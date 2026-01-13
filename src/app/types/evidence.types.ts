/**
 * Evidence Type Definitions
 * Bám sát mô hình dữ liệu khái niệm (Data Dictionary) - Section 8
 * 
 * 8.1 EvidenceItem
 * 8.2 CustodyEvent
 * 8.3 EvidencePackage
 * 8.4 ExportJob
 */

// ============================================================================
// 8.1 EvidenceItem
// ============================================================================

/**
 * Evidence Type Enum
 */
export type EvidenceType = 
  | 'PHOTO'
  | 'VIDEO'
  | 'AUDIO'
  | 'DOC'
  | 'PDF'
  | 'OTHER';

/**
 * Evidence Status Enum
 * Workflow: Draft → Submitted → InReview → Approved/Rejected/NeedMoreInfo → Sealed → Archived
 */
export type EvidenceStatus = 
  | 'Draft'
  | 'Submitted'
  | 'InReview'
  | 'Approved'
  | 'Rejected'
  | 'NeedMoreInfo'
  | 'Sealed'
  | 'Archived';

/**
 * Evidence Source Enum
 */
export type EvidenceSource = 
  | 'MobileCapture'
  | 'PortalUpload'
  | 'Import'
  | 'ExternalLink';

/**
 * Sensitivity Label Enum
 */
export type SensitivityLabel = 
  | 'Public'
  | 'Internal'
  | 'Restricted'
  | 'Secret-lite';

/**
 * Entity Type for Links
 */
export type EntityType = 
  | 'LEAD'
  | 'RISK'
  | 'TASK'
  | 'PLAN'
  | 'STORE';

/**
 * Scope (địa bàn quản lý)
 */
export interface EvidenceScope {
  province?: string;
  ward?: string;
  unitId?: string;
}

/**
 * Location Information
 */
export interface EvidenceLocation {
  lat: number;
  lng: number;
  addressText: string;
  precision?: number;      // Độ chính xác GPS (meters)
  confidence?: number;     // Độ tin cậy (0-1)
}

/**
 * File Information
 */
export interface EvidenceFile {
  storageKey: string;      // Storage identifier (S3 key, file path, etc.)
  filename: string;        // Original filename
  mimeType: string;        // MIME type (image/jpeg, video/mp4, etc.)
  sizeBytes: number;       // File size in bytes
  durationSec?: number;    // Duration for video/audio (seconds)
  pageCount?: number;      // Page count for PDF/documents
}

/**
 * Hash Information (SWGDE compliant)
 */
export interface EvidenceHash {
  alg: string;             // Algorithm: SHA-256, SHA-512, MD5
  value: string;           // Hash value (hex string)
  computedAt: string;      // ISO 8601 timestamp
  computedBy: string;      // User ID or 'System'
}

/**
 * Submitter Information
 */
export interface EvidenceSubmitter {
  userId: string;
  unitId: string;
}

/**
 * Review Information
 */
export interface EvidenceReview {
  assignedReviewerId?: string;
  decision?: 'Approved' | 'Rejected' | 'NeedMoreInfo';
  decisionAt?: string;           // ISO 8601 timestamp
  decisionReason?: string;
  commentsThreadId?: string;     // Reference to comments/discussion thread
}

/**
 * Link to Related Entity
 */
export interface EvidenceLink {
  entityType: EntityType;
  entityId: string;
}

/**
 * CORE EVIDENCE ITEM INTERFACE
 * Bám sát 100% mô hình dữ liệu 8.1
 */
export interface EvidenceItem {
  /** Unique Evidence ID */
  evidenceId: string;
  
  /** Evidence Type */
  type: EvidenceType;
  
  /** Current Status */
  status: EvidenceStatus;
  
  /** Scope (địa bàn quản lý) */
  scope: EvidenceScope;
  
  /** Source of evidence */
  source: EvidenceSource;
  
  /** Captured timestamp (ISO 8601) */
  capturedAt: string;
  
  /** Uploaded timestamp (ISO 8601) */
  uploadedAt: string;
  
  /** Location information */
  location: EvidenceLocation;
  
