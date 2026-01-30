/**
 * MAPPA Portal - Quick Actions Sidebar
 * Sidebar for quick actions on leads (resume processing, pause, assign, etc.)
 */

import { 
  X, 
  PlayCircle, 
  PauseCircle, 
  UserPlus, 
  CheckCircle2,
  XCircle,
  AlertTriangle,
  FileText,
  Clock,
  ChevronRight
} from 'lucide-react';
import type { Lead } from '@/utils/data/lead-risk/types';
import styles from './QuickActionsSidebar.module.css';

interface QuickActionsSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  lead: Lead | null;
  onResumeProcessing?: () => void;
  onPauseProcessing?: () => void;
  onResumeVerification?: () => void;
  onPauseVerification?: () => void;
  onAssign?: () => void;
  onComplete?: () => void;
  onReject?: () => void;
  onCancel?: () => void;
  onAddEvidence?: () => void;
  onUpdateSLA?: () => void;
}

interface QuickAction {
  id: string;
  label: string;
  icon: React.ElementType;
  iconColor: string;
  bgColor: string;
  description: string;
  onClick: () => void;
  disabled?: boolean;
  show: boolean;
}

export default function QuickActionsSidebar({
  isOpen,
  onClose,
  lead,
  onResumeProcessing,
  onPauseProcessing,
  onResumeVerification,
  onPauseVerification,
  onAssign,
  onComplete,
  onReject,
  onCancel,
  onAddEvidence,
  onUpdateSLA,
}: QuickActionsSidebarProps) {
  if (!isOpen || !lead) return null;

  // Define quick actions based on lead status
  const getQuickActions = (): QuickAction[] => {
    const actions: QuickAction[] = [];

    // Resume Processing (for process_paused status)
    if (lead.status === 'process_paused' && onResumeProcessing) {
      actions.push({
        id: 'resume_processing',
        label: 'Tiếp tục xử lý',
        icon: PlayCircle,
        iconColor: 'var(--success)',
        bgColor: 'rgba(220, 252, 231, 1)',
        description: 'Tiếp tục xử lý lead sau khi tạm dừng',
        onClick: onResumeProcessing,
        show: true,
      });
    }

    // Pause Processing (for in_progress status)
    if (lead.status === 'in_progress' && onPauseProcessing) {
      actions.push({
        id: 'pause_processing',
        label: 'Tạm dừng xử lý',
        icon: PauseCircle,
        iconColor: 'rgba(234, 179, 8, 1)',
        bgColor: 'rgba(254, 249, 195, 1)',
        description: 'Tạm dừng xử lý lead',
        onClick: onPauseProcessing,
        show: true,
      });
    }

    // Resume Verification (for verify_paused status)
    if (lead.status === 'verify_paused' && onResumeVerification) {
      actions.push({
        id: 'resume_verification',
        label: 'Tiếp tục xác minh',
        icon: PlayCircle,
        iconColor: 'var(--success)',
        bgColor: 'rgba(220, 252, 231, 1)',
        description: 'Tiếp tục xác minh lead sau khi tạm dừng',
        onClick: onResumeVerification,
        show: true,
      });
    }

    // Pause Verification (for verifying status)
    if (lead.status === 'verifying' && onPauseVerification) {
      actions.push({
        id: 'pause_verification',
        label: 'Tạm dừng xác minh',
        icon: PauseCircle,
        iconColor: 'rgba(234, 179, 8, 1)',
        bgColor: 'rgba(254, 249, 195, 1)',
        description: 'Tạm dừng xác minh lead',
        onClick: onPauseVerification,
        show: true,
      });
    }

    // Assign (for new, verifying, verify_paused status)
    if (['new', 'verifying', 'verify_paused'].includes(lead.status) && onAssign) {
      actions.push({
        id: 'assign',
        label: 'Giao việc',
        icon: UserPlus,
        iconColor: 'var(--primary)',
        bgColor: 'rgba(239, 246, 255, 1)',
        description: 'Giao việc cho cán bộ xử lý',
        onClick: onAssign,
        show: true,
      });
    }

    // Complete (for in_progress status)
    if (lead.status === 'in_progress' && onComplete) {
      actions.push({
        id: 'complete',
        label: 'Hoàn thành',
        icon: CheckCircle2,
        iconColor: 'var(--success)',
        bgColor: 'rgba(220, 252, 231, 1)',
        description: 'Đánh dấu lead đã hoàn thành',
        onClick: onComplete,
        show: true,
      });
    }

    // Reject (only for verifying, verify_paused status - NOT for new)
    // Nghiệp vụ: Lead mới phải qua xác minh trước, không thể từ chối ngay
    if (['verifying', 'verify_paused'].includes(lead.status) && onReject) {
      actions.push({
        id: 'reject',
        label: 'Từ chối',
        icon: XCircle,
        iconColor: 'var(--destructive)',
        bgColor: 'rgba(254, 226, 226, 1)',
        description: 'Từ chối xử lý lead này',
        onClick: onReject,
        show: true,
      });
    }

    // Cancel (for any active status)
    if (!['cancelled', 'resolved', 'rejected'].includes(lead.status) && onCancel) {
      actions.push({
        id: 'cancel',
        label: 'Hủy lead',
        icon: AlertTriangle,
        iconColor: 'rgba(234, 88, 12, 1)',
        bgColor: 'rgba(255, 237, 213, 1)',
        description: 'Hủy bỏ lead này',
        onClick: onCancel,
        show: true,
      });
    }

    // Add Evidence (for in_progress status)
    if (lead.status === 'in_progress' && onAddEvidence) {
      actions.push({
        id: 'add_evidence',
        label: 'Thêm chứng cứ',
        icon: FileText,
        iconColor: 'rgba(59, 130, 246, 1)',
        bgColor: 'rgba(219, 234, 254, 1)',
        description: 'Thêm chứng cứ, tài liệu',
        onClick: onAddEvidence,
        show: true,
      });
    }

    // Update SLA (for in_progress status)
    if (lead.status === 'in_progress' && onUpdateSLA) {
      actions.push({
        id: 'update_sla',
        label: 'Cập nhật thời hạn',
        icon: Clock,
        iconColor: 'rgba(168, 85, 247, 1)',
        bgColor: 'rgba(243, 232, 255, 1)',
        description: 'Điều chỉnh thời hạn xử lý',
        onClick: onUpdateSLA,
        show: true,
      });
    }

    return actions.filter(action => action.show);
  };

  const quickActions = getQuickActions();

  return (
    <>
      {/* Overlay */}
      <div className={styles.overlay} onClick={onClose} />
      
      {/* Sidebar */}
      <div className={styles.sidebar}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <h2 className={styles.title}>Thao tác nhanh</h2>
          </div>
          <button
            className={styles.closeButton}
            onClick={onClose}
            aria-label="Đóng"
          >
            <X size={20} />
          </button>
        </div>

        {/* Lead info banner */}
        <div className={styles.leadBanner}>
          <div className={styles.leadCode}>{lead.code}</div>
          <div className={styles.leadTitle}>{lead.title}</div>
        </div>

        {/* Content */}
        <div className={styles.content}>
          {quickActions.length === 0 ? (
            <div className={styles.emptyState}>
              <AlertTriangle size={48} />
              <p>Không có thao tác khả dụng</p>
              <p className={styles.emptyHint}>
                Trạng thái hiện tại không có thao tác nhanh nào
              </p>
            </div>
          ) : (
            <div className={styles.actionsList}>
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <button
                    key={action.id}
                    className={styles.actionItem}
                    onClick={() => {
                      action.onClick();
                      onClose();
                    }}
                    disabled={action.disabled}
                  >
                    <div className={styles.actionLeft}>
                      <div 
                        className={styles.actionIcon}
                        style={{ 
                          backgroundColor: action.bgColor,
                          color: action.iconColor 
                        }}
                      >
                        <Icon size={20} />
                      </div>
                      <div className={styles.actionContent}>
                        <div className={styles.actionLabel}>{action.label}</div>
                        <div className={styles.actionDescription}>
                          {action.description}
                        </div>
                      </div>
                    </div>
                    <ChevronRight size={20} className={styles.actionArrow} />
                  </button>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
