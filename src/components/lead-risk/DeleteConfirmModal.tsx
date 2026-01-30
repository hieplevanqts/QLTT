import { AlertTriangle, Trash2, X } from 'lucide-react';
import styles from './DeleteConfirmModal.module.css';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  count?: number;
}

export function DeleteConfirmModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message,
  count 
}: DeleteConfirmModalProps) {
  if (!isOpen) return null;

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        {/* Icon */}
        <div className={styles.iconWrapper}>
          <div className={styles.icon}>
            <AlertTriangle size={32} />
          </div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          <h2 className={styles.title}>{title}</h2>
          <p className={styles.message}>{message}</p>
          {count && count > 0 && (
            <div className={styles.countBadge}>
              <Trash2 size={16} />
              <span>{count} lead sẽ bị xóa</span>
            </div>
          )}
        </div>

        {/* Actions */}
        <div className={styles.actions}>
          <button className={styles.cancelButton} onClick={onClose}>
            <X size={18} />
            Hủy
          </button>
          <button className={styles.deleteButton} onClick={handleConfirm}>
            <Trash2 size={18} />
            Xác nhận xóa
          </button>
        </div>
      </div>
    </div>
  );
}
