/**
 * CONFIRM DIALOG Component
 * Alert dialog for confirmations (delete, deactivate, etc.)
 */

import React, { useEffect } from 'react';
import { AlertTriangle, Info, AlertCircle } from 'lucide-react';
import styles from './ConfirmDialog.module.css';

export type DialogVariant = 'danger' | 'warning' | 'info';

interface ConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  description: string;
  variant?: DialogVariant;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

const iconMap: Record<DialogVariant, React.ReactNode> = {
  danger: <AlertCircle size={24} />,
  warning: <AlertTriangle size={24} />,
  info: <Info size={24} />
};

const iconClassMap: Record<DialogVariant, string> = {
  danger: styles.iconDanger,
  warning: styles.iconWarning,
  info: styles.iconInfo
};

export function ConfirmDialog({
  open,
  onClose,
  onConfirm,
  title,
  description,
  variant = 'info',
  confirmLabel = 'Xác nhận',
  cancelLabel = 'Hủy',
  loading = false
}: ConfirmDialogProps) {
  useEffect(() => {
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  if (!open) return null;

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const handleConfirm = () => {
    onConfirm();
  };

  return (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div className={styles.dialog}>
        <div className={styles.header}>
          <div className={iconClassMap[variant]}>{iconMap[variant]}</div>
          <div className={styles.headerContent}>
            <h3 className={styles.title}>{title}</h3>
            <p className={styles.description}>{description}</p>
          </div>
        </div>
        <div className={styles.actions}>
          <button className={styles.buttonCancel} onClick={onClose} disabled={loading}>
            {cancelLabel}
          </button>
          <button
            className={variant === 'danger' ? styles.buttonDanger : styles.buttonConfirm}
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? 'Đang xử lý...' : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
