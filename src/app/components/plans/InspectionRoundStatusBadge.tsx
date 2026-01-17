import React from 'react';
import styles from './InspectionRoundStatusBadge.module.css';

export type InspectionRoundStatus = 'draft' | 'preparing' | 'in_progress' | 'reporting' | 'completed' | 'cancelled' | 
  'pending_approval' | 'approved' | 'rejected' | 'paused' | 'active';
export type InspectionType = 'routine' | 'targeted' | 'sudden' | 'followup';

interface InspectionRoundStatusBadgeProps {
  type?: 'round' | 'inspectionType';
  value: InspectionRoundStatus | InspectionType;
  size?: 'sm' | 'md';
}

export function InspectionRoundStatusBadge({ type = 'round', value, size = 'md' }: InspectionRoundStatusBadgeProps) {
  // Configuration for inspection round status
  const statusConfig: Record<string, { label: string; variant: string }> = {
    draft: {
      label: 'Nháp',
      variant: 'draft',
    },
    preparing: {
      label: 'Chuẩn bị',
      variant: 'preparing',
    },
    in_progress: {
      label: 'Đang kiểm tra',
      variant: 'in-progress',
    },
    reporting: {
      label: 'Hoàn thành báo cáo',
      variant: 'reporting',
    },
    completed: {
      label: 'Hoàn thành',
      variant: 'completed',
    },
    cancelled: {
      label: 'Đã hủy',
      variant: 'cancelled',
    },
    pending_approval: {
      label: 'Chờ duyệt',
      variant: 'pending-approval',
    },
    approved: {
      label: 'Đã duyệt',
      variant: 'approved',
    },
    rejected: {
      label: 'Từ chối',
      variant: 'rejected',
    },
    paused: {
      label: 'Tạm dừng',
      variant: 'paused',
    },
    active: {
      label: 'Đang triển khai',
      variant: 'active',
    },
  };

  // Configuration for inspection type
  const typeConfig: Record<string, { label: string; variant: string }> = {
    routine: {
      label: 'Định kỳ',
      variant: 'routine',
    },
    targeted: {
      label: 'Chuyên đề',
      variant: 'targeted',
    },
    sudden: {
      label: 'Đột xuất',
      variant: 'sudden',
    },
    followup: {
      label: 'Tái kiểm tra',
      variant: 'followup',
    },
  };

  const config = type === 'inspectionType' ? typeConfig[value] : statusConfig[value];

  // Fallback if config not found
  if (!config) {
    return (
      <span className={`${styles.badge} ${styles.draft} ${styles[size]}`}>
        <span className={styles.dot}></span>
        <span className={styles.label}>{value}</span>
      </span>
    );
  }

  return (
    <span className={`${styles.badge} ${styles[config.variant]} ${styles[size]}`}>
      <span className={styles.dot}></span>
      <span className={styles.label}>{config.label}</span>
    </span>
  );
}