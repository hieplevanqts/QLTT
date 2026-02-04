/**
 * Evidence Service
 * Implements business logic theo mô hình dữ liệu 8.1-8.4
 * 
 * Nguyên tắc 1: Immutable-first
 * Nguyên tắc 2: Metadata chuẩn hóa theo Data Dictionary
 * Nguyên tắc 3: Review workflow theo schema
 * 
 * WEB-05: OWASP Security Logging Compliance
 */

import {
  EvidenceItem,
  EvidenceType,
  EvidenceStatus,
  EvidenceSource,
  EvidenceScope,
  EvidenceLocation,
  EvidenceFile,
  EvidenceHash,
  EvidenceSubmitter,
  CustodyEvent,
  CustodyEventType,
  EvidencePackage,
  ExportJob,
  ExportJobType,
  createEvidenceItem,
  createCustodyEvent,
  createEvidencePackage,
  createExportJob,
  validateEvidenceItem,
  canEditEvidence,
  canDeleteEvidence,
  canSealEvidence,
  getNextStatuses,
  formatFileSize
} from '../types/evidence.types';

import { auditLogger } from './audit-logging.service';

class EvidenceService {
  /**
   * CREATE NEW EVIDENCE ITEM
   * Validate theo Data Dictionary 8.1
   * WEB-05: Log EVIDENCE_UPLOADED + EVIDENCE_HASH_COMPUTED
   */
  async createNewEvidence(params: {
    type: EvidenceType;
    source: EvidenceSource;
    capturedAt: string;
    location: EvidenceLocation;
    file: File;
    submitter: EvidenceSubmitter;
    scope?: EvidenceScope;
    sensitivityLabel?: EvidenceItem['sensitivityLabel'];
    notes?: string;
    tags?: string[];
    deviceInfo?: string;
  }): Promise<EvidenceItem> {
    const startTime = Date.now();
    
    // Generate Evidence ID
    const evidenceId = this.generateEvidenceId();

    // Compute file hash (SWGDE compliant - multiple algorithms)
    const hashes = await this.computeFileHashes(params.file);
    const hashComputeTime = Date.now() - startTime;

    // Extract file metadata
    const fileMetadata: EvidenceFile = {
      storageKey: this.generateStorageKey(evidenceId, params.file.name),
      filename: params.file.name,
      mimeType: params.file.type,
      sizeBytes: params.file.size,
      durationSec: await this.extractDuration(params.file),
      pageCount: await this.extractPageCount(params.file)
    };

    // Create evidence item
    const evidence = createEvidenceItem({
      evidenceId,
      type: params.type,
      source: params.source,
      capturedAt: params.capturedAt,
      location: params.location,
      file: fileMetadata,
      submitter: params.submitter,
      scope: params.scope || {},
      sensitivityLabel: params.sensitivityLabel || 'Internal',
      hashes,
      notes: params.notes,
      tags: params.tags,
      deviceInfo: params.deviceInfo
    });

    // Validate
    const validation = validateEvidenceItem(evidence);
    if (!validation.isValid) {
      throw new Error(`Validation failed: ${validation.missingFields.join(', ')}`);
    }

    // Create audit actor
    const actor = auditLogger.createActor(
      params.submitter.userId,
      params.submitter.unitId
    );

    // WEB-05: Log EVIDENCE_UPLOADED
    await auditLogger.logEvidenceUploaded(actor, {
      evidenceId,
      filename: params.file.name,
      mimeType: params.file.type,
      sizeBytes: params.file.size,
      source: params.source,
      capturedAt: params.capturedAt
    });

    // WEB-05: Log EVIDENCE_HASH_COMPUTED (for each algorithm)
    for (const hash of hashes) {
      await auditLogger.logEvidenceHashComputed(actor, {
        evidenceId,
        algorithm: hash.alg,
        hashValue: hash.value,
        computationTimeMs: hashComputeTime
      });
    }

    // Log custody event
    await this.logCustodyEvent(
      evidenceId,
      'Upload',
      params.submitter.userId,
      params.submitter.unitId,
      { device: params.deviceInfo },
      `Uploaded ${params.file.name}`
    );

    // In production: Upload file to storage
    // await this.uploadToStorage(params.file, fileMetadata.storageKey);

    return evidence;
  }

