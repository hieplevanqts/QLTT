/**
 * KpiCards - Hiển thị các thẻ KPI với xu hướng
 */

import React from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { MiniTrend } from './MiniTrend';
import { KpiMetric } from '../data/mock';
import styles from './KpiCards.module.css';

interface KpiCardsProps {
  metrics: KpiMetric[];
}

export const KpiCards: React.FC<KpiCardsProps> = ({ metrics }) => {
  const formatNumber = (num: number): string => {
    return new Intl.NumberFormat('vi-VN').format(num);
  };

  return (
    <div className={styles.kpiGrid}>
      {metrics.map((metric) => (
        <div key={metric.id} className={styles.kpiCard}>
          <div className={styles.kpiHeader}>
            <span className={styles.kpiLabel}>{metric.label}</span>
            <div className={styles.kpiTrend} data-positive={metric.trend >= 0}>
              {metric.trend >= 0 ? (
                <TrendingUp size={16} />
              ) : (
                <TrendingDown size={16} />
              )}
              <span className={styles.kpiTrendValue}>
                {metric.trend > 0 ? '+' : ''}{metric.trend.toFixed(1)}%
              </span>
            </div>
          </div>
          
          <div className={styles.kpiValue}>
            {formatNumber(metric.value)}
            <span className={styles.kpiUnit}> {metric.unit}</span>
          </div>

          <div className={styles.kpiChart}>
            <MiniTrend 
              data={metric.trendData} 
              color={metric.color}
              width={120}
              height={32}
            />
          </div>
        </div>
      ))}
    </div>
  );
};
