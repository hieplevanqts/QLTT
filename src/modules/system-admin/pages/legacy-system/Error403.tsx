import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ShieldOff } from 'lucide-react';
import styles from './ErrorPage.module.css';

export default function Error403() {
  const navigate = useNavigate();

  return (
    <div className={styles.errorPage}>
      <div className={styles.errorCard}>
        <div className={`${styles.errorIcon} ${styles.error403}`}>
          <ShieldOff size={64} color="white" />
        </div>
        <h1 className={styles.errorCode}>403</h1>
        <h2 className={styles.errorTitle}>Không có quyền truy cập</h2>
        <p className={styles.errorDescription}>
          Bạn không có quyền truy cập vào trang này. Vui lòng liên hệ quản trị viên
          nếu bạn cho rằng đây là lỗi.
        </p>
        <div className={styles.errorActions}>
          <Button onClick={() => navigate(-1)} variant="ghost">
            Quay lại
          </Button>
          <Button onClick={() => navigate('/overview')}>
            Về Trang chủ
          </Button>
        </div>
      </div>
    </div>
  );
}
