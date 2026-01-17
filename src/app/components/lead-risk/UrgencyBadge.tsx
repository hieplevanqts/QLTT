import type { LeadUrgency } from '../../../data/lead-risk/types';
import { AlertCircle, AlertTriangle, AlertOctagon, Info } from 'lucide-react';
import styles from './UrgencyBadge.module.css';

interface UrgencyBadgeProps {
  urgency?: LeadUrgency; // Make optional to handle undefined
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
  // Use medium as default if urgency is undefined
  const actualUrgency = urgency || 'medium';
  const config = URGENCY_CONFIG[actualUrgency];
  
  // Safety check
  if (!config) {
    return null;
  }
  
  const Icon = config.icon;
  
  return (
    <span className={`${styles.badge} ${styles[actualUrgency]} ${styles[size]}`}>
      {showIcon && <Icon className={styles.icon} />}
      <span>{config.label}</span>
    </span>
  );
}