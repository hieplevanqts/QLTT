import type { Task } from '../types';
import styles from './PriorityIndicator.module.css';

interface PriorityIndicatorProps {
  priority: Task['priority'];
  showLabel?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const PRIORITY_CONFIG = {
  urgent: {
    label: 'Khẩn cấp',
    color: '#D92D20', // destructive
  },
  high: {
    label: 'Cao',
    color: '#FB9238', // warning
  },
  medium: {
    label: 'Trung bình',
    color: '#3B82F6', // info
  },
  low: {
    label: 'Thấp',
    color: '#667085', // muted-foreground
  },
};

export function PriorityIndicator({ priority, showLabel = false, size = 'md' }: PriorityIndicatorProps) {
  const config = PRIORITY_CONFIG[priority];

  if (!showLabel) {
    return (
      <span
        className={`${styles.dot} ${styles[size]}`}
        style={{ backgroundColor: config.color }}
        title={config.label}
      />
    );
  }

  return (
    <span className={styles.indicator}>
      <span
        className={`${styles.dot} ${styles[size]}`}
        style={{ backgroundColor: config.color }}
      />
      <span className={styles.label}>{config.label}</span>
    </span>
  );
}