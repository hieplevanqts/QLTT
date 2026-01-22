import { useEffect, useState } from 'react';
import { Clock, CheckCircle2, Edit2, MessageCircle } from 'lucide-react';
import { historyService } from '../services/taskService';
import type { TaskHistory } from '../types';
import styles from './TaskHistoryTimeline.module.css';

interface TaskHistoryTimelineProps {
  taskId: string;
}

export function TaskHistoryTimeline({ taskId }: TaskHistoryTimelineProps) {
  const [history, setHistory] = useState<TaskHistory[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadHistory();
  }, [taskId]);

  const loadHistory = async () => {
    try {
      const data = await historyService.getTaskHistory(taskId);
      setHistory(data);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr: string) => {
    const date = new Date(dateStr);
    return new Intl.DateTimeFormat('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const getActionIcon = (action: TaskHistory['action']) => {
    switch (action) {
      case 'created':
        return <CheckCircle2 size={16} />;
      case 'status_changed':
        return <CheckCircle2 size={16} />;
      case 'updated':
        return <Edit2 size={16} />;
      case 'commented':
        return <MessageCircle size={16} />;
      default:
        return <Clock size={16} />;
    }
  };

  const getActionColor = (action: TaskHistory['action']) => {
    switch (action) {
      case 'created':
        return 'var(--color-success)';
      case 'status_changed':
        return 'var(--color-primary)';
      case 'updated':
        return 'var(--color-warning)';
      case 'commented':
        return 'var(--color-info)';
      default:
        return 'var(--color-text-tertiary)';
    }
  };

  if (loading) {
    return <div className={styles.loading}>Đang tải lịch sử...</div>;
  }

  if (history.length === 0) {
    return <div className={styles.empty}>Chưa có lịch sử thay đổi</div>;
  }

  return (
    <div className={styles.container}>
      <h3 className={styles.title}>Lịch sử thay đổi</h3>
      <div className={styles.timeline}>
        {history.map((entry, index) => (
          <div key={entry.id} className={styles.timelineItem}>
            <div 
              className={styles.timelineIcon}
              style={{ backgroundColor: getActionColor(entry.action) }}
            >
              {getActionIcon(entry.action)}
            </div>
            <div className={styles.timelineContent}>
              <div className={styles.timelineDescription}>{entry.description}</div>
              <div className={styles.timelineMeta}>
                <span className={styles.timelineAuthor}>{entry.author}</span>
                <span className={styles.timelineDot}>•</span>
                <span className={styles.timelineDate}>{formatDate(entry.createdAt)}</span>
              </div>
            </div>
            {index < history.length - 1 && <div className={styles.timelineLine} />}
          </div>
        ))}
      </div>
    </div>
  );
}