  /** File information */
  file: EvidenceFile;
  
  /** Hash values (SWGDE - multiple algorithms) */
  hashes: EvidenceHash[];
  
  /** Sensitivity label */
  sensitivityLabel: SensitivityLabel;
  
  /** Submitter information */
  submitter: EvidenceSubmitter;
  
  /** Review information */
  review: EvidenceReview;
  
  /** Links to related entities */
  links: EvidenceLink[];
  
  /** Original Evidence ID (if this is derived version) */
  originalEvidenceId?: string;
  
  /** Created timestamp (ISO 8601) */
  createdAt: string;
  
  /** Updated timestamp (ISO 8601) */
  updatedAt: string;
  
  // === OPTIONAL METADATA (not in schema but useful) ===
  
  /** Notes/description */
  notes?: string;
  
  /** Tags for categorization */
  tags?: string[];
  
  /** Device information */
  deviceInfo?: string;
  
  /** Derived version IDs (if this is original) */
  derivedVersionIds?: string[];
  
  /** Derivation reason (if derived) */
  derivationReason?: string;
  
  /** Derived timestamp (if derived) */
  derivedAt?: string;
  
  /** Derived by user (if derived) */
  derivedBy?: string;
}

// ============================================================================
// 8.2 CustodyEvent
// ============================================================================

/**
 * Custody Event Type
 */
export type CustodyEventType = 
  | 'Upload'
  | 'Submit'
  | 'View'
  | 'Edit'
  | 'Review'
  | 'Approve'
  | 'Reject'
  | 'Download'
  | 'Export'
  | 'Seal'
  | 'Unseal'
  | 'Archive'
  | 'Derive'
  | 'Link'
  | 'Unlink';

/**
 * Custody Event Context
 */
export interface CustodyEventContext {
  ip?: string;             // IP address
  device?: string;         // Device/browser info
  requestId?: string;      // Request ID for tracing
}

/**
 * CUSTODY EVENT
 * Bám sát 100% mô hình dữ liệu 8.2
 */
export interface CustodyEvent {
  /** Event ID */
  eventId: string;
  
  /** Evidence ID */
  evidenceId: string;
  
  /** Event Type */
  eventType: CustodyEventType;
  
  /** Actor User ID */
  actorUserId: string;
  
  /** Actor Unit ID */
  actorUnitId: string;
  
  /** Event timestamp (ISO 8601) */
  timestamp: string;
  
  /** Context (IP, device, requestId) */
  context: CustodyEventContext;
  
  /** Optional note/description */
  note?: string;
}

// ============================================================================
// 8.3 EvidencePackage
// ============================================================================

/**
 * Evidence Package Status
 */
export type PackageStatus = 
  | 'Draft'
  | 'Generated'
  | 'Exported';

/**
 * Package Item (Evidence in package)
 */
export interface PackageItem {
  evidenceId: string;
  order: number;           // Display order in package
}

/**
 * Linked Entity for Package
 */
export interface PackageLinkedEntity {
  entityType: 'PLAN' | 'LEAD' | 'TASK';
  entityId: string;
}

/**
 * EVIDENCE PACKAGE
 * Bám sát 100% mô hình dữ liệu 8.3
 */
export interface EvidencePackage {
  /** Package ID */
  packageId: string;
  
  /** Package name */
  name: string;
  
  /** Scope (địa bàn) */
  scope: EvidenceScope;
  
  /** Owner Unit ID */
  ownerUnitId: string;
  
  /** Created by User ID */
  createdBy: string;
  
  /** Linked entity (plan/lead/task) */
  linkedEntity?: PackageLinkedEntity;
  
  /** Evidence items in package */
  items: PackageItem[];
  
  /** Include metadata in export? */
  includeMetadata: boolean;
  
  /** Include chain of custody excerpt? */
  includeCustodyExcerpt: boolean;
  
  /** Package status */
  status: PackageStatus;
  
  /** Export job IDs */
  exports: string[];
  
  /** Created timestamp (ISO 8601) */
  createdAt: string;
  
