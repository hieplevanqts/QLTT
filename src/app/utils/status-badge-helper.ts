/**
 * Helper utility to map domain-specific statuses to generic StatusBadge props.
 * This keeps the StatusBadge component "dumb" and reusable across any module.
 */

import type { PlanStatus, TaskStatus, SLAStatus, Priority } from '@/app/types/plans';
import type { InspectionRoundStatus, InspectionType } from '@/app/types/inspections';

export type StatusCategory = 
  | 'plan' 
  | 'round'
  | 'task' 
  | 'sla' 
  | 'priority' 
  | 'planType'
  | 'inspectionType'
  | 'sessionType'
  | 'lead';

// Plan Status Mapping
const planStatusMap: Record<PlanStatus, { label: string; variant: string }> = {
  draft: { label: 'Nháp', variant: 'draft' },
  pending_approval: { label: 'Chờ duyệt', variant: 'pending_approval' },
  approved: { label: 'Đã duyệt', variant: 'approved' },
  active: { label: 'Đang triển khai', variant: 'active' },
  completed: { label: 'Hoàn thành', variant: 'completed' },
  paused: { label: 'Tạm dừng', variant: 'paused' },
  rejected: { label: 'Đã từ chối', variant: 'rejected' },
  cancelled: { label: 'Đã hủy', variant: 'cancelled' }
};

// Inspection Round Status Mapping
const roundStatusMap: Record<InspectionRoundStatus, { label: string; variant: string }> = {
  draft: { label: 'Nháp', variant: 'draft' },
  pending_approval: { label: 'Chờ duyệt', variant: 'pending_approval' },
  approved: { label: 'Đã duyệt', variant: 'approved' },
  rejected: { label: 'Từ chối duyệt', variant: 'rejected' },
  active: { label: 'Đang triển khai', variant: 'active' },
  paused: { label: 'Tạm dừng', variant: 'paused' },
  in_progress: { label: 'Đang kiểm tra', variant: 'in_progress' },
  completed: { label: 'Hoàn thành', variant: 'completed' },
  cancelled: { label: 'Đã hủy', variant: 'cancelled' },
};

// Task Status Mapping
const taskStatusMap: Record<TaskStatus, { label: string; variant: string }> = {
  not_started: { label: 'Chưa bắt đầu', variant: 'not_started' },
  in_progress: { label: 'Đang thực hiện', variant: 'in_progress' },
  pending_approval: { label: 'Chờ duyệt', variant: 'pending_approval' },
  completed: { label: 'Hoàn thành', variant: 'completed' },
  cancelled: { label: 'Đã hủy', variant: 'cancelled' },
  closed: { label: 'Đã đóng', variant: 'closed' }
};

// SLA Status Mapping
const slaStatusMap: Record<SLAStatus, { label: string; variant: string }> = {
  on_track: { label: 'Đúng tiến độ', variant: 'on_track' },
  at_risk: { label: 'Có rủi ro', variant: 'at_risk' },
  overdue: { label: 'Quá hạn', variant: 'overdue' }
};

// Priority Mapping
const priorityMap: Record<Priority, { label: string; variant: string }> = {
  low: { label: 'Thấp', variant: 'low' },
  medium: { label: 'Trung bình', variant: 'medium' },
  high: { label: 'Cao', variant: 'high' },
  critical: { label: 'Khẩn cấp', variant: 'critical' },
  urgent: { label: 'Khẩn cấp', variant: 'critical' } // Support both critical and urgent
};

// Plan Type Mapping
const planTypeMap: Record<string, { label: string; variant: string }> = {
  periodic: { label: 'Định kỳ (Năm)', variant: 'periodic' },
  thematic: { label: 'Chuyên đề', variant: 'thematic' },
  urgent: { label: 'Đột xuất', variant: 'urgent' }
};

// Inspection Type Mapping
const inspectionTypeMap: Record<InspectionType, { label: string; variant: string }> = {
  routine: { label: 'Định kỳ', variant: 'routine' },
  targeted: { label: 'Chuyên đề', variant: 'targeted' },
  sudden: { label: 'Đột xuất', variant: 'sudden' },
  followup: { label: 'Tái kiểm tra', variant: 'followup' },
};

// Lead Status Mapping
const leadStatusMap: Record<string, { label: string; variant: string }> = {
  new: { label: 'Mới', variant: 'active' }, // Use 'active' style for new
  in_verification: { label: 'Đang xác minh', variant: 'pending_approval' },
  in_progress: { label: 'Đang xử lý', variant: 'in_progress' },
  resolved: { label: 'Đã xử lý', variant: 'completed' },
  rejected: { label: 'Đã từ chối', variant: 'rejected' },
  cancelled: { label: 'Đã hủy', variant: 'cancelled' },
  under_investigation: { label: 'Đang điều tra', variant: 'in_progress' },
  closed: { label: 'Đã đóng', variant: 'closed' },
};

// Session Type Mapping (passive/proactive)
const sessionTypeMap: Record<string, { label: string; variant: string }> = {
  passive: { label: 'Nguồn tin', variant: 'active' },
  proactive: { label: 'Kế hoạch', variant: 'approved' },
};

const CATEGORY_MAPS: Record<string, Record<string, { label: string; variant: string }>> = {
  plan: planStatusMap,
  round: roundStatusMap,
  task: taskStatusMap,
  sla: slaStatusMap,
  priority: priorityMap,
  planType: planTypeMap,
  inspectionType: inspectionTypeMap,
  sessionType: sessionTypeMap,
  lead: leadStatusMap,
};

/**
 * Returns the label and variant/styles for a given status value and category.
 * Useful for spreading into the StatusBadge component.
 * 
 * @example
 * <StatusBadge {...getStatusProps('plan', plan.status)} />
 */
export function getStatusProps(category: StatusCategory, value: string) {
  const config = CATEGORY_MAPS[category]?.[value];
  
  if (!config) {
    return { label: value, variant: value };
  }
  
  return config;
}
