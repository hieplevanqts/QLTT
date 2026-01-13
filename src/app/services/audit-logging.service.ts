/**
 * Audit Logging Service
 * OWASP Security Logging Compliance (WEB-05)
 * 
 * Section 10: Audit events bắt buộc
 * 
 * Requirements:
 * - Log all security-related events
 * - Include who, what, when, where, why
 * - Immutable audit trail
 * - Support querying and reporting
 * - Compliance with OWASP logging guidelines
 */

import {
  AuditEvent,
  AuditEventType,
  AuditSeverity,
  AuditStatus,
  AuditActor,
  AuditContext,
  AuditQueryFilters,
  AuditListResponse,
  AuditStatistics,
  EvidenceUploadedMetadata,
  EvidenceHashComputedMetadata,
  EvidenceSubmittedMetadata,
  ReviewAssignedMetadata,
  ReviewDecisionMadeMetadata,
  EvidenceSealedMetadata,
  EvidenceLinkedMetadata,
  PackageCreatedMetadata,
  PackageGeneratedMetadata,
  ExportRequestedMetadata,
  ExportCompletedMetadata,
  ExportDownloadedMetadata,
  CustodyLogExportedMetadata,
  EvidenceDerivedMetadata,
  createAuditEvent,
  validateAuditMetadata,
  getSeverityForEventType
} from '../types/audit.types';

class AuditLoggingService {
  private auditBuffer: AuditEvent[] = [];
  private readonly BUFFER_SIZE = 100;
  private readonly FLUSH_INTERVAL_MS = 5000;
  private flushTimer: number | null = null;

  constructor() {
    this.startAutoFlush();
  }

  /**
   * LOG EVIDENCE_UPLOADED (WEB-05)
   */
  async logEvidenceUploaded(
    actor: AuditActor,
    metadata: EvidenceUploadedMetadata
  ): Promise<void> {
    const event = createAuditEvent(
      'EVIDENCE_UPLOADED',
      actor,
      { type: 'evidence', id: metadata.evidenceId, name: metadata.filename },
      `Uploaded evidence: ${metadata.filename} (${this.formatBytes(metadata.sizeBytes)})`,
      metadata,
      { severity: 'INFO' }
    );

    await this.logEvent(event);
    console.log('[AUDIT] EVIDENCE_UPLOADED:', JSON.stringify(event, null, 2));
  }

  /**
   * LOG EVIDENCE_HASH_COMPUTED (WEB-05)
   */
  async logEvidenceHashComputed(
    actor: AuditActor,
    metadata: EvidenceHashComputedMetadata
  ): Promise<void> {
    const event = createAuditEvent(
      'EVIDENCE_HASH_COMPUTED',
      actor,
      { type: 'evidence', id: metadata.evidenceId },
      `Computed ${metadata.algorithm} hash for evidence ${metadata.evidenceId}`,
      metadata,
      { severity: 'INFO' }
    );

    await this.logEvent(event);
    console.log('[AUDIT] EVIDENCE_HASH_COMPUTED:', JSON.stringify(event, null, 2));
  }

  /**
   * LOG EVIDENCE_SUBMITTED (WEB-05)
   */
  async logEvidenceSubmitted(
    actor: AuditActor,
    metadata: EvidenceSubmittedMetadata
  ): Promise<void> {
    const event = createAuditEvent(
      'EVIDENCE_SUBMITTED',
      actor,
      { type: 'evidence', id: metadata.evidenceId },
      `Submitted evidence for review (${metadata.fromStatus} → ${metadata.toStatus})`,
      metadata,
      { severity: 'INFO' }
    );

    await this.logEvent(event);
    console.log('[AUDIT] EVIDENCE_SUBMITTED:', JSON.stringify(event, null, 2));
  }

