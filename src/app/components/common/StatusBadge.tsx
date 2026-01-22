import styles from './StatusBadge.module.css';
import type { PlanStatus, TaskStatus, SLAStatus, Priority } from '@/app/types/plans';
import type { InspectionRoundStatus, InspectionType } from '@/app/types/inspections';

type BadgeType = 
  | 'plan' 
  | 'task' 
  | 'target' 
  | 'sla' 
  | 'priority' 
  | 'planType'
  | 'round'
  | 'inspectionType';

type BadgeSize = 'sm' | 'md' | 'lg';

interface StatusBadgeProps {
  type: BadgeType;
  value: string;
  size?: BadgeSize;
}

// Plan Status Labels
const planStatusLabels: Record<PlanStatus, string> = {
  draft: 'Nháp',
  pending_approval: 'Chờ duyệt',
  approved: 'Đã duyệt',
  active: 'Đang thực hiện',
  completed: 'Hoàn thành',
  paused: 'Tạm dừng',
  rejected: 'Đã từ chối',
  cancelled: 'Đã hủy'
};

// Inspection Round Status Labels
const roundStatusLabels: Record<InspectionRoundStatus, string> = {
  draft: 'Nháp',
  pending_approval: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Từ chối duyệt',
  active: 'Đang triển khai',
  paused: 'Tạm dừng',
  in_progress: 'Đang kiểm tra',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy',
};

// Task Status Labels
const taskStatusLabels: Record<TaskStatus, string> = {
  not_started: 'Chưa bắt đầu',
  in_progress: 'Đang thực hiện',
  completed: 'Hoàn thành',
  closed: 'Đã đóng'
};

// SLA Status Labels
const slaStatusLabels: Record<SLAStatus, string> = {
  on_track: 'Đúng tiến độ',
  at_risk: 'Có rủi ro',
  overdue: 'Quá hạn'
};

// Priority Labels
const priorityLabels: Record<Priority, string> = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
  critical: 'Khẩn cấp'
};

// Plan Type Labels
const planTypeLabels: Record<string, string> = {
  periodic: 'Định kỳ (Năm)',
  thematic: 'Chuyên đề',
  urgent: 'Đột xuất'
};

// Inspection Type Labels
const inspectionTypeLabels: Record<InspectionType, string> = {
  routine: 'Định kỳ',
  targeted: 'Chuyên đề',
  sudden: 'Đột xuất',
  followup: 'Tái kiểm tra',
};

export function StatusBadge({ 
  type, 
  value,
  size = 'md' 
}: StatusBadgeProps) {
  let label = '';
  let variant = '';

  switch (type) {
    case 'plan':
      label = planStatusLabels[value as PlanStatus] || '';
      variant = value;
      break;
    case 'round':
      label = roundStatusLabels[value as InspectionRoundStatus] || '';
      variant = value;
      break;
    case 'task':
      label = taskStatusLabels[value as TaskStatus] || '';
      variant = value;
      break;
    case 'sla':
      label = slaStatusLabels[value as SLAStatus] || '';
      variant = value;
      break;
    case 'priority':
      label = priorityLabels[value as Priority] || '';
      variant = value;
      break;
    case 'planType':
      label = planTypeLabels[value] || '';
      variant = value;
      break;
    case 'inspectionType':
      label = inspectionTypeLabels[value as InspectionType] || '';
      variant = value;
      break;
  }

  // Safety check - if no label found, return null to avoid rendering issues
  if (!label) {
    return null;
  }

  return (
    <span className={`${styles.badge} ${styles[variant]} ${styles[size]}`}>
      {label}
    </span>
  );
}

// Export with original name for backward compatibility
export { StatusBadge as KeHoachTacNghiepStatusBadge };
export { StatusBadge as InspectionRoundStatusBadge };
