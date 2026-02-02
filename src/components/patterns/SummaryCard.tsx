import React, { ReactNode } from 'react';
import { LucideIcon } from 'lucide-react';
import styles from './SummaryCard.module.css';

export interface SummaryCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  variant?: 'success' | 'warning' | 'danger' | 'info' | 'neutral';
  trend?: {
    value: string;
    direction: 'up' | 'down';
  };
  active?: boolean;
  onClick?: () => void;
}

export default function SummaryCard({
  label,
  value,
  icon: Icon,
  variant = 'info',
  trend,
  active = false,
  onClick,
}: SummaryCardProps) {
  return (
    <div
      className={`${styles.summaryCard} ${active ? styles.active : ''}`}
      onClick={onClick}
    >
      <div className={styles.header}>
        <div className={`${styles.iconWrapper} ${styles[variant]}`}>
          <Icon size={20} />
        </div>
        <div className={styles.content}>
          <div className={styles.label}>{label}</div>
          <div className={styles.value}>{value}</div>
          {trend && (
            <div className={`${styles.trend} ${trend.direction === 'up' ? styles.positive : styles.negative}`}>
              {trend.direction === 'up' ? '↑' : '↓'} {trend.value}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