  /**
   * LOG REVIEW_ASSIGNED (WEB-05)
   */
  async logReviewAssigned(
    actor: AuditActor,
    metadata: ReviewAssignedMetadata
  ): Promise<void> {
    const event = createAuditEvent(
      'REVIEW_ASSIGNED',
      actor,
      { type: 'review', id: metadata.evidenceId },
      `Assigned review to ${metadata.reviewerName || metadata.reviewerId}`,
      metadata,
      { severity: 'INFO' }
    );

    await this.logEvent(event);
    console.log('[AUDIT] REVIEW_ASSIGNED:', JSON.stringify(event, null, 2));
  }

  /**
   * LOG REVIEW_DECISION_MADE (WEB-05)
   */
  async logReviewDecisionMade(
    actor: AuditActor,
    metadata: ReviewDecisionMadeMetadata
  ): Promise<void> {
    const severity: AuditSeverity = 
      metadata.decision === 'Rejected' ? 'WARNING' : 'INFO';

    const event = createAuditEvent(
      'REVIEW_DECISION_MADE',
      actor,
      { type: 'review', id: metadata.evidenceId },
      `Review decision: ${metadata.decision} - ${metadata.reason}`,
      metadata,
      { severity }
    );

    await this.logEvent(event);
    console.log('[AUDIT] REVIEW_DECISION_MADE:', JSON.stringify(event, null, 2));
  }

  /**
   * LOG EVIDENCE_SEALED (WEB-05)
   */
  async logEvidenceSealed(
    actor: AuditActor,
    metadata: EvidenceSealedMetadata
  ): Promise<void> {
    const event = createAuditEvent(
      'EVIDENCE_SEALED',
      actor,
      { type: 'evidence', id: metadata.evidenceId },
      `Sealed evidence (${metadata.previousStatus} → ${metadata.newStatus})`,
      metadata,
      { severity: 'CRITICAL' }
    );

    await this.logEvent(event);
    console.log('[AUDIT] EVIDENCE_SEALED:', JSON.stringify(event, null, 2));
  }

  /**
   * LOG EVIDENCE_UNSEALED (WEB-05)
   */
  async logEvidenceUnsealed(
    actor: AuditActor,
    metadata: EvidenceSealedMetadata
  ): Promise<void> {
    const event = createAuditEvent(
      'EVIDENCE_UNSEALED',
      actor,
      { type: 'evidence', id: metadata.evidenceId },
      `Unsealed evidence (${metadata.previousStatus} → ${metadata.newStatus}). Reason: ${metadata.reason || 'N/A'}`,
      metadata,
      { severity: 'CRITICAL' }
    );

    await this.logEvent(event);
    console.log('[AUDIT] EVIDENCE_UNSEALED:', JSON.stringify(event, null, 2));
  }

  /**
   * LOG EVIDENCE_LINKED_TO_ENTITY (WEB-05)
   */
  async logEvidenceLinkedToEntity(
    actor: AuditActor,
    metadata: EvidenceLinkedMetadata
  ): Promise<void> {
    const event = createAuditEvent(
      'EVIDENCE_LINKED_TO_ENTITY',
      actor,
      { type: 'evidence', id: metadata.evidenceId },
      `Linked evidence to ${metadata.entityType}: ${metadata.entityName || metadata.entityId}`,
      metadata,
      { severity: 'INFO' }
    );

    await this.logEvent(event);
    console.log('[AUDIT] EVIDENCE_LINKED_TO_ENTITY:', JSON.stringify(event, null, 2));
  }

  /**
   * LOG PACKAGE_CREATED (WEB-05)
   */
  async logPackageCreated(
    actor: AuditActor,
    metadata: PackageCreatedMetadata
  ): Promise<void> {
    const event = createAuditEvent(
      'PACKAGE_CREATED',
      actor,
      { type: 'package', id: metadata.packageId, name: metadata.packageName },
      `Created evidence package: ${metadata.packageName}`,
      metadata,
      { severity: 'INFO' }
    );

    await this.logEvent(event);
    console.log('[AUDIT] PACKAGE_CREATED:', JSON.stringify(event, null, 2));
  }

