/**
 * FilterBar - Component filter cho danh sách báo cáo
 */

import React from 'react';
import { Search, Filter } from 'lucide-react';
import { provinces, topics } from '../data/mock';
import styles from './FilterBar.module.css';

export interface FilterValues {
  search: string;
  province: string;
  topic: string;
  status: string;
  dateFrom: string;
  dateTo: string;
}

interface FilterBarProps {
  filters: FilterValues;
  onFilterChange: (filters: FilterValues) => void;
  onClearFilters: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({ 
  filters, 
  onFilterChange,
  onClearFilters
}) => {
  const handleChange = (field: keyof FilterValues, value: string) => {
    onFilterChange({ ...filters, [field]: value });
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== '');

  return (
    <div className={styles.filterBar}>
      <div className={styles.filterRow}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm kiếm báo cáo..."
            value={filters.search}
            onChange={(e) => handleChange('search', e.target.value)}
            className={styles.searchInput}
          />
        </div>

        <div className={styles.filterGroup}>
          <select
            value={filters.province}
            onChange={(e) => handleChange('province', e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Tất cả địa bàn</option>
            {provinces.map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>

          <select
            value={filters.topic}
            onChange={(e) => handleChange('topic', e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Tất cả chuyên đề</option>
            {topics.map(t => (
              <option key={t} value={t}>{t}</option>
            ))}
          </select>

          <select
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
            className={styles.filterSelect}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="draft">Nháp</option>
            <option value="completed">Hoàn thành</option>
            <option value="archived">Lưu trữ</option>
          </select>
        </div>
      </div>

      <div className={styles.filterRow}>
        <div className={styles.dateGroup}>
          <label className={styles.dateLabel}>
            Từ ngày:
            <input
              type="date"
              value={filters.dateFrom}
              onChange={(e) => handleChange('dateFrom', e.target.value)}
              className={styles.dateInput}
            />
          </label>
          <label className={styles.dateLabel}>
            Đến ngày:
            <input
              type="date"
              value={filters.dateTo}
              onChange={(e) => handleChange('dateTo', e.target.value)}
              className={styles.dateInput}
            />
          </label>
        </div>

        {hasActiveFilters && (
          <button 
            onClick={onClearFilters}
            className={styles.clearButton}
          >
            <Filter size={16} />
            Xóa bộ lọc
          </button>
        )}
      </div>
    </div>
  );
};
