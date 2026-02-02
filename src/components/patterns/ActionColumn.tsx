import React from 'react';
import {
  Eye,
  SquarePen,
  Trash2,
  TriangleAlert,
  UserCog,
  CirclePause,
  CirclePlay,
  FileText,
  History,
  CheckCircle2,
  XCircle,
  EllipsisVertical,
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import styles from './ActionColumn.module.css';

/**
 * Action interface - Defines a single action
 */
export interface Action {
  label: string;
  icon?: React.ReactNode;
  onClick: () => void;
  variant?: 'default' | 'destructive';
  separator?: boolean; // Add separator before this action in menu
  disabled?: boolean;
  priority?: number; // Higher = more important (for sorting when > 4 actions)
}

/**
 * ActionColumn Props
 * 
 * ⚠️ QLTT STANDARD RULES:
 * - If total actions ≤ 4: Show all as icon buttons with tooltips
 * - If total actions > 4: Show top 3 priority icons + ellipsis menu with the rest
 * - Never show more than 3 icons + 1 ellipsis button
 */
export interface ActionColumnProps {
  actions: Action[]; // All available actions
  variant?: 'default' | 'dots'; // 'default' = icons+menu, 'dots' = menu only
  className?: string;
  style?: React.CSSProperties;
}

/**
 * CommonActions - Predefined actions with Vietnamese labels
 * Priority levels: 1-10 (10 = highest priority)
 */
export const CommonActions = {
  view: (onClick: () => void): Action => ({
    label: 'Xem chi tiết',
    icon: <Eye size={16} />,
    onClick,
    priority: 10, // Most important - always visible
  }),
  edit: (onClick: () => void): Action => ({
    label: 'Chỉnh sửa',
    icon: <SquarePen size={16} />,
    onClick,
    priority: 9,
  }),
  assignRisk: (onClick: () => void): Action => ({
    label: 'Phân loại rủi ro',
    icon: <TriangleAlert size={16} />,
    onClick,
    priority: 8,
  }),
  assignInspector: (onClick: () => void): Action => ({
    label: 'Phân công thanh tra',
    icon: <UserCog size={16} />,
    onClick,
    priority: 7,
  }),
  viewDocs: (onClick: () => void): Action => ({
    label: 'Xem hồ sơ',
    icon: <FileText size={16} />,
    onClick,
    priority: 6,
  }),
  viewHistory: (onClick: () => void): Action => ({
    label: 'Lịch sử kiểm tra',
    icon: <History size={16} />,
    onClick,
    priority: 5,
  }),
  viewViolations: (onClick: () => void): Action => ({
    label: 'Vi phạm & xử lý',
    icon: <TriangleAlert size={16} />,
    onClick,
    priority: 6,
  }),
  viewLegal: (onClick: () => void): Action => ({
    label: 'Hồ sơ pháp lý',
    icon: <FileText size={16} />,
    onClick,
    priority: 5,
  }),
  resume: (onClick: () => void): Action => ({
    label: 'Kích hoạt lại',
    icon: <CirclePlay size={16} />,
    onClick,
    priority: 4,
  }),
  pause: (onClick: () => void): Action => ({
    label: 'Tạm dừng',
    icon: <CirclePause size={16} />,
    onClick,
    priority: 3, // Lower priority - potentially dangerous
  }),
  approve: (onClick: () => void): Action => ({
    label: 'Phê duyệt',
    icon: <CheckCircle2 size={16} />,
    onClick,
    priority: 8, // High priority for pending approvals
  }),
  reject: (onClick: () => void): Action => ({
    label: 'Từ chối',
    icon: <XCircle size={16} />,
    onClick,
    variant: 'destructive' as const,
    priority: 8, // Same priority as approve so it can surface in top actions for pending rows
  }),
  delete: (onClick: () => void): Action => ({
    label: 'Xóa',
    icon: <Trash2 size={16} />,
    onClick,
    variant: 'destructive' as const,
    priority: 2, // Low priority - dangerous action
  }),
};

/**
 * ActionColumn Component
 * 
 * ⚠️ QLTT GOVERNMENT STANDARD:
 * - ≤ 4 actions: Show all as icon buttons
 * - > 4 actions: Show top 3 priority + ellipsis menu
 * 
 * @example
 * ```tsx
 * <ActionColumn
 *   actions={[
 *     CommonActions.view(() => handleView(item)),
 *     CommonActions.edit(() => handleEdit(item)),
 *     CommonActions.delete(() => handleDelete(item)),
 *   ]}
 * />
 * ```
 */
export default function ActionColumn({ actions, variant = 'default', className, style }: ActionColumnProps) {
  const totalActions = actions.length;

  // Rule: If variant is 'dots', show only ellipsis menu regardless of action count
  if (variant === 'dots') {
    return (
      <div className={`${styles.actionColumn} ${className || ''}`} style={style}>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
                variant="ghost" 
                size="sm" 
                className={styles.iconButton}
                onClick={(e) => e.stopPropagation()}
            >
              <EllipsisVertical size={16} />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            {(() => {
              // Ensure destructive actions (e.g., delete) appear at the bottom of the menu
              const menuList = [...actions].sort((a, b) => {
                const da = a.variant === 'destructive' ? 1 : 0;
                const db = b.variant === 'destructive' ? 1 : 0;
                return da - db; // non-destructive first, destructive last
              });

              return menuList.map((action, index) => (
                <div key={index} className={styles.actionWrapper}>
                  {action.separator && <DropdownMenuSeparator />}
                  <DropdownMenuItem
                    onClick={(e) => {
                      e.stopPropagation();
                      action.onClick();
                    }}
                    disabled={action.disabled}
                    className={action.variant === 'destructive' ? styles.destructiveAction : ''}
                  >
                    {action.icon}
                    <span className={styles.actionLabel}>{action.label}</span>
                  </DropdownMenuItem>
                </div>
              ));
            })()}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  // QLTT Rule: If ≤ 4 actions, show all as icon buttons
  if (totalActions <= 4) {
    return (
      <div className={`${styles.actionColumn} ${className || ''}`} style={style}>
        {actions.map((action, index) => (
          <Tooltip key={index}>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick();
                }}
                disabled={action.disabled}
                className={`${styles.iconButton} ${action.variant === 'destructive' ? styles.destructiveIcon : ''}`}
              >
                {action.icon}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {action.label}
            </TooltipContent>
          </Tooltip>
        ))}
      </div>
    );
  }

  // QLTT Rule: If > 4 actions, show top 3 priority + ellipsis menu
  // Sort by priority (highest first)
  const sortedActions = [...actions].sort((a, b) => {
    const priorityA = a.priority ?? 0;
    const priorityB = b.priority ?? 0;
    return priorityB - priorityA;
  });

  // Top 3 highest priority actions shown as icons
  const topActions = sortedActions.slice(0, 3);
  
  // Remaining actions go to ellipsis menu
  const menuActions = sortedActions.slice(3);

  return (
    <div className={`${styles.actionColumn} ${className || ''}`} style={style}>
      {/* Top 3 priority actions as icon buttons */}
      {topActions.map((action, index) => (
        <Tooltip key={index}>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                action.onClick();
              }}
              disabled={action.disabled}
              className={`${styles.iconButton} ${action.variant === 'destructive' ? styles.destructiveIcon : ''}`}
            >
              {action.icon}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            {action.label}
          </TooltipContent>
        </Tooltip>
      ))}

      {/* Ellipsis menu for remaining actions */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            size="sm" 
            className={styles.iconButton}
            onClick={(e) => e.stopPropagation()}
          >
            <EllipsisVertical size={16} />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          {(() => {
            // Place destructive actions (delete) at the bottom of the menu
            const sortedMenu = [...menuActions].sort((a, b) => {
              const da = a.variant === 'destructive' ? 1 : 0;
              const db = b.variant === 'destructive' ? 1 : 0;
              return da - db;
            });

            return sortedMenu.map((action, index) => (
              <div key={index} className={styles.actionWrapper}>
                {action.separator && <DropdownMenuSeparator />}
                <DropdownMenuItem
                  onClick={(e) => {
                    e.stopPropagation();
                    action.onClick();
                  }}
                  disabled={action.disabled}
                  className={action.variant === 'destructive' ? styles.destructiveAction : ''}
                >
                  {action.icon}
                  <span className={styles.actionLabel}>{action.label}</span>
                </DropdownMenuItem>
              </div>
            ));
          })()}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
