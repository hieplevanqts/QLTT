import React, { useState, useEffect } from 'react';
import { X, Calendar, User, AlertCircle, FileText, MapPin, Clock, Flag } from 'lucide-react';
import styles from './CreateTaskModal.module.css';
import { TaskPriority, TaskStatus, InspectionTask } from '../../data/inspection-tasks-mock-data';
import DateRangePicker from '../../../ui-kit/DateRangePicker';

interface EditTaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (taskId: string, taskData: EditTaskFormData) => void;
  task: InspectionTask | null;
}

export interface EditTaskFormData {
  title: string;
  description: string;
  targetName: string; // Tên cửa hàng
  roundId: string;
  planId?: string;
  assigneeId: string;
  priority: TaskPriority;
  status: TaskStatus;
  dueDate: string;
  startDate?: string;
}

const PRIORITY_OPTIONS = [
  { value: 'low', label: 'Thấp', color: '#64748b' },
  { value: 'medium', label: 'Trung bình', color: '#f59e0b' },
  { value: 'high', label: 'Cao', color: '#f97316' },
  { value: 'urgent', label: 'Khẩn cấp', color: '#ef4444' },
];

const STATUS_OPTIONS = [
  { value: 'not_started', label: 'Chưa bắt đầu', emoji: '⚪' },
  { value: 'in_progress', label: 'Đang thực hiện', emoji: '🔵' },
  { value: 'completed', label: 'Hoàn thành', emoji: '🟢' },
  { value: 'closed', label: 'Đã đóng', emoji: '⚫' },
];

// Mock data - In production, fetch from API
const MOCK_PLANS = [
  { value: 'KH-2024-001', label: 'Kế hoạch kiểm tra ATTP Q1/2024' },
  { value: 'KH-2024-002', label: 'Kế hoạch giám sát ATTP Q2/2024' },
  { value: 'KH-2024-003', label: 'Kế hoạch thanh tra ATTP Q3/2024' },
];

const MOCK_ROUNDS = [
  { value: 'DKT-2024-001', label: 'Đợt kiểm tra Q1/2024 - Hà Nội' },
  { value: 'DKT-2024-002', label: 'Đợt kiểm tra Q1/2024 - TP.HCM' },
  { value: 'DKT-2024-003', label: 'Đợt kiểm tra Q2/2024 - Đà Nẵng' },
];

// Mock danh sách cửa hàng
const MOCK_STORES = [
  { value: 'CH-001', label: 'Siêu thị CoopMart Quận 1' },
  { value: 'CH-002', label: 'Cửa hàng thực phẩm Bách Hóa Xanh Lê Lợi' },
  { value: 'CH-003', label: 'Nhà hàng Phở 24 Nguyễn Huệ' },
  { value: 'CH-004', label: 'Quán café Highlands Coffee Đồng Khởi' },
  { value: 'CH-005', label: 'Siêu thị Mini Big C Quận 3' },
  { value: 'CH-006', label: 'Cửa hàng thực phẩm sạch Organica' },
  { value: 'CH-007', label: 'Nhà hàng lẩu Haidilao Vincom' },
  { value: 'CH-008', label: 'Cửa hàng bánh ngọt ABC Bakery' },
];

const MOCK_ASSIGNEES = [
  { value: 'user-1', label: 'Nguyễn Văn A' },
  { value: 'user-2', label: 'Trần Thị B' },
  { value: 'user-3', label: 'Lê Văn C' },
  { value: 'user-4', label: 'Phạm Thị D' },
];

