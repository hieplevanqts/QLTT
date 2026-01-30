import { useState } from 'react';
import { X, XCircle, AlertTriangle } from 'lucide-react';
import type { Lead } from '../../../data/lead-risk/types';
import styles from './RejectLeadModal.module.css';

interface RejectLeadModalProps {
  isOpen: boolean;
  lead: Lead | null;
  onClose: () => void;
  onSave: (reason: string) => void;
}

export function RejectLeadModal({ isOpen, lead, onClose, onSave }: RejectLeadModalProps) {
  const [reason, setReason] = useState('');

  if (!isOpen || !lead) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (reason.trim()) {
      onSave(reason.trim());
      setReason(''); // Reset
      onClose();
    }
  };

  const handleClose = () => {
    setReason(''); // Reset on close
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={handleClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerIcon}>
            <XCircle size={24} />
          </div>
          <div className={styles.headerText}>
            <h2 className={styles.title}>Từ chối Lead</h2>
            <p className={styles.leadCode}>Lead: <span>{lead.code}</span></p>
          </div>
          <button className={styles.closeButton} onClick={handleClose}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.content}>
            <div className={styles.warningBox}>
              <AlertTriangle size={18} />
              <p>Lead này sẽ bị đánh dấu là không hợp lệ và không được xử lý tiếp.</p>
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="reject-reason" className={styles.label}>
                Lý do từ chối <span className={styles.required}>*</span>
              </label>
              <textarea
                id="reject-reason"
                className={styles.textarea}
                placeholder="Nhập lý do từ chối lead này..."
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={5}
                required
                autoFocus
              />
              <div className={styles.hint}>
                Vui lòng ghi rõ lý do để theo dõi và báo cáo sau này.
              </div>
            </div>
          </div>

          <div className={styles.footer}>
            <button
              type="button"
              className={styles.cancelButton}
              onClick={handleClose}
            >
              Hủy
            </button>
            <button
              type="submit"
              className={styles.confirmButton}
              disabled={!reason.trim()}
            >
              <XCircle size={18} />
              Từ chối Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
