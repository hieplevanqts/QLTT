import type { Task } from '../types';
import styles from './TaskStatusBadge.module.css';

interface TaskStatusBadgeProps {
  status: Task['status'];
  size?: 'sm' | 'md';
}

const STATUS_CONFIG = {
  'not-started': {
    label: 'Chưa bắt đầu',
  },
  'in-progress': {
    label: 'Đang làm',
  },
  completed: {
    label: 'Hoàn thành',
  },
  paused: {
    label: 'Tạm dừng',
  },
};

export function TaskStatusBadge({ status, size = 'md' }: TaskStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  const badgeClass = [
    styles.badge,
    styles[status.replace('-', '')],
    styles[size]
  ].filter(Boolean).join(' ');

  return (
    <span className={badgeClass}>
      {config.label}
    </span>
  );
}