export function EditTaskModal({ isOpen, onClose, onSubmit, task }: EditTaskModalProps) {
  const [formData, setFormData] = useState<EditTaskFormData>({
    title: '',
    description: '',
    targetName: '',
    roundId: '',
    planId: '',
    assigneeId: '',
    priority: 'medium',
    status: 'not_started',
    dueDate: '',
    startDate: '',
  });

  const [errors, setErrors] = useState<Partial<Record<keyof EditTaskFormData, string>>>({});

  // Populate form when task changes OR when modal opens
  useEffect(() => {
    if (task && isOpen) {
      console.log('[EditTaskModal] Populating form with task:', task);
      setFormData({
        title: task.title || '',
        description: task.description || '',
        targetName: task.targetName || '',
        roundId: task.roundId || '',
        planId: task.planId || '',
        assigneeId: task.assignee?.id || '',
        priority: task.priority || 'medium',
        status: task.status || 'not_started',
        dueDate: task.dueDate || '',
        startDate: task.startDate || '',
      });
      setErrors({});
    }
  }, [task?.id, isOpen]); // Track task.id instead of task object

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFormData({
        title: '',
        description: '',
        targetName: '',
        roundId: '',
        planId: '',
        assigneeId: '',
        priority: 'medium',
        status: 'not_started',
        dueDate: '',
        startDate: '',
      });
      setErrors({});
    }
  }, [isOpen]);

  console.log('[EditTaskModal] Render:', { isOpen, hasTask: !!task, taskId: task?.id });

  if (!isOpen) return null;
  if (!task) {
    console.warn('[EditTaskModal] Modal is open but no task provided!');
    return null;
  }

  const handleChange = (field: keyof EditTaskFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Partial<Record<keyof EditTaskFormData, string>> = {};

    // Tên nhiệm vụ - bắt buộc, ≤ 255 ký tự
    if (!formData.title.trim()) {
      newErrors.title = 'Vui lòng nhập tên nhiệm vụ';
    } else if (formData.title.length > 255) {
      newErrors.title = 'Tên nhiệm vụ không được vượt quá 255 ký tự';
    }

    // Tên cửa hàng - bắt buộc
    if (!formData.targetName.trim()) {
      newErrors.targetName = 'Vui lòng chọn cửa hàng';
    }

    // Đợt kiểm tra - bắt buộc
    if (!formData.roundId) {
      newErrors.roundId = 'Vui lòng chọn đợt kiểm tra';
    }

    // Người thực hiện - bắt buộc
    if (!formData.assigneeId) {
      newErrors.assigneeId = 'Vui lòng chọn người thực hiện';
    }

    // Hạn hoàn thành - bắt buộc
    if (!formData.dueDate) {
      newErrors.dueDate = 'Vui lòng chọn hạn hoàn thành';
    }

    // Validate dates: Hạn hoàn thành ≥ ngày bắt đầu
    if (formData.startDate && formData.dueDate) {
      const start = new Date(formData.startDate);
      const due = new Date(formData.dueDate);
      if (start > due) {
        newErrors.dueDate = 'Hạn hoàn thành phải sau ngày bắt đầu';
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      onSubmit(task.id, formData);
      onClose();
    }
  };

  const handleClose = () => {
    setErrors({});
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerIcon}>
              <FileText size={20} />
            </div>
            <h2 className={styles.title}>Chỉnh sửa phiên làm việc</h2>
          </div>
          <button className={styles.closeButton} onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.content}>
            {/* Info Banner */}
            <div className={styles.infoBanner}>
              <AlertCircle size={16} />
              <span>
                Cập nhật thông tin phiên làm việc
              </span>
            </div>

            {/* Tên nhiệm vụ */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="title">
                Tên nhiệm vụ <span className={styles.required}>*</span>
              </label>
              <input
                id="title"
                type="text"
                value={formData.title}
                onChange={(e) => handleChange('title', e.target.value)}
                placeholder="Nhập tên nhiệm vụ"
                className={`${styles.input} ${errors.title ? styles.inputError : ''}`}
              />
              {errors.title && (
                <span className={styles.errorText}>
                  <AlertCircle size={14} /> {errors.title}
                </span>
              )}
            </div>

            {/* Mô tả */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="description">
                Mô tả
              </label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Nhập mô tả chi tiết nhiệm vụ..."
                rows={3}
                className={styles.textarea}
              />
              <div className={styles.hint}>
                Mô tả chi tiết giúp người thực hiện hiểu rõ hơn về nhiệm vụ
              </div>
            </div>

            {/* Kế hoạch */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="planId">
                Kế hoạch kiểm tra
              </label>
              <select
                id="planId"
                value={formData.planId || ''}
                onChange={(e) => handleChange('planId', e.target.value)}
                className={`${styles.select} ${errors.planId ? styles.inputError : ''}`}
              >
                <option value="">Chọn kế hoạch (không bắt buộc)</option>
                {MOCK_PLANS.map(plan => (
                  <option key={plan.value} value={plan.value}>
                    {plan.label}
                  </option>
                ))}
              </select>
              {errors.planId && (
                <span className={styles.errorText}>
                  <AlertCircle size={14} /> {errors.planId}
                </span>
              )}
            </div>

            {/* Đợt kiểm tra */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="roundId">
                Đợt kiểm tra <span className={styles.required}>*</span>
              </label>
              <select
                id="roundId"
                value={formData.roundId}
                onChange={(e) => handleChange('roundId', e.target.value)}
                className={`${styles.select} ${errors.roundId ? styles.inputError : ''}`}
              >
                <option value="">Chọn đợt kiểm tra</option>
                {MOCK_ROUNDS.map(round => (
                  <option key={round.value} value={round.value}>
                    {round.label}
                  </option>
                ))}
              </select>
              {errors.roundId && (
                <span className={styles.errorText}>
                  <AlertCircle size={14} /> {errors.roundId}
                </span>
              )}
            </div>

            {/* Tên cửa hàng - SELECT */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="targetName">
                <MapPin size={14} />
                Tên cửa hàng <span className={styles.required}>*</span>
              </label>
              <select
                id="targetName"
                value={formData.targetName}
                onChange={(e) => handleChange('targetName', e.target.value)}
                className={`${styles.select} ${errors.targetName ? styles.inputError : ''}`}
              >
                <option value="">Chọn cửa hàng</option>
                {MOCK_STORES.map(store => (
                  <option key={store.value} value={store.value}>
                    {store.label}
                  </option>
                ))}
              </select>
              {errors.targetName && (
                <span className={styles.errorText}>
                  <AlertCircle size={14} /> {errors.targetName}
                </span>
              )}
            </div>

            {/* Người thực hiện */}
            <div className={styles.field}>
              <label className={styles.label} htmlFor="assigneeId">
                <User size={14} />
                Người thực hiện <span className={styles.required}>*</span>
              </label>
              <select
                id="assigneeId"
                value={formData.assigneeId}
                onChange={(e) => handleChange('assigneeId', e.target.value)}
                className={`${styles.select} ${errors.assigneeId ? styles.inputError : ''}`}
              >
                <option value="">Chọn người thực hiện</option>
                {MOCK_ASSIGNEES.map(assignee => (
                  <option key={assignee.value} value={assignee.value}>
                    {assignee.label}
                  </option>
                ))}
              </select>
              {errors.assigneeId && (
                <span className={styles.errorText}>
                  <AlertCircle size={14} /> {errors.assigneeId}
                </span>
              )}
            </div>

            {/* Ngày bắt đầu & Hạn hoàn thành */}
            <div className={styles.fieldGroup}>
              <div className={styles.field}>
                <label className={styles.label}>
                  <Calendar size={14} />
                  Ngày bắt đầu
                </label>
                <DateRangePicker
                  mode="single"
                  placeholder="Chọn ngày bắt đầu"
                  value={{
                    startDate: formData.startDate || null,
                    endDate: formData.startDate || null
                  }}
                  onChange={(range) => handleChange('startDate', range.startDate || '')}
                />
              </div>

              <div className={styles.field}>
                <label className={styles.label}>
                  <Clock size={14} />
                  Hạn hoàn thành <span className={styles.required}>*</span>
                </label>
                <DateRangePicker
                  mode="single"
                  placeholder="Chọn hạn hoàn thành"
                  value={{
                    startDate: formData.dueDate || null,
                    endDate: formData.dueDate || null
                  }}
                  onChange={(range) => handleChange('dueDate', range.startDate || '')}
                  className={errors.dueDate ? styles.inputError : ''}
                />
                {errors.dueDate && (
                  <span className={styles.errorText}>
                    <AlertCircle size={14} /> {errors.dueDate}
                  </span>
                )}
              </div>
            </div>

            {/* Trạng thái nhiệm vụ */}
            <div className={styles.field}>
              <label className={styles.label}>
                Trạng thái nhiệm vụ <span className={styles.required}>*</span>
              </label>
              <div className={styles.statusGrid}>
                {STATUS_OPTIONS.map(status => (
                  <button
                    key={status.value}
                    type="button"
                    className={`${styles.statusButton} ${formData.status === status.value ? styles.statusButtonActive : ''}`}
                    onClick={() => handleChange('status', status.value as TaskStatus)}
                  >
                    <span className={styles.statusEmoji}>{status.emoji}</span>
                    <span>{status.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Mức ưu tiên */}
            <div className={styles.field}>
              <label className={styles.label}>
                <Flag size={14} />
                Mức ưu tiên
              </label>
              <div className={styles.priorityGrid}>
                {PRIORITY_OPTIONS.map(priority => (
                  <button
                    key={priority.value}
                    type="button"
                    className={`${styles.priorityButton} ${formData.priority === priority.value ? styles.priorityButtonActive : ''}`}
                    onClick={() => handleChange('priority', priority.value as TaskPriority)}
                    style={
                      formData.priority === priority.value
                        ? {
                            borderColor: priority.color,
                            background: `${priority.color}10`,
                            color: priority.color,
                          }
                        : undefined
                    }
                  >
                    {priority.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleClose}
            >
              Hủy
            </button>
            <button type="submit" className={styles.submitButton}>
              <FileText size={16} />
              Cập nhật
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditTaskModal;