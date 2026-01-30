import { MapPin, Search, Filter } from 'lucide-react';
import styles from './ErrorStates.module.css';

interface NoDataHotspotProps {
  onClearFilters?: () => void;
}

export function NoDataHotspot({ onClearFilters }: NoDataHotspotProps) {
  return (
    <div className={styles.emptyStateContainer}>
      <div className={styles.emptyStateContent}>
        <div className={styles.emptyIcon}>
          <MapPin size={64} />
        </div>

        <h2 className={styles.emptyTitle}>Không tìm thấy điểm nóng</h2>
        <p className={styles.emptyMessage}>
          Không có điểm nóng nào phù hợp với bộ lọc hiện tại.
          <br />
          Thử điều chỉnh bộ lọc hoặc mở rộng phạm vi tìm kiếm.
        </p>

        <div className={styles.emptyActions}>
          {onClearFilters && (
            <button className={styles.primaryButton} onClick={onClearFilters}>
              <Filter size={16} />
              Xóa bộ lọc
            </button>
          )}
          <button className={styles.secondaryButton}>
            <Search size={16} />
            Tìm kiếm khác
          </button>
        </div>

        <div className={styles.emptyStats}>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Tổng điểm nóng</div>
            <div className={styles.statValue}>0</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Đang hoạt động</div>
            <div className={styles.statValue}>0</div>
          </div>
          <div className={styles.statItem}>
            <div className={styles.statLabel}>Mức độ cao</div>
            <div className={styles.statValue}>0</div>
          </div>
        </div>
      </div>
    </div>
  );
}
