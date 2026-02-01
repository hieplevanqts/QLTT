/**
 * FORM DRAWER Component
 * Side drawer for create/update forms
 */

import React from 'react';
import styles from './FormDrawer.module.css';
import { CenteredModalShell } from '@/components/overlays/CenteredModalShell';
import { EnterpriseModalHeader } from '@/components/overlays/EnterpriseModalHeader';

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
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSubmit && !loading) {
      onSubmit();
    }
  };

  const footerContent = footerActions || (
    <>
      <button type="button" className={styles.buttonCancel} onClick={onClose} disabled={loading}>
        {cancelLabel}
      </button>
      <button
        type="button"
        className={styles.buttonPrimary}
        onClick={() => {
          if (onSubmit && !loading) onSubmit();
        }}
        disabled={loading}
      >
        {loading ? 'Đang xử lý...' : submitLabel}
      </button>
    </>
  );

  return (
    <CenteredModalShell
      header={
        <EnterpriseModalHeader
          title={
            <div className={styles.headerContent}>
              <div className={styles.title}>{title}</div>
              {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
            </div>
          }
        />
      }
      open={open}
      onClose={onClose}
      width={900}
      footer={<div className={styles.footer}>{footerContent}</div>}
    >
      <form onSubmit={handleSubmit}>
        <div className={styles.body}>{children}</div>
      </form>
    </CenteredModalShell>
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
