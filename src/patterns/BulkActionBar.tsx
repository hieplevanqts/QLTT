import React from 'react';
import { Button } from '../app/components/ui/button';
import styles from './BulkActionBar.module.css';

export interface BulkAction {
  label: string;
  onClick: () => void;
  variant?: 'default' | 'secondary' | 'destructive' | 'outline';
  icon?: React.ReactNode;
}

export interface BulkActionBarProps {
  selectedCount: number;
  actions: BulkAction[];
  onClear: () => void;
}

export default function BulkActionBar({
  selectedCount,
  actions,
  onClear,
}: BulkActionBarProps) {
  if (selectedCount === 0) return null;

  return (
    <div className={styles.bulkActionBar}>
      <div className={styles.selectionInfo}>
        <span className={styles.selectionText}>
          Đã chọn <strong>{selectedCount}</strong>
        </span>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className={styles.clearButton}
        >
          Bỏ chọn
        </Button>
      </div>
      
      <div className={styles.actions}>
        {actions.map((action, index) => (
          <Button
            key={index}
            variant={action.variant || 'outline'}
            size="sm"
            onClick={action.onClick}
            className={styles.actionButton}
          >
            {action.icon}
            {action.label}
          </Button>
        ))}
      </div>
    </div>
  );
}