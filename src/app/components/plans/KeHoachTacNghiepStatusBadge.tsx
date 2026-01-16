import React from 'react';
import styles from './KeHoachTacNghiepStatusBadge.module.css';
import type { PlanStatus, TaskStatus, SLAStatus, Priority } from '../../data/kehoach-mock-data';

interface StatusBadgeProps {
  type: 'plan' | 'task' | 'target' | 'sla' | 'priority' | 'planType';
  value: string;
  size?: 'sm' | 'md' | 'lg';
}

const planStatusLabels: Record<PlanStatus, string> = {
  draft: 'Nháp',
  pending_approval: 'Chờ duyệt',
  approved: 'Đã duyệt',
  rejected: 'Đã từ chối',
  active: 'Đang thực hiện',
  paused: 'Tạm dừng',
  completed: 'Hoàn thành',
  cancelled: 'Đã hủy'
};

const taskStatusLabels: Record<TaskStatus, string> = {
  not_started: 'Chưa bắt đầu',
  in_progress: 'Đang thực hiện',
  blocked: 'Bị chặn',
  completed: 'Hoàn thành',
  verified: 'Đã xác nhận',
  closed: 'Đã đóng'
};

const slaStatusLabels: Record<SLAStatus, string> = {
  on_track: 'Đúng tiến độ',
  at_risk: 'Có rủi ro',
  overdue: 'Quá hạn'
};

const priorityLabels: Record<Priority, string> = {
  low: 'Thấp',
  medium: 'Trung bình',
  high: 'Cao',
  critical: 'Khẩn cấp'
};

const planTypeLabels: Record<string, string> = {
  periodic: 'Định kỳ (Năm)',
  thematic: 'Chuyên đề',
  urgent: 'Đột xuất'
};

export function KeHoachTacNghiepStatusBadge({ 
  type, 
  value,
  size = 'md' 
}: { 
  type: 'plan' | 'task' | 'target' | 'sla' | 'priority' | 'planType'; 
  value: string;
  size?: 'sm' | 'md' | 'lg';
}) {
  let label = '';
  let variant = '';

  if (type === 'plan') {
    label = planStatusLabels[value as PlanStatus] || '';
    variant = value as string;
  } else if (type === 'task') {
    label = taskStatusLabels[value as TaskStatus] || '';
    variant = value as string;
  } else if (type === 'sla') {
    label = slaStatusLabels[value as SLAStatus] || '';
    variant = value as string;
  } else if (type === 'priority') {
    label = priorityLabels[value as Priority] || '';
    variant = value as string;
  } else if (type === 'planType') {
    label = planTypeLabels[value] || '';
    variant = value as string;
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