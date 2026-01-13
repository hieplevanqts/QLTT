/**
 * MAPPA Lead & Risk Management - Complete Type Definitions
 * Ready for API integration - chỉ cần replace mock data với API calls
 */

// ============================================================================
// A. LEAD STATUS (Vòng đời nguồn tin)
// ============================================================================

export type LeadStatus =
  | 'new'                  // Mới tạo
  | 'triaged'             // Đã phân loại
  | 'pendingInfo'         // Chờ bổ sung thông tin
  | 'assigned'            // Đã giao việc
  | 'inProgress'          // Đang xử lý (field work)
  | 'inVerification'      // Đang kiểm tra (office review)
  | 'resolved'            // Đã giải quyết
  | 'closed'              // Đã đóng
  | 'duplicate'           // Trùng lặp
  | 'rejected'            // Từ chối
  | 'escalated'           // Báo cáo cấp trên
  | 'onHold';             // Tạm dừng

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Mới',
  triaged: 'Đã phân loại',
  pendingInfo: 'Chờ bổ sung TT',
  assigned: 'Đã giao việc',
  inProgress: 'Đang xử lý',
  inVerification: 'Đang kiểm tra',
  resolved: 'Đã giải quyết',
  closed: 'Đã đóng',
  duplicate: 'Trùng lặp',
  rejected: 'Từ chối',
  escalated: 'Báo cáo cấp trên',
  onHold: 'Tạm dừng',
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'var(--chart-5)',
  triaged: 'var(--chart-3)',
  pendingInfo: 'var(--chart-2)',
  assigned: 'var(--primary)',
  inProgress: 'var(--primary)',
  inVerification: 'var(--chart-3)',
  resolved: 'var(--chart-4)',
  closed: 'var(--muted-foreground)',
  duplicate: 'var(--muted-foreground)',
  rejected: 'var(--chart-1)',
  escalated: 'var(--chart-2)',
  onHold: 'var(--chart-2)',
};

// ============================================================================
// B. URGENCY / PRIORITY
// ============================================================================

export type Urgency = 'low' | 'medium' | 'high' | 'critical';

export const URGENCY_LABELS: Record<Urgency, string> = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
  critical: 'Nghiêm trọng',
};

export const URGENCY_COLORS: Record<Urgency, string> = {
  low: 'var(--muted-foreground)',
  medium: 'var(--chart-5)',
  high: 'var(--chart-2)',
  critical: 'var(--chart-1)',
};

export const URGENCY_SLA_HOURS: Record<Urgency, number> = {
  low: 72,      // 3 days
  medium: 48,   // 2 days
  high: 24,     // 1 day
  critical: 4,  // 4 hours
};

// ============================================================================
// C. CONFIDENCE (Độ tin cậy nguồn tin)
// ============================================================================

export type Confidence = 'unverified' | 'low' | 'medium' | 'high' | 'verified';

export const CONFIDENCE_LABELS: Record<Confidence, string> = {
  unverified: 'Chưa xác minh',
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
  verified: 'Đã xác minh',
};

export const CONFIDENCE_SCORES: Record<Confidence, number> = {
  unverified: 10,
  low: 30,
  medium: 60,
  high: 85,
  verified: 100,
};

export const CONFIDENCE_COLORS: Record<Confidence, string> = {
  unverified: 'var(--muted-foreground)',
  low: 'var(--chart-2)',
  medium: 'var(--chart-5)',
  high: 'var(--chart-3)',
  verified: 'var(--chart-4)',
};

// ============================================================================
// D. RISK SCOPE (Đối tượng rủi ro)
// ============================================================================

export type RiskScope =
  | 'point'      // Điểm đơn lẻ
  | 'store'      // Cơ sở
  | 'chain'      // Chuỗi
  | 'route'      // Tuyến
  | 'zone'       // Vùng
  | 'supplier'   // Nguồn gốc
  | 'topic'      // Chuyên đề
  | 'event';     // Sự kiện

export const RISK_SCOPE_LABELS: Record<RiskScope, string> = {
  point: 'Điểm',
  store: 'Cơ sở',
  chain: 'Chuỗi',
  route: 'Tuyến',
  zone: 'Vùng',
  supplier: 'Nguồn gốc',
  topic: 'Chuyên đề',
  event: 'Sự kiện',
};

export const RISK_SCOPE_ICONS: Record<RiskScope, string> = {
  point: 'MapPin',
  store: 'Building2',
  chain: 'Network',
  route: 'Route',
  zone: 'Map',
  supplier: 'Factory',
  topic: 'FolderTree',
  event: 'Calendar',
};

// ============================================================================
// E. SOURCE TYPE (Loại nguồn tin)
// ============================================================================

