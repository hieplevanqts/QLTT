import React, { ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import styles from './QuickActions.module.css';

export interface QuickAction {
  label: string;
  icon: ReactNode;
  onClick: () => void;
  variant?: 'default' | 'outline' | 'secondary';
  permission?: string; // For role-based filtering
}

export interface QuickActionsProps {
  title?: string;
  actions: QuickAction[];
}

export default function QuickActions({
  title = 'Hành động nhanh',
  actions,
}: QuickActionsProps) {
  return (
    <div className={styles.quickActions}>
      <div className={styles.title}>{title}</div>
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
