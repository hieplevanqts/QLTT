import React, { useState, useEffect } from 'react';
import { X, Filter } from 'lucide-react';
import DateRangePicker, { DateRange } from './DateRangePicker';
import InfiniteScrollSelect, { InfiniteScrollSelectOption } from './InfiniteScrollSelect';
import styles from './AdvancedFilterModal.module.css';

export interface FilterConfig {
  key: string;
  label: string;
  type: 'text' | 'select' | 'daterange' | 'multiselect' | 'infinite-scroll-select';
  options?: { value: string; label: string; subtitle?: string }[];
  placeholder?: string;
  // For infinite-scroll-select
  hasMore?: boolean;
  isLoading?: boolean;
  onLoadMore?: () => void;
}

interface AdvancedFilterModalProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterConfig[];
  values: Record<string, any>;
  onChange: (values: Record<string, any>) => void;
  onApply: () => void;
  onClear: () => void;
}

export default function AdvancedFilterModal({
  isOpen,
  onClose,
  filters,
  values,
  onChange,
  onApply,
  onClear
}: AdvancedFilterModalProps) {
  // Local state: lưu tạm các thay đổi trong modal
  const [localValues, setLocalValues] = useState(values);

  // Sync localValues với values từ parent khi modal mở
  useEffect(() => {
    if (isOpen) {
      setLocalValues(values);
    }
  }, [isOpen, values]);

  if (!isOpen) return null;

  const handleChange = (key: string, value: any) => {
    // Chỉ update local state, CHƯA update về parent
    setLocalValues(prev => ({ ...prev, [key]: value }));
  };

  const handleApply = () => {
    // Khi click "Áp dụng" → MỚI update về parent
    onChange(localValues);
    onApply();
    onClose();
  };

  const handleClear = () => {
    const clearedValues: Record<string, any> = {};
    filters.forEach(filter => {
      if (filter.type === 'daterange') {
        clearedValues[filter.key] = { startDate: null, endDate: null };
      } else if (filter.type === 'multiselect') {
        clearedValues[filter.key] = [];
      } else {
        clearedValues[filter.key] = 'all';
      }
    });
    // CHỈ xóa local state trong popup, KHÔNG update về parent
    setLocalValues(clearedValues);
    // KHÔNG gọi onChange(clearedValues) - chỉ xóa trong popup thôi
    // KHÔNG gọi onClear() - chỉ xóa trong popup thôi
    // KHÔNG gọi onClose() - giữ popup mở để user có thể tiếp tục chỉnh
  };

  const handleCancel = () => {
    // Khi click "Hủy" → discard local changes, không update về parent
    setLocalValues(values);
    onClose();
  };

  const renderFilterInput = (filter: FilterConfig) => {
    const value = localValues[filter.key];

    switch (filter.type) {
      case 'text':
        return (
          <input
            type="text"
            className={styles.input}
            value={value || ''}
            onChange={(e) => handleChange(filter.key, e.target.value)}
            placeholder={filter.placeholder || `Nhập ${filter.label.toLowerCase()}`}
          />
        );

      case 'select':
        return (
          <select
            className={styles.select}
            value={value || ''}
            onChange={(e) => handleChange(filter.key, e.target.value)}
          >
            <option value="">Tất cả</option>
            {filter.options?.map(opt => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>
        );

      case 'daterange':
        return (
          <div className={styles.dateRangeInputs}>
            <div className={styles.dateInputGroup}>
              <label className={styles.dateLabel}>Từ ngày</label>
              <DateRangePicker
                value={(value as DateRange) || { startDate: null, endDate: null }}
                onChange={(dateRange) => handleChange(filter.key, dateRange)}
              />
            </div>
          </div>
        );

      case 'multiselect':
        return (
          <div className={styles.checkboxGroup}>
            {filter.options?.map(opt => (
              <label key={opt.value} className={styles.checkboxLabel}>
                <input
                  type="checkbox"
                  className={styles.checkbox}
                  checked={(value || []).includes(opt.value)}
                  onChange={(e) => {
                    const currentValues = value || [];
                    const newValues = e.target.checked
                      ? [...currentValues, opt.value]
                      : currentValues.filter((v: string) => v !== opt.value);
                    handleChange(filter.key, newValues);
                  }}
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        );

      case 'infinite-scroll-select':
        return (
          <InfiniteScrollSelect
            value={value || 'all'}
            onChange={(newValue) => handleChange(filter.key, newValue)}
            options={(filter.options || []) as InfiniteScrollSelectOption[]}
            hasMore={filter.hasMore || false}
            loading={filter.isLoading || false}
            onLoadMore={filter.onLoadMore}
            placeholder={filter.placeholder || `Chọn ${filter.label.toLowerCase()}`}
          />
        );

      default:
        return null;
    }
  };

  const activeFilterCount = Object.values(localValues || {}).filter(v => {
    if (Array.isArray(v)) return v.length > 0;
    if (typeof v === 'object' && v !== null) return (v as any).startDate || (v as any).endDate;
    return v && v !== 'all' && v !== '';
  }).length;

  return (
    <div className={styles.overlay} onClick={(e) => {
      // Only close if clicking directly on overlay, not on any child elements
      if (e.target === e.currentTarget) {
        handleCancel();
      }
    }}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <div className={styles.headerLeft}>
            <Filter size={22} style={{ color: 'var(--color-primary)' }} />
            <h2 className={styles.title}>Bộ lọc nâng cao</h2>
            {activeFilterCount > 0 && (
              <span className={styles.badge}>{activeFilterCount}</span>
            )}
          </div>
          <button className={styles.closeButton} onClick={handleCancel}>
            <X size={20} />
          </button>
        </div>

        <div className={styles.content}>
          {filters.map(filter => (
            <div key={filter.key} className={styles.filterItem}>
              <label className={styles.label}>{filter.label}</label>
              {renderFilterInput(filter)}
            </div>
          ))}
        </div>

        <div className={styles.footer}>
          <div className={styles.footerLeft}>
            <button 
              className={styles.clearButton} 
              onClick={handleClear}
              type="button"
            >
              <X size={16} />
              Xóa tất cả
            </button>
          </div>
          <div className={styles.footerRight}>
            <button className={styles.cancelButton} onClick={handleCancel} type="button">
              Hủy
            </button>
            <button className={styles.applyButton} onClick={handleApply} type="button">
              Áp dụng
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}