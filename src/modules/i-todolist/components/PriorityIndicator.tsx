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
  },
  high: {
    label: 'Cao',
  },
  medium: {
    label: 'Trung bình',
  },
  low: {
    label: 'Thấp',
  },
};

export function PriorityIndicator({ priority, showLabel = false, size = 'md' }: PriorityIndicatorProps) {
  const config = PRIORITY_CONFIG[priority];

  const dotClass = [
    styles.dot,
    styles[priority],
    styles[size]
  ].filter(Boolean).join(' ');

  if (!showLabel) {
    return (
      <span
        className={dotClass}
        title={config.label}
      />
    );
  }

  return (
    <span className={styles.wrapper}>
      <span className={dotClass} />
      <span className={styles.label}>
        {config.label}
      </span>
    </span>
  );
}
