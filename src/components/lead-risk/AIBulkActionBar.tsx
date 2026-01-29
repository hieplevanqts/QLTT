import { Sparkles, ThumbsUp, ThumbsDown, AlertCircle, Loader } from 'lucide-react';
import styles from './AIBulkActionBar.module.css';

interface AIBulkActionBarProps {
  totalLeads: number;
  analyzedCount: number;
  highConfidenceCount: number;
  spamCount: number;
  needsReviewCount: number;
  isProcessing: boolean;
  onApproveHighConfidence: () => void;
  onRejectSpam: () => void;
  onShowNeedsReview: () => void;
}

export function AIBulkActionBar({
  totalLeads,
  analyzedCount,
  highConfidenceCount,
  spamCount,
  needsReviewCount,
  isProcessing,
  onApproveHighConfidence,
  onRejectSpam,
  onShowNeedsReview,
}: AIBulkActionBarProps) {
  return (
    <div className={styles.container}>
      {/* AI Status */}
      <div className={styles.status}>
        <div className={styles.statusIcon}>
          {isProcessing ? (
            <Loader size={16} className={styles.spin} />
          ) : (
            <Sparkles size={16} />
          )}
        </div>
        <span className={styles.statusText}>
          AI đã phân tích: <strong>{analyzedCount}/{totalLeads}</strong> nguồn tin
        </span>
        {isProcessing && <div className={styles.dots}>●●●</div>}
      </div>

      {/* AI Quick Actions */}
      <div className={styles.actions}>
        {highConfidenceCount > 0 && (
          <button 
            className={styles.actionBtn}
            data-variant="success"
            onClick={onApproveHighConfidence}
          >
            <ThumbsUp size={16} />
            <span className={styles.actionText}>
              Duyệt {highConfidenceCount} tin AI đánh giá cao
            </span>
            <span className={styles.badge} data-variant="success">
              95%+ tin cậy
            </span>
          </button>
        )}

        {spamCount > 0 && (
          <button 
            className={styles.actionBtn}
            data-variant="danger"
            onClick={onRejectSpam}
          >
            <ThumbsDown size={16} />
            <span className={styles.actionText}>
              Loại {spamCount} tin spam/trùng
            </span>
            <span className={styles.badge} data-variant="danger">
              AI phát hiện
            </span>
          </button>
        )}

        {needsReviewCount > 0 && (
          <button 
            className={styles.actionBtn}
            data-variant="warning"
            onClick={onShowNeedsReview}
          >
            <AlertCircle size={16} />
            <span className={styles.actionText}>
              Xem {needsReviewCount} tin cần review
            </span>
            <span className={styles.badge} data-variant="warning">
              &lt;70% tin cậy
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