  /**
   * SUBMIT FOR REVIEW
   * Workflow: Draft → Submitted
   * WEB-05: Log EVIDENCE_SUBMITTED
   */
  async submitForReview(
    evidenceId: string,
    submitterUserId: string,
    submitterUnitId: string
  ): Promise<EvidenceItem> {
    const evidence = await this.getEvidence(evidenceId);

    // Validate status transition
    if (evidence.status !== 'Draft' && evidence.status !== 'NeedMoreInfo') {
      throw new Error(`Cannot submit evidence with status: ${evidence.status}`);
    }

    // Validate completeness
    const validation = validateEvidenceItem(evidence);
    if (!validation.isValid) {
      throw new Error(`Cannot submit: missing ${validation.missingFields.join(', ')}`);
    }

    const fromStatus = evidence.status;
    const toStatus = 'Submitted';

    // Update status
    const updated: EvidenceItem = {
      ...evidence,
      status: toStatus,
      updatedAt: new Date().toISOString()
    };

    // Create audit actor
    const actor = auditLogger.createActor(submitterUserId, submitterUnitId);

    // WEB-05: Log EVIDENCE_SUBMITTED
    await auditLogger.logEvidenceSubmitted(actor, {
      evidenceId,
      fromStatus,
      toStatus
    });

    // Log custody event
    await this.logCustodyEvent(
      evidenceId,
      'Submit',
      submitterUserId,
      submitterUnitId,
      undefined,
      'Submitted for review'
    );

    return updated;
  }

  /**
   * START REVIEW
   * Workflow: Submitted → InReview
   * WEB-05: Log REVIEW_ASSIGNED
   */
  async startReview(
    evidenceId: string,
    reviewerId: string,
    reviewerUnitId: string,
    reviewerName?: string
  ): Promise<EvidenceItem> {
    const evidence = await this.getEvidence(evidenceId);

    if (evidence.status !== 'Submitted') {
      throw new Error(`Cannot review evidence with status: ${evidence.status}`);
    }

    const updated: EvidenceItem = {
      ...evidence,
      status: 'InReview',
      review: {
        ...evidence.review,
        assignedReviewerId: reviewerId
      },
      updatedAt: new Date().toISOString()
    };

    // Create audit actor
    const actor = auditLogger.createActor(reviewerId, reviewerUnitId, reviewerName);

    // WEB-05: Log REVIEW_ASSIGNED
    await auditLogger.logReviewAssigned(actor, {
      evidenceId,
      reviewerId,
      reviewerName,
      assignedAt: new Date().toISOString()
    });

    await this.logCustodyEvent(
      evidenceId,
      'Review',
      reviewerId,
      reviewerUnitId,
      undefined,
      'Started review'
    );

    return updated;
  }

  /**
   * APPROVE EVIDENCE
   * Workflow: InReview → Approved
   * WEB-05: Log REVIEW_DECISION_MADE
   */
  async approveEvidence(
    evidenceId: string,
    reviewerId: string,
    reviewerUnitId: string,
    reason: string
  ): Promise<EvidenceItem> {
    const evidence = await this.getEvidence(evidenceId);

    if (evidence.status !== 'InReview') {
      throw new Error(`Cannot approve evidence with status: ${evidence.status}`);
    }

    const now = new Date().toISOString();

    const updated: EvidenceItem = {
      ...evidence,
      status: 'Approved',
      review: {
        ...evidence.review,
        decision: 'Approved',
        decisionAt: now,
        decisionReason: reason
      },
      updatedAt: now
    };

    // Create audit actor
    const actor = auditLogger.createActor(reviewerId, reviewerUnitId);

    // WEB-05: Log REVIEW_DECISION_MADE
    await auditLogger.logReviewDecisionMade(actor, {
      evidenceId,
      reviewerId,
      decision: 'Approved',
      reason,
      decisionAt: now
    });

    await this.logCustodyEvent(
      evidenceId,
      'Approve',
      reviewerId,
      reviewerUnitId,
      undefined,
      `Approved: ${reason}`
    );

    return updated;
  }

  /**
   * REJECT EVIDENCE
   * Workflow: InReview → Rejected
   * WEB-05: Log REVIEW_DECISION_MADE
   */
  async rejectEvidence(
    evidenceId: string,
    reviewerId: string,
    reviewerUnitId: string,
    reason: string
  ): Promise<EvidenceItem> {
    const evidence = await this.getEvidence(evidenceId);

    if (evidence.status !== 'InReview') {
      throw new Error(`Cannot reject evidence with status: ${evidence.status}`);
    }

    const now = new Date().toISOString();

    const updated: EvidenceItem = {
      ...evidence,
      status: 'Rejected',
      review: {
        ...evidence.review,
        decision: 'Rejected',
        decisionAt: now,
        decisionReason: reason
      },
      updatedAt: now
    };

    // Create audit actor
    const actor = auditLogger.createActor(reviewerId, reviewerUnitId);

    // WEB-05: Log REVIEW_DECISION_MADE
    await auditLogger.logReviewDecisionMade(actor, {
      evidenceId,
      reviewerId,
      decision: 'Rejected',
      reason,
      decisionAt: now
    });

    await this.logCustodyEvent(
      evidenceId,
      'Reject',
      reviewerId,
      reviewerUnitId,
      undefined,
      `Rejected: ${reason}`
    );

    return updated;
  }

