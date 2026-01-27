/**
 * STATUS BADGE Component
 * Reusable status badge with predefined styles
 */

import React from 'react';
import styles from './StatusBadge.module.css';

export type BadgeVariant = 'active' | 'inactive' | 'pending' | 'error';

interface StatusBadgeProps {
  variant: BadgeVariant;
  children: React.ReactNode;
  className?: string;
}

const variantClassMap: Record<BadgeVariant, string> = {
  active: styles.statusActive,
  inactive: styles.statusInactive,
  pending: styles.statusPending,
  error: styles.statusError
};

export function StatusBadge({ variant, children, className }: StatusBadgeProps) {
  const variantClass = variantClassMap[variant] || styles.statusBadge;
  const finalClassName = className ? `${variantClass} ${className}` : variantClass;

  return <span className={finalClassName}>{children}</span>;
}
