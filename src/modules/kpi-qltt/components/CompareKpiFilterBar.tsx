/**
 * CompareKpiFilterBar - Bộ lọc cho màn hình so sánh KPI
 */

import React from 'react';
import { CompareFilters, CompareMode, CompareMetric } from '../types';
import { provinces, topics } from '../data/mock';
import styles from './CompareKpiFilterBar.module.css';

interface CompareKpiFilterBarProps {
  filters: CompareFilters;
  onFiltersChange: (filters: CompareFilters) => void;
  onApply: () => void;
}

const periodOptions: { value: CompareFilters['period']; label: string }[] = [
  { value: '7d', label: '7 ngày' },
  { value: '30d', label: '30 ngày' },
  { value: '90d', label: '90 ngày' }
];

const modeOptions: { value: CompareMode; label: string }[] = [
  { value: 'unit', label: 'Theo đơn vị' },
  { value: 'category', label: 'Theo nhóm ngành hàng' }
];

const metricOptions: { value: CompareMetric; label: string }[] = [
  { value: 'leads', label: 'Nguồn tin' },
  { value: 'tasks', label: 'Nhiệm vụ' },
  { value: 'overdue', label: 'Quá hạn' },
  { value: 'violations', label: 'Vi phạm / Biên bản' },
  { value: 'hotspots', label: 'Điểm nóng' }
];

export function CompareKpiFilterBar({ filters, onFiltersChange, onApply }: CompareKpiFilterBarProps) {
  const handlePeriodChange = (period: CompareFilters['period']) => {
    onFiltersChange({ ...filters, period });
  };

  const handleModeChange = (mode: CompareMode) => {
    onFiltersChange({ ...filters, mode });
  };

  const handleFieldChange = (field: keyof CompareFilters, value: string) => {
    onFiltersChange({ ...filters, [field]: value || undefined });
  };

  return (
    <div className={styles.filterBar}>
      {/* Period Selection */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Khoảng thời gian</label>
        <div className={styles.periodTabs}>
          {periodOptions.map(option => (
            <button
              key={option.value}
              className={`${styles.periodTab} ${filters.period === option.value ? styles.active : ''}`}
              onClick={() => handlePeriodChange(option.value)}
              type="button"
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Mode Selection */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel}>Chế độ so sánh</label>
        <div className={styles.modeRadios}>
          {modeOptions.map(option => (
            <label key={option.value} className={styles.radioLabel}>
              <input
                type="radio"
                name="mode"
                value={option.value}
                checked={filters.mode === option.value}
                onChange={(e) => handleModeChange(e.target.value as CompareMode)}
                className={styles.radioInput}
              />
              <span>{option.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Province Filter */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="province-select">Địa bàn</label>
        <select
          id="province-select"
          value={filters.province || ''}
          onChange={(e) => handleFieldChange('province', e.target.value)}
          className={styles.select}
        >
          <option value="">Tất cả</option>
          {provinces.map(province => (
            <option key={province} value={province}>{province}</option>
          ))}
        </select>
      </div>

      {/* Topic Filter */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="topic-select">Chuyên đề</label>
        <select
          id="topic-select"
          value={filters.topic || ''}
          onChange={(e) => handleFieldChange('topic', e.target.value)}
          className={styles.select}
        >
          <option value="">Tất cả</option>
          {topics.map(topic => (
            <option key={topic} value={topic}>{topic}</option>
          ))}
        </select>
      </div>

      {/* Metric Selection */}
      <div className={styles.filterGroup}>
        <label className={styles.filterLabel} htmlFor="metric-select">KPI Metric</label>
        <select
          id="metric-select"
          value={filters.metric}
          onChange={(e) => handleFieldChange('metric', e.target.value)}
          className={styles.select}
        >
          {metricOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
      </div>

      {/* Apply Button */}
      <div className={styles.filterGroup}>
        <button onClick={onApply} className={styles.applyButton} type="button">
          Áp dụng
        </button>
      </div>
    </div>
  );
}