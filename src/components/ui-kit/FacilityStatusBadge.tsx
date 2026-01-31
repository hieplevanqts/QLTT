import React from 'react';
import { 
  Clock, 
  CircleCheck, 
  Search, 
  CirclePause, 
  CircleX,
  LucideIcon,
} from 'lucide-react';
import styles from './FacilityStatusBadge.module.css';

export type FacilityStatus = 
  | 'pending'           // Chờ xác minh
  | 'active'            // Đang hoạt động
  | 'underInspection'   // Đang xử lý kiểm tra
  | 'suspended'         // Tạm ngưng hoạt động
  | 'rejected'          // Từ chối phê duyệt
  | 'refuse';           // Ngừng hoạt động (refuse)

interface StatusConfig {
  label: string;
  icon: LucideIcon;
  variant: string;
  allowedActions: string[]; // Actions that can be performed in this state
}

const statusConfig: Record<FacilityStatus, StatusConfig> = {
  pending: {
    label: 'Chờ xác minh',
    icon: Clock,
    variant: 'pending',
    allowedActions: ['verify', 'edit', 'delete'],
  },
  active: {
    label: 'Đang hoạt động',
    icon: CircleCheck,
    variant: 'active',
    allowedActions: ['view', 'edit', 'assignRisk', 'inspect', 'suspend'],
  },
  underInspection: {
    label: 'Đang xử lý kiểm tra',
    icon: Search,
    variant: 'underInspection',
    allowedActions: ['view', 'viewHistory'],
  },
  suspended: {
    label: 'Tạm ngưng hoạt động',
    icon: CirclePause,
    variant: 'suspended',
    allowedActions: ['view', 'resume', 'close'],
  },
  rejected: {
    label: 'Từ chối phê duyệt',
    icon: CircleX,
    variant: 'rejected',
    allowedActions: ['verify', 'edit', 'delete'],
  },
  refuse: {
    label: 'Ngừng hoạt động',
    icon: CircleX,
    variant: 'closed',
    allowedActions: ['view', 'viewHistory'],
  },
};

export interface FacilityStatusBadgeProps {
  status: FacilityStatus;
  showIcon?: boolean;
}

export default function FacilityStatusBadge({
  status,
  showIcon = true,
}: FacilityStatusBadgeProps) {
  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <span className={`${styles.statusBadge} ${styles[config.variant]}`}>
      {showIcon && <Icon className={styles.icon} />}
      {config.label}
    </span>
  );
}

// Export config for use in determining available actions
export { statusConfig };
