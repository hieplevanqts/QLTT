import React from 'react';
import { LucideIcon } from 'lucide-react';
import styles from '../DepartmentDetailModal.module.css';

interface DepartmentMetricCardProps {
  icon: LucideIcon;
  value: number | string;
  label: string;
  variant: 'blue' | 'red' | 'purple' | 'yellow' | 'green' | 'orange';
  valueSize?: 'normal' | 'large';
}

export function DepartmentMetricCard({ 
  icon: Icon, 
  value, 
  label, 
  variant,
  valueSize = 'normal'
}: DepartmentMetricCardProps) {
  const cardClass = `${styles.metricCard} ${styles[`metricCard${variant.charAt(0).toUpperCase() + variant.slice(1)}`]}`;
  const iconClass = `${styles.metricIcon} ${styles[`metricIcon${variant.charAt(0).toUpperCase() + variant.slice(1)}`]}`;
  const valueClass = `${styles.metricValue} ${styles[`metricValue${variant.charAt(0).toUpperCase() + variant.slice(1)}`]} ${valueSize === 'large' ? styles.metricValueLarge : ''}`;
  const labelClass = `${styles.metricLabel} ${styles[`metricLabel${variant.charAt(0).toUpperCase() + variant.slice(1)}`]}`;

  return (
    <div className={cardClass}>
      <div className={iconClass}>
        <Icon size={16} color="white" strokeWidth={2.5} />
      </div>
      <div className={valueClass}>
        {value}
      </div>
      <div className={labelClass}>
        {label}
      </div>
    </div>
  );
}
