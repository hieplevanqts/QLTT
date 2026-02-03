/**
 * Dashboard Báo cáo - Reports Dashboard
 */

import React, { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import { KpiCards } from '../components/KpiCards';
import { ActivityTrendChart } from '../components/ActivityTrendChart';
import { mockKpiMetrics } from '../data/mock';
import styles from './DashboardPage.module.css';

export const DashboardPage: React.FC = () => {
  const [period, setPeriod] = useState<'7d' | '30d' | '90d'>('30d');

  const trendData = useMemo(
    () =>
      mockKpiMetrics.map((metric) => ({
        label: metric.label,
        value: metric.value,
        percentage: metric.trend,
      })),
    [],
  );

  return (
    <div className={styles.dashboardPage}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumbs} style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        marginBottom: '20px',
        fontSize: '14px',
        color: '#666',
        padding: '12px 0',
        backgroundColor: 'transparent'
      }}>
        <Link to="/" className={styles.breadcrumbLink} style={{ color: '#666', textDecoration: 'none' }}>Trang chủ</Link>
        <ChevronRight style={{ width: '16px', height: '16px', color: '#ccc', flexShrink: 0 }} />
        <span style={{ color: '#101828', fontWeight: '500' }}>Báo cáo & KPI</span>
        <ChevronRight style={{ width: '16px', height: '16px', color: '#ccc', flexShrink: 0 }} />
        <span style={{ color: '#101828', fontWeight: '500' }}>Dashboard KPI QLTT</span>
      </div>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Dashboard KPI QLTT</h1>
          <p className={styles.subtitle}>
            Tổng hợp chỉ số hoạt động quản lý thị trường
          </p>
        </div>
        <div className={styles.periodSelector}>
          <button
            type="button"
            onClick={() => setPeriod('7d')}
            className={`${styles.periodButton} ${period === '7d' ? styles.periodButtonActive : ''}`}
          >
            7 ngày
          </button>
          <button
            type="button"
            onClick={() => setPeriod('30d')}
            className={`${styles.periodButton} ${period === '30d' ? styles.periodButtonActive : ''}`}
          >
            30 ngày
          </button>
          <button
            type="button"
            onClick={() => setPeriod('90d')}
            className={`${styles.periodButton} ${period === '90d' ? styles.periodButtonActive : ''}`}
          >
            90 ngày
          </button>
        </div>
      </div>

      <KpiCards metrics={mockKpiMetrics} />

      <div className={styles.infoSection}>
        <div className={styles.infoCard}>
          <h3>Xu hướng KPI theo kỳ</h3>
          <p className={styles.infoDescription}>
            Tổng quan biến động các chỉ số KPI trong {period === '7d' ? '7 ngày' : period === '30d' ? '30 ngày' : '90 ngày'} gần nhất.
          </p>
          <ActivityTrendChart data={trendData} />
        </div>
        <div className={styles.infoCard}>
          <h3>Điểm nhấn & khuyến nghị</h3>
          <p className={styles.infoDescription}>
            Các chỉ số cần ưu tiên theo dõi trong kỳ hiện tại.
          </p>
          <ul className={styles.highlightList}>
            {mockKpiMetrics.map((metric) => (
              <li key={metric.id}>
                <strong>{metric.label}:</strong> {metric.value.toLocaleString('vi-VN')} {metric.unit}
              </li>
            ))}
          </ul>
          <ul className={styles.recommendList}>
            <li>Tập trung xử lý các nhiệm vụ quá hạn trong 7 ngày gần nhất.</li>
            <li>Ưu tiên kiểm tra chuyên đề có xu hướng tăng mạnh.</li>
            <li>Duy trì tần suất báo cáo định kỳ để theo dõi hiệu quả.</li>
          </ul>
        </div>
      </div>
    </div>
  );
};