export type SourceType =
  | 'hotline'        // 1800
  | 'webPortal'      // mappa.gov.vn
  | 'mobileApp'      // Mobile app
  | 'email'          // Email
  | 'socialMedia'    // Facebook, Zalo
  | 'walkIn'         // Đến trực tiếp
  | 'inspector'      // Thanh tra phát hiện
  | 'interAgency'    // Từ bộ khác
  | 'media'          // Báo chí
  | 'whistleblower'; // Người trong cuộc tố cáo

export const SOURCE_TYPE_LABELS: Record<SourceType, string> = {
  hotline: 'Hotline 1800',
  webPortal: 'Cổng thông tin',
  mobileApp: 'Ứng dụng di động',
  email: 'Email',
  socialMedia: 'Mạng xã hội',
  walkIn: 'Trực tiếp',
  inspector: 'Thanh tra phát hiện',
  interAgency: 'Liên ngành',
  media: 'Báo chí',
  whistleblower: 'Người tố cáo',
};

export const SOURCE_TYPE_DEFAULT_CONFIDENCE: Record<SourceType, Confidence> = {
  hotline: 'low',
  webPortal: 'low',
  mobileApp: 'low',
  email: 'medium',
  socialMedia: 'low',
  walkIn: 'medium',
  inspector: 'verified',
  interAgency: 'high',
  media: 'medium',
  whistleblower: 'high',
};

// ============================================================================
// F. VIOLATION TYPE (Loại vi phạm)
// ============================================================================

export type ViolationType =
  | 'foodSafety'           // An toàn thực phẩm
  | 'counterfeit'          // Hàng giả
  | 'substandard'          // Hàng kém chất lượng
  | 'unlicensed'           // Kinh doanh không phép
  | 'priceManipulation'    // Vi phạm giá
  | 'falseAdvertising'     // Quảng cáo sai sự thật
  | 'consumerRights'       // Vi phạm quyền người tiêu dùng
  | 'prohibitedGoods';     // Hàng cấm

export const VIOLATION_TYPE_LABELS: Record<ViolationType, string> = {
  foodSafety: 'An toàn thực phẩm',
  counterfeit: 'Hàng giả',
  substandard: 'Hàng kém chất lượng',
  unlicensed: 'Kinh doanh không phép',
  priceManipulation: 'Vi phạm giá',
  falseAdvertising: 'Quảng cáo sai sự thật',
  consumerRights: 'Vi phạm quyền NTD',
  prohibitedGoods: 'Hàng cấm',
};

export const VIOLATION_TYPE_COLORS: Record<ViolationType, string> = {
  foodSafety: 'var(--chart-1)',
  counterfeit: 'var(--chart-2)',
  substandard: 'var(--chart-5)',
  unlicensed: 'var(--chart-3)',
  priceManipulation: 'var(--chart-4)',
  falseAdvertising: 'var(--chart-2)',
  consumerRights: 'var(--chart-5)',
  prohibitedGoods: 'var(--chart-1)',
};

export interface ViolationSubtype {
  type: ViolationType;
  subtype: string;
  legalReference: string; // Nghị định, Điều, Khoản
  minFine: number;        // VND
  maxFine: number;        // VND
}

// ============================================================================
// G. ACTION STATUS (Trạng thái hành động)
// ============================================================================

export type ActionStatus =
  | 'pendingAssignment'    // Chờ giao việc
  | 'travelToSite'         // Di chuyển đến hiện trường
  | 'onSite'               // Đang tại hiện trường
  | 'evidenceCollected'    // Đã thu thập chứng cứ
  | 'sampleTaken'          // Đã lấy mẫu
  | 'inspectionComplete'   // Hoàn tất kiểm tra
  | 'reportDrafted'        // Đã lập biên bản
  | 'penaltyIssued'        // Đã xử phạt
  | 'followUpRequired'     // Cần kiểm tra lại
  | 'completed';           // Hoàn tất

export const ACTION_STATUS_LABELS: Record<ActionStatus, string> = {
  pendingAssignment: 'Chờ giao việc',
  travelToSite: 'Đang di chuyển',
  onSite: 'Tại hiện trường',
  evidenceCollected: 'Đã thu thập CC',
  sampleTaken: 'Đã lấy mẫu',
  inspectionComplete: 'Hoàn tất kiểm tra',
  reportDrafted: 'Đã lập biên bản',
  penaltyIssued: 'Đã xử phạt',
  followUpRequired: 'Cần kiểm tra lại',
  completed: 'Hoàn tất',
};

// ============================================================================
// H. EVIDENCE TYPE (Loại chứng cứ)
// ============================================================================

export type EvidenceType =
  | 'photo'
  | 'video'
  | 'document'
  | 'physicalSample'
  | 'witnessStatement'
  | 'inspectorReport'
  | 'labTestResult'
  | 'audioRecording'
  | 'digitalEvidence'
  | 'gpsLocation';

