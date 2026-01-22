import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Clock, Calendar, Tag } from 'lucide-react';
import type { Task } from '../types';
import { taskService } from '../services/taskService';
import { TaskStatusBadge } from '../components/TaskStatusBadge';
import { PriorityIndicator } from '../components/PriorityIndicator';
import { CommentSection } from '../components/CommentSection';
import { TaskHistoryTimeline } from '../components/TaskHistoryTimeline';
import { Button } from '@/app/components/ui/button';
import styles from './TaskDetailPage.module.css';

export function TaskDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (id) {
      loadTask(id);
    }
  }, [id]);

  const loadTask = async (taskId: string) => {
    setLoading(true);
    try {
      const data = await taskService.getTaskById(taskId);
      setTask(data);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!task || !confirm('Bạn có chắc muốn xóa công việc này?')) return;
    await taskService.deleteTask(task.id);
    navigate('/todolist/list');
  };

  const handleStatusChange = async (newStatus: Task['status']) => {
    if (!task) return;
    await taskService.updateTask(task.id, { status: newStatus });
    await loadTask(task.id);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      weekday: 'long',
      day: '2-digit',
      month: 'long',
      year: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const isOverdue = (task: Task) => {
    if (task.status === 'completed') return false;
    return new Date(task.dueDate) < new Date();
  };

  if (loading) {
    return (
      <div className={styles.loading}>
        <div className={styles.spinner} />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className={styles.container}>
        <div className={styles.error}>
          <p>Không tìm thấy công việc</p>
          <Button onClick={() => navigate('/todolist/list')}>Quay lại danh sách</Button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/todolist/list')}>
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
        <div className={styles.headerActions}>
          <Button
            variant="outline"
            size="sm"
            onClick={() => navigate(`/todolist/create?edit=${task.id}`)}
          >
            <Edit className="h-4 w-4" />
            Chỉnh sửa
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleDelete}
            style={{ color: 'var(--destructive)' }}
          >
            <Trash2 className="h-4 w-4" />
            Xóa
          </Button>
        </div>
      </div>

      <div className={styles.content}>
        {/* Main Info */}
        <div className={styles.mainCard}>
          <div className={styles.titleSection}>
            <div className={styles.titleRow}>
              <PriorityIndicator priority={task.priority} showLabel size="lg" />
              <h1 className={styles.title}>{task.title}</h1>
            </div>
            {isOverdue(task) && (
              <div className={styles.overdueAlert}>⚠️ Công việc đã quá hạn!</div>
            )}
          </div>

          <p className={styles.description}>{task.description}</p>

          {/* Metadata */}
          <div className={styles.metadata}>
            <div className={styles.metaItem}>
              <Calendar className="h-4 w-4" />
              <span>Đến hạn:</span>
              <strong>{formatDate(task.dueDate)}</strong>
            </div>

            <div className={styles.metaItem}>
              <Clock className="h-4 w-4" />
              <span>Thời gian ước tính:</span>
              <strong>{task.estimatedHours || 0} giờ</strong>
            </div>

            {task.actualHours && (
              <div className={styles.metaItem}>
                <Clock className="h-4 w-4" />
                <span>Thời gian thực tế:</span>
                <strong>{task.actualHours} giờ</strong>
              </div>
            )}

            {task.tags.length > 0 && (
              <div className={styles.metaItem}>
                <Tag className="h-4 w-4" />
                <div className={styles.tags}>
                  {task.tags.map((tag) => (
                    <span key={tag} className={styles.tag}>
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Status Control */}
          <div className={styles.statusSection}>
            <span className={styles.statusLabel}>Trạng thái:</span>
            <div className={styles.statusButtons}>
              <button
                onClick={() => handleStatusChange('not-started')}
                className={`${styles.statusBtn} ${
                  task.status === 'not-started' ? styles.active : ''
                }`}
              >
                Chưa bắt đầu
              </button>
              <button
                onClick={() => handleStatusChange('in-progress')}
                className={`${styles.statusBtn} ${
                  task.status === 'in-progress' ? styles.active : ''
                }`}
              >
                Đang làm
              </button>
              <button
                onClick={() => handleStatusChange('completed')}
                className={`${styles.statusBtn} ${
                  task.status === 'completed' ? styles.active : ''
                }`}
              >
                Hoàn thành
              </button>
              <button
                onClick={() => handleStatusChange('paused')}
                className={`${styles.statusBtn} ${task.status === 'paused' ? styles.active : ''}`}
              >
                Tạm dừng
              </button>
            </div>
          </div>

          {/* Notes */}
          {task.notes && (
            <div className={styles.notesSection}>
              <h3 className={styles.sectionTitle}>Ghi chú</h3>
              <div className={styles.notes}>{task.notes}</div>
            </div>
          )}

          {/* Timestamps */}
          <div className={styles.timestamps}>
            <div className={styles.timestamp}>
              <span>Tạo lúc:</span> {formatDateTime(task.createdAt)}
            </div>
            <div className={styles.timestamp}>
              <span>Cập nhật:</span> {formatDateTime(task.updatedAt)}
            </div>
            {task.completedAt && (
              <div className={styles.timestamp}>
                <span>Hoàn thành:</span> {formatDateTime(task.completedAt)}
              </div>
            )}
          </div>
        </div>

        {/* Comments */}
        <div className={styles.commentsCard}>
          <CommentSection taskId={task.id} />
        </div>

        {/* History Timeline */}
        <div className={styles.historyCard}>
          <TaskHistoryTimeline taskId={task.id} />
        </div>
      </div>
    </div>
  );
}