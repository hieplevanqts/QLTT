import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { ArrowLeft, Save } from 'lucide-react';
import type { Task } from '../types';
import { taskService } from '../services/taskService';
import { Button } from '@/app/components/ui/button';
import styles from './TaskFormPage.module.css';

export function TaskFormPage() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const editId = searchParams.get('edit');
  const isEdit = Boolean(editId);

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    status: 'not-started' as Task['status'],
    priority: 'medium' as Task['priority'],
    dueDate: '',
    tags: '',
    notes: '',
    estimatedHours: '',
  });

  useEffect(() => {
    if (editId) {
      loadTask(editId);
    }
  }, [editId]);

  const loadTask = async (id: string) => {
    const task = await taskService.getTaskById(id);
    if (task) {
      setFormData({
        title: task.title,
        description: task.description,
        status: task.status,
        priority: task.priority,
        dueDate: task.dueDate.split('T')[0],
        tags: task.tags.join(', '),
        notes: task.notes,
        estimatedHours: task.estimatedHours?.toString() || '',
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title || !formData.dueDate) {
      alert('Vui lòng điền đầy đủ thông tin bắt buộc');
      return;
    }

    setLoading(true);
    try {
      const taskData = {
        title: formData.title,
        description: formData.description,
        status: formData.status,
        priority: formData.priority,
        dueDate: new Date(formData.dueDate).toISOString(),
        tags: formData.tags
          .split(',')
          .map((t) => t.trim())
          .filter(Boolean),
        notes: formData.notes,
        attachments: [],
        estimatedHours: formData.estimatedHours ? Number(formData.estimatedHours) : undefined,
      };

      if (isEdit && editId) {
        await taskService.updateTask(editId, taskData);
      } else {
        await taskService.createTask(taskData);
      }

      navigate('/todolist/list');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <Button variant="ghost" size="sm" onClick={() => navigate('/todolist/list')}>
          <ArrowLeft className="h-4 w-4" />
          Quay lại
        </Button>
        <h1 className={styles.title}>
          {isEdit ? 'Chỉnh sửa công việc' : 'Tạo công việc mới'}
        </h1>
      </div>

      <form onSubmit={handleSubmit} className={styles.form}>
        <div className={styles.formGroup}>
          <label className={styles.label}>
            Tiêu đề <span className={styles.required}>*</span>
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            className={styles.input}
            placeholder="Nhập tiêu đề công việc"
            required
          />
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Mô tả</label>
          <textarea
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            className={styles.textarea}
            placeholder="Mô tả chi tiết công việc"
            rows={4}
          />
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Ngày đến hạn <span className={styles.required}>*</span>
            </label>
            <input
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData({ ...formData, dueDate: e.target.value })}
              className={styles.input}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Thời gian ước tính (giờ)</label>
            <input
              type="number"
              value={formData.estimatedHours}
              onChange={(e) => setFormData({ ...formData, estimatedHours: e.target.value })}
              className={styles.input}
              placeholder="0"
              min="0"
              step="0.5"
            />
          </div>
        </div>

        <div className={styles.formRow}>
          <div className={styles.formGroup}>
            <label className={styles.label}>Trạng thái</label>
            <select
              value={formData.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e.target.value as Task['status'] })
              }
              className={styles.select}
            >
              <option value="not-started">Chưa bắt đầu</option>
              <option value="in-progress">Đang làm</option>
              <option value="completed">Hoàn thành</option>
              <option value="paused">Tạm dừng</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>Mức độ ưu tiên</label>
            <select
              value={formData.priority}
              onChange={(e) =>
                setFormData({ ...formData, priority: e.target.value as Task['priority'] })
              }
              className={styles.select}
            >
              <option value="low">Thấp</option>
              <option value="medium">Trung bình</option>
              <option value="high">Cao</option>
              <option value="urgent">Khẩn cấp</option>
            </select>
          </div>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Nhãn (Tags)</label>
          <input
            type="text"
            value={formData.tags}
            onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
            className={styles.input}
            placeholder="Nhập các nhãn, cách nhau bằng dấu phẩy"
          />
          <span className={styles.hint}>Ví dụ: báo cáo, quan trọng, urgent</span>
        </div>

        <div className={styles.formGroup}>
          <label className={styles.label}>Ghi chú</label>
          <textarea
            value={formData.notes}
            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
            className={styles.textarea}
            placeholder="Ghi chú thêm về công việc"
            rows={4}
          />
        </div>

        <div className={styles.formActions}>
          <Button
            type="button"
            variant="outline"
            onClick={() => navigate('/todolist/list')}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button type="submit" disabled={loading}>
            <Save className="h-4 w-4" />
            {loading ? 'Đang lưu...' : isEdit ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </div>
      </form>
    </div>
  );
}