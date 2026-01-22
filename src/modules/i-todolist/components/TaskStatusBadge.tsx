import type { Task } from '../types';
import styles from './TaskStatusBadge.module.css';

interface TaskStatusBadgeProps {
  status: Task['status'];
  size?: 'sm' | 'md';
}

const STATUS_CONFIG = {
  'not-started': {
    label: 'Chưa bắt đầu',
    className: 'notStarted',
  },
  'in-progress': {
    label: 'Đang làm',
    className: 'inProgress',
  },
  completed: {
    label: 'Hoàn thành',
    className: 'completed',
  },
  paused: {
    label: 'Tạm dừng',
    className: 'paused',
  },
};

export function TaskStatusBadge({ status, size = 'md' }: TaskStatusBadgeProps) {
  const config = STATUS_CONFIG[status];

  return (
    <span
      className={`${styles.badge} ${styles[config.className]} ${styles[size]}`}
      data-status={status}
    >
      {config.label}
    </span>
  );
}
