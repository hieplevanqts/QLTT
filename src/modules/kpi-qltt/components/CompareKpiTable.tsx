/**
 * CompareKpiTable - Bảng so sánh KPI
 */

import React, { useState, useMemo } from 'react';
import { CompareRow, CompareFilters } from '../types';
import { CompareMiniBars } from './CompareMiniBars';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';
import styles from './CompareKpiTable.module.css';

interface CompareKpiTableProps {
  rows: CompareRow[];
  filters: CompareFilters;
}

type SortField = 'name' | 'leads' | 'tasks' | 'overdue' | 'violations' | 'hotspots' | 'total' | 'trend' | 'deviation';
type SortDirection = 'asc' | 'desc';

export function CompareKpiTable({ rows, filters }: CompareKpiTableProps) {
  const [search, setSearch] = useState('');
  const [sortField, setSortField] = useState<SortField>('total');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');

  // Filter rows by search
  const filteredRows = useMemo(() => {
    if (!search) return rows;
    const searchLower = search.toLowerCase();
    return rows.filter(row => row.name.toLowerCase().includes(searchLower));
  }, [rows, search]);

  // Sort rows
  const sortedRows = useMemo(() => {
    const sorted = [...filteredRows];
    sorted.sort((a, b) => {
      const aVal = a[sortField];
      const bVal = b[sortField];
      
      let comparison = 0;
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        comparison = aVal.localeCompare(bVal, 'vi');
      } else {
        comparison = (aVal as number) - (bVal as number);
      }
      
      return sortDirection === 'asc' ? comparison : -comparison;
    });
    return sorted;
  }, [filteredRows, sortField, sortDirection]);

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('desc');
    }
  };

  const SortIcon = ({ field }: { field: SortField }) => {
    if (sortField !== field) return <ArrowUpDown className={styles.sortIcon} size={14} />;
    return sortDirection === 'asc' ? 
      <ArrowUp className={styles.sortIcon} size={14} /> : 
      <ArrowDown className={styles.sortIcon} size={14} />;
  };

  const maxTotal = Math.max(...sortedRows.map(r => r.total), 1);

  if (rows.length === 0) {
    return (
      <div className={styles.emptyState}>
        <p>Không có dữ liệu phù hợp với bộ lọc.</p>
      </div>
    );
  }

  return (
    <div className={styles.tableContainer}>
      {/* Search */}
      <div className={styles.searchBar}>
        <input
          type="text"
          placeholder="Tìm kiếm..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className={styles.searchInput}
        />
        <span className={styles.resultCount}>
          Hiển thị {sortedRows.length} / {rows.length} kết quả
        </span>
      </div>

      {/* Table */}
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th onClick={() => handleSort('name')} className={styles.sortable}>
                {filters.mode === 'unit' ? 'Đơn vị' : 'Nhóm ngành hàng'}
                <SortIcon field="name" />
              </th>
              <th onClick={() => handleSort('leads')} className={styles.sortable}>
                Nguồn tin
                <SortIcon field="leads" />
              </th>
              <th onClick={() => handleSort('tasks')} className={styles.sortable}>
                Nhiệm vụ
                <SortIcon field="tasks" />
              </th>
              <th onClick={() => handleSort('overdue')} className={styles.sortable}>
                Quá hạn
                <SortIcon field="overdue" />
              </th>
              <th onClick={() => handleSort('violations')} className={styles.sortable}>
                Vi phạm
                <SortIcon field="violations" />
              </th>
              <th onClick={() => handleSort('hotspots')} className={styles.sortable}>
                Điểm nóng
                <SortIcon field="hotspots" />
              </th>
              <th onClick={() => handleSort('total')} className={styles.sortable}>
                Tổng
                <SortIcon field="total" />
              </th>
              <th onClick={() => handleSort('trend')} className={styles.sortable}>
                Xu hướng
                <SortIcon field="trend" />
              </th>
              <th onClick={() => handleSort('deviation')} className={styles.sortable}>
                Chênh lệch
                <SortIcon field="deviation" />
              </th>
            </tr>
          </thead>
          <tbody>
            {sortedRows.map((row) => (
              <tr key={row.id}>
                <td className={styles.nameCell}>{row.name}</td>
                <td className={styles.numberCell}>{row.leads.toLocaleString()}</td>
                <td className={styles.numberCell}>{row.tasks.toLocaleString()}</td>
                <td className={styles.numberCell}>{row.overdue.toLocaleString()}</td>
                <td className={styles.numberCell}>{row.violations.toLocaleString()}</td>
                <td className={styles.numberCell}>{row.hotspots.toLocaleString()}</td>
                <td className={styles.numberCell}>
                  <strong>{row.total.toLocaleString()}</strong>
                </td>
                <td className={styles.trendCell}>
                  <CompareMiniBars value={row.total} max={maxTotal} trend={row.trend} />
                </td>
                <td className={`${styles.numberCell} ${row.deviation >= 0 ? styles.positive : styles.negative}`}>
                  {row.deviation >= 0 ? '+' : ''}{row.deviation.toFixed(1)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
