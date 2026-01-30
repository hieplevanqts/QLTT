import { AlertTriangle, CheckCircle2, Info, X } from 'lucide-react';
import styles from './ConfirmationDialog.module.css';

interface ConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'info' | 'warning' | 'danger' | 'success';
  leadCode?: string;
}

export function ConfirmationDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Xác nhận',
  cancelText = 'Hủy',
  type = 'warning',
  leadCode,
}: ConfirmationDialogProps) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'danger':
        return <AlertTriangle size={20} />;
      case 'success':
        return <CheckCircle2 size={20} />;
      case 'info':
        return <Info size={20} />;
      default:
        return <AlertTriangle size={20} />;
    }
  };

  const handleConfirm = () => {
    onConfirm();
    onClose();
  };

  return (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        {/* Header with Icon + Text */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <div className={`${styles.headerIcon} ${styles[`headerIcon${type.charAt(0).toUpperCase() + type.slice(1)}`]}`}>
              {getIcon()}
            </div>
            <h3 className={styles.title}>{title}</h3>
          </div>
          <button className={styles.closeBtn} onClick={onClose}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {leadCode && (
            <div className={styles.leadCode}>
              Mã nguồn tin: <strong>{leadCode}</strong>
            </div>
          )}
          <p className={styles.message}>{message}</p>
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <button className={styles.cancelBtn} onClick={onClose}>
            {cancelText}
          </button>
          <button 
            className={`${styles.confirmBtn} ${styles[`confirmBtn${type.charAt(0).toUpperCase() + type.slice(1)}`]}`}
            onClick={handleConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
}
