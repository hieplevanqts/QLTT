import React from 'react';
import { Button } from '@/components/ui/button';
import styles from './FilterActionBar.module.css';

export interface FilterActionBarProps {
  /** Filter components to display on the left */
  filters?: React.ReactNode;
  /** Search input component */
  searchInput?: React.ReactNode;
  /** Action buttons to display on the right */
  actions?: React.ReactNode;
}

/**
 * FilterActionBar Component - Standardized filter and action bar
 * 
 * Following QLTT standards:
 * - Filters and actions on the SAME ROW
 * - Order: Filters (left) → Search → Actions (right)
 * - Compact layout
 * 
 * @example
 * ```tsx
 * <FilterActionBar
 *   filters={
 *     <>
 *       <Select>...</Select>
 *       <Select>...</Select>
 *     </>
 *   }
 *   searchInput={<SearchInput />}
 *   actions={
 *     <>
 *       <Button>Xuất dữ liệu</Button>
 *       <Button>Thêm mới</Button>
 *     </>
 *   }
 * />
 * ```
 */
export default function FilterActionBar({
  filters,
  searchInput,
  actions,
}: FilterActionBarProps) {
  return (
    <div className={styles.filterActionBar}>
      {/* Left: Filters */}
      <div className={styles.filtersSection}>
        {filters}
        {searchInput}
      </div>

      {/* Right: Actions */}
      {actions && (
        <div className={styles.actionsSection}>
          {actions}
        </div>
      )}
    </div>
  );
}
