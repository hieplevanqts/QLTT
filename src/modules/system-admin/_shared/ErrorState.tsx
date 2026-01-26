/**
 * ERROR STATE - System Admin Shared
 * Component hiển thị khi có lỗi
 */

import React from 'react';
import { AlertCircle } from 'lucide-react';
import styles from './ErrorState.module.css';

interface ErrorStateProps {
  title?: string;
  message: string;
  onRetry?: () => void;
}

export function ErrorState({
  title = 'Đã xảy ra lỗi',
  message,
  onRetry
}: ErrorStateProps) {
  return (
    <div className={styles.error}>
      <AlertCircle size={48} className={styles.icon} />
      <h3 className={styles.title}>{title}</h3>
      <p className={styles.message}>{message}</p>
      {onRetry && (
        <button className={styles.retryButton} onClick={onRetry}>
          Thử lại
        </button>
      )}
    </div>
  );
}