  /** Updated timestamp (ISO 8601) */
  updatedAt: string;
}

// ============================================================================
// 8.4 ExportJob
// ============================================================================

/**
 * Export Job Type
 */
export type ExportJobType = 
  | 'EVIDENCE_PACKAGE'
  | 'CHAIN_OF_CUSTODY'
  | 'ITEMS_LIST';

/**
 * Export Job Status
 */
export type ExportJobStatus = 
  | 'Pending'
  | 'Processing'
  | 'Completed'
  | 'Failed';

/**
 * EXPORT JOB
 * Bám sát 100% mô hình dữ liệu 8.4
 */
export interface ExportJob {
  /** Job ID */
  jobId: string;
  
  /** Export type */
  type: ExportJobType;
  
  /** Requested by User ID */
  requestedBy: string;
  
  /** Requested timestamp (ISO 8601) */
  requestedAt: string;
  
  /** Job status */
  status: ExportJobStatus;
  
  /** Completed timestamp (ISO 8601) */
  completedAt?: string;
  
  /** Download count */
  downloadCount: number;
  
  /** Last downloaded timestamp (ISO 8601) */
  lastDownloadedAt?: string;
  
  /** Download URL (if completed) */
  downloadUrl?: string;
  
  /** File size (if completed) */
  fileSizeBytes?: number;
  
  /** Error message (if failed) */
  errorMessage?: string;
}

// ============================================================================
// HELPER TYPES & INTERFACES
// ============================================================================

/**
 * Evidence Filter Options
 */
export interface EvidenceFilterOptions {
  status?: EvidenceStatus | EvidenceStatus[];
  type?: EvidenceType | EvidenceType[];
  source?: EvidenceSource | EvidenceSource[];
  sensitivityLabel?: SensitivityLabel | SensitivityLabel[];
  scope?: Partial<EvidenceScope>;
  submitterUserId?: string;
  submitterUnitId?: string;
  linkedEntityType?: EntityType;
  linkedEntityId?: string;
  capturedFrom?: string;   // ISO 8601
  capturedTo?: string;     // ISO 8601
  uploadedFrom?: string;   // ISO 8601
  uploadedTo?: string;     // ISO 8601
  searchText?: string;
  hasOriginal?: boolean;   // Filter derived versions
  isDerived?: boolean;     // Filter only derived versions
}

/**
 * Evidence Sort Options
 */
export interface EvidenceSortOptions {
  field: 
    | 'evidenceId'
    | 'capturedAt'
    | 'uploadedAt'
    | 'status'
    | 'type'
    | 'file.sizeBytes';
  direction: 'asc' | 'desc';
}

/**
 * Evidence List Response (with pagination)
 */
