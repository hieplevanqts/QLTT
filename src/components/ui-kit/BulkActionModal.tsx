import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle2, X, Info } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import FacilityStatusBadge, { FacilityStatus } from './FacilityStatusBadge';
import { Store } from '../data/mockStores';
import { exportStoresToCSV } from '@/utils/exportStoresCSV';
import styles from './BulkActionModal.module.css';

export type BulkActionType = 
  | 'approve' 
  | 'reject' 
  | 'suspend' 
  | 'activate' 
  | 'close'
  | 'delete'
  | 'export';

interface BulkActionModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  actionType: BulkActionType;
  selectedStores: Store[];
  onConfirm: (reason?: string) => void;
  loading?: boolean;
}

const ACTION_CONFIG: Record<BulkActionType, {
  title: string;
  description: string;
  requiresReason: boolean;
  variant: 'default' | 'warning' | 'danger' | 'success';
  icon: React.ReactNode;
  warningText?: string;
}> = {
  approve: {
    title: 'Phê duyệt hàng loạt',
    description: 'Phê duyệt các cơ sở đã chọn và chuyển sang trạng thái "Đang hoạt động"',
    requiresReason: true,
    variant: 'success',
    icon: <CheckCircle2 size={24} />,
  },
  reject: {
    title: 'Từ chối hàng loạt',
    description: 'Từ chối các cơ sở đã chọn và yêu cầu chỉnh sửa lại',
    requiresReason: true,
    variant: 'danger',
    icon: <X size={24} />,
    warningText: 'Cơ sở sẽ được chuyển về trạng thái "Chờ duyệt" và cần bổ sung thông tin.',
  },
  suspend: {
    title: 'Tạm ngừng hàng loạt',
    description: 'Tạm ngừng hoạt động các cơ sở đã chọn',
    requiresReason: true,
    variant: 'warning',
    icon: <AlertTriangle size={24} />,
    warningText: 'Cơ sở sẽ không thể hoạt động cho đến khi được kích hoạt lại.',
  },
  activate: {
    title: 'Kích hoạt lại hàng loạt',
    description: 'Kích hoạt lại các cơ sở đang tạm ngừng',
    requiresReason: false,
    variant: 'success',
    icon: <CheckCircle2 size={24} />,
  },
  close: {
    title: 'Ngừng hoạt động hàng loạt',
    description: 'Ngừng hoạt động vĩnh viễn các cơ sở đã chọn',
    requiresReason: true,
    variant: 'danger',
    icon: <X size={24} />,
    warningText: 'Hành động này không thể hoàn tác. Cơ sở sẽ chuyển sang trạng thái "Ngừng hoạt động" vĩnh viễn.',
  },
  delete: {
    title: 'Xóa cơ sở hàng loạt',
    description: 'Xóa các cơ sở đã chọn khỏi hệ thống',
    requiresReason: false,
    variant: 'danger',
    icon: <X size={24} />,
    warningText: 'Hành động này không thể hoàn tác. Dữ liệu cơ sở sẽ bị xóa khỏi hệ thống.',
  },
  export: {
    title: 'Xuất dữ liệu CSV',
    description: 'Xuất danh sách các cơ sở đã chọn ra file CSV',
    requiresReason: false,
    variant: 'default',
    icon: <Info size={24} />,
  },
};

