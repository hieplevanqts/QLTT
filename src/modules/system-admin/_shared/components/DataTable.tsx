/**
 * DATA TABLE Component
 * Styled table with pagination support
 */

import React from 'react';
import styles from './DataTable.module.css';

interface Column<T> {
  header: string;
  accessor?: keyof T;
  render?: (item: T) => React.ReactNode;
  width?: string;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  keyExtractor: (item: T) => string;
  emptyMessage?: React.ReactNode;
}

export function DataTable<T>({
  columns,
  data,
  keyExtractor,
  emptyMessage = 'Không có dữ liệu'
}: DataTableProps<T>) {
  if (data.length === 0 && emptyMessage) {
    return <div style={{ padding: '40px', textAlign: 'center', color: 'var(--muted-foreground)' }}>{emptyMessage}</div>;
  }

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            {columns.map((col, idx) => (
              <th key={idx} style={col.width ? { width: col.width } : undefined}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={keyExtractor(item)}>
              {columns.map((col, idx) => (
                <td key={idx}>
                  {col.render ? col.render(item) : col.accessor ? String(item[col.accessor]) : null}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  return (
    <div className={styles.pagination}>
      <button
        className={styles.paginationButton}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        Trước
      </button>
      <span className={styles.paginationInfo}>
        Trang {currentPage} / {totalPages}
      </span>
      <button
        className={styles.paginationButton}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        Sau
      </button>
    </div>
  );
}

// Export utility classes for cell styling
export const cellStyles = {
  code: styles.codeCell,
  name: styles.nameCell,
  muted: styles.mutedCell,
  actions: styles.actionsCell,
  actionButton: styles.actionButton,
  actionButtonDanger: styles.actionButtonDanger,
  iconButton: styles.iconButton,
  iconButtonDanger: styles.iconButtonDanger
};