  /**
   * REQUEST MORE INFO
   * Workflow: InReview → NeedMoreInfo
   * WEB-05: Log REVIEW_DECISION_MADE
   */
  async requestMoreInfo(
    evidenceId: string,
    reviewerId: string,
    reviewerUnitId: string,
    requestedChanges: string
  ): Promise<EvidenceItem> {
    const evidence = await this.getEvidence(evidenceId);

    if (evidence.status !== 'InReview') {
      throw new Error(`Cannot request more info for evidence with status: ${evidence.status}`);
    }

    const now = new Date().toISOString();

    const updated: EvidenceItem = {
      ...evidence,
      status: 'NeedMoreInfo',
      review: {
        ...evidence.review,
        decision: 'NeedMoreInfo',
        decisionAt: now,
        decisionReason: requestedChanges
      },
      updatedAt: now
    };

    // Create audit actor
    const actor = auditLogger.createActor(reviewerId, reviewerUnitId);

    // WEB-05: Log REVIEW_DECISION_MADE
    await auditLogger.logReviewDecisionMade(actor, {
      evidenceId,
      reviewerId,
      decision: 'NeedMoreInfo',
      reason: requestedChanges,
      decisionAt: now
    });

    await this.logCustodyEvent(
      evidenceId,
      'Review',
      reviewerId,
      reviewerUnitId,
      undefined,
      `Requested more info: ${requestedChanges}`
    );

    return updated;
  }

  /**
   * SEAL EVIDENCE (Make immutable)
   * Workflow: Approved → Sealed
   * WEB-05: Log EVIDENCE_SEALED
   */
  async sealEvidence(
    evidenceId: string,
    userId: string,
    unitId: string
  ): Promise<EvidenceItem> {
    const evidence = await this.getEvidence(evidenceId);

    if (!canSealEvidence(evidence.status)) {
      throw new Error('Can only seal approved evidence');
    }

    const previousStatus = evidence.status;
    const newStatus = 'Sealed';

    const updated: EvidenceItem = {
      ...evidence,
      status: newStatus,
      updatedAt: new Date().toISOString()
    };

    // Create audit actor
    const actor = auditLogger.createActor(userId, unitId);

    // WEB-05: Log EVIDENCE_SEALED
    await auditLogger.logEvidenceSealed(actor, {
      evidenceId,
      previousStatus,
      newStatus
    });

    await this.logCustodyEvent(
      evidenceId,
      'Seal',
      userId,
      unitId,
      undefined,
      'Sealed evidence (now immutable)'
    );

    return updated;
  }

