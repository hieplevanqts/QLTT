/**
 * DATA TOOLBAR Component
 * Search bar + filters + stats display
 */

import React from 'react';
import { Search } from 'lucide-react';
import styles from './DataToolbar.module.css';

interface DataToolbarProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  searchPlaceholder?: string;
  totalCount: number;
  entityLabel?: string;
  filters?: React.ReactNode;
  actions?: React.ReactNode;
}

export function DataToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder = 'Tìm kiếm...',
  totalCount,
  entityLabel = 'bản ghi',
  filters,
  actions
}: DataToolbarProps) {
  return (
    <div className={styles.toolbar}>
      <div className={styles.toolbarLeft}>
        <div className={styles.searchBox}>
          <Search size={18} className={styles.searchIcon} />
          <input
            type="text"
            placeholder={searchPlaceholder}
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className={styles.searchInput}
          />
        </div>
        {filters && <div>{filters}</div>}
      </div>
      <div className={styles.toolbarRight}>
        {actions}
        <span className={styles.statsText}>
          Tổng: <strong>{totalCount}</strong> {entityLabel}
        </span>
      </div>
    </div>
  );
}