export const EVIDENCE_TYPE_LABELS: Record<EvidenceType, string> = {
  photo: 'Hình ảnh',
  video: 'Video',
  document: 'Giấy tờ',
  physicalSample: 'Mẫu vật',
  witnessStatement: 'Lời khai',
  inspectorReport: 'Biên bản',
  labTestResult: 'Kết quả giám định',
  audioRecording: 'Ghi âm',
  digitalEvidence: 'Chứng cứ số',
  gpsLocation: 'Dữ liệu GPS',
};

export interface Evidence {
  id: string;
  type: EvidenceType;
  description: string;
  fileUrl?: string;
  fileName?: string;
  uploadedBy: string;
  uploadedAt: Date;
  metadata?: Record<string, any>;
}

// ============================================================================
// I. RESOLUTION TYPE (Kết quả xử lý)
// ============================================================================

export type ResolutionType =
  | 'warning'              // Nhắc nhở
  | 'adminFine'            // Phạt tiền
  | 'goodsConfiscation'    // Tịch thu hàng hóa
  | 'licenseSuspension'    // Đình chỉ hoạt động
  | 'licenseRevocation'    // Thu hồi giấy phép
  | 'criminalReferral'     // Chuyển công an
  | 'correctiveAction'     // Yêu cầu khắc phục
  | 'noViolation'          // Không vi phạm
  | 'merchantResolved'     // Cơ sở tự khắc phục
  | 'transferred';         // Chuyển đơn vị khác

export const RESOLUTION_TYPE_LABELS: Record<ResolutionType, string> = {
  warning: 'Nhắc nhở',
  adminFine: 'Phạt tiền',
  goodsConfiscation: 'Tịch thu hàng',
  licenseSuspension: 'Đình chỉ hoạt động',
  licenseRevocation: 'Thu hồi giấy phép',
  criminalReferral: 'Chuyển công an',
  correctiveAction: 'Yêu cầu khắc phục',
  noViolation: 'Không vi phạm',
  merchantResolved: 'Cơ sở tự khắc phục',
  transferred: 'Chuyển đơn vị khác',
};

export const RESOLUTION_TYPE_COLORS: Record<ResolutionType, string> = {
  warning: 'var(--chart-5)',
  adminFine: 'var(--chart-2)',
  goodsConfiscation: 'var(--chart-1)',
  licenseSuspension: 'var(--chart-1)',
  licenseRevocation: 'var(--chart-1)',
  criminalReferral: 'var(--chart-1)',
  correctiveAction: 'var(--chart-3)',
  noViolation: 'var(--chart-4)',
  merchantResolved: 'var(--chart-4)',
  transferred: 'var(--muted-foreground)',
};

// ============================================================================
// J. ASSIGNEE TYPE (Loại người được giao)
// ============================================================================

export type AssigneeType =
  | 'individual'     // Thanh tra viên đơn lẻ
  | 'team'           // Đội thanh tra
  | 'jointForce'     // Liên ngành
  | 'external';      // Ủy thác

export const ASSIGNEE_TYPE_LABELS: Record<AssigneeType, string> = {
  individual: 'Cá nhân',
  team: 'Đội',
  jointForce: 'Liên ngành',
  external: 'Ủy thác',
};

// ============================================================================
// K. SLA STATUS (Auto-calculated from deadline)
// ============================================================================

export type SLAStatus = 'onTrack' | 'atRisk' | 'overdue';

export const SLA_STATUS_LABELS: Record<SLAStatus, string> = {
  onTrack: 'Trong hạn',
  atRisk: 'Sắp quá hạn',
  overdue: 'Quá hạn',
};

export const SLA_STATUS_COLORS: Record<SLAStatus, string> = {
  onTrack: 'var(--chart-4)',
  atRisk: 'var(--chart-2)',
  overdue: 'var(--chart-1)',
};

// ============================================================================
// MAIN LEAD INTERFACE
// ============================================================================

export interface Lead {
  // Basic Info
  id: string;
  title: string;
  description: string;

  // A. Lead Status
  status: LeadStatus;
  statusHistory: Array<{
    status: LeadStatus;
    changedBy: string;
    changedAt: Date;
    reason?: string;
  }>;

  // B. Urgency
  urgency: Urgency;
  slaDeadline: Date;
  slaStatus: SLAStatus; // Auto-calculated
  priorityOverrideReason?: string;

  // C. Confidence
  confidence: Confidence;
  confidenceScore: number; // 0-100

  // D. Risk Scope
  riskScope: RiskScope;
  riskScopeDetails?: string;
  estimatedAffectedPeople?: number;

  // E. Source
  sourceType: SourceType;
  sourceReference: string; // Ticket #, Email ID, etc.
  reporterName?: string;
  reporterContact?: string;

