/**
 * Lead Status Design Tokens
 * Trạng thái của Lead trong hệ thống QLTT
 */

export type LeadStatus =
  | 'new'
  | 'triaged'
  | 'assigned'
  | 'in_verification'
  | 'resolved'
  | 'closed'
  | 'duplicate'
  | 'rejected'
  | 'escalated';

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  new: 'Mới',
  triaged: 'Đã phân loại',
  assigned: 'Đã phân công',
  in_verification: 'Đang xác minh',
  resolved: 'Đã giải quyết',
  closed: 'Đã đóng',
  duplicate: 'Trùng lặp',
  rejected: 'Từ chối',
  escalated: 'Chuyển cấp',
};

export const LEAD_STATUS_COLORS: Record<LeadStatus, string> = {
  new: 'rgba(59, 130, 246, 1)', // blue
  triaged: 'rgba(168, 85, 247, 1)', // purple
  assigned: 'rgba(234, 179, 8, 1)', // yellow
  in_verification: 'rgba(251, 146, 60, 1)', // orange
  resolved: 'rgba(34, 197, 94, 1)', // green
  closed: 'rgba(148, 163, 184, 1)', // gray
  duplicate: 'rgba(100, 116, 139, 1)', // slate
  rejected: 'rgba(239, 68, 68, 1)', // red
  escalated: 'rgba(220, 38, 38, 1)', // dark red
};

export const LEAD_STATUS_BG_COLORS: Record<LeadStatus, string> = {
  new: 'rgba(59, 130, 246, 0.1)',
  triaged: 'rgba(168, 85, 247, 0.1)',
  assigned: 'rgba(234, 179, 8, 0.1)',
  in_verification: 'rgba(251, 146, 60, 0.1)',
  resolved: 'rgba(34, 197, 94, 0.1)',
  closed: 'rgba(148, 163, 184, 0.1)',
  duplicate: 'rgba(100, 116, 139, 0.1)',
  rejected: 'rgba(239, 68, 68, 0.1)',
  escalated: 'rgba(220, 38, 38, 0.1)',
};

/**
 * Urgency Level Design Tokens
 */
export type UrgencyLevel = 'low' | 'medium' | 'high' | 'critical';

export const URGENCY_LABELS: Record<UrgencyLevel, string> = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
  critical: 'Khẩn cấp',
};

export const URGENCY_COLORS: Record<UrgencyLevel, string> = {
  low: 'rgba(148, 163, 184, 1)', // gray
  medium: 'rgba(234, 179, 8, 1)', // yellow
  high: 'rgba(251, 146, 60, 1)', // orange
  critical: 'rgba(239, 68, 68, 1)', // red
};

export const URGENCY_BG_COLORS: Record<UrgencyLevel, string> = {
  low: 'rgba(148, 163, 184, 0.1)',
  medium: 'rgba(234, 179, 8, 0.1)',
  high: 'rgba(251, 146, 60, 0.1)',
  critical: 'rgba(239, 68, 68, 0.1)',
};

/**
 * Confidence Level Design Tokens
 */
export type ConfidenceLevel = 'low' | 'medium' | 'high';

export const CONFIDENCE_LABELS: Record<ConfidenceLevel, string> = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
};

export const CONFIDENCE_COLORS: Record<ConfidenceLevel, string> = {
  low: 'rgba(239, 68, 68, 1)', // red
  medium: 'rgba(234, 179, 8, 1)', // yellow
  high: 'rgba(34, 197, 94, 1)', // green
};

export const CONFIDENCE_BG_COLORS: Record<ConfidenceLevel, string> = {
  low: 'rgba(239, 68, 68, 0.1)',
  medium: 'rgba(234, 179, 8, 0.1)',
  high: 'rgba(34, 197, 94, 0.1)',
};

/**
 * Risk Scope Design Tokens
 */
export type RiskScope = 'point' | 'store' | 'zone' | 'route' | 'topic';

export const RISK_SCOPE_LABELS: Record<RiskScope, string> = {
  point: 'Điểm',
  store: 'Cơ sở',
  zone: 'Khu vực',
  route: 'Tuyến',
  topic: 'Chủ đề',
};

export const RISK_SCOPE_COLORS: Record<RiskScope, string> = {
  point: 'rgba(59, 130, 246, 1)', // blue
  store: 'rgba(168, 85, 247, 1)', // purple
  zone: 'rgba(251, 146, 60, 1)', // orange
  route: 'rgba(234, 179, 8, 1)', // yellow
  topic: 'rgba(34, 197, 94, 1)', // green
};

export const RISK_SCOPE_BG_COLORS: Record<RiskScope, string> = {
  point: 'rgba(59, 130, 246, 0.1)',
  store: 'rgba(168, 85, 247, 0.1)',
  zone: 'rgba(251, 146, 60, 0.1)',
  route: 'rgba(234, 179, 8, 0.1)',
  topic: 'rgba(34, 197, 94, 0.1)',
};
