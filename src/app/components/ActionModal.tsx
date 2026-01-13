import React, { useState } from 'react';
import { X, CheckCircle2, Calendar, User, FileText, AlertCircle } from 'lucide-react';
import styles from './ActionModal.module.css';

export type ActionType = 'task' | 'plan' | 'followup';

interface ActionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  type: ActionType;
  source?: {
    type: 'hotspot' | 'watchlist' | 'lead';
    id: string;
    name: string;
  };
}

export function ActionModal({ isOpen, onClose, onSubmit, type, source }: ActionModalProps) {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    assignee: '',
    priority: 'medium',
    dueDate: '',
    category: '',
    steps: [''],
    targetEntity: source?.name || '',
    reason: '',
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      type,
      sourceType: source?.type,
      sourceId: source?.id,
      createdAt: new Date().toISOString(),
    });
    onClose();
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addStep = () => {
    setFormData(prev => ({
      ...prev,
      steps: [...prev.steps, '']
    }));
  };

  const updateStep = (index: number, value: string) => {
    const newSteps = [...formData.steps];
    newSteps[index] = value;
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const removeStep = (index: number) => {
    const newSteps = formData.steps.filter((_, i) => i !== index);
    setFormData(prev => ({ ...prev, steps: newSteps }));
  };

  const getTitle = () => {
    switch (type) {
      case 'task': return 'Tạo Task mới';
      case 'plan': return 'Tạo Plan hành động';
      case 'followup': return 'Tạo Follow-up Lead';
    }
  };

  const getIcon = () => {
    switch (type) {
      case 'task': return <CheckCircle2 size={20} />;
      case 'plan': return <FileText size={20} />;
      case 'followup': return <AlertCircle size={20} />;
    }
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={e => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.titleRow}>
            <div className={styles.iconTitle}>
              {getIcon()}
              <h2>{getTitle()}</h2>
            </div>
            <button className={styles.closeBtn} onClick={onClose}>
              <X size={20} />
            </button>
          </div>
          {source && (
            <div className={styles.sourceInfo}>
              <span className={styles.sourceLabel}>Nguồn:</span>
              <span className={styles.sourceName}>
                {source.type === 'hotspot' && 'Hotspot: '}
                {source.type === 'watchlist' && 'Watchlist: '}
                {source.type === 'lead' && 'Lead: '}
                {source.name}
              </span>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="title">
              Tiêu đề <span className={styles.required}>*</span>
            </label>
            <input
              id="title"
              type="text"
              value={formData.title}
              onChange={e => handleChange('title', e.target.value)}
              placeholder={type === 'task' ? 'VD: Kiểm tra cơ sở X' : type === 'plan' ? 'VD: Kế hoạch giám sát khu vực Y' : 'VD: Theo dõi cơ sở nguy cơ cao'}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="description">
              Mô tả <span className={styles.required}>*</span>
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={e => handleChange('description', e.target.value)}
              placeholder="Mô tả chi tiết..."
              rows={3}
              required
            />
          </div>

          {type === 'plan' && (
            <div className={styles.formGroup}>
              <label>
                Các bước thực hiện <span className={styles.required}>*</span>
              </label>
              <div className={styles.stepsList}>
                {formData.steps.map((step, index) => (
                  <div key={index} className={styles.stepItem}>
                    <span className={styles.stepNumber}>{index + 1}</span>
                    <input
                      type="text"
                      value={step}
                      onChange={e => updateStep(index, e.target.value)}
                      placeholder="Nhập bước thực hiện..."
                      required
                    />
                    {formData.steps.length > 1 && (
                      <button
                        type="button"
                        className={styles.removeStepBtn}
                        onClick={() => removeStep(index)}
                      >
                        <X size={16} />
                      </button>
                    )}
                  </div>
                ))}
                <button type="button" className={styles.addStepBtn} onClick={addStep}>
                  + Thêm bước
                </button>
              </div>
            </div>
          )}

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="assignee">
                <User size={16} />
                Người thực hiện <span className={styles.required}>*</span>
              </label>
              <select
                id="assignee"
                value={formData.assignee}
                onChange={e => handleChange('assignee', e.target.value)}
                required
              >
                <option value="">-- Chọn người thực hiện --</option>
                <option value="QT01_NguyenVanA">QT01_NguyenVanA - Chi cục Hà Nội</option>
                <option value="QT01_TranThiB">QT01_TranThiB - Chi cục Hà Nội</option>
                <option value="QT02_LeVanC">QT02_LeVanC - Chi cục Hồ Chí Minh</option>
                <option value="QT0101_PhamVanD">QT0101_PhamVanD - Đội 01 Hà Nội</option>
                <option value="QT_HoangVanE">QT_HoangVanE - Cấp Cục</option>
              </select>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="priority">
                Mức độ ưu tiên <span className={styles.required}>*</span>
              </label>
              <select
                id="priority"
                value={formData.priority}
                onChange={e => handleChange('priority', e.target.value)}
                required
              >
                <option value="low">Thấp</option>
                <option value="medium">Trung bình</option>
                <option value="high">Cao</option>
                <option value="critical">Khẩn cấp</option>
              </select>
            </div>
          </div>

          <div className={styles.formRow}>
            <div className={styles.formGroup}>
              <label htmlFor="dueDate">
                <Calendar size={16} />
                Hạn hoàn thành <span className={styles.required}>*</span>
              </label>
              <input
                id="dueDate"
                type="date"
                value={formData.dueDate}
                onChange={e => handleChange('dueDate', e.target.value)}
                required
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="category">
                Danh mục
              </label>
              <select
                id="category"
                value={formData.category}
                onChange={e => handleChange('category', e.target.value)}
              >
                <option value="">-- Chọn danh mục --</option>
                <option value="inspection">Thanh tra/Kiểm tra</option>
                <option value="investigation">Điều tra</option>
                <option value="monitoring">Giám sát</option>
                <option value="verification">Xác minh</option>
                <option value="followup">Theo dõi</option>
              </select>
            </div>
          </div>

          {type === 'followup' && (
            <div className={styles.formGroup}>
              <label htmlFor="reason">
                Lý do theo dõi <span className={styles.required}>*</span>
              </label>
              <textarea
                id="reason"
                value={formData.reason}
                onChange={e => handleChange('reason', e.target.value)}
                placeholder="VD: Risk score cao, nhiều vi phạm lặp lại, cần giám sát dài hạn..."
                rows={2}
                required
              />
            </div>
          )}

          <div className={styles.actions}>
            <button type="button" className={styles.cancelBtn} onClick={onClose}>
              Hủy
            </button>
            <button type="submit" className={styles.submitBtn}>
              {type === 'task' && 'Tạo Task'}
              {type === 'plan' && 'Tạo Plan'}
              {type === 'followup' && 'Tạo Follow-up'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}