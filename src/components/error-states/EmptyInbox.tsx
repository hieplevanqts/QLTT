import { Inbox, Plus, RefreshCw } from 'lucide-react';
import styles from './ErrorStates.module.css';

interface EmptyInboxProps {
  onRefresh?: () => void;
  onCreate?: () => void;
}

export function EmptyInbox({ onRefresh, onCreate }: EmptyInboxProps) {
  return (
    <div className={styles.emptyStateContainer}>
      <div className={styles.emptyStateContent}>
        <div className={styles.emptyIcon}>
          <Inbox size={64} />
        </div>

        <h2 className={styles.emptyTitle}>Inbox trống</h2>
        <p className={styles.emptyMessage}>
          Không có lead mới nào cần xử lý.
          <br />
          Tất cả các lead đã được phân loại hoặc xử lý.
        </p>

        <div className={styles.emptyActions}>
          {onCreate && (
            <button className={styles.primaryButton} onClick={onCreate}>
              <Plus size={16} />
              Tạo lead mới
            </button>
          )}
          {onRefresh && (
            <button className={styles.secondaryButton} onClick={onRefresh}>
              <RefreshCw size={16} />
              Làm mới
            </button>
          )}
        </div>

        <div className={styles.emptyHint}>
          <p>💡 <strong>Mẹo:</strong> Lead mới sẽ tự động xuất hiện khi có báo cáo từ hotline, mobile app hoặc import hàng loạt.</p>
        </div>
      </div>
    </div>
  );
}
