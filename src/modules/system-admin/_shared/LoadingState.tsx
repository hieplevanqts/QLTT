/**
 * LOADING STATE - System Admin Shared
 * Component hiển thị khi đang tải dữ liệu
 */

import React from 'react';
import { Loader2 } from 'lucide-react';
import styles from './LoadingState.module.css';

interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = 'Đang tải...' }: LoadingStateProps) {
  return (
    <div className={styles.loading}>
      <Loader2 size={48} className={styles.spinner} />
      <p className={styles.message}>{message}</p>
    </div>
  );
}
