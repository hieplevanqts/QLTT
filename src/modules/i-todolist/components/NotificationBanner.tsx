import { Bell } from 'lucide-react';
import { Button } from './Button';
import styles from './NotificationBanner.module.css';

interface NotificationBannerProps {
  onEnable: () => void;
  onDismiss: () => void;
}

export function NotificationBanner({ onEnable, onDismiss }: NotificationBannerProps) {
  return (
    <div className={styles.banner}>
      <div className={styles.icon}>
        <Bell size={20} />
      </div>
      <div className={styles.content}>
        <h4 className={styles.title}>Bật thông báo công việc</h4>
        <p className={styles.description}>
          Nhận cảnh báo khi công việc sắp hết hạn ngay trên trình duyệt
        </p>
      </div>
      <div className={styles.actions}>
        <Button onClick={onEnable} size="sm" variant="default">
          Bật ngay
        </Button>
        <Button onClick={onDismiss} size="sm" variant="outline">
          Để sau
        </Button>
      </div>
    </div>
  );
}
