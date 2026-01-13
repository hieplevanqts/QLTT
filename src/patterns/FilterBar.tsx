import React, { useState } from 'react';
import { Filter, RotateCcw } from 'lucide-react';
import { Button } from '../app/components/ui/button';
import styles from './FilterBar.module.css';

export interface FilterBarProps {
  onFilterChange?: (filters: any) => void;
  onReset?: () => void;
}

export default function FilterBar({ onFilterChange, onReset }: FilterBarProps) {
  const [filters, setFilters] = useState({
    jurisdiction: '',
    topic: '',
    timeRange: '',
    status: '',
  });

  const handleChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleReset = () => {
    const resetFilters = {
      jurisdiction: '',
      topic: '',
      timeRange: '',
      status: '',
    };
    setFilters(resetFilters);
    onReset?.();
  };

  return (
    <div className={styles.filterBar}>
      <div className={styles.filterBarIcon}>
        <Filter size={18} style={{ color: 'var(--primary)' }} />
      </div>
      
      <div className={styles.filterContent}>
        {/* Địa bàn */}
        <div className={styles.filterControl}>
          <label className={styles.filterControlLabel}>Địa bàn</label>
          <select
            className={styles.select}
            value={filters.jurisdiction}
            onChange={(e) => handleChange('jurisdiction', e.target.value)}
          >
            <option value="">Tất cả địa bàn</option>
            <option value="q1">Quận 1</option>
            <option value="q3">Quận 3</option>
            <option value="q5">Quận 5</option>
            <option value="q10">Quận 10</option>
          </select>
        </div>

        {/* Chuyên đề */}
        <div className={styles.filterControl}>
          <label className={styles.filterControlLabel}>Chuyên đề</label>
          <select
            className={styles.select}
            value={filters.topic}
            onChange={(e) => handleChange('topic', e.target.value)}
          >
            <option value="">Tất cả chuyên đề</option>
            <option value="food">An toàn thực phẩm</option>
            <option value="cosmetics">Mỹ phẩm</option>
            <option value="quality">Chất lượng hàng hóa</option>
            <option value="price">Giá cả</option>
          </select>
        </div>

        {/* Thời gian */}
        <div className={styles.filterControl}>
          <label className={styles.filterControlLabel}>Thời gian</label>
          <select
            className={styles.select}
            value={filters.timeRange}
            onChange={(e) => handleChange('timeRange', e.target.value)}
          >
            <option value="">Tất cả thời gian</option>
            <option value="today">Hôm nay</option>
            <option value="week">Tuần này</option>
            <option value="month">Tháng này</option>
            <option value="quarter">Quý này</option>
            <option value="year">Năm nay</option>
          </select>
        </div>

        {/* Trạng thái */}
        <div className={styles.filterControl}>
          <label className={styles.filterControlLabel}>Trạng thái</label>
          <select
            className={styles.select}
            value={filters.status}
            onChange={(e) => handleChange('status', e.target.value)}
          >
            <option value="">Tất cả trạng thái</option>
            <option value="draft">Nháp</option>
            <option value="active">Đang hoạt động</option>
            <option value="pending">Chờ xử lý</option>
            <option value="completed">Hoàn thành</option>
            <option value="overdue">Quá hạn</option>
          </select>
        </div>

        {/* Actions */}
        <div className={styles.filterActions}>
          <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
            <RotateCcw size={16} />
            Đặt lại
          </Button>
        </div>
      </div>
    </div>
  );
}