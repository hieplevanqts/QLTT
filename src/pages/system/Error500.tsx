import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../../app/components/ui/button';
import { ServerCrash, RefreshCw } from 'lucide-react';
import styles from './ErrorPage.module.css';

export default function Error500() {
  const navigate = useNavigate();

  const handleRetry = () => {
    window.location.reload();
  };

  return (
    <div className={styles.errorPage}>
      <div className={styles.errorCard}>
        <div className={`${styles.errorIcon} ${styles.error500}`}>
          <ServerCrash size={64} color="white" />
        </div>
        <h1 className={styles.errorCode}>500</h1>
        <h2 className={styles.errorTitle}>Lỗi máy chủ</h2>
        <p className={styles.errorDescription}>
          Đã xảy ra lỗi từ phía máy chủ. Chúng tôi đang khắc phục sự cố.
          Vui lòng thử lại sau hoặc liên hệ hỗ trợ kỹ thuật.
        </p>
        <div className={styles.errorActions}>
          <Button onClick={handleRetry} variant="ghost" className="gap-2">
            <RefreshCw size={18} />
            Thử lại
          </Button>
          <Button onClick={() => navigate('/overview')}>
            Về Trang chủ
          </Button>
        </div>
        <p style={{ marginTop: '24px', fontSize: 'var(--text-sm)', color: 'var(--muted-foreground)' }}>
          Liên hệ hỗ trợ: support@mappa.vn | 1900-xxxx
        </p>
      </div>
    </div>
  );
}