  /**
   * LOG PACKAGE_GENERATED (WEB-05)
   */
  async logPackageGenerated(
    actor: AuditActor,
    metadata: PackageGeneratedMetadata
  ): Promise<void> {
    const event = createAuditEvent(
      'PACKAGE_GENERATED',
      actor,
      { type: 'package', id: metadata.packageId },
      `Generated package with ${metadata.evidenceCount} evidence items (${this.formatBytes(metadata.totalSizeBytes)}) in ${metadata.generationTimeMs}ms`,
      metadata,
      { severity: 'INFO' }
    );

    await this.logEvent(event);
    console.log('[AUDIT] PACKAGE_GENERATED:', JSON.stringify(event, null, 2));
  }

  /**
   * LOG EXPORT_REQUESTED (WEB-05)
   */
  async logExportRequested(
    actor: AuditActor,
    metadata: ExportRequestedMetadata
  ): Promise<void> {
    const event = createAuditEvent(
      'EXPORT_REQUESTED',
      actor,
      { type: 'export', id: metadata.jobId },
      `Requested ${metadata.exportType} export for ${metadata.targetResourceType}: ${metadata.targetResourceId}`,
      metadata,
      { severity: 'INFO' }
    );

    await this.logEvent(event);
    console.log('[AUDIT] EXPORT_REQUESTED:', JSON.stringify(event, null, 2));
  }

  /**
   * LOG EXPORT_COMPLETED (WEB-05)
   */
  async logExportCompleted(
    actor: AuditActor,
    metadata: ExportCompletedMetadata
  ): Promise<void> {
    const event = createAuditEvent(
      'EXPORT_COMPLETED',
      actor,
      { type: 'export', id: metadata.jobId },
      `Completed ${metadata.exportType} export (${this.formatBytes(metadata.fileSizeBytes)}) in ${metadata.processingTimeMs}ms`,
      metadata,
      { severity: 'INFO' }
    );

    await this.logEvent(event);
    console.log('[AUDIT] EXPORT_COMPLETED:', JSON.stringify(event, null, 2));
  }

  /**
   * LOG EXPORT_DOWNLOADED (WEB-05)
   */
  async logExportDownloaded(
    actor: AuditActor,
    metadata: ExportDownloadedMetadata
  ): Promise<void> {
    const event = createAuditEvent(
      'EXPORT_DOWNLOADED',
      actor,
      { type: 'export', id: metadata.jobId },
      `Downloaded ${metadata.exportType} export (count: ${metadata.downloadCount})`,
      metadata,
      { severity: 'INFO' }
    );

    await this.logEvent(event);
    console.log('[AUDIT] EXPORT_DOWNLOADED:', JSON.stringify(event, null, 2));
  }

  /**
   * LOG CUSTODY_LOG_EXPORTED (WEB-05)
   */
  async logCustodyLogExported(
    actor: AuditActor,
    metadata: CustodyLogExportedMetadata
  ): Promise<void> {
    const event = createAuditEvent(
      'CUSTODY_LOG_EXPORTED',
      actor,
      { type: 'custody', id: metadata.evidenceId },
      `Exported custody log for evidence ${metadata.evidenceId} (${metadata.eventCount} events, ${metadata.dateFrom} to ${metadata.dateTo})`,
      metadata,
      { severity: 'INFO' }
    );

    await this.logEvent(event);
    console.log('[AUDIT] CUSTODY_LOG_EXPORTED:', JSON.stringify(event, null, 2));
  }

  /**
   * LOG EVIDENCE_DERIVED
   */
  async logEvidenceDerived(
    actor: AuditActor,
    metadata: EvidenceDerivedMetadata
  ): Promise<void> {
    const event = createAuditEvent(
      'EVIDENCE_DERIVED',
      actor,
      { type: 'evidence', id: metadata.originalEvidenceId },
      `Created derived version ${metadata.derivedEvidenceId} from ${metadata.originalEvidenceId}: ${metadata.derivationReason}`,
      metadata,
      { severity: 'INFO' }
    );

    await this.logEvent(event);
    console.log('[AUDIT] EVIDENCE_DERIVED:', JSON.stringify(event, null, 2));
  }

  /**
   * LOG EVIDENCE_VIEWED
   */
  async logEvidenceViewed(
    actor: AuditActor,
    evidenceId: string,
    viewMode: 'detail' | 'preview' | 'download'
  ): Promise<void> {
    const event = createAuditEvent(
      'EVIDENCE_VIEWED',
      actor,
      { type: 'evidence', id: evidenceId },
      `Viewed evidence in ${viewMode} mode`,
      { evidenceId, viewMode },
      { severity: 'INFO' }
    );

    await this.logEvent(event);
    console.log('[AUDIT] EVIDENCE_VIEWED:', JSON.stringify(event, null, 2));
  }

  /**
   * LOG EVIDENCE_DOWNLOADED
   */
  async logEvidenceDownloaded(
    actor: AuditActor,
    evidenceId: string,
    filename: string,
    sizeBytes: number
  ): Promise<void> {
    const event = createAuditEvent(
      'EVIDENCE_DOWNLOADED',
      actor,
      { type: 'evidence', id: evidenceId, name: filename },
      `Downloaded evidence: ${filename} (${this.formatBytes(sizeBytes)})`,
      { evidenceId, filename, sizeBytes },
      { severity: 'INFO' }
    );

    await this.logEvent(event);
    console.log('[AUDIT] EVIDENCE_DOWNLOADED:', JSON.stringify(event, null, 2));
  }

  /**
   * LOG UNAUTHORIZED_ACCESS_ATTEMPTED
   */
  async logUnauthorizedAccess(
    actor: AuditActor,
    resourceType: string,
    resourceId: string,
    reason: string
  ): Promise<void> {
    const event = createAuditEvent(
      'UNAUTHORIZED_ACCESS_ATTEMPTED',
      actor,
      { type: resourceType as any, id: resourceId },
      `Unauthorized access attempt: ${reason}`,
      { resourceType, resourceId, reason },
      { severity: 'CRITICAL', status: 'FAILURE' }
    );

    await this.logEvent(event);
    console.log('[AUDIT] UNAUTHORIZED_ACCESS_ATTEMPTED:', JSON.stringify(event, null, 2));
  }

  /**
   * LOG PERMISSION_DENIED
   */
  async logPermissionDenied(
    actor: AuditActor,
    action: string,
    resourceType: string,
    resourceId: string,
    requiredPermission: string
  ): Promise<void> {
    const event = createAuditEvent(
      'PERMISSION_DENIED',
      actor,
      { type: resourceType as any, id: resourceId },
      `Permission denied for action: ${action}. Required: ${requiredPermission}`,
      { action, resourceType, resourceId, requiredPermission },
      { severity: 'CRITICAL', status: 'FAILURE' }
    );

    await this.logEvent(event);
    console.log('[AUDIT] PERMISSION_DENIED:', JSON.stringify(event, null, 2));
  }

  /**
   * GENERIC LOG EVENT
   */
  private async logEvent(event: AuditEvent): Promise<void> {
    // Validate metadata
    const validation = validateAuditMetadata(event.eventType, event.metadata);
    if (!validation.isValid) {
      console.warn(`[AUDIT] Missing metadata fields for ${event.eventType}:`, validation.missingFields);
    }

    // Add to buffer
    this.auditBuffer.push(event);

    // Flush if buffer is full
    if (this.auditBuffer.length >= this.BUFFER_SIZE) {
      await this.flush();
    }

    // In production: Send to backend immediately for critical events
    if (event.severity === 'CRITICAL') {
      await this.sendToBackend([event]);
    }
  }

