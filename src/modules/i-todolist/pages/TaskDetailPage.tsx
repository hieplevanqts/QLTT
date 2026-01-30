import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Edit, Trash2, Clock, Calendar, Tag } from 'lucide-react';
import type { Task } from '../types';
import { taskService } from '../services/taskService';
import { TaskStatusBadge } from '../components/TaskStatusBadge';
import { PriorityIndicator } from '../components/PriorityIndicator';
import { CommentSection } from '../components/CommentSection';
import { TaskHistoryTimeline } from '../components/TaskHistoryTimeline';
import { Button } from '../components/Button';

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
      <div className="todolist-loading">
        <div className="todolist-spinner" />
        <p>Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!task) {
    return (
      <div className="todolist-detail-container">
        <div className="todolist-empty">
          <p>Không tìm thấy công việc</p>
          <Button onClick={() => navigate('/todolist/list')}>Quay lại danh sách</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="todolist-detail-container">
      {/* Header */}
      <div className="todolist-detail-header">
        <Button variant="ghost" size="sm" onClick={() => navigate('/todolist/list')}>
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
        <div className="todolist-detail-actions">
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

      <div className="todolist-detail-content">
        {/* Main Info */}
        <div className="todolist-detail-main">
          <div className="todolist-detail-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--spacing-3)', marginBottom: 'var(--spacing-4)' }}>
              <PriorityIndicator priority={task.priority} showLabel size="lg" />
              <h1 className="todolist-detail-title">{task.title}</h1>
            </div>
            
            {isOverdue(task) && (
              <div style={{
                padding: 'var(--spacing-2) var(--spacing-3)',
                background: 'rgba(239, 68, 68, 0.1)',
                color: 'var(--destructive)',
                borderRadius: 'var(--radius)',
                marginBottom: 'var(--spacing-4)',
                fontSize: 'var(--font-size-sm)',
                fontWeight: 'var(--font-weight-medium)'
              }}>
                ⚠️ Công việc đã quá hạn!
              </div>
            )}

            <div className="todolist-detail-description" style={{ marginBottom: 'var(--spacing-6)' }}>
              {task.description}
            </div>

            {/* Metadata */}
            <div className="todolist-detail-info-grid" style={{ marginBottom: 'var(--spacing-6)' }}>
              <div className="todolist-detail-info-item">
                <div className="todolist-detail-info-label">
                  <Calendar className="h-3 w-3" style={{ display: 'inline', marginRight: '4px' }} />
                  Đến hạn
                </div>
                <div className="todolist-detail-info-value">{formatDate(task.dueDate)}</div>
              </div>

              <div className="todolist-detail-info-item">
                <div className="todolist-detail-info-label">
                  <Clock className="h-3 w-3" style={{ display: 'inline', marginRight: '4px' }} />
                  Thời gian ước tính
                </div>
                <div className="todolist-detail-info-value">{task.estimatedHours || 0} giờ</div>
              </div>

              {task.actualHours && (
                <div className="todolist-detail-info-item">
                  <div className="todolist-detail-info-label">
                    <Clock className="h-3 w-3" style={{ display: 'inline', marginRight: '4px' }} />
                    Thời gian thực tế
                  </div>
                  <div className="todolist-detail-info-value">{task.actualHours} giờ</div>
                </div>
              )}

              {task.tags.length > 0 && (
                <div className="todolist-detail-info-item">
                  <div className="todolist-detail-info-label">
                    <Tag className="h-3 w-3" style={{ display: 'inline', marginRight: '4px' }} />
                    Nhãn
                  </div>
                  <div className="todolist-task-tags">
                    {task.tags.map((tag) => (
                      <span key={tag} className="todolist-task-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Status Control */}
            <div style={{ marginBottom: 'var(--spacing-6)' }}>
              <div className="todolist-detail-info-label" style={{ marginBottom: 'var(--spacing-2)' }}>
                Trạng thái
              </div>
              <div style={{ display: 'flex', gap: 'var(--spacing-2)', flexWrap: 'wrap' }}>
                {['not-started', 'in-progress', 'completed', 'paused'].map((status) => {
                  const labels = {
                    'not-started': 'Chưa bắt đầu',
                    'in-progress': 'Đang làm',
                    'completed': 'Hoàn thành',
                    'paused': 'Tạm dừng'
                  };
                  return (
                    <button
                      key={status}
                      onClick={() => handleStatusChange(status as Task['status'])}
                      className="todolist-tab-button"
                      style={{
                        background: task.status === status ? 'var(--primary)' : 'transparent',
                        color: task.status === status ? 'var(--primary-foreground)' : 'var(--foreground)',
                        borderColor: task.status === status ? 'var(--primary)' : 'var(--border)'
                      }}
                    >
                      {labels[status as keyof typeof labels]}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Notes */}
            {task.notes && (
              <div style={{ marginBottom: 'var(--spacing-6)' }}>
                <h3 className="todolist-detail-section-title">Ghi chú</h3>
                <div className="todolist-detail-description">{task.notes}</div>
              </div>
            )}

            {/* Timestamps */}
            <div style={{
              display: 'flex',
              gap: 'var(--spacing-4)',
              paddingTop: 'var(--spacing-4)',
              borderTop: 'var(--border-width) solid var(--border)',
              fontSize: 'var(--font-size-xs)',
              color: 'var(--muted-foreground)'
            }}>
              <div>
                <strong>Tạo lúc:</strong> {formatDateTime(task.createdAt)}
              </div>
              <div>
                <strong>Cập nhật:</strong> {formatDateTime(task.updatedAt)}
              </div>
              {task.completedAt && (
                <div>
                  <strong>Hoàn thành:</strong> {formatDateTime(task.completedAt)}
                </div>
              )}
            </div>
          </div>

          {/* Comments */}
          <div className="todolist-detail-card">
            <CommentSection taskId={task.id} />
          </div>
        </div>

        {/* Sidebar */}
        <div className="todolist-detail-sidebar">
          <div className="todolist-detail-card">
            <TaskHistoryTimeline taskId={task.id} />
          </div>
        </div>
      </div>
    </div>
  );
}
