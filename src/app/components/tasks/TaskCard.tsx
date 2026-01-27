import { MapPin, AlertCircle, Clock } from 'lucide-react';
import { StatusBadge } from '../common/StatusBadge';
import { getStatusProps } from '../../utils/status-badge-helper';
import { InspectionTask } from '../../data/inspection-tasks-mock-data';
import ActionColumn, { type Action } from '../../../patterns/ActionColumn';
import styles from './TaskCard.module.css';

interface TaskCardProps {
  task: InspectionTask;
  onClick: (task: InspectionTask) => void;
  actions?: Action[]; // Add actions prop
}

export function TaskCard({ task, onClick, actions }: TaskCardProps) {
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

  const overdue = isOverdue();

  return (
    <div className={styles.taskCard} onClick={() => onClick(task)}>
      {/* Header with Title and Actions Menu */}
      <div className={styles.cardHeader}>
        <h4 className={styles.taskTitle}>{task.title}</h4>
        {actions && actions.length > 0 && (
          <div className={styles.actionsMenu} onClick={(e) => e.stopPropagation()}>
            <ActionColumn actions={actions} />
          </div>
        )}
      </div>

      {/* Tags/Badges Row */}
      <div className={styles.tagsRow}>
        <StatusBadge {...getStatusProps('priority', task.priority)} size="sm" />
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

      {/* Footer with Avatar and Task Code */}
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