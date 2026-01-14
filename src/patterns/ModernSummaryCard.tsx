import React from 'react';
import { LucideIcon } from 'lucide-react';
import styles from './ModernSummaryCard.module.css';

interface ModernSummaryCardProps {
  label: string;
  value: number | string;
  icon: LucideIcon;
  variant?: 'primary' | 'warning' | 'success' | 'neutral' | 'info';
  active?: boolean;
  onClick?: () => void;
}

export default function ModernSummaryCard({
  label,
  value,
  icon: Icon,
  variant = 'primary',
  active = false,
  onClick,
}: ModernSummaryCardProps) {
  return (
    <button
      className={`${styles.card} ${styles[variant]} ${active ? styles.active : ''}`}
      onClick={onClick}
      type="button"
    >
      <div className={styles.iconWrapper}>
        <div className={styles.iconCircle}>
          <Icon className={styles.icon} size={20} strokeWidth={2} />
        </div>
      </div>
      
      <div className={styles.content}>
        <div className={styles.value}>{value}</div>
        <div className={styles.label}>{label}</div>
      </div>
    </button>
  );
}