  // F. Violation
  violationTypes: ViolationType[];
  violationSubtypes?: string[];
  legalReferences?: string[];

  // G. Action Status
  actionStatus: ActionStatus;
  actionHistory: Array<{
    action: ActionStatus;
    performedBy: string;
    performedAt: Date;
    location?: { lat: number; lng: number };
    notes?: string;
  }>;

  // H. Evidence
  evidences: Evidence[];

  // I. Resolution
  resolutionType?: ResolutionType;
  resolutionDetails?: string;
  penaltyAmount?: number; // VND
  confiscatedValue?: number; // VND
  resolutionDocument?: string;

  // J. Assignment
  assigneeType: AssigneeType;
  assignedTo?: string | string[]; // Team ID or Inspector ID(s)
  assignedAt?: Date;

  // Location
  location: {
    address: string;
    ward?: string;
    district: string;
    city: string;
    coordinates?: { lat: number; lng: number };
    zone?: string;
  };

  // Business Info
  businessName?: string;
  businessLicense?: string;
  businessOwner?: string;
  businessPhone?: string;

  // Metadata
  tags?: string[];
  relatedLeads?: string[]; // IDs of related leads
  duplicateOf?: string; // If status = duplicate

  // Timestamps
  createdAt: Date;
  updatedAt: Date;
  assignedAt?: Date;
  resolvedAt?: Date;
  closedAt?: Date;

  // System
  createdBy: string;
  organization: string; // Chi cục
  department?: string; // Phòng/Ban
}

// ============================================================================
// ACTION LOG
// ============================================================================

export interface ActionLog {
  id: string;
  leadId: string;
  action: ActionStatus;
  performedBy: string;
  performedAt: Date;
  location?: { lat: number; lng: number };
  duration?: number; // minutes
  notes?: string;
  evidenceCollected?: string[]; // Evidence IDs
}

// ============================================================================
// TEAM & INSPECTOR
// ============================================================================

export interface Team {
  id: string;
  name: string;
  organization: string;
  area: string;
  members: string[]; // Inspector IDs
  activeLeads: number;
  completedLeads: number;
  slaCompliance: number; // percentage
}

export interface Inspector {
  id: string;
  name: string;
  email: string;
  phone: string;
  role: 'inspector' | 'lead' | 'supervisor' | 'manager';
  teamId: string;
  activeLeads: number;
  specializations: ViolationType[];
}

// ============================================================================
// STATISTICS
// ============================================================================

export interface LeadStatistics {
  total: number;
  byStatus: Record<LeadStatus, number>;
  byUrgency: Record<Urgency, number>;
  byViolationType: Record<ViolationType, number>;
  bySLA: Record<SLAStatus, number>;
  byResolution: Record<ResolutionType, number>;
  avgResolutionTime: number; // hours
  slaComplianceRate: number; // percentage
}

// ============================================================================
// API RESPONSE TYPES (Ready for integration)
// ============================================================================

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

export interface LeadFilters {
  status?: LeadStatus[];
  urgency?: Urgency[];
  confidence?: Confidence[];
  riskScope?: RiskScope[];
  sourceType?: SourceType[];
  violationType?: ViolationType[];
  slaStatus?: SLAStatus[];
  assigneeType?: AssigneeType[];
  organization?: string[];
  city?: string[];
  dateFrom?: Date;
  dateTo?: Date;
  search?: string;
}

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

export function calculateSLAStatus(deadline: Date): SLAStatus {
  const now = new Date();
  const hoursRemaining = (deadline.getTime() - now.getTime()) / (1000 * 60 * 60);

  if (hoursRemaining < 0) return 'overdue';
  if (hoursRemaining < 4) return 'atRisk'; // Last 4 hours
  return 'onTrack';
}

export function calculateSLADeadline(createdAt: Date, urgency: Urgency): Date {
  const hours = URGENCY_SLA_HOURS[urgency];
  const deadline = new Date(createdAt);
  deadline.setHours(deadline.getHours() + hours);
  return deadline;
}

export function calculateConfidenceScore(
  sourceType: SourceType,
  evidenceCount: number,
  hasLabTest: boolean,
  hasInspectorReport: boolean
): number {
  let score = CONFIDENCE_SCORES[SOURCE_TYPE_DEFAULT_CONFIDENCE[sourceType]];

  // Boost from evidence
  score += Math.min(evidenceCount * 5, 20);

  // Boost from lab test
  if (hasLabTest) score += 15;

  // Boost from inspector report
  if (hasInspectorReport) score += 10;

  return Math.min(score, 100);
}

export function getConfidenceFromScore(score: number): Confidence {
  if (score >= 91) return 'verified';
  if (score >= 71) return 'high';
  if (score >= 41) return 'medium';
  if (score >= 21) return 'low';
  return 'unverified';
}
