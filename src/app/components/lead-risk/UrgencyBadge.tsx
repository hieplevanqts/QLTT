import type { LeadUrgency } from '../../../data/lead-risk/types';
import { AlertCircle, AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import styles from './UrgencyBadge.module.css';

interface UrgencyBadgeProps {
  urgency: LeadUrgency;
  size?: 'sm' | 'md';
  showIcon?: boolean;
}

const URGENCY_CONFIG: Record<LeadUrgency, { label: string; icon: typeof AlertCircle }> = {
  low: { label: 'Thấp', icon: Info },
  medium: { label: 'Trung bình', icon: AlertCircle },
  high: { label: 'Cao', icon: AlertTriangle },
  critical: { label: 'Khẩn cấp', icon: AlertOctagon },
};

export function UrgencyBadge({ urgency, size = 'md', showIcon = true }: UrgencyBadgeProps) {
  const config = URGENCY_CONFIG[urgency];
  const Icon = config.icon;
  
  return (
    <span className={`${styles.badge} ${styles[urgency]} ${styles[size]}`}>
      {showIcon && <Icon className={styles.icon} />}
      <span>{config.label}</span>
    </span>
  );
}
