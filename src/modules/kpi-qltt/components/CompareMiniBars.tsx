/**
 * CompareMiniBars - Mini bar chart trong cell
 */

import React from 'react';
import styles from './CompareMiniBars.module.css';

interface CompareMiniBarsProps {
  value: number;
  max: number;
  trend?: number;
}

export function CompareMiniBars({ value, max, trend }: CompareMiniBarsProps) {
  const percentage = max > 0 ? (value / max) * 100 : 0;
  
  return (
    <div className={styles.container}>
      <div className={styles.barWrapper}>
        <div 
          className={styles.bar}
          style={{ width: `${Math.min(100, percentage)}%` }}
        />
      </div>
      {trend !== undefined && (
        <span 
          className={`${styles.trend} ${trend >= 0 ? styles.positive : styles.negative}`}
          title={`Xu hướng: ${trend >= 0 ? '+' : ''}${trend.toFixed(1)}%`}
        >
          {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(0)}%
        </span>
      )}
    </div>
  );
}
