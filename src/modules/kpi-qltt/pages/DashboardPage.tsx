/**
 * DashboardPage - Trang Dashboard KPI
 */

import React, { useState, useEffect } from 'react';
import { KpiCards } from '../components/KpiCards';
import { reportService } from '../services/reportService';
import { KpiMetric } from '../data/mock';
import styles from './DashboardPage.module.css';

export const DashboardPage: React.FC = () => {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('7d');
  const [metrics, setMetrics] = useState<KpiMetric[]>([]);

  useEffect(() => {
    // Load KPI metrics
    const data = reportService.getKpiMetrics(period);
    setMetrics(data);
  }, [period]);

  const getPeriodLabel = (p: string) => {
    switch (p) {
      case '7d': return '7 ngày';
      case '30d': return '30 ngày';
      case '90d': return '90 ngày';
      default: return p;
    }
  };

  return (
    <div className={styles.dashboardPage}>
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard KPI QLTT</h1>
          <p className={styles.subtitle}>
            Tổng quan các chỉ số hoạt động quản lý thị trường
          </p>
        </div>
        
        <div className={styles.periodSelector}>
          {(['7d', '30d', '90d'] as const).map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`${styles.periodButton} ${period === p ? styles.periodButtonActive : ''}`}
            >
              {getPeriodLabel(p)}
            </button>
          ))}
        </div>
      </div>

      <KpiCards metrics={metrics} />

      <div className={styles.infoSection}>
        <div className={styles.infoCard}>
          <h3>Xu hướng hoạt động</h3>
          <p>
            Trong {getPeriodLabel(period).toLowerCase()} qua, hoạt động quản lý thị trường 
            có xu hướng tích cực với sự gia tăng về số lượng cơ sở được quản lý và 
            giảm số lượng vi phạm phát hiện.
          </p>
          <ul className={styles.highlightList}>
            <li>Tăng trưởng số cơ sở: <strong>+5.2%</strong></li>
            <li>Giảm vi phạm: <strong>-8.5%</strong></li>
            <li>Tăng hiệu quả thu phạt: <strong>+12.3%</strong></li>
          </ul>
        </div>

        <div className={styles.infoCard}>
          <h3>Khuyến nghị</h3>
          <ul className={styles.recommendList}>
            <li>Tiếp tục tăng cường kiểm tra các cơ sở kinh doanh mới</li>
            <li>Duy trì xu hướng giảm vi phạm qua công tác tuyên truyền</li>
            <li>Theo dõi sát sao các địa bàn trọng điểm</li>
            <li>Chuẩn bị báo cáo định kỳ cho tháng tiếp theo</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
