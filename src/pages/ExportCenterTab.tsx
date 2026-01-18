/**
 * Export Center Tab - MAPPA Portal
 * Tab quản trị "Trung tâm xuất dữ liệu" (Export Center)
 * Theo dõi và audit các export jobs của hệ thống
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect } from 'react';
import {
  Download,
  Search,
  Plus,
  Eye,
  XCircle,
  RefreshCw,
  Loader2,
  CheckCircle,
  AlertCircle,
  Clock,
  FileDown,
  Database,
  TrendingUp,
  Activity,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import styles from './ExportCenterTab.module.css';
import { toast } from 'sonner';
import { Pagination, usePagination } from '../components/Pagination';
import {
  ExportJob,
  SAMPLE_EXPORT_JOBS,
  ExportJobStatus,
  SourceType,
  getStatusBadgeStyle,
  getSourceTypeIcon,
  getSourceTypeLabel,
  getSourceTypeBadgeStyle,
  formatFileSize,
  formatDateTime,
  getRetentionPolicyBadge,
  ALL_EXPORT_STATUSES,
  ALL_SOURCE_TYPES,
} from '../app/data/exportJobsTemplates';
import { ExportJobModal } from '../components/ExportJobModal';
import { ExportJobDrawer } from '../components/ExportJobDrawer';

export const ExportCenterTab: React.FC = () => {
  // Data state
  const [jobs, setJobs] = useState<ExportJob[]>(SAMPLE_EXPORT_JOBS);
  const [loading, setLoading] = useState(false);

  // Modal state (for add mode)
  const [selectedJob, setSelectedJob] = useState<ExportJob | null>(null);
  const [modalMode, setModalMode] = useState<'view' | 'add'>('view');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Drawer state (for view mode)
  const [drawerJob, setDrawerJob] = useState<ExportJob | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Filters
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<ExportJobStatus | 'all'>('all');
  const [filterSourceType, setFilterSourceType] = useState<SourceType | 'all'>('all');
  const [filterRequestedBy, setFilterRequestedBy] = useState<string>('all');
  const [filterDateFrom, setFilterDateFrom] = useState<string>('');
  const [filterDateTo, setFilterDateTo] = useState<string>('');

  // Pagination
  const itemsPerPage = 10;
  
  // Get unique requested_by values for filter
  const uniqueRequestedBy = Array.from(new Set(jobs.map((job) => job.export_jobs_requested_by)));
  
  // Filtered jobs
  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      searchTerm === '' ||
      job.export_jobs_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.export_jobs_source_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.export_jobs_requested_by.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || job.export_jobs_status === filterStatus;
    
    const matchesSourceType =
      filterSourceType === 'all' || job.export_jobs_source_type === filterSourceType;
    
    const matchesRequestedBy =
      filterRequestedBy === 'all' || job.export_jobs_requested_by === filterRequestedBy;
    
    // Date range filter
    let matchesDateRange = true;
    if (filterDateFrom || filterDateTo) {
      const jobDate = new Date(job.export_jobs_requested_at);
      if (filterDateFrom) {
        const fromDate = new Date(filterDateFrom);
        fromDate.setHours(0, 0, 0, 0);
        matchesDateRange = matchesDateRange && jobDate >= fromDate;
      }
      if (filterDateTo) {
        const toDate = new Date(filterDateTo);
        toDate.setHours(23, 59, 59, 999);
        matchesDateRange = matchesDateRange && jobDate <= toDate;
      }
    }
    
    return matchesSearch && matchesStatus && matchesSourceType && matchesRequestedBy && matchesDateRange;
  });
  
  const { currentPage, totalPages, currentItems, setCurrentPage } = usePagination(
    filteredJobs,
    itemsPerPage
  );

  // Handlers
  const handleViewDetails = (job: ExportJob) => {
    setDrawerJob(job);
    setIsDrawerOpen(true);
  };

  const handleDownload = (job: ExportJob) => {
    if (job.export_jobs_file_url) {
      // Increment download count
      setJobs((prev) =>
        prev.map((j) =>
          j.export_jobs_id === job.export_jobs_id
            ? {
                ...j,
                export_jobs_download_count: j.export_jobs_download_count + 1,
                export_jobs_updated_at: new Date().toISOString(),
              }
            : j
        )
      );
      toast.success(`Đang tải xuống: ${job.export_jobs_source_name}`);
    } else {
      toast.error('File chưa sẵn sàng để tải xuống');
    }
  };

  const handleCancel = (jobId: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.export_jobs_id === jobId
          ? {
              ...job,
              export_jobs_status: 'Cancelled' as ExportJobStatus,
              export_jobs_updated_at: new Date().toISOString(),
            }
          : job
      )
    );
    toast.success('Đã hủy công việc export');
  };

  const handleRetry = (jobId: string) => {
    setJobs((prev) =>
      prev.map((job) =>
        job.export_jobs_id === jobId
          ? {
              ...job,
              export_jobs_status: 'Pending' as ExportJobStatus,
              export_jobs_error_message: undefined,
              export_jobs_updated_at: new Date().toISOString(),
            }
          : job
      )
    );
    toast.success('Đã khởi động lại công việc export');
  };

  const handleRefresh = () => {
    setLoading(true);
    setTimeout(() => {
      toast.success('Đã làm mới danh sách');
      setLoading(false);
    }, 500);
  };

  const handleCreateNew = () => {
    setSelectedJob(null);
    setModalMode('add');
    setIsModalOpen(true);
  };

  const handleSaveJob = (data: Partial<ExportJob>) => {
    if (modalMode === 'add') {
      const newJob: ExportJob = {
        export_jobs_id: `EXP_${String(jobs.length + 1).padStart(3, '0')}`,
        export_jobs_source_name: data.export_jobs_source_name || 'Untitled Export',
        export_jobs_source_type: data.export_jobs_source_type || 'REPORT_RUN',
        export_jobs_requested_by: 'Current User (admin@mappa.gov.vn)',
        export_jobs_requested_at: new Date().toISOString(),
        export_jobs_status: 'Pending',
        export_jobs_download_count: 0,
        export_jobs_retention_policy: data.export_jobs_retention_policy || '7 days',
        export_jobs_created_at: new Date().toISOString(),
        export_jobs_updated_at: new Date().toISOString(),
      };
      setJobs((prev) => [newJob, ...prev]);
      toast.success('Đã tạo công việc export mới');
    }
    setIsModalOpen(false);
  };

  // Status icon helper
  const getStatusIcon = (status: ExportJobStatus) => {
    switch (status) {
      case 'Completed':
        return <CheckCircle size={16} style={{ color: '#155724' }} />;
      case 'Processing':
        return <Loader2 size={16} style={{ color: '#856404' }} className="animate-spin" />;
      case 'Pending':
        return <Clock size={16} style={{ color: '#1976d2' }} />;
      case 'Failed':
        return <AlertCircle size={16} style={{ color: '#721c24' }} />;
      case 'Cancelled':
        return <XCircle size={16} style={{ color: '#424242' }} />;
      case 'Expired':
        return <XCircle size={16} style={{ color: '#6b7280' }} />;
      default:
        return null;
    }
  };

  // Accordion state
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());

  const toggleJob = (jobId: string) => {
    setExpandedJobs((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(jobId)) {
        newSet.delete(jobId);
      } else {
        newSet.add(jobId);
      }
      return newSet;
    });
  };

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Download className={styles.headerIcon} />
          <div>
            <h1 className={styles.title}>Trung tâm Xuất dữ liệu</h1>
            <p className={styles.subtitle}>
              Quản lý và theo dõi các công việc export dữ liệu từ hệ thống MAPPA Portal
            </p>
          </div>
        </div>
      </div>

      {/* Filters + Actions Row */}
      <div className={styles.filterActionsRow}>
        <div className={styles.filterGroup}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm kiếm theo Job ID, tên nguồn..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>
        </div>
        <div className={styles.actionGroup}>
          <button onClick={handleRefresh} className={styles.btnSecondary}>
            <RefreshCw size={16} />
            Làm mới
          </button>
          <button onClick={handleCreateNew} className={styles.btnPrimary}>
            <Plus size={16} />
            Tạo Export Mới
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <Database className={styles.statIcon} />
            <span className={styles.statLabel}>Tổng số Jobs</span>
          </div>
          <div className={styles.statValue}>{jobs.length}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <CheckCircle className={styles.statIcon} />
            <span className={styles.statLabel}>Hoàn thành</span>
          </div>
          <div className={styles.statValue}>
            {jobs.filter((j) => j.export_jobs_status === 'Completed').length}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <Activity className={styles.statIcon} />
            <span className={styles.statLabel}>Đang xử lý</span>
          </div>
          <div className={styles.statValue}>
            {jobs.filter((j) => j.export_jobs_status === 'Processing').length}
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <AlertCircle className={styles.statIcon} />
            <span className={styles.statLabel}>Thất bại</span>
          </div>
          <div className={styles.statValue}>
            {jobs.filter((j) => j.export_jobs_status === 'Failed').length}
          </div>
        </div>
      </div>

      {/* Jobs List (Accordion Style) */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.spinner} />
          <p className={styles.loadingText}>Đang tải dữ liệu...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className={styles.emptyState}>
          <Download size={64} />
          <p>Không tìm thấy export job nào</p>
        </div>
      ) : (
        <>
          <div className={styles.modulesList}>
            {currentItems.map((job) => {
              const isExpanded = expandedJobs.has(job.export_jobs_id);
              
              return (
                <div key={job.export_jobs_id} className={styles.moduleCard}>
                  {/* Job Header */}
                  <div className={styles.moduleHeader}>
                    <button
                      className={styles.moduleToggle}
                      onClick={() => toggleJob(job.export_jobs_id)}
                    >
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>
                    
                    <div className={styles.moduleInfo}>
                      <div className={styles.moduleNameRow}>
                        <h3 className={styles.moduleName}>{job.export_jobs_source_name}</h3>
                        <code className={styles.moduleCode}>{job.export_jobs_id}</code>
                      </div>
                      <p className={styles.moduleDescription}>
                        {getSourceTypeLabel(job.export_jobs_source_type)} • {job.export_jobs_requested_by.split('(')[0].trim()}
                      </p>
                    </div>
                    
                    <div className={styles.moduleMeta}>
                      <span
                        className={styles.permissionCount}
                        style={getStatusBadgeStyle(job.export_jobs_status)}
                      >
                        {job.export_jobs_status}
                      </span>
                    </div>
                    
                    <div className={styles.moduleActions}>
                      {/* Download for Completed */}
                      {job.export_jobs_status === 'Completed' && job.export_jobs_file_url && (
                        <button
                          className={styles.btnIconEdit}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(job);
                          }}
                          title="Tải xuống"
                        >
                          <Download size={16} />
                        </button>
                      )}
                      
                      {/* View Details */}
                      <button
                        className={styles.btnIconEdit}
                        onClick={(e) => {
                          e.stopPropagation();
                          handleViewDetails(job);
                        }}
                        title="Xem chi tiết"
                      >
                        <Eye size={16} />
                      </button>
                      
                      {/* Retry for Failed */}
                      {job.export_jobs_status === 'Failed' && (
                        <button
                          className={styles.btnIconDelete}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRetry(job.export_jobs_id);
                          }}
                          title="Thử lại"
                        >
                          <RefreshCw size={16} />
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Job Details (Expanded) */}
                  {isExpanded && (
                    <div className={styles.permissionsTable}>
                      <div className={styles.permissionsTableHeader}>
                        <h4 className={styles.permissionsTableTitle}>Thông tin chi tiết</h4>
                      </div>

                      <table className={styles.table}>
                        <tbody>
                          <tr>
                            <th style={{ width: '200px' }}>Loại nguồn</th>
                            <td>
                              <span style={getSourceTypeBadgeStyle(job.export_jobs_source_type)}>
                                {getSourceTypeLabel(job.export_jobs_source_type)}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <th>Người yêu cầu</th>
                            <td>{job.export_jobs_requested_by}</td>
                          </tr>
                          <tr>
                            <th>Thời gian yêu cầu</th>
                            <td>{formatDateTime(job.export_jobs_requested_at)}</td>
                          </tr>
                          {job.export_jobs_completed_at && (
                            <tr>
                              <th>Thời gian hoàn thành</th>
                              <td>{formatDateTime(job.export_jobs_completed_at)}</td>
                            </tr>
                          )}
                          <tr>
                            <th>Số lần tải xuống</th>
                            <td>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  padding: '4px 12px',
                                  background: job.export_jobs_download_count > 0 ? '#e3f2fd' : 'var(--muted)',
                                  color: job.export_jobs_download_count > 0 ? '#1976d2' : 'var(--muted-foreground)',
                                  borderRadius: '12px',
                                  fontSize: 'var(--text-sm)',
                                  fontWeight: 600,
                                }}
                              >
                                {job.export_jobs_download_count} lần
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <th>Chính sách lưu trữ</th>
                            <td>
                              <span style={getRetentionPolicyBadge(job.export_jobs_retention_policy)}>
                                {job.export_jobs_retention_policy}
                              </span>
                            </td>
                          </tr>
                          {job.export_jobs_file_size && (
                            <tr>
                              <th>Kích thước file</th>
                              <td>{formatFileSize(job.export_jobs_file_size)}</td>
                            </tr>
                          )}
                          {job.export_jobs_error_message && (
                            <tr>
                              <th>Thông báo lỗi</th>
                              <td>
                                <div
                                  style={{
                                    padding: '12px',
                                    background: '#fff3e0',
                                    border: '1px solid #ffb74d',
                                    borderRadius: 'var(--radius)',
                                    color: '#e65100',
                                    fontSize: 'var(--text-sm)',
                                    fontFamily: 'monospace',
                                  }}
                                >
                                  {job.export_jobs_error_message}
                                </div>
                              </td>
                            </tr>
                          )}
                          {job.export_jobs_processing_stage && (
                            <tr>
                              <th>Giai đoạn xử lý</th>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                  <span style={{ fontSize: 'var(--text-sm)', fontWeight: 500 }}>
                                    {job.export_jobs_processing_stage}
                                  </span>
                                  {job.export_jobs_progress_percent !== undefined && (
                                    <div>
                                      <div
                                        style={{
                                          width: '100%',
                                          height: '8px',
                                          background: 'var(--muted)',
                                          borderRadius: '4px',
                                          overflow: 'hidden',
                                        }}
                                      >
                                        <div
                                          style={{
                                            width: `${job.export_jobs_progress_percent}%`,
                                            height: '100%',
                                            background: '#1976d2',
                                            transition: 'width 0.3s ease',
                                          }}
                                        />
                                      </div>
                                      <span
                                        style={{
                                          fontSize: '12px',
                                          color: 'var(--muted-foreground)',
                                          marginTop: '4px',
                                          display: 'block',
                                        }}
                                      >
                                        {job.export_jobs_progress_percent}%
                                      </span>
                                    </div>
                                  )}
                                </div>
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Footer with Pagination */}
          <div className={styles.footer}>
            <div className={styles.footerLeft}>
              <span className={styles.footerText}>
                Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, filteredJobs.length)} của {filteredJobs.length} jobs
              </span>
            </div>
            <div className={styles.footerRight}>
              <div className={styles.pagination}>
                <button
                  className={styles.pageButton}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={currentPage === 1}
                >
                  ← Trước
                </button>
                <span className={styles.pageInfo}>
                  Trang {currentPage} / {totalPages}
                </span>
                <button
                  className={styles.pageButton}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={currentPage === totalPages}
                >
                  Sau →
                </button>
              </div>
            </div>
          </div>
        </>
      )}

      {/* Modal */}
      {isModalOpen && (
        <ExportJobModal
          job={selectedJob}
          mode={modalMode}
          onClose={() => setIsModalOpen(false)}
          onSave={handleSaveJob}
        />
      )}

      {/* Drawer */}
      <ExportJobDrawer
        job={drawerJob}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        onDownload={handleDownload}
      />
    </div>
  );
};