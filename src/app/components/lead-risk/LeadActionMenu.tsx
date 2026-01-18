import { useState, useRef, useEffect } from 'react';
import {
  Eye,
  Edit2,
  Trash2,
  MoreVertical,
  FileText,
  XCircle,
  Copy,
  UserPlus,
  ArrowUpCircle,
  Play,
  RotateCcw,
  Pause,
  Upload,
  CheckCircle2,
  Lock,
  Download,
  Link2,
  Clock,
} from 'lucide-react';
import type { LeadStatus } from '../../../data/lead-risk/types';
import styles from './LeadActionMenu.module.css';

type LeadAction = 
  | 'view'
  | 'edit'
  | 'delete'
  | 'start_verification'
  | 'assign'
  | 'reject'
  | 'hold'
  | 'cancel'
  | 'complete'
  | 'reopen_to_progress'
  | 'reopen_to_verification'
  | 'note'
  | 'update_sla'
  | 'add_evidence'
  | 'export';

interface LeadActionMenuProps {
  status: LeadStatus;
  onAction: (action: LeadAction) => void;
}

// Get allowed actions for each status
const getAllowedActions = (status: LeadStatus): LeadAction[] => {
  switch (status) {
    case 'new':
      return ['view', 'note', 'start_verification'];
    case 'in_verification':
      return ['view', 'note', 'assign', 'reject', 'hold', 'cancel'];
    case 'in_progress':
      return ['view', 'note', 'add_evidence', 'update_sla', 'complete', 'hold', 'cancel'];
    case 'resolved':
      return ['view', 'note', 'export', 'reopen_to_progress', 'reopen_to_verification'];
    case 'rejected':
      return ['view', 'export'];
    case 'cancelled':
      return ['view', 'export'];
    default:
      return ['view'];
  }
};

// Action labels and icons
const actionConfig: Record<LeadAction, { label: string; icon: any; variant?: 'default' | 'primary' | 'danger' }> = {
  view: { label: 'Xem chi tiết', icon: Eye },
  edit: { label: 'Chỉnh sửa', icon: Edit2 },
  delete: { label: 'Xóa', icon: Trash2, variant: 'danger' },
  start_verification: { label: 'Bắt đầu xác minh', icon: Play, variant: 'primary' },
  assign: { label: 'Giao xử lý', icon: UserPlus, variant: 'primary' },
  reject: { label: 'Từ chối', icon: XCircle, variant: 'danger' },
  hold: { label: 'Tạm dừng', icon: Pause },
  cancel: { label: 'Hủy bỏ', icon: XCircle, variant: 'danger' },
  complete: { label: 'Hoàn thành', icon: CheckCircle2, variant: 'primary' },
  reopen_to_progress: { label: 'Mở lại (Đang xử lý)', icon: RotateCcw },
  reopen_to_verification: { label: 'Yêu cầu xác minh lại', icon: RotateCcw },
  note: { label: 'Thêm ghi chú', icon: FileText },
  update_sla: { label: 'Cập nhật thời hạn', icon: Clock },
  add_evidence: { label: 'Thêm bằng chứng', icon: Upload },
  export: { label: 'Xuất báo cáo', icon: Download },
};

export function LeadActionMenu({ status, onAction }: LeadActionMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [showAbove, setShowAbove] = useState(false);
  const [menuPosition, setMenuPosition] = useState({ top: 0, left: 0 });
  const menuRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const allowedActions = getAllowedActions(status);

  // Always show first 3 actions as quick buttons
  const quickActions = allowedActions.slice(0, 3);
  const menuActions = allowedActions.length > 3 ? allowedActions.slice(3) : [];

  // Calculate fixed position for dropdown menu
  useEffect(() => {
    if (isOpen && buttonRef.current && menuActions.length > 0) {
      requestAnimationFrame(() => {
        if (!buttonRef.current) return;
        
        const buttonRect = buttonRef.current.getBoundingClientRect();
        const viewportHeight = window.innerHeight;
        const viewportWidth = window.innerWidth;
        
        // Menu dimensions
        const menuWidth = 240; // Fixed width from CSS
        const menuItemHeight = 42;
        const menuPadding = 8;
        const estimatedMenuHeight = (menuActions.length * menuItemHeight) + menuPadding;
        
        // Calculate available space
        const spaceBelow = viewportHeight - buttonRect.bottom - 10;
        const spaceAbove = buttonRect.top - 10;
        
        // Decide position
        const shouldShowAbove = spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow;
        
        // Calculate horizontal position (align right edge of menu with button)
        let left = buttonRect.right - menuWidth;
        
        // Make sure menu doesn't go off-screen on the left
        if (left < 10) {
          left = 10;
        }
        
        // Make sure menu doesn't go off-screen on the right
        if (left + menuWidth > viewportWidth - 10) {
          left = viewportWidth - menuWidth - 10;
        }
        
        // Calculate vertical position
        let top;
        if (shouldShowAbove) {
          // Show above: position menu bottom at button top
          top = buttonRect.top - estimatedMenuHeight - 4;
        } else {
          // Show below: position menu top at button bottom
          top = buttonRect.bottom + 4;
        }
        
        setShowAbove(shouldShowAbove);
        setMenuPosition({ top, left });
        
        // Debug log for menu positioning
        console.log({
          buttonRect: { top: buttonRect.top, bottom: buttonRect.bottom, left: buttonRect.left, right: buttonRect.right },
          viewportHeight,
          spaceBelow: Math.round(spaceBelow),
          spaceAbove: Math.round(spaceAbove),
          estimatedMenuHeight,
          shouldShowAbove,
          finalPosition: { top: Math.round(top), left: Math.round(left) }
        });
      });
    }
  }, [isOpen, menuActions.length]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleAction = (action: LeadAction) => {
    setIsOpen(false);
    onAction(action);
  };

  return (
    <div className={styles.container} ref={menuRef}>
      <div className={styles.quickButtons}>
        {quickActions.map((action) => {
          const config = actionConfig[action];
          const Icon = config.icon;
          return (
            <button
              key={action}
              className={`${styles.quickButton} ${config.variant ? styles[`quickButton${config.variant.charAt(0).toUpperCase() + config.variant.slice(1)}`] : ''}`}
              onClick={() => handleAction(action)}
              title={config.label}
            >
              <Icon size={16} />
            </button>
          );
        })}

        {menuActions.length > 0 && (
          <button
            className={styles.menuButton}
            onClick={() => setIsOpen(!isOpen)}
            title="Thêm"
            ref={buttonRef}
          >
            <MoreVertical size={16} />
          </button>
        )}
      </div>

      {isOpen && menuActions.length > 0 && (
        <div className={showAbove ? styles.dropdownAbove : styles.dropdown} style={{ top: menuPosition.top, left: menuPosition.left }}>
          {menuActions.map((action) => {
            const config = actionConfig[action];
            const Icon = config.icon;
            return (
              <button
                key={action}
                className={`${styles.menuItem} ${config.variant ? styles[`menuItem${config.variant.charAt(0).toUpperCase() + config.variant.slice(1)}`] : ''}`}
                onClick={() => handleAction(action)}
              >
                <Icon size={16} />
                <span>{config.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}