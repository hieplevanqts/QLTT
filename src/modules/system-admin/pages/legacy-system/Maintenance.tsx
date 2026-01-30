import React from 'react';
import { Construction } from 'lucide-react';
import styles from './ErrorPage.module.css';

export default function Maintenance() {
  return (
    <div className={styles.errorPage}>
      <div className={styles.errorCard}>
        <div className={`${styles.errorIcon} ${styles.errorMaintenance}`}>
          <Construction size={64} color="white" />
        </div>
        <h2 className={styles.errorTitle}>Đang bảo trì hệ thống</h2>
        <p className={styles.errorDescription}>
          Hệ thống đang được nâng cấp và bảo trì để mang đến trải nghiệm tốt hơn.
          Chúng tôi sẽ quay lại sớm nhất có thể.
        </p>
        <div style={{ marginTop: '32px', padding: '16px', backgroundColor: 'var(--muted)', borderRadius: 'var(--radius-lg)' }}>
          <p style={{ fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)', margin: 0 }}>
            <strong>Thời gian dự kiến:</strong> 2 giờ (từ 02:00 - 04:00 ngày 06/01/2025)
          </p>
        </div>
        <p style={{ marginTop: '24px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
          Liên hệ khẩn cấp: support@mappa.vn | 1900-xxxx
        </p>
      </div>
    </div>
  );
}
