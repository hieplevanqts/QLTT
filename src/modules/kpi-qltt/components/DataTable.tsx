/**
 * DataTable - Bảng dữ liệu với pagination
 */

import React from 'react';
import { ChevronLeft, ChevronRight, Eye, Download } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Report } from '../data/mock';
import { PaginatedResult } from '../services/reportService';
import styles from './DataTable.module.css';

interface DataTableProps {
  result: PaginatedResult<Report>;
  onPageChange: (page: number) => void;
  onExport?: (report: Report) => void;
}

export const DataTable: React.FC<DataTableProps> = ({ 
  result, 
  onPageChange,
  onExport
}) => {
  const navigate = useNavigate();

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft': return 'Nháp';
      case 'completed': return 'Hoàn thành';
      case 'archived': return 'Lưu trữ';
      default: return status;
    }
  };

  const getStatusClass = (status: string) => {
    switch (status) {
      case 'draft': return styles.statusDraft;
      case 'completed': return styles.statusCompleted;
      case 'archived': return styles.statusArchived;
      default: return '';
    }
  };

  const handleViewDetail = (reportId: string) => {
    navigate(`/kpi/${reportId}`);
  };

  return (
    <div className={styles.tableContainer}>
      <div className={styles.tableWrapper}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Tiêu đề báo cáo</th>
              <th>Mẫu báo cáo</th>
              <th>Địa bàn</th>
              <th>Chuyên đề</th>
              <th>Trạng thái</th>
              <th>Người tạo</th>
              <th>Ngày tạo</th>
              <th>Thao tác</th>
            </tr>
          </thead>
          <tbody>
            {result.data.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.emptyState}>
                  Không tìm thấy báo cáo nào
                </td>
              </tr>
            ) : (
              result.data.map((report) => (
                <tr key={report.id}>
                  <td className={styles.titleCell}>{report.title}</td>
                  <td>{report.templateName}</td>
                  <td>{report.province}</td>
                  <td>{report.topic}</td>
                  <td>
                    <span className={`${styles.statusBadge} ${getStatusClass(report.status)}`}>
                      {getStatusLabel(report.status)}
                    </span>
                  </td>
                  <td>{report.createdBy}</td>
                  <td>{formatDate(report.createdAt)}</td>
                  <td>
                    <div className={styles.actions}>
                      <button
                        onClick={() => handleViewDetail(report.id)}
                        className={styles.actionButton}
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      {onExport && (
                        <button
                          onClick={() => onExport(report)}
                          className={styles.actionButton}
                          title="Xuất CSV"
                        >
                          <Download size={16} />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {result.totalPages > 1 && (
        <div className={styles.pagination}>
          <div className={styles.paginationInfo}>
            Hiển thị {((result.page - 1) * result.pageSize) + 1} - {Math.min(result.page * result.pageSize, result.total)} trong tổng số {result.total} kết quả
          </div>
          <div className={styles.paginationControls}>
            <button
              onClick={() => onPageChange(result.page - 1)}
              disabled={result.page === 1}
              className={styles.paginationButton}
            >
              <ChevronLeft size={18} />
              Trước
            </button>
            <div className={styles.pageNumbers}>
              {Array.from({ length: result.totalPages }, (_, i) => i + 1)
                .filter(page => {
                  // Show first, last, current, and adjacent pages
                  return (
                    page === 1 ||
                    page === result.totalPages ||
                    Math.abs(page - result.page) <= 1
                  );
                })
                .map((page, index, array) => {
                  // Add ellipsis
                  const showEllipsis = index > 0 && page - array[index - 1] > 1;
                  return (
                    <React.Fragment key={page}>
                      {showEllipsis && <span className={styles.ellipsis}>...</span>}
                      <button
                        onClick={() => onPageChange(page)}
                        className={`${styles.pageButton} ${page === result.page ? styles.pageButtonActive : ''}`}
                      >
                        {page}
                      </button>
                    </React.Fragment>
                  );
                })}
            </div>
            <button
              onClick={() => onPageChange(result.page + 1)}
              disabled={result.page === result.totalPages}
              className={styles.paginationButton}
            >
              Sau
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
