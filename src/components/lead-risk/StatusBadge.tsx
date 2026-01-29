import type { LeadStatus } from '../../../data/lead-risk/types';
import styles from './StatusBadge.module.css';

interface StatusBadgeProps {
  status: LeadStatus;
  size?: 'sm' | 'md';
}

const STATUS_CONFIG: Record<LeadStatus, { label: string; variant: string }> = {
  new: { label: 'Mới', variant: 'new' },
  verifying: { label: 'Đang xác minh', variant: 'in-verification' },
  verify_paused: { label: 'Tạm dừng xác minh', variant: 'paused' },
  processing: { label: 'Đang xử lý', variant: 'in-progress' },
  process_paused: { label: 'Tạm dừng xử lý', variant: 'paused' },
  resolved: { label: 'Đã xử lý', variant: 'resolved' },
  rejected: { label: 'Đã từ chối', variant: 'rejected' },
  cancelled: { label: 'Đã hủy', variant: 'cancelled' },
};

// Legacy/alias status mapping (for backward compatibility with UI code)
const STATUS_ALIASES: Record<string, LeadStatus> = {
  'in_verification': 'verifying',        // Map UI "in_verification" to DB "verifying"
  'in_progress': 'processing',           // Map UI "in_progress" to DB "processing"
  'triaged': 'verifying',                // Map old "triaged" to "verifying"
  'under_investigation': 'processing',   // Map "under_investigation" to "processing"
  'closed': 'resolved',                  // Map "closed" to "resolved"
};

export function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
  // Check if status is an alias and map it to the correct status
  const normalizedStatus = STATUS_ALIASES[status] || status;
  
  // Try to get config from main STATUS_CONFIG first
  let config = STATUS_CONFIG[normalizedStatus as LeadStatus];
  
  // Safety check - if status not found in config, show fallback
  if (!config) {
    console.warn(`⚠️ Unknown status received: "${status}"`);
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