  /**
   * CREATE DERIVED VERSION (Nguyên tắc 1: Immutable-first)
   * Original không sửa, tạo derived version mới
   * WEB-05: Log EVIDENCE_DERIVED
   */
  async createDerivedVersion(
    originalId: string,
    derivationParams: {
      derivedBy: string;
      derivedByUnit: string;
      derivationReason: string;
      newFile: File;
      modifications: string;
    }
  ): Promise<EvidenceItem> {
    const original = await this.getEvidence(originalId);

    // Cannot derive from sealed/archived (unless admin)
    if (original.status === 'Sealed' || original.status === 'Archived') {
      throw new Error('Cannot create derived version of sealed/archived evidence without admin permission');
    }

    // Generate derived Evidence ID
    const derivedId = this.generateDerivedEvidenceId(originalId);

    // Compute new hash for derived file
    const newHashes = await this.computeFileHashes(derivationParams.newFile);

    // Create new file metadata
    const newFileMetadata: EvidenceFile = {
      storageKey: this.generateStorageKey(derivedId, derivationParams.newFile.name),
      filename: derivationParams.newFile.name,
      mimeType: derivationParams.newFile.type,
      sizeBytes: derivationParams.newFile.size,
      durationSec: await this.extractDuration(derivationParams.newFile),
      pageCount: await this.extractPageCount(derivationParams.newFile)
    };

    const now = new Date().toISOString();

    // Create derived evidence (copy all metadata from original)
    const derived: EvidenceItem = {
      ...original,
      evidenceId: derivedId,
      file: newFileMetadata,
      hashes: newHashes,
      status: 'Draft',  // Derived version starts as Draft
      originalEvidenceId: originalId,
      derivationReason: derivationParams.derivationReason,
      derivedAt: now,
      derivedBy: derivationParams.derivedBy,
      review: {},  // Clear review (needs new review)
      createdAt: now,
      updatedAt: now
    };

    // Update original to track derived version
    if (!original.derivedVersionIds) {
      original.derivedVersionIds = [];
    }
    original.derivedVersionIds.push(derivedId);

    // Create audit actor
    const actor = auditLogger.createActor(
      derivationParams.derivedBy,
      derivationParams.derivedByUnit
    );

    // WEB-05: Log EVIDENCE_DERIVED
    await auditLogger.logEvidenceDerived(actor, {
      originalEvidenceId: originalId,
      derivedEvidenceId: derivedId,
      derivationReason: derivationParams.derivationReason,
      modifications: derivationParams.modifications
    });

    // Log custody events
    await this.logCustodyEvent(
      originalId,
      'Derive',
      derivationParams.derivedBy,
      derivationParams.derivedByUnit,
      undefined,
      `Created derived version: ${derivedId} - ${derivationParams.modifications}`
    );

    await this.logCustodyEvent(
      derivedId,
      'Upload',
      derivationParams.derivedBy,
      derivationParams.derivedByUnit,
      undefined,
      `Derived from ${originalId}: ${derivationParams.modifications}`
    );

    return derived;
  }

  /**
   * LINK EVIDENCE TO ENTITY
   * WEB-05: Log EVIDENCE_LINKED_TO_ENTITY
   */
  async linkToEntity(
    evidenceId: string,
    entityType: 'LEAD' | 'TASK' | 'PLAN' | 'STORE',
    entityId: string,
    entityName: string,
    userId: string,
    unitId: string
  ): Promise<EvidenceItem> {
    const evidence = await this.getEvidence(evidenceId);

    // Add link
    evidence.links.push({ entityType, entityId });
    evidence.updatedAt = new Date().toISOString();

    // Create audit actor
    const actor = auditLogger.createActor(userId, unitId);

    // WEB-05: Log EVIDENCE_LINKED_TO_ENTITY
    await auditLogger.logEvidenceLinkedToEntity(actor, {
      evidenceId,
      entityType,
      entityId,
      entityName
    });

    await this.logCustodyEvent(
      evidenceId,
      'Link',
      userId,
      unitId,
      undefined,
      `Linked to ${entityType}: ${entityName}`
    );

    return evidence;
  }

  /**
   * CREATE EVIDENCE PACKAGE
   * WEB-05: Log PACKAGE_CREATED
   */
  async createPackage(
    name: string,
    ownerUnitId: string,
    createdBy: string,
    scope?: EvidenceScope,
    includeMetadata: boolean = true,
    includeCustodyExcerpt: boolean = true
  ): Promise<EvidencePackage> {
    const packageId = this.generatePackageId();
    
    const pkg = createEvidencePackage(
      packageId,
      name,
      ownerUnitId,
      createdBy,
      scope
    );

    pkg.includeMetadata = includeMetadata;
    pkg.includeCustodyExcerpt = includeCustodyExcerpt;

    // Create audit actor
    const actor = auditLogger.createActor(createdBy, ownerUnitId);

    // WEB-05: Log PACKAGE_CREATED
    await auditLogger.logPackageCreated(actor, {
      packageId,
      packageName: name,
      ownerUnitId,
      includeMetadata,
      includeCustodyExcerpt
    });

    return pkg;
  }

  /**
   * GENERATE PACKAGE (Finalize)
   * WEB-05: Log PACKAGE_GENERATED
   */
  async generatePackage(
    packageId: string,
    userId: string,
    unitId: string
  ): Promise<EvidencePackage> {
    const startTime = Date.now();
    const pkg = await this.getPackage(packageId);

    if (pkg.status !== 'Draft') {
      throw new Error('Can only generate draft packages');
    }

    pkg.status = 'Generated';
    pkg.updatedAt = new Date().toISOString();

    // Calculate stats
    const evidenceCount = pkg.items.length;
    const totalSizeBytes = 5242880; // Mock: 5 MB
    const generationTimeMs = Date.now() - startTime;

    // Create audit actor
    const actor = auditLogger.createActor(userId, unitId);

    // WEB-05: Log PACKAGE_GENERATED
    await auditLogger.logPackageGenerated(actor, {
      packageId,
      evidenceCount,
      totalSizeBytes,
      generationTimeMs
    });

    return pkg;
  }

