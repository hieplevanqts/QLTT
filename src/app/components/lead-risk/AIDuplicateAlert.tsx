import { AlertTriangle, X } from 'lucide-react';
import { useState } from 'react';
import styles from './AIDuplicateAlert.module.css';

interface AIDuplicateAlertProps {
  duplicateCount: number;
  highestSimilarity: number;
  onViewDetails: () => void;
  onDismiss: () => void;
}

export function AIDuplicateAlert({
  duplicateCount,
  highestSimilarity,
  onViewDetails,
  onDismiss,
}: AIDuplicateAlertProps) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed) return null;

  const getSeverity = () => {
    if (highestSimilarity >= 90) return 'high';
    if (highestSimilarity >= 70) return 'medium';
    return 'low';
  };

  const severity = getSeverity();

  const config = {
    high: {
      bgColor: 'rgba(239, 68, 68, 0.1)',
      borderColor: 'rgb(239, 68, 68)',
      textColor: 'rgb(185, 28, 28)',
      icon: '⚠️',
      title: 'Cảnh báo: Có khả năng trùng nguồn tin cao',
    },
    medium: {
      bgColor: 'rgba(245, 158, 11, 0.1)',
      borderColor: 'rgb(245, 158, 11)',
      textColor: 'rgb(161, 98, 7)',
      icon: '⚠️',
      title: 'Lưu ý: Phát hiện nguồn tin tương tự',
    },
    low: {
      bgColor: 'rgba(59, 130, 246, 0.1)',
      borderColor: 'rgb(59, 130, 246)',
      textColor: 'rgb(29, 78, 216)',
      icon: 'ℹ️',
      title: 'Thông tin: Có nguồn tin liên quan',
    },
  };

  const c = config[severity];

  const handleDismiss = () => {
    setIsDismissed(true);
    onDismiss();
  };

  return (
    <div
      className={styles.alert}
      style={{
        backgroundColor: c.bgColor,
        borderLeft: `4px solid ${c.borderColor}`,
      }}
    >
      <div className={styles.alertIcon} style={{ color: c.textColor }}>
        <AlertTriangle size={24} />
      </div>

      <div className={styles.alertContent}>
        <div className={styles.alertHeader}>
          <h3 className={styles.alertTitle} style={{ color: c.textColor }}>
            {c.icon} {c.title}
          </h3>
          <span className={styles.similarity} style={{ color: c.textColor }}>
            {highestSimilarity}% tương đồng
          </span>
        </div>

        <p className={styles.alertMessage}>
          AI phát hiện{' '}
          <strong>
            {duplicateCount} nguồn tin tương tự
          </strong>{' '}
          trong hệ thống. Khuyến nghị xem xét để tránh xử lý trùng lặp.
        </p>

        <div className={styles.alertActions}>
          <button className={styles.viewButton} onClick={onViewDetails}>
            Xem chi tiết so sánh
          </button>
          <button className={styles.dismissButton} onClick={handleDismiss}>
            Đã hiểu, ẩn thông báo
          </button>
        </div>
      </div>

      <button className={styles.closeButton} onClick={handleDismiss}>
        <X size={20} />
      </button>
    </div>
  );
}
