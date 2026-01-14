import React from 'react';
import { Clock, MapPin, User, AlertCircle } from 'lucide-react';
import { InspectionTaskStatusBadge } from './InspectionTaskStatusBadge';
import { InspectionTask } from '../../data/inspection-tasks-mock-data';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: InspectionTask;
  onClick: (task: InspectionTask) => void;
}

export function TaskCard({ task, onClick }: TaskCardProps) {
  // Calculate if overdue
  const isOverdue = () => {
    const today = new Date();
    const dueDate = new Date(task.dueDate);
    return task.status !== 'completed' && task.status !== 'cancelled' && dueDate < today;
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  // Priority badge mapping
  const getPriorityConfig = () => {
    const configs = {
      urgent: { label: 'KHẨN CẤP', color: '#ef4444' },
      high: { label: 'CAO', color: '#f59e0b' },
      medium: { label: 'TRUNG BÌNH', color: '#3b82f6' },
      low: { label: 'THẤP', color: '#6b7280' },
    };
    return configs[task.priority] || configs.medium;
  };

  const priorityConfig = getPriorityConfig();
  const overdue = isOverdue();

  return (
    <div className={styles.taskCard} onClick={() => onClick(task)}>
      {/* Task Title */}
      <h4 className={styles.taskTitle}>{task.title}</h4>

      {/* Tags/Badges Row */}
      <div className={styles.tagsRow}>
        <span 
          className={styles.priorityTag}
          style={{ 
            backgroundColor: `${priorityConfig.color}15`,
            color: priorityConfig.color,
            borderColor: `${priorityConfig.color}30`
          }}
        >
          {priorityConfig.label}
        </span>
        {task.roundId && (
          <span className={styles.roundTag}>
            {task.roundId}
          </span>
        )}
      </div>

      {/* Target Location */}
      {task.targetName && (
        <div className={styles.targetInfo}>
          <MapPin className={styles.infoIcon} />
          <span>{task.targetName}</span>
        </div>
      )}

      {/* Due Date with Overdue Warning */}
      <div className={styles.dueInfo}>
        <Clock className={styles.infoIcon} />
        <span className={overdue ? styles.overdue : ''}>
          {new Date(task.dueDate).toLocaleDateString('vi-VN')}
        </span>
        {overdue && (
          <span className={styles.overdueLabel}>
            <AlertCircle size={12} />
            Quá hạn
          </span>
        )}
      </div>

      {/* Footer with Avatar */}
      <div className={styles.cardFooter}>
        <div className={styles.taskCode}>{task.code}</div>
        <div 
          className={styles.avatar}
          title={task.assignee.name}
        >
          {getInitials(task.assignee.name)}
        </div>
      </div>
    </div>
  );
}