/**
 * CompareKpiPage - Màn hình so sánh KPI
 */

import React, { useState, useEffect } from 'react';
import { Download } from 'lucide-react';
import { CompareFilters, CompareRow } from '../types';
import { reportService } from '../services/reportService';
import { CompareKpiFilterBar } from '../components/CompareKpiFilterBar';
import { CompareKpiTable } from '../components/CompareKpiTable';
import styles from './CompareKpiPage.module.css';

export function CompareKpiPage() {
  const [filters, setFilters] = useState<CompareFilters>({
    period: '30d',
    mode: 'unit',
    metric: 'violations'
  });

  const [rows, setRows] = useState<CompareRow[]>([]);
  const [loading, setLoading] = useState(true);

  const loadData = () => {
    setLoading(true);
    
    // Use requestAnimationFrame to defer execution
    requestAnimationFrame(() => {
      try {
        const data = filters.mode === 'unit' 
          ? reportService.getCompareByUnit(filters)
          : reportService.getCompareByCategory(filters);
        
        setRows(data);
        setLoading(false);
      } catch (error) {
        console.error('Error loading compare data:', error);
        setRows([]);
        setLoading(false);
      }
    });
  };

  useEffect(() => {
    loadData();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Load initial data

  const handleApply = () => {
    loadData();
  };

  const handleExport = () => {
    try {
      const blob = reportService.exportCompareToCSV(rows, filters);
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `so-sanh-kpi-${filters.mode}-${filters.period}-${Date.now()}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting CSV:', error);
      alert('Có lỗi khi xuất CSV');
    }
  };

  return (
    <div className={styles.page}>
      {/* Header */}
      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>So sánh KPI</h1>
          <p className={styles.description}>
            So sánh theo đơn vị QLTT hoặc theo nhóm ngành hàng trong khoảng thời gian chọn.
          </p>
        </div>
        
        <button 
          onClick={handleExport} 
          className={styles.exportButton}
          disabled={rows.length === 0}
          type="button"
        >
          <Download size={16} />
          Tải CSV
        </button>
      </div>

      {/* Filter Bar */}
      <CompareKpiFilterBar
        filters={filters}
        onFiltersChange={setFilters}
        onApply={handleApply}
      />

      {/* Loading State */}
      {loading && (
        <div className={styles.loading}>
          <div className={styles.spinner} />
          <p>Đang tải dữ liệu...</p>
        </div>
      )}

      {/* Results */}
      {!loading && (
        <CompareKpiTable rows={rows} filters={filters} />
      )}
    </div>
  );
}