  /**
   * FLUSH BUFFER
   */
  private async flush(): Promise<void> {
    if (this.auditBuffer.length === 0) return;

    const eventsToSend = [...this.auditBuffer];
    this.auditBuffer = [];

    await this.sendToBackend(eventsToSend);
  }

  /**
   * SEND TO BACKEND
   */
  private async sendToBackend(events: AuditEvent[]): Promise<void> {
    try {
      console.log(`[AUDIT] Sending ${events.length} events to backend...`);
      
      // In production: POST to /api/audit/events
      // await fetch('/api/audit/events', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ events })
      // });

      // For demo: just log
      console.log('[AUDIT] Events sent successfully');
    } catch (error) {
      console.error('[AUDIT] Failed to send events:', error);
      // Re-add to buffer for retry
      this.auditBuffer.unshift(...events);
    }
  }

  /**
   * START AUTO-FLUSH
   */
  private startAutoFlush(): void {
    if (typeof window !== 'undefined') {
      this.flushTimer = window.setInterval(() => {
        this.flush();
      }, this.FLUSH_INTERVAL_MS);
    }
  }

  /**
   * STOP AUTO-FLUSH
   */
  public stopAutoFlush(): void {
    if (this.flushTimer !== null) {
      clearInterval(this.flushTimer);
      this.flushTimer = null;
    }
  }

  /**
   * QUERY AUDIT EVENTS
   */
  async queryEvents(
    filters: AuditQueryFilters,
    page: number = 1,
    pageSize: number = 50
  ): Promise<AuditListResponse> {
    // In production: Query from backend
    // const response = await fetch('/api/audit/events?' + queryParams);
    // return response.json();

    // Mock implementation
    return {
      events: [],
      total: 0,
      page,
      pageSize,
      totalPages: 0
    };
  }

  /**
   * GET AUDIT STATISTICS
   */
  async getStatistics(
    filters?: AuditQueryFilters
  ): Promise<AuditStatistics> {
    // In production: Fetch from backend
    // const response = await fetch('/api/audit/statistics?' + queryParams);
    // return response.json();

    // Mock implementation
    return {
      totalEvents: 0,
      eventsByType: {} as any,
      eventsBySeverity: {
        INFO: 0,
        WARNING: 0,
        ERROR: 0,
        CRITICAL: 0
      },
      eventsByStatus: {
        SUCCESS: 0,
        FAILURE: 0,
        PARTIAL: 0
      },
      topActors: [],
      topResources: [],
      timeRange: {
        from: new Date().toISOString(),
        to: new Date().toISOString()
      }
    };
  }

  /**
   * CREATE ACTOR FROM CURRENT USER
   */
  public createActor(
    userId: string,
    unitId: string,
    userName?: string,
    unitName?: string
  ): AuditActor {
    return {
      userId,
      userName: userName || userId,
      unitId,
      unitName: unitName || unitId,
      ipAddress: this.getClientIpAddress(),
      userAgent: navigator.userAgent,
      sessionId: this.getSessionId()
    };
  }

  /**
   * GET CLIENT IP ADDRESS
   */
  private getClientIpAddress(): string {
    // In production: Get from request headers
    // For demo: use placeholder
    return '113.161.50.100';
  }

  /**
   * GET SESSION ID
   */
  private getSessionId(): string {
    // In production: Get from session storage
    // For demo: generate random
    return sessionStorage.getItem('sessionId') || `SESSION-${Date.now()}`;
  }

  /**
   * FORMAT BYTES
   */
  private formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
  }

  /**
   * CLEANUP ON DESTROY
   */
  public destroy(): void {
    this.stopAutoFlush();
    this.flush();
  }
}

// Singleton instance
export const auditLogger = new AuditLoggingService();

// Cleanup on page unload
if (typeof window !== 'undefined') {
  window.addEventListener('beforeunload', () => {
    auditLogger.destroy();
  });
}
