import { useState } from 'react';
import { Clock, X } from 'lucide-react';
import type { Lead } from '../../../data/lead-risk/types';
import styles from './UpdateSLAModal.module.css';

interface UpdateSLAModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (deadline: string, reason: string) => void;
  lead?: Lead | null;
}

export function UpdateSLAModal({
  isOpen,
  onClose,
  onSave,
  lead,
}: UpdateSLAModalProps) {
  const [deadline, setDeadline] = useState(lead?.sla.deadline || '');
  const [reason, setReason] = useState('');

  if (!isOpen) return null;

  const handleSave = () => {
    if (deadline && reason.trim()) {
      onSave(deadline, reason);
      setDeadline(lead?.sla.deadline || '');
      setReason('');
      onClose();
    }
  };

  const handleCancel = () => {
    setDeadline(lead?.sla.deadline || '');
    setReason('');
    onClose();
  };

  // Get min date (today)
  const today = new Date().toISOString().split('T')[0];

  return (
    <div className={styles.overlay} onClick={handleCancel}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Header with Icon + Text */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={styles.iconWrapper}>
              <Clock size={20} />
            </div>
            <h3 className={styles.title}>Cập nhật thời hạn SLA</h3>
          </div>
          <button className={styles.closeBtn} onClick={handleCancel}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {lead && (
            <div className={styles.leadCode}>
              Mã nguồn tin: <strong>{lead.code}</strong>
            </div>
          )}

          {lead?.sla.deadline && (
            <div className={styles.currentDeadline}>
              <span className={styles.currentLabel}>Thời hạn hiện tại:</span>
              <span className={styles.currentValue}>
                {new Date(lead?.sla.deadline).toLocaleString('vi-VN', {
                  day: '2-digit',
                  month: '2-digit',
                  year: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </span>
            </div>
          )}
          
          <div className={styles.formGroup}>
            <label className={styles.label}>
              Thời hạn mới <span className={styles.required}>*</span>
            </label>
            <input
              type="datetime-local"
              className={styles.input}
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
              min={today}
              autoFocus
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label}>
              Lý do cập nhật <span className={styles.required}>*</span>
            </label>
            <textarea
              className={styles.textarea}
              placeholder="Nhập lý do cần cập nhật thời hạn..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              rows={4}
            />
            <div className={styles.charCount}>
              {reason.length} / 200 ký tự
            </div>
          </div>

          <div className={styles.note}>
            <strong>Lưu ý:</strong> Việc cập nhật thời hạn SLA sẽ được ghi nhận vào lịch sử thay đổi.
          </div>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={handleCancel}>
            Hủy
          </button>
          <button 
            className={styles.saveBtn}
            onClick={handleSave}
            disabled={!deadline || !reason.trim()}
          >
            Cập nhật thời hạn
          </button>
        </div>
      </div>
    </div>
  );
}