export function BulkActionModal({
  open,
  onOpenChange,
  actionType,
  selectedStores,
  onConfirm,
  loading = false,
}: BulkActionModalProps) {
  const [reason, setReason] = useState('');
  
  const config = ACTION_CONFIG[actionType];
  
  // Validate stores for action
  const { validStores, invalidStores } = React.useMemo(() => {
    const valid: Store[] = [];
    const invalid: { store: Store; reason: string }[] = [];

    selectedStores.forEach(store => {
      // Validation rules based on action type
      switch (actionType) {
        case 'approve':
          if (store.status === 'pending') {
            valid.push(store);
          } else {
            invalid.push({ store, reason: 'Chỉ có thể phê duyệt cơ sở ở trạng thái "Chờ duyệt"' });
          }
          break;
        
        case 'reject':
          if (store.status === 'pending' || store.status === 'active') {
            valid.push(store);
          } else {
            invalid.push({ store, reason: 'Chỉ có thể từ chối cơ sở ở trạng thái "Chờ duyệt" hoặc "Đang hoạt động"' });
          }
          break;
        
        case 'suspend':
          if (store.status === 'active') {
            valid.push(store);
          } else {
            invalid.push({ store, reason: 'Chỉ có thể tạm ngừng cơ sở ở trạng thái "Đang hoạt động"' });
          }
          break;
        
        case 'activate':
          if (store.status === 'suspended') {
            valid.push(store);
          } else {
            invalid.push({ store, reason: 'Chỉ có thể kích hoạt lại cơ sở ở trạng thái "Tạm ngừng"' });
          }
          break;
        
        case 'close':
          if (store.status === 'suspended' || store.status === 'active') {
            valid.push(store);
          } else {
            invalid.push({ store, reason: 'Chỉ có thể ngừng hoạt động cơ sở ở trạng thái "Đang hoạt động" hoặc "Tạm ngừng"' });
          }
          break;

        case 'delete':
          if (store.status === 'rejected') {
            valid.push(store);
          } else {
            invalid.push({ store, reason: 'Chỉ có thể xóa cơ sở ở trạng thái "Từ chối phê duyệt"' });
          }
          break;
        
        case 'export':
          valid.push(store);
          break;
      }
    });

    return { validStores: valid, invalidStores: invalid };
  }, [selectedStores, actionType]);

  const hasInvalidStores = invalidStores.length > 0;
  const canProceed = validStores.length > 0 && (!config.requiresReason || reason.trim().length > 0);
  
  // Reset reason when modal closes
  React.useEffect(() => {
    if (!open) {
      setReason('');
    }
  }, [open]);

  // Don't render if not open (AFTER all hooks)
  if (!open) return null;

  // Handle backdrop click
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget && !loading) {
      onOpenChange(false);
    }
  };

  // Handle confirm
  const handleConfirm = () => {
    if (canProceed && !loading) {
      // If export action, trigger CSV export
      if (actionType === 'export') {
        const timestamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
        exportStoresToCSV(validStores, `danh-sach-cua-hang-${timestamp}.csv`);
      }
      
      onConfirm(config.requiresReason ? reason : undefined);
    }
  };

  // Handle close
  const handleClose = () => {
    if (!loading) {
      setReason('');
      onOpenChange(false);
    }
  };

  return (
    <div className={styles.backdrop} onClick={handleBackdropClick}>
      <div className={styles.modal}>
        {/* Header */}
        <div className={`${styles.header} ${styles[`header${config.variant.charAt(0).toUpperCase() + config.variant.slice(1)}`]}`}>
          <div className={styles.headerIcon}>
            {config.icon}
          </div>
          <h2 className={styles.title}>{config.title}</h2>
          {!loading && (
            <button
              className={styles.closeButton}
              onClick={handleClose}
              aria-label="Đóng"
            >
              <X size={20} />
            </button>
          )}
        </div>

        {/* Content */}
        <div className={styles.content}>
          {/* Description */}
          <div className={styles.description}>
            {config.description}
          </div>

          {/* Warning */}
          {config.warningText && (
            <div className={styles.warning}>
              <AlertTriangle size={16} />
              <span>{config.warningText}</span>
            </div>
          )}

          {/* Summary */}
          <div className={styles.summary}>
            <div className={styles.summaryRow}>
              <span className={styles.summaryLabel}>Tổng số bản ghi đã chọn:</span>
              <span className={styles.summaryValue}>{selectedStores.length}</span>
            </div>
            {hasInvalidStores && (
              <>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Bản ghi hợp lệ:</span>
                  <span className={`${styles.summaryValue} ${styles.summarySuccess}`}>{validStores.length}</span>
                </div>
                <div className={styles.summaryRow}>
                  <span className={styles.summaryLabel}>Bản ghi không hợp lệ:</span>
                  <span className={`${styles.summaryValue} ${styles.summaryDanger}`}>{invalidStores.length}</span>
                </div>
              </>
            )}
          </div>

          {/* Invalid Stores Warning */}
          {hasInvalidStores && (
            <div className={styles.invalidWarning}>
              <AlertTriangle size={16} />
              <div className={styles.invalidWarningContent}>
                <div className={styles.invalidWarningTitle}>
                  {invalidStores.length} cơ sở không đủ điều kiện
                </div>
                <div className={styles.invalidWarningText}>
                  Các cơ sở này sẽ được bỏ qua. Chỉ {validStores.length} cơ sở hợp lệ sẽ được xử lý.
                </div>
              </div>
            </div>
          )}

          {/* Store Preview */}
          <div className={styles.preview}>
            <div className={styles.previewTitle}>
              Danh sách cơ sở sẽ được xử lý ({validStores.length})
            </div>
            <div className={styles.previewList}>
              {validStores.slice(0, 10).map(store => (
                <div key={store.id} className={styles.previewItem}>
                  <div className={styles.previewItemInfo}>
                    <div className={styles.previewItemName}>{store.name}</div>
                    <div className={styles.previewItemAddress}>{store.address}</div>
                  </div>
                  <FacilityStatusBadge status={store.status} />
                </div>
              ))}
              {validStores.length > 10 && (
                <div className={styles.previewMore}>
                  ...và {validStores.length - 10} cơ sở khác
                </div>
              )}
            </div>
          </div>

          {/* Invalid Stores List (if any) */}
          {hasInvalidStores && (
            <details className={styles.invalidDetails}>
              <summary className={styles.invalidSummary}>
                Xem danh sách cơ sở không hợp lệ ({invalidStores.length})
              </summary>
              <div className={styles.invalidList}>
                {invalidStores.map(({ store, reason: invalidReason }) => (
                  <div key={store.id} className={styles.invalidItem}>
                    <div className={styles.invalidItemInfo}>
                      <div className={styles.invalidItemName}>{store.name}</div>
                      <div className={styles.invalidItemReason}>{invalidReason}</div>
                    </div>
                    <FacilityStatusBadge status={store.status} />
                  </div>
                ))}
              </div>
            </details>
          )}

          {/* Reason Field */}
          {config.requiresReason && (
            <div className={styles.reasonField}>
              <label className={styles.reasonLabel}>
                Lý do <span className={styles.required}>*</span>
              </label>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder={`Nhập lý do ${config.title.toLowerCase()}...`}
                rows={4}
                disabled={loading}
                className={styles.reasonTextarea}
              />
              <div className={styles.reasonHint}>
                Lý do này sẽ được ghi vào lịch sử thay đổi của từng cơ sở.
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className={styles.footer}>
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={loading}
          >
            Hủy
          </Button>
          <Button
            variant={config.variant === 'danger' ? 'destructive' : 'default'}
            onClick={handleConfirm}
            disabled={!canProceed || loading}
          >
            {loading ? 'Đang xử lý...' : `Xác nhận ${config.title.toLowerCase()}`}
          </Button>
        </div>
      </div>
    </div>
  );
}
