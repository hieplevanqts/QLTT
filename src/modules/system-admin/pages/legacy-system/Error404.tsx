import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { FileQuestion } from 'lucide-react';
import styles from './ErrorPage.module.css';

export default function Error404() {
  const navigate = useNavigate();

  return (
    <div className={styles.errorPage}>
      <div className={styles.errorCard}>
        <div className={`${styles.errorIcon} ${styles.error404}`}>
          <FileQuestion size={64} color="white" />
        </div>
        <h1 className={styles.errorCode}>404</h1>
        <h2 className={styles.errorTitle}>Không tìm thấy trang</h2>
        <p className={styles.errorDescription}>
          Trang bạn đang tìm kiếm không tồn tại hoặc đã bị di chuyển.
          Vui lòng kiểm tra lại đường dẫn.
        </p>
        <div className={styles.errorActions}>
          <Button onClick={() => navigate(-1)} variant="ghost">
            Quay lại
          </Button>
          <Button onClick={() => navigate('/overview')}>
            Về Tổng quan
          </Button>
        </div>
      </div>
    </div>
  );
}
