import React, { useState } from 'react';
import { Filter, RotateCcw, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import styles from './AdvancedFilterBar.module.css';

export interface FilterOption {
  value: string;
  label: string;
}

export interface FilterConfig {
  key: string;
  label: string;
  placeholder: string;
  options: FilterOption[];
  advanced?: boolean; // Whether this is an advanced filter
}

export interface AdvancedFilterBarProps {
  filters: FilterConfig[];
  onFilterChange?: (filters: Record<string, string>) => void;
  onReset?: () => void;
}

export default function AdvancedFilterBar({
  filters,
  onFilterChange,
  onReset,
}: AdvancedFilterBarProps) {
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [showAdvanced, setShowAdvanced] = useState(false);

  const mainFilters = filters.filter(f => !f.advanced);
  const advancedFilters = filters.filter(f => f.advanced);

  const handleChange = (key: string, value: string) => {
    const newFilters = { ...filterValues, [key]: value };
    setFilterValues(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleReset = () => {
    setFilterValues({});
    setShowAdvanced(false);
    onReset?.();
  };

  const activeFiltersCount = Object.values(filterValues).filter(v => v !== '').length;

  return (
    <div className={styles.filterBar}>
      <div className={styles.mainFilters}>
        <Filter size={18} style={{ color: 'var(--primary)', flexShrink: 0 }} />
        
        {mainFilters.map((filter) => (
          <div key={filter.key} className={styles.filterControl}>
            <select
              className={styles.select}
              value={filterValues[filter.key] || ''}
              onChange={(e) => handleChange(filter.key, e.target.value)}
            >
              <option value="">{filter.placeholder}</option>
              {filter.options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>
        ))}

        <div className={styles.filterActions}>
          {advancedFilters.length > 0 && (
            <button
              className={styles.advancedToggle}
              onClick={() => setShowAdvanced(!showAdvanced)}
            >
              Bộ lọc nâng cao
              {activeFiltersCount > 0 && (
                <span className={styles.activeFiltersCount}>
                  {activeFiltersCount}
                </span>
              )}
              {showAdvanced ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
            </button>
          )}
          
          {activeFiltersCount > 0 && (
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
              <RotateCcw size={16} />
              Đặt lại
            </Button>
          )}
        </div>
      </div>

      {/* Advanced Filters Section */}
      {advancedFilters.length > 0 && (
        <div className={showAdvanced ? styles.advancedFilters : styles.advancedFiltersHidden}>
          {advancedFilters.map((filter) => (
            <div key={filter.key}>
              <label className={styles.filterLabel}>{filter.label}</label>
              <select
                className={styles.select}
                value={filterValues[filter.key] || ''}
                onChange={(e) => handleChange(filter.key, e.target.value)}
              >
                <option value="">{filter.placeholder}</option>
                {filter.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
