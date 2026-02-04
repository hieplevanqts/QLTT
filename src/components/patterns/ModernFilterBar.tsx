import React, { useState } from 'react';
import { Filter, RotateCcw, Search } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SearchInput } from '@/components/ui-kit/SearchInput';
import styles from './ModernFilterBar.module.css';

export interface ModernFilterBarProps {
  /** Custom filter fields to display */
  customFilters?: React.ReactNode;
  /** Show search input */
  showSearch?: boolean;
  /** Search placeholder text */
  searchPlaceholder?: string;
  /** Callback when filters change */
  onFilterChange?: (filters: any) => void;
  /** Callback when search changes */
  onSearchChange?: (value: string) => void;
  /** Callback when reset */
  onReset?: () => void;
  /** Show default filters (jurisdiction, topic, timeRange, status) */
  showDefaultFilters?: boolean;
}

export default function ModernFilterBar({
  customFilters,
  showSearch = true,
  searchPlaceholder = 'Tìm kiếm...',
  onFilterChange,
  onSearchChange,
  onReset,
  showDefaultFilters = true,
}: ModernFilterBarProps) {
  const [filters, setFilters] = useState({
    jurisdiction: '',
    topic: '',
    timeRange: '',
    status: '',
  });
  const [searchValue, setSearchValue] = useState('');

  const handleFilterChange = (field: string, value: string) => {
    const newFilters = { ...filters, [field]: value };
    setFilters(newFilters);
    onFilterChange?.(newFilters);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchValue(value);
    onSearchChange?.(value);
  };

  const handleReset = () => {
    const resetFilters = {
      jurisdiction: '',
      topic: '',
      timeRange: '',
      status: '',
    };
    setFilters(resetFilters);
    setSearchValue('');
    onReset?.();
    onFilterChange?.(resetFilters);
    onSearchChange?.('');
  };

  const hasActiveFilters =
    filters.jurisdiction || filters.topic || filters.timeRange || filters.status || searchValue;

  return (
    <div className={styles.filterBarContainer}>
      <div className={styles.filterBarIcon}>
        <Filter size={18} />
      </div>

      <div className={styles.filterBarContent}>
        {/* Filters Section */}
        <div className={styles.filtersGrid}>
          {showDefaultFilters && (
            <>
              {/* Địa bàn */}
              <div className={styles.filterItem}>
                <Select
                  value={filters.jurisdiction}
                  onValueChange={(value) => handleFilterChange('jurisdiction', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả địa bàn" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả địa bàn</SelectItem>
                    <SelectItem value="q1">Phường 1</SelectItem>
                    <SelectItem value="q3">Phường 3</SelectItem>
                    <SelectItem value="q5">Phường 5</SelectItem>
                    <SelectItem value="q10">Phường 10</SelectItem>
                    <SelectItem value="binhthanh">Bình Thạnh</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Chuyên đề */}
              <div className={styles.filterItem}>
                <Select
                  value={filters.topic}
                  onValueChange={(value) => handleFilterChange('topic', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả chuyên đề" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả chuyên đề</SelectItem>
                    <SelectItem value="food">An toàn thực phẩm</SelectItem>
                    <SelectItem value="cosmetics">Mỹ phẩm</SelectItem>
                    <SelectItem value="quality">Chất lượng hàng hóa</SelectItem>
                    <SelectItem value="price">Giá cả</SelectItem>
                    <SelectItem value="fake">Hàng giả</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Thời gian */}
              <div className={styles.filterItem}>
                <Select
                  value={filters.timeRange}
                  onValueChange={(value) => handleFilterChange('timeRange', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả thời gian" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả thời gian</SelectItem>
                    <SelectItem value="today">Hôm nay</SelectItem>
                    <SelectItem value="week">Tuần này</SelectItem>
                    <SelectItem value="month">Tháng này</SelectItem>
                    <SelectItem value="quarter">Quý này</SelectItem>
                    <SelectItem value="year">Năm nay</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Trạng thái */}
              <div className={styles.filterItem}>
                <Select
                  value={filters.status}
                  onValueChange={(value) => handleFilterChange('status', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Tất cả trạng thái" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Tất cả trạng thái</SelectItem>
                    <SelectItem value="draft">Nháp</SelectItem>
                    <SelectItem value="pending">Chờ xử lý</SelectItem>
                    <SelectItem value="active">Đang hoạt động</SelectItem>
                    <SelectItem value="completed">Hoàn thành</SelectItem>
                    <SelectItem value="overdue">Quá hạn</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          {/* Custom filters */}
          {customFilters}
        </div>

        {/* Search & Actions Row */}
        <div className={styles.searchActionsRow}>
          {/* Search */}
          {showSearch && (
            <div className={styles.searchContainer}>
              <SearchInput
                placeholder={searchPlaceholder}
                value={searchValue}
                onChange={handleSearchChange}
              />
            </div>
          )}

          {/* Reset Button */}
          {hasActiveFilters && (
            <Button variant="ghost" size="sm" onClick={handleReset} className="gap-2">
              <RotateCcw size={16} />
              Đặt lại
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
