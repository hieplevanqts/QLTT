/**
 * Danh sách báo cáo - Reports List Page
 */

import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Plus, ChevronRight } from 'lucide-react';
import { FilterBar, FilterValues } from '../components/FilterBar';
import { DataTable } from '../components/DataTable';
import { reportService, PaginatedResult } from '../services/reportService';
import { Report } from '../data/mock';
import styles from './ReportsListPage.module.css';

const initialFilters: FilterValues = {
  search: '',
  province: '',
  topic: '',
  status: '',
  dateFrom: '',
  dateTo: ''
};

export const ReportsListPage: React.FC = () => {
  const navigate = useNavigate();
  const [filters, setFilters] = useState<FilterValues>(initialFilters);
  const [currentPage, setCurrentPage] = useState(1);
  const [result, setResult] = useState<PaginatedResult<Report>>({
    data: [],
    total: 0,
    page: 1,
    pageSize: 10,
    totalPages: 0
  });

  useEffect(() => {
    // Load reports when filters or page change
    const loadReports = () => {
      const searchFilters = {
        search: filters.search,
        province: filters.province,
        topic: filters.topic,
        status: filters.status,
        dateFrom: filters.dateFrom,
        dateTo: filters.dateTo
      };
      
      const data = reportService.getReports(searchFilters, { 
        page: currentPage, 
        pageSize: 10 
      });
      setResult(data);
    };

    loadReports();
  }, [filters, currentPage]);

  const handleFilterChange = (newFilters: FilterValues) => {
    setFilters(newFilters);
    setCurrentPage(1); // Reset to first page when filters change
  };

  const handleClearFilters = () => {
    setFilters(initialFilters);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleExport = (report: Report) => {
    const blob = reportService.exportReportToCSV(report);
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${report.id}_${report.title}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleCreateNew = () => {
    navigate('/kpi/builder');
  };

  return (
    <div className={styles.reportsListPage}>
      {/* Breadcrumb */}
      <div className={styles.breadcrumbs} style={{ 
        display: 'flex', 
        alignItems: 'center', 
        gap: '8px',
        marginBottom: '20px',
        fontSize: '14px',
        color: '#666',
        padding: '12px 0'
      }}>
        <Link to="/" className={styles.breadcrumbLink} style={{ color: '#666', textDecoration: 'none' }}>Trang chủ</Link>
        <ChevronRight style={{ width: '16px', height: '16px', color: '#ccc', flexShrink: 0 }} />
        <span style={{ color: '#101828', fontWeight: '500' }}>Báo cáo & KPI</span>
        <ChevronRight style={{ width: '16px', height: '16px', color: '#ccc', flexShrink: 0 }} />
        <span style={{ color: '#101828', fontWeight: '500' }}>Danh sách báo cáo</span>
      </div>

      <div className={styles.header}>
        <div>
          <h1 className={styles.title}>Danh sách báo cáo</h1>
          <p className={styles.subtitle}>
            Quản lý và theo dõi các báo cáo QLTT
          </p>
        </div>
        
        <button onClick={handleCreateNew} className={styles.createButton}>
          <Plus size={18} />
          Tạo báo cáo mới
        </button>
      </div>

      <FilterBar 
        filters={filters}
        onFilterChange={handleFilterChange}
        onClearFilters={handleClearFilters}
      />

      <DataTable 
        result={result}
        onPageChange={handlePageChange}
        onExport={handleExport}
      />
    </div>
  );
};
