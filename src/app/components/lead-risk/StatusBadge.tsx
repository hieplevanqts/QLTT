import type { LeadStatus } from '../../../data/lead-risk/types';
import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<LeadStatus, { label: string; variant: string }> = {
  new: { label: 'Mới', variant: 'new' },
  in_verification: { label: 'Đang xác minh', variant: 'in-verification' },
  in_progress: { label: 'Đang xử lý', variant: 'in-progress' },
  resolved: { label: 'Đã xử lý', variant: 'resolved' },
  rejected: { label: 'Đã từ chối', variant: 'rejected' },
  cancelled: { label: 'Đã hủy', variant: 'cancelled' },
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  const config = STATUS_CONFIG[status];
  
  // Safety check - if status not found in config, show fallback
  if (!config) {
    return (
      <span 
        className={`${styles.badge} ${styles.cancelled} ${styles[size]}`}
        data-status={status}
        title={`Unknown status: ${status}`}
      >
        {String(status)}
      </span>
    );
  }
  
  return (
    <span 
      className={`${styles.badge} ${styles[config.variant]} ${styles[size]}`}
      data-status={status}
    >
      {config.label}
    </span>
  );
}