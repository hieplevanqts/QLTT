import React, { useState, useMemo } from 'react';
import { X, Search, Filter, FileText, Eye, CheckCircle2, XCircle, Building2, FolderOpen } from 'lucide-react';
import {
  PendingUpdate,
  UpdateType,
  mockPendingUpdates,
  getUpdateTypeLabel,
} from '@/utils/data/mockPendingUpdates';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { SearchInput } from './SearchInput';
import { PendingUpdateDetailDialog } from './PendingUpdateDetailDialog';
import { toast } from 'sonner';
import styles from './PendingUpdatesDialog.module.css';

interface PendingUpdatesDialogProps {
  open: boolean;
  onClose: () => void;
}

export function PendingUpdatesDialog({ open, onClose }: PendingUpdatesDialogProps) {
  const [updates, setUpdates] = useState<PendingUpdate[]>(mockPendingUpdates);
  const [searchValue, setSearchValue] = useState('');
  const [typeFilter, setTypeFilter] = useState<string>('all');
  const [selectedUpdate, setSelectedUpdate] = useState<PendingUpdate | null>(null);
  const [detailDialogOpen, setDetailDialogOpen] = useState(false);

  // Filter and search
  const filteredUpdates = useMemo(() => {
    let filtered = updates.filter(u => u.status === 'pending');

    // Apply type filter
    if (typeFilter !== 'all') {
      filtered = filtered.filter(u => u.updateType === typeFilter);
    }

    // Apply search
    if (searchValue) {
      const search = searchValue.toLowerCase();
      filtered = filtered.filter(
        u =>
          u.storeName.toLowerCase().includes(search) ||
          u.categoryLabel.toLowerCase().includes(search) ||
          u.description.toLowerCase().includes(search)
      );
    }

    // Sort by most recent
    return filtered.sort(
      (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
    );
  }, [updates, typeFilter, searchValue]);

  const handleView = (update: PendingUpdate) => {
    setSelectedUpdate(update);
    setDetailDialogOpen(true);
  };

  const handleApprove = (updateId: number) => {
    setUpdates(prev =>
      prev.map(u => (u.id === updateId ? { ...u, status: 'approved' as const } : u))
    );
    toast.success('Đã phê duyệt thành công', {
      description: 'Thông tin đã được cập nhật vào hệ thống',
    });
  };

  const handleReject = (updateId: number, reason?: string) => {
    setUpdates(prev =>
      prev.map(u =>
        u.id === updateId
          ? { ...u, status: 'rejected' as const, rejectionReason: reason }
          : u
      )
    );
    toast.error('Đã từ chối yêu cầu', {
      description: reason || 'Yêu cầu cập nhật đã bị từ chối',
    });
  };

  const handleQuickApprove = (update: PendingUpdate, e: React.MouseEvent) => {
    e.stopPropagation();
    handleApprove(update.id);
  };

  const handleQuickReject = (update: PendingUpdate, e: React.MouseEvent) => {
    e.stopPropagation();
    if (window.confirm(`Bạn có chắc muốn từ chối yêu cầu cập nhật "${update.description}"?`)) {
      handleReject(update.id);
    }
  };

  if (!open) return null;

  const pendingCount = filteredUpdates.length;

  return (
    <>
      <div className={styles.overlay} onClick={onClose}>
        <div className={styles.dialog} onClick={e => e.stopPropagation()}>
          {/* Header */}
          <div className={styles.header}>
            <div className={styles.headerContent}>
              <div className={styles.headerTitle}>
                <FileText size={24} />
                <h2>Danh sách thông tin chờ phê duyệt</h2>
              </div>
              <p className={styles.headerSubtitle}>
                Các thông tin cơ sở và hồ sơ pháp lý được người dùng cập nhật và đang chờ xác nhận
              </p>
            </div>
            <button className={styles.closeButton} onClick={onClose}>
              <X size={20} />
            </button>
          </div>

          {/* Filters */}
          <div className={styles.filters}>
            <div className={styles.searchWrapper}>
              <SearchInput
                value={searchValue}
                onChange={setSearchValue}
                placeholder="Tìm kiếm theo tên cơ sở..."
              />
            </div>

            <div className={styles.nativeSelectWrapper}>
              <Filter size={16} className={styles.selectIcon} />
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className={styles.nativeSelect}
              >
                <option value="all">Tất cả</option>
                <option value="business_info">Thông tin cơ sở</option>
                <option value="legal_profile">Hồ sơ pháp lý</option>
              </select>
            </div>

            <div className={styles.countBadge}>
              <Badge variant="secondary">
                {pendingCount} yêu cầu
              </Badge>
            </div>
          </div>

          {/* Body - Table */}
          <div className={styles.body}>
            {filteredUpdates.length === 0 ? (
              <div className={styles.emptyState}>
                <FileText size={48} />
                <p className={styles.emptyTitle}>Không có yêu cầu Chờ duyệt</p>
                <p className={styles.emptyDescription}>
                  {searchValue
                    ? 'Không tìm thấy kết quả phù hợp'
                    : 'Hiện tại không có thông tin nào đang chờ phê duyệt'}
                </p>
              </div>
            ) : (
              <div className={styles.tableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>Tên cơ sở</th>
                      <th>Loại thông tin</th>
                      <th>Nội dung chi tiết</th>
                      <th>Người cập nhật</th>
                      <th>Thời gian</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredUpdates.map(update => (
                      <tr
                        key={update.id}
                        className={styles.tableRow}
                        onClick={() => handleView(update)}
                      >
                        <td className={styles.storeName}>{update.storeName}</td>
                        <td>
                          <UpdateTypeBadge type={update.updateType} />
                        </td>
                        <td className={styles.description}>
                          <div className={styles.descriptionContent}>
                            <span className={styles.categoryLabel}>
                              {update.categoryLabel}
                            </span>
                            <span className={styles.descriptionText}>
                              {update.description}
                            </span>
                          </div>
                        </td>
                        <td className={styles.updatedBy}>{update.updatedBy}</td>
                        <td className={styles.updatedAt}>
                          {formatDateTime(update.updatedAt)}
                        </td>
                        <td className={styles.actions}>
                          <div className={styles.actionButtons}>
                            <button
                              className={styles.actionBtn}
                              onClick={() => handleView(update)}
                              title="Xem chi tiết"
                            >
                              <Eye size={16} />
                            </button>
                            <button
                              className={`${styles.actionBtn} ${styles.actionApprove}`}
                              onClick={e => handleQuickApprove(update, e)}
                              title="Phê duyệt"
                            >
                              <CheckCircle2 size={16} />
                            </button>
                            <button
                              className={`${styles.actionBtn} ${styles.actionReject}`}
                              onClick={e => handleQuickReject(update, e)}
                              title="Từ chối"
                            >
                              <XCircle size={16} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className={styles.footer}>
            <p className={styles.footerInfo}>
              Tổng số: <strong>{pendingCount}</strong> yêu cầu chờ phê duyệt
            </p>
            <Button variant="outline" onClick={onClose} className='hover:!text-white hover:!bg-red-700'>
              Đóng
            </Button>
          </div>
        </div>
      </div>

      {/* Detail Dialog */}
      <PendingUpdateDetailDialog
        open={detailDialogOpen}
        update={selectedUpdate}
        onClose={() => setDetailDialogOpen(false)}
        onApprove={handleApprove}
        onReject={handleReject}
      />
    </>
  );
}

// Update Type Badge Component
function UpdateTypeBadge({ type }: { type: UpdateType }) {
  const isBusinessInfo = type === 'business_info';
  return (
    <Badge className={isBusinessInfo ? styles.badgeBlue : styles.badgePurple}>
      {isBusinessInfo ? (
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
  );
}

// Helper function
function formatDateTime(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  const diffHours = Math.floor(diffMs / 3600000);
  const diffDays = Math.floor(diffMs / 86400000);

  if (diffMins < 60) {
    return `${diffMins} phút trước`;
  } else if (diffHours < 24) {
    return `${diffHours} giờ trước`;
  } else if (diffDays < 7) {
    return `${diffDays} ngày trước`;
  } else {
    return date.toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  }
}
