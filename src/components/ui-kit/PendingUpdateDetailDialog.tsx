import React from 'react';
import { X, ArrowRight, FileText, User, Clock, Building2, FolderOpen } from 'lucide-react';
import { PendingUpdate, FieldChange } from '../data/mockPendingUpdates';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import styles from './PendingUpdateDetailDialog.module.css';

interface PendingUpdateDetailDialogProps {
  open: boolean;
  update: PendingUpdate | null;
  onClose: () => void;
  onApprove: (updateId: number) => void;
  onReject: (updateId: number, reason?: string) => void;
}

export function PendingUpdateDetailDialog({
  open,
  update,
  onClose,
  onApprove,
  onReject,
}: PendingUpdateDetailDialogProps) {
  const [rejectReason, setRejectReason] = React.useState('');
  const [showRejectInput, setShowRejectInput] = React.useState(false);

  if (!open || !update) return null;

  const handleApprove = () => {
    onApprove(update.id);
    onClose();
  };

  const handleReject = () => {
    if (!showRejectInput) {
      setShowRejectInput(true);
      return;
    }
    onReject(update.id, rejectReason);
    setShowRejectInput(false);
    setRejectReason('');
    onClose();
  };

  const handleCancel = () => {
    setShowRejectInput(false);
    setRejectReason('');
    onClose();
  };

  const updateTypeBadgeClass =
    update.updateType === 'business_info' ? styles.badgeBlue : styles.badgePurple;

  return (
    <div className={styles.overlay} onClick={handleCancel}>
      <div className={styles.dialog} onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <div className={styles.headerTitle}>
              <FileText size={24} />
              <h2>Chi tiết nội dung chờ phê duyệt</h2>
            </div>
            <p className={styles.headerSubtitle}>{update.storeName}</p>
          </div>
          <button className={styles.closeButton} onClick={handleCancel}>
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className={styles.body}>
          {/* Metadata */}
          <div className={styles.metadata}>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Loại thông tin:</span>
              <Badge className={updateTypeBadgeClass}>
                {update.updateType === 'business_info' ? (
                  <>
                    <Building2 size={14} />
                    <span>Thông tin cơ sở</span>
                  </>
                ) : (
                  <>
                    <FolderOpen size={14} />
                    <span>Hồ sơ pháp lý</span>
                  </>
                )}
              </Badge>
            </div>
            <div className={styles.metadataItem}>
              <span className={styles.metadataLabel}>Danh mục:</span>
              <span className={styles.metadataValue}>{update.categoryLabel}</span>
            </div>
            <div className={styles.metadataItem}>
              <User size={16} />
              <span className={styles.metadataValue}>{update.updatedBy}</span>
            </div>
            <div className={styles.metadataItem}>
              <Clock size={16} />
              <span className={styles.metadataValue}>
                {new Date(update.updatedAt).toLocaleString('vi-VN')}
              </span>
            </div>
          </div>

          {/* Description */}
          <div className={styles.description}>
            <p>{update.description}</p>
          </div>

          {/* Changes Comparison */}
          <div className={styles.changesSection}>
            <h3 className={styles.sectionTitle}>So sánh thay đổi</h3>
            <div className={styles.changesList}>
              {update.changes.map((change, index) => (
                <ChangeComparisonRow key={index} change={change} />
              ))}
            </div>
          </div>

          {/* Reject Reason Input */}
          {showRejectInput && (
            <div className={styles.rejectSection}>
              <label className={styles.rejectLabel}>Lý do từ chối:</label>
              <textarea
                className={styles.rejectTextarea}
                placeholder="Nhập lý do từ chối (tùy chọn)..."
                value={rejectReason}
                onChange={(e) => setRejectReason(e.target.value)}
                rows={3}
              />
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button variant="outline" onClick={handleCancel}>
            Hủy
          </Button>
          <div className={styles.footerActions}>
            <Button variant="destructive" onClick={handleReject}>
              {showRejectInput ? 'Xác nhận từ chối' : 'Từ chối'}
            </Button>
            <Button onClick={handleApprove}>Phê duyệt</Button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Change Comparison Row Component
function ChangeComparisonRow({ change }: { change: FieldChange }) {
  const isNewValue = change.oldValue === null || change.oldValue === undefined;
  const isEmptyOld = change.oldValue === '';
  
  return (
    <div className={styles.changeRow}>
      <div className={styles.changeLabel}>{change.label}</div>
      <div className={styles.changeComparison}>
        <div className={styles.changeOld}>
          <span className={styles.changeTag}>Cũ</span>
          <div className={styles.changeValue}>
            {isNewValue || isEmptyOld ? (
              <span className={styles.emptyValue}>Chưa có</span>
            ) : (
              formatValue(change.oldValue)
            )}
          </div>
        </div>
        <div className={styles.changeArrow}>
          <ArrowRight size={20} />
        </div>
        <div className={styles.changeNew}>
          <span className={styles.changeTag}>Mới</span>
          <div className={`${styles.changeValue} ${styles.changeValueNew}`}>
            {formatValue(change.newValue)}
          </div>
        </div>
      </div>
    </div>
  );
}

function formatValue(value: any): string {
  if (value === null || value === undefined) return 'Chưa có';
  if (typeof value === 'string' && value.includes('.pdf')) {
    return `📄 ${value}`;
  }
  return String(value);
}
