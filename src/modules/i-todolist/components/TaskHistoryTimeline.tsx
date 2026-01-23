import { useEffect, useState } from 'react';
import { Clock, CheckCircle2, Edit2, MessageCircle, PlusCircle } from 'lucide-react';
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
        return <PlusCircle size={16} />;
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

  const getActionClass = (action: TaskHistory['action']) => {
    switch (action) {
      case 'created':
        return styles.created;
      case 'status_changed':
        return styles.statusChanged;
      case 'updated':
        return styles.updated;
      case 'completed':
        return styles.completed;
      default:
        return '';
    }
  };

  if (loading) {
    return <div className={styles.empty}>Đang tải lịch sử...</div>;
  }

  if (history.length === 0) {
    return <div className={styles.empty}>Chưa có lịch sử thay đổi</div>;
  }

  return (
    <div className={styles.timeline}>
      {history.map((entry) => (
        <div key={entry.id} className={styles.item}>
          <div className={`${styles.iconWrapper} ${getActionClass(entry.action)}`}>
            {getActionIcon(entry.action)}
          </div>
          <div className={styles.content}>
            <p className={styles.action}>
              <strong>{entry.author}</strong> {entry.description}
            </p>
            <span className={styles.timestamp}>{formatDate(entry.createdAt)}</span>
          </div>
        </div>
      ))}
    </div>
  );
}