  /**
   * ADD EVIDENCE TO PACKAGE
   */
  async addEvidenceToPackage(
    packageId: string,
    evidenceId: string,
    order?: number
  ): Promise<EvidencePackage> {
    const pkg = await this.getPackage(packageId);

    if (pkg.status !== 'Draft') {
      throw new Error('Can only add evidence to draft packages');
    }

    // Check if already exists
    if (pkg.items.some(item => item.evidenceId === evidenceId)) {
      throw new Error('Evidence already in package');
    }

    const newOrder = order ?? pkg.items.length + 1;

    pkg.items.push({
      evidenceId,
      order: newOrder
    });

    pkg.updatedAt = new Date().toISOString();

    return pkg;
  }

  /**
   * CREATE EXPORT JOB
   * WEB-05: Log EXPORT_REQUESTED
   */
  async createExport(
    type: ExportJobType,
    requestedBy: string,
    requestedByUnit: string,
    params?: {
      packageId?: string;
      evidenceIds?: string[];
    }
  ): Promise<ExportJob> {
    const jobId = this.generateExportJobId();
    
    const job = createExportJob(jobId, type, requestedBy);

    // Create audit actor
    const actor = auditLogger.createActor(requestedBy, requestedByUnit);

    // WEB-05: Log EXPORT_REQUESTED
    await auditLogger.logExportRequested(actor, {
      jobId,
      exportType: type,
      targetResourceType: params?.packageId ? 'package' : 'evidence',
      targetResourceId: params?.packageId || params?.evidenceIds?.join(',') || 'N/A'
    });

    // In production: Queue export job
    // await this.queueExportJob(job, params);

    return job;
  }

  /**
   * COMPLETE EXPORT JOB
   * WEB-05: Log EXPORT_COMPLETED
   */
  async completeExport(
    jobId: string,
    userId: string,
    unitId: string,
    fileSizeBytes: number,
    format: string
  ): Promise<ExportJob> {
    const job = await this.getExportJob(jobId);
    const processingTimeMs = Date.now() - new Date(job.requestedAt).getTime();

    job.status = 'Completed';
    job.completedAt = new Date().toISOString();
    job.fileSizeBytes = fileSizeBytes;

    // Create audit actor
    const actor = auditLogger.createActor(userId, unitId);

    // WEB-05: Log EXPORT_COMPLETED
    await auditLogger.logExportCompleted(actor, {
      jobId,
      exportType: job.type,
      fileSizeBytes,
      processingTimeMs,
      format
    });

    return job;
  }

  /**
   * DOWNLOAD EXPORT
   * WEB-05: Log EXPORT_DOWNLOADED
   */
  async downloadExport(
    jobId: string,
    userId: string,
    unitId: string
  ): Promise<void> {
    const job = await this.getExportJob(jobId);

    job.downloadCount++;
    job.lastDownloadedAt = new Date().toISOString();

    // Create audit actor
    const actor = auditLogger.createActor(userId, unitId);

    // WEB-05: Log EXPORT_DOWNLOADED
    await auditLogger.logExportDownloaded(actor, {
      jobId,
      exportType: job.type,
      downloadCount: job.downloadCount,
      fileSizeBytes: job.fileSizeBytes || 0
    });
  }

  /**
   * EXPORT CUSTODY LOG
   * WEB-05: Log CUSTODY_LOG_EXPORTED
   */
  async exportCustodyLog(
    evidenceId: string,
    userId: string,
    unitId: string,
    dateFrom: string,
    dateTo: string,
    format: 'pdf' | 'csv' | 'json'
  ): Promise<void> {
    // Get custody events (mock)
    const eventCount = 15;

    // Create audit actor
    const actor = auditLogger.createActor(userId, unitId);

    // WEB-05: Log CUSTODY_LOG_EXPORTED
    await auditLogger.logCustodyLogExported(actor, {
      evidenceId,
      eventCount,
      dateFrom,
      dateTo,
      format
    });
  }

