import React from 'react';
import { LucideIcon } from 'lucide-react';
import styles from './StatCard.module.css';

interface StatCardProps {
  title: string;
  value: string;
  subtitle?: string;
  color?: 'blue' | 'green' | 'red' | 'orange';
  icon?: LucideIcon;
}

export function StatCard({ title, value, subtitle, color = 'blue', icon: Icon }: StatCardProps) {
  return (
    <div className={`${styles.card} ${styles[`color-${color}`]}`}>
      <div className={styles.header}>
        <div className={styles.textGroup}>
          <div className={styles.title}>{title}</div>
          <div className={styles.value}>{value}</div>
        </div>
        {Icon && (
          <div className={styles.iconWrapper}>
            <Icon size={32} strokeWidth={1.5} />
          </div>
        )}
      </div>
      {subtitle && <div className={styles.subtitle}>{subtitle}</div>}
    </div>
  );
}