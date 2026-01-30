import { Shield, ArrowLeft, Home } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import styles from './ErrorStates.module.css';

export function Error403() {
  const navigate = useNavigate();

  return (
    <div className={styles.errorContainer}>
      <div className={styles.errorContent}>
        <div className={styles.errorIcon403}>
          <Shield size={64} />
        </div>

        <div className={styles.errorCode}>403</div>
        <h1 className={styles.errorTitle}>Truy cập bị từ chối</h1>
        <p className={styles.errorMessage}>
          Bạn không có quyền truy cập vào trang này.
          <br />
          Vui lòng liên hệ quản trị viên để được cấp quyền.
        </p>

        <div className={styles.errorActions}>
          <button className={styles.primaryButton} onClick={() => navigate(-1)}>
            <ArrowLeft size={16} />
            Quay lại
          </button>
          <button className={styles.secondaryButton} onClick={() => navigate('/')}>
            <Home size={16} />
            Về trang chủ
          </button>
        </div>

        <div className={styles.errorHelp}>
          <p>Cần trợ giúp?</p>
          <a href="mailto:support@qltt.gov.vn">support@qltt.gov.vn</a>
        </div>
      </div>
    </div>
  );
}