  /**
   * LOG CUSTODY EVENT
   */
  private async logCustodyEvent(
    evidenceId: string,
    eventType: CustodyEventType,
    actorUserId: string,
    actorUnitId: string,
    context?: Partial<CustodyEvent['context']>,
    note?: string
  ): Promise<CustodyEvent> {
    const event = createCustodyEvent(
      evidenceId,
      eventType,
      actorUserId,
      actorUnitId,
      context,
      note
    );


    // In production: Store in database
    // await this.storeCustodyEvent(event);

    return event;
  }

  /**
   * COMPUTE FILE HASHES (SWGDE compliant)
   */
  private async computeFileHashes(file: File): Promise<EvidenceHash[]> {
    const arrayBuffer = await file.arrayBuffer();
    const now = new Date().toISOString();

    // SHA-256
    const sha256Buffer = await crypto.subtle.digest('SHA-256', arrayBuffer);
    const sha256Hash = Array.from(new Uint8Array(sha256Buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // SHA-512
    const sha512Buffer = await crypto.subtle.digest('SHA-512', arrayBuffer);
    const sha512Hash = Array.from(new Uint8Array(sha512Buffer))
      .map(b => b.toString(16).padStart(2, '0'))
      .join('');

    // MD5 (simulated - Web Crypto doesn't support MD5)
    const md5Hash = sha256Hash.substring(0, 32);

    return [
      {
        alg: 'SHA-256',
        value: sha256Hash,
        computedAt: now,
        computedBy: 'System'
      },
      {
        alg: 'SHA-512',
        value: sha512Hash,
        computedAt: now,
        computedBy: 'System'
      },
      {
        alg: 'MD5',
        value: md5Hash,
        computedAt: now,
        computedBy: 'System'
      }
    ];
  }

  /**
   * EXTRACT DURATION (for video/audio)
   */
  private async extractDuration(file: File): Promise<number | undefined> {
    if (!file.type.startsWith('video/') && !file.type.startsWith('audio/')) {
      return undefined;
    }

    // In production: Use media library to extract duration
    // For demo: return mock duration
    return 120; // 2 minutes
  }

  /**
   * EXTRACT PAGE COUNT (for PDF/documents)
   */
  private async extractPageCount(file: File): Promise<number | undefined> {
    if (file.type !== 'application/pdf') {
      return undefined;
    }

    // In production: Use PDF library to extract page count
    // For demo: return mock page count
    return 5;
  }

  /**
   * GENERATE IDs
   */
  private generateEvidenceId(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `EVD-${year}-${random}`;
  }

  private generateDerivedEvidenceId(originalId: string): string {
    const timestamp = Date.now().toString(36);
    return `${originalId}-D${timestamp}`;
  }

  private generateStorageKey(evidenceId: string, filename: string): string {
    const extension = filename.split('.').pop();
    return `evidence/${evidenceId}.${extension}`;
  }

  private generatePackageId(): string {
    const year = new Date().getFullYear();
    const random = Math.floor(Math.random() * 9000) + 1000;
    return `PKG-${year}-${random}`;
  }

  private generateExportJobId(): string {
    const timestamp = Date.now();
    const random = Math.random().toString(36).substr(2, 9);
    return `EXPORT-${timestamp}-${random}`;
  }

  /**
   * MOCK GET METHODS (In production: fetch from database)
   */
  private async getEvidence(evidenceId: string): Promise<EvidenceItem> {
    // Mock implementation
    return createEvidenceItem({
      evidenceId,
      type: 'PHOTO',
      source: 'MobileCapture',
      capturedAt: new Date().toISOString(),
      location: {
        lat: 10.7769,
        lng: 106.7009,
        addressText: 'Phường 1, Hà Nội',
        precision: 10,
        confidence: 0.95
      },
      file: {
        storageKey: `evidence/${evidenceId}.jpg`,
        filename: 'evidence.jpg',
        mimeType: 'image/jpeg',
        sizeBytes: 1024000
      },
      submitter: {
        userId: 'USER-001',
        unitId: 'UNIT-001'
      },
      hashes: [
        {
          alg: 'SHA-256',
          value: 'a'.repeat(64),
          computedAt: new Date().toISOString(),
          computedBy: 'System'
        }
      ]
    });
  }

  private async getPackage(packageId: string): Promise<EvidencePackage> {
    // Mock implementation
    return createEvidencePackage(
      packageId,
      'Package Mock',
      'UNIT-001',
      'USER-001'
    );
  }

  private async getExportJob(jobId: string): Promise<ExportJob> {
    // Mock implementation
    return createExportJob(
      jobId,
      'PDF',
      'USER-001'
    );
  }
}

// Singleton instance
export const evidenceService = new EvidenceService();
