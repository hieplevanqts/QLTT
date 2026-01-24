/**
 * FORM DRAWER Component
 * Side drawer for create/update forms
 */

import React, { useEffect } from 'react';
import { X } from 'lucide-react';
import styles from './FormDrawer.module.css';

interface FormDrawerProps {
  open: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: React.ReactNode;
  onSubmit?: () => void;
  submitLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
  footerActions?: React.ReactNode;
}

export function FormDrawer({
  open,
  onClose,
  title,
  subtitle,
  children,
  onSubmit,
  submitLabel = 'Lưu',
  cancelLabel = 'Hủy',
  loading = false,
  footerActions
}: FormDrawerProps) {
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
    if (e.target === e.currentTarget && !loading) {
      onClose();
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && !loading) {
      onSubmit();
    }
  };

  return (
    <>
      <div className={styles.overlay} onClick={handleOverlayClick} />
      <div className={styles.drawer}>
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h2 className={styles.title}>{title}</h2>
            {subtitle && <p className={styles.subtitle}>{subtitle}</p>}
          </div>
          <button className={styles.closeButton} onClick={onClose} disabled={loading}>
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className={styles.body}>{children}</div>

          <div className={styles.footer}>
            {footerActions || (
              <>
                <button type="button" className={styles.buttonCancel} onClick={onClose} disabled={loading}>
                  {cancelLabel}
                </button>
                <button type="submit" className={styles.buttonPrimary} disabled={loading}>
                  {loading ? 'Đang xử lý...' : submitLabel}
                </button>
              </>
            )}
          </div>
        </form>
      </div>
    </>
  );
}

// Form field components
interface FormGroupProps {
  label: string;
  required?: boolean;
  error?: string;
  helpText?: string;
  children: React.ReactNode;
}

export function FormGroup({ label, required, error, helpText, children }: FormGroupProps) {
  return (
    <div className={styles.formGroup}>
      <label className={`${styles.label} ${required ? styles.labelRequired : ''}`}>{label}</label>
      {children}
      {error && <div className={styles.errorText}>{error}</div>}
      {!error && helpText && <div className={styles.helpText}>{helpText}</div>}
    </div>
  );
}

export const formStyles = {
  input: styles.input,
  inputError: styles.inputError,
  select: styles.select,
  textarea: styles.textarea
};