export interface EvidenceListResponse {
  items: EvidenceItem[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}

/**
 * Custody Event List Response
 */
export interface CustodyEventListResponse {
  events: CustodyEvent[];
  total: number;
  evidenceId: string;
}

/**
 * Package List Response
 */
export interface PackageListResponse {
  packages: EvidencePackage[];
  total: number;
  page: number;
  pageSize: number;
}

/**
 * Export Job List Response
 */
export interface ExportJobListResponse {
  jobs: ExportJob[];
  total: number;
  page: number;
  pageSize: number;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Format file size from bytes
 */
export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B';
  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return `${parseFloat((bytes / Math.pow(k, i)).toFixed(2))} ${sizes[i]}`;
}

/**
 * Format duration from seconds
 */
export function formatDuration(seconds: number): string {
  const hrs = Math.floor(seconds / 3600);
  const mins = Math.floor((seconds % 3600) / 60);
  const secs = Math.floor(seconds % 60);
  
  if (hrs > 0) {
    return `${hrs}:${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  }
  return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Get hash by algorithm
 */
export function getHashByAlgorithm(
  hashes: EvidenceHash[],
  algorithm: string
): EvidenceHash | undefined {
  return hashes.find(h => h.alg === algorithm);
}

/**
 * Validate Evidence Item (check required fields)
 */
export function validateEvidenceItem(item: Partial<EvidenceItem>): {
  isValid: boolean;
  missingFields: string[];
} {
  const requiredFields: (keyof EvidenceItem)[] = [
    'evidenceId',
    'type',
    'status',
    'scope',
    'source',
    'capturedAt',
    'uploadedAt',
    'location',
    'file',
    'hashes',
    'sensitivityLabel',
    'submitter',
    'review',
    'links',
    'createdAt',
    'updatedAt'
  ];
  
  const missingFields = requiredFields.filter(field => {
    const value = item[field];
    if (value === undefined || value === null) return true;
    if (Array.isArray(value) && value.length === 0 && field === 'hashes') return true;
    return false;
  });
  
  return {
    isValid: missingFields.length === 0,
    missingFields: missingFields as string[]
  };
}

/**
 * Check if evidence can be edited based on status
 */
export function canEditEvidence(status: EvidenceStatus): boolean {
  return status === 'Draft' || status === 'NeedMoreInfo';
}

/**
 * Check if evidence can be deleted based on status
 */
export function canDeleteEvidence(status: EvidenceStatus): boolean {
  return status === 'Draft' || status === 'Rejected';
}

/**
 * Check if evidence can be sealed based on status
 */
export function canSealEvidence(status: EvidenceStatus): boolean {
  return status === 'Approved';
}

/**
 * Get next allowed statuses in workflow
 */
export function getNextStatuses(currentStatus: EvidenceStatus): EvidenceStatus[] {
  switch (currentStatus) {
    case 'Draft':
      return ['Submitted'];
    case 'Submitted':
      return ['InReview'];
    case 'InReview':
      return ['Approved', 'Rejected', 'NeedMoreInfo'];
    case 'NeedMoreInfo':
      return ['Submitted'];
    case 'Approved':
      return ['Sealed'];
    case 'Sealed':
      return ['Archived'];
    default:
      return [];
  }
}

/**
 * Get status badge color
 */
export function getStatusColor(status: EvidenceStatus): {
  color: string;
  bg: string;
} {
  const statusColors: Record<EvidenceStatus, { color: string; bg: string }> = {
    Draft: { color: '#6b7280', bg: '#6b728015' },
    Submitted: { color: '#005cb6', bg: '#005cb615' },
    InReview: { color: '#f59e0b', bg: '#f59e0b15' },
    Approved: { color: '#22c55e', bg: '#22c55e15' },
    Rejected: { color: '#ef4444', bg: '#ef444415' },
    NeedMoreInfo: { color: '#f59e0b', bg: '#f59e0b15' },
    Sealed: { color: '#8b5cf6', bg: '#8b5cf615' },
    Archived: { color: '#9ca3af', bg: '#9ca3af15' }
  };
  
  return statusColors[status] || statusColors.Draft;
}

/**
 * Get status label (Vietnamese)
 */
export function getStatusLabel(status: EvidenceStatus): string {
  const labels: Record<EvidenceStatus, string> = {
    Draft: 'Nháp',
    Submitted: 'Đã nộp',
    InReview: 'Đang xét duyệt',
    Approved: 'Đã duyệt',
    Rejected: 'Từ chối',
    NeedMoreInfo: 'Cần bổ sung',
    Sealed: 'Đã niêm phong',
    Archived: 'Đã lưu trữ'
  };
  
  return labels[status] || status;
}

/**
 * Get type label (Vietnamese)
 */
export function getTypeLabel(type: EvidenceType): string {
  const labels: Record<EvidenceType, string> = {
    PHOTO: 'Ảnh',
    VIDEO: 'Video',
    AUDIO: 'Âm thanh',
    DOC: 'Tài liệu',
    PDF: 'PDF',
    OTHER: 'Khác'
  };
  
  return labels[type] || type;
}

/**
 * Get source label (Vietnamese)
 */
export function getSourceLabel(source: EvidenceSource): string {
  const labels: Record<EvidenceSource, string> = {
    MobileCapture: 'Chụp từ Mobile',
    PortalUpload: 'Tải lên Portal',
    Import: 'Import',
    ExternalLink: 'Liên kết ngoài'
  };
  
  return labels[source] || source;
}

/**
 * Get sensitivity label (Vietnamese)
 */
export function getSensitivityLabel(label: SensitivityLabel): string {
  const labels: Record<SensitivityLabel, string> = {
    Public: 'Công khai',
    Internal: 'Nội bộ',
    Restricted: 'Hạn chế',
    'Secret-lite': 'Bảo mật'
  };
  
  return labels[label] || label;
}

/**
 * Get entity type label (Vietnamese)
 */
export function getEntityTypeLabel(entityType: EntityType): string {
  const labels: Record<EntityType, string> = {
    LEAD: 'Vụ việc',
    RISK: 'Rủi ro',
    TASK: 'Nhiệm vụ',
    PLAN: 'Kế hoạch',
    STORE: 'Cơ sở'
  };
  
  return labels[entityType] || entityType;
}

/**
 * Format scope as display string
 */
export function formatScope(scope: EvidenceScope): string {
  const parts: string[] = [];
  
  if (scope.ward) parts.push(scope.ward);
  if (scope.province) parts.push(scope.province);
  if (scope.unitId) parts.push(`Đơn vị: ${scope.unitId}`);
  
  return parts.join(', ') || 'N/A';
}

/**
 * Create new Evidence Item with defaults
 */
export function createEvidenceItem(
  baseData: Partial<EvidenceItem> & {
    evidenceId: string;
    type: EvidenceType;
    source: EvidenceSource;
    capturedAt: string;
    location: EvidenceLocation;
    file: EvidenceFile;
    submitter: EvidenceSubmitter;
  }
): EvidenceItem {
  const now = new Date().toISOString();
  
  return {
    evidenceId: baseData.evidenceId,
    type: baseData.type,
    status: baseData.status || 'Draft',
    scope: baseData.scope || {},
    source: baseData.source,
    capturedAt: baseData.capturedAt,
    uploadedAt: now,
    location: baseData.location,
    file: baseData.file,
    hashes: baseData.hashes || [],
    sensitivityLabel: baseData.sensitivityLabel || 'Internal',
    submitter: baseData.submitter,
    review: baseData.review || {},
    links: baseData.links || [],
    originalEvidenceId: baseData.originalEvidenceId,
    createdAt: now,
    updatedAt: now,
    notes: baseData.notes,
    tags: baseData.tags,
    deviceInfo: baseData.deviceInfo,
    derivedVersionIds: baseData.derivedVersionIds,
    derivationReason: baseData.derivationReason,
    derivedAt: baseData.derivedAt,
    derivedBy: baseData.derivedBy
  };
}

/**
 * Create Custody Event
 */
export function createCustodyEvent(
  evidenceId: string,
  eventType: CustodyEventType,
  actorUserId: string,
  actorUnitId: string,
  context?: Partial<CustodyEventContext>,
  note?: string
): CustodyEvent {
  return {
    eventId: `COC-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    evidenceId,
    eventType,
    actorUserId,
    actorUnitId,
    timestamp: new Date().toISOString(),
    context: {
      ip: context?.ip,
      device: context?.device || navigator.userAgent.substring(0, 100),
      requestId: context?.requestId
    },
    note
  };
}

/**
 * Create Evidence Package
 */
export function createEvidencePackage(
  packageId: string,
  name: string,
  ownerUnitId: string,
  createdBy: string,
  scope?: EvidenceScope
): EvidencePackage {
  const now = new Date().toISOString();
  
  return {
    packageId,
    name,
    scope: scope || {},
    ownerUnitId,
    createdBy,
    items: [],
    includeMetadata: true,
    includeCustodyExcerpt: true,
    status: 'Draft',
    exports: [],
    createdAt: now,
    updatedAt: now
  };
}

/**
 * Create Export Job
 */
export function createExportJob(
  jobId: string,
  type: ExportJobType,
  requestedBy: string
): ExportJob {
  return {
    jobId,
    type,
    requestedBy,
    requestedAt: new Date().toISOString(),
    status: 'Pending',
    downloadCount: 0
  };
}