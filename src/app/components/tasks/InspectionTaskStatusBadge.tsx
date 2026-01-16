import React from 'react';
import styles from './InspectionTaskStatusBadge.module.css';
import { type TaskStatus, type TaskPriority } from '../../data/inspection-tasks-mock-data';

interface InspectionTaskStatusBadgeProps {
  type: 'status' | 'priority';
  value: TaskStatus | TaskPriority;
  size?: 'sm' | 'md' | 'lg';
}

export function InspectionTaskStatusBadge({ type, value, size = 'md' }: InspectionTaskStatusBadgeProps) {
  const getStatusConfig = (status: TaskStatus) => {
    const configs = {
      not_started: { label: 'Chưa bắt đầu', className: styles.statusNotStarted },
      in_progress: { label: 'Đang thực hiện', className: styles.statusInProgress },
      pending_approval: { label: 'Chờ duyệt', className: styles.statusPendingApproval },
      completed: { label: 'Hoàn thành', className: styles.statusCompleted },
      cancelled: { label: 'Đã hủy', className: styles.statusCancelled },
      closed: { label: 'Đã đóng', className: styles.statusClosed },
    };
    return configs[status];
  };

  const getPriorityConfig = (priority: TaskPriority) => {
    const configs = {
      low: { label: 'Thấp', className: styles.priorityLow },
      medium: { label: 'Trung bình', className: styles.priorityMedium },
      high: { label: 'Cao', className: styles.priorityHigh },
      urgent: { label: 'Khẩn cấp', className: styles.priorityUrgent },
    };
    return configs[priority];
  };

  const config = type === 'status' 
    ? getStatusConfig(value as TaskStatus)
    : getPriorityConfig(value as TaskPriority);

  const sizeClass = size === 'sm' ? styles.sizeSm : size === 'lg' ? styles.sizeLg : styles.sizeMd;

  return (
    <span className={`${styles.badge} ${config.className} ${sizeClass}`}>
      {config.label}
    </span>
  );
}