/**
 * Export Log Tab - MAPPA Portal
 * Nhật ký tải xuất - Timeline và download history tracking
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Download,
  Search,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Copy,
  User,
  Clock,
  FileText,
  Loader2,
  CheckCircle,
  XCircle,
  AlertCircle,
  PlayCircle,
  File,
  Database,
  Globe,
  Calendar,
  TrendingUp,
  Archive,
} from 'lucide-react';
import styles from './ExportLogTab.module.css';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

// ============================================
// TYPES
// ============================================

type ExportStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'expired';
type SourceType = 'database' | 'api' | 'report' | 'manual';

interface ExportJob {
  export_job_id: string;
  export_job_name: string;
  export_job_status: ExportStatus;
  export_job_source_type: SourceType;
  export_job_file_format?: string;
  export_job_file_size?: number;
  export_job_created_by?: string;
  export_job_created_at: string;
  export_job_completed_at?: string;
  export_job_expires_at?: string;
  export_job_download_url?: string;
  export_job_progress?: number;
  export_job_error_message?: string;
  export_job_download_count?: number;
  export_job_metadata?: Record<string, any>;
}

interface DownloadHistory {
  download_id: string;
  download_timestamp: string;
  download_user_email: string;
  download_ip_address?: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const ExportLogTab: React.FC = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<ExportJob[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterSourceType, setFilterSourceType] = useState<string>('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedJob, setSelectedJob] = useState<ExportJob | null>(null);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [downloadHistory, setDownloadHistory] = useState<DownloadHistory[]>([]);
  const itemsPerPage = 40;

  // ============================================
  // DATA FETCHING
  // ============================================

  const fetchExportJobs = async () => {
    try {
      setLoading(true);
      console.log('🔍 Fetching export jobs...');

      const { data, error } = await supabase
        .from('export_jobs')
        .select('*')
        .order('export_job_created_at', { ascending: false })
        .limit(500);

      if (error) {
        console.error('❌ Error fetching export jobs:', error);
        toast.error(`Lỗi tải dữ liệu: ${error.message}`);
        return;
      }

      console.log(`✅ Loaded ${data?.length || 0} export jobs`);
      setJobs(data || []);
    } catch (error) {
      console.error('❌ Error:', error);
      toast.error('Lỗi kết nối cơ sở dữ liệu');
    } finally {
      setLoading(false);
    }
  };

  const fetchDownloadHistory = async (jobId: string) => {
    try {
      console.log('🔍 Fetching download history for job:', jobId);

      const { data, error } = await supabase
        .from('download_history')
        .select('*')
        .eq('export_job_id', jobId)
        .order('download_timestamp', { ascending: false });

      if (error) {
        console.error('❌ Error fetching download history:', error);
        return;
      }

      console.log(`✅ Loaded ${data?.length || 0} download records`);
      setDownloadHistory(data || []);
    } catch (error) {
      console.error('❌ Error:', error);
    }
  };

  useEffect(() => {
    fetchExportJobs();
  }, []);

  // ============================================
  // FILTERING & PAGINATION
  // ============================================

  const filteredJobs = useMemo(() => {
    let filtered = [...jobs];

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.export_job_id.toLowerCase().includes(term) ||
          job.export_job_name.toLowerCase().includes(term) ||
          job.export_job_created_by?.toLowerCase().includes(term)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter((j) => j.export_job_status === filterStatus);
    }

    if (filterSourceType !== 'all') {
      filtered = filtered.filter((j) => j.export_job_source_type === filterSourceType);
    }

    return filtered;
  }, [jobs, searchTerm, filterStatus, filterSourceType]);

  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const currentItems = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // ============================================
  // HANDLERS
  // ============================================

  const handleRowClick = (job: ExportJob) => {
    setSelectedJob(job);
    setDrawerOpen(true);
    fetchDownloadHistory(job.export_job_id);
  };

  const closeDrawer = () => {
    setDrawerOpen(false);
    setTimeout(() => {
      setSelectedJob(null);
      setDownloadHistory([]);
    }, 300);
  };

  const handleRefresh = () => {
    toast.info('Đang làm mới dữ liệu...');
    fetchExportJobs();
  };

  const handleCopy = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`Đã copy ${label}`);
  };

  const handleDownload = (job: ExportJob) => {
    if (job.export_job_download_url) {
      window.open(job.export_job_download_url, '_blank');
      toast.success('Đang tải xuống file...');
    } else {
      toast.error('Download URL không khả dụng');
    }
  };

  const formatDateTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
    });
  };

  const formatFileSize = (bytes?: number): string => {
    if (!bytes) return 'N/A';
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getStatusBadge = (status: ExportStatus) => {
    const styles_map = {
      pending: { bg: '#e2e3e5', color: '#383d41', label: 'PENDING', icon: <Clock size={14} /> },
      processing: { bg: '#d1ecf1', color: '#0c5460', label: 'PROCESSING', icon: <PlayCircle size={14} /> },
      completed: { bg: '#d4edda', color: '#155724', label: 'COMPLETED', icon: <CheckCircle size={14} /> },
      failed: { bg: '#f8d7da', color: '#721c24', label: 'FAILED', icon: <XCircle size={14} /> },
      expired: { bg: '#f3f4f6', color: '#6b7280', label: 'EXPIRED', icon: <AlertCircle size={14} /> },
    };
    return styles_map[status];
  };

  const getSourceTypeBadge = (sourceType: SourceType) => {
    const styles_map = {
      database: { bg: 'rgba(0, 92, 182, 0.1)', color: '#005cb6', label: 'DATABASE', icon: <Database size={14} /> },
      api: { bg: 'rgba(16, 185, 129, 0.1)', color: '#059669', label: 'API', icon: <Globe size={14} /> },
      report: { bg: 'rgba(245, 158, 11, 0.1)', color: '#d97706', label: 'REPORT', icon: <FileText size={14} /> },
      manual: { bg: 'rgba(139, 92, 246, 0.1)', color: '#7c3aed', label: 'MANUAL', icon: <User size={14} /> },
    };
    return styles_map[sourceType];
  };

  const isExpired = (job: ExportJob): boolean => {
    if (!job.export_job_expires_at) return false;
    return new Date(job.export_job_expires_at) < new Date();
  };

  const getDuration = (createdAt: string, completedAt?: string): string => {
    const start = new Date(createdAt).getTime();
    const end = completedAt ? new Date(completedAt).getTime() : Date.now();
    const diffMs = end - start;
    const diffSecs = Math.floor(diffMs / 1000);
    const diffMins = Math.floor(diffSecs / 60);

    if (diffMins < 1) return `${diffSecs}s`;
    if (diffMins < 60) return `${diffMins}m ${diffSecs % 60}s`;
    const diffHours = Math.floor(diffMins / 60);
    return `${diffHours}h ${diffMins % 60}m`;
  };

  // ============================================
  // RENDER
  // ============================================

  return (
    <div className={styles.container}>
      {/* Header */}
      <div className={styles.header}>
        <div className={styles.headerLeft}>
          <Download className={styles.headerIcon} />
          <div>
            <h1 className={styles.title}>Nhật ký Tải xuất</h1>
            <p className={styles.subtitle}>
              Export jobs management và download tracking • {filteredJobs.length.toLocaleString()} jobs
            </p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button onClick={handleRefresh} className={styles.btnPrimary}>
            <RefreshCw size={16} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Inline Filter Toolbar */}
      <div className={styles.filterToolbar}>
        <div className={styles.searchBox}>
          <Search className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Tìm theo Job ID, Job Name, User..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.searchInput}
          />
          {searchTerm && (
            <button
              className={styles.searchClear}
              onClick={() => setSearchTerm('')}
              aria-label="Clear search"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <select
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Status</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="completed">Completed</option>
          <option value="failed">Failed</option>
          <option value="expired">Expired</option>
        </select>

        <select
          value={filterSourceType}
          onChange={(e) => setFilterSourceType(e.target.value)}
          className={styles.filterSelect}
        >
          <option value="all">All Source Types</option>
          <option value="database">Database</option>
          <option value="api">API</option>
          <option value="report">Report</option>
          <option value="manual">Manual</option>
        </select>
      </div>

      {/* Large Scannable Table */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.spinner} />
          <p className={styles.loadingText}>Đang tải export logs...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className={styles.emptyState}>
          <Download size={64} />
          <p>Không tìm thấy export jobs</p>
        </div>
      ) : (
        <>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead className={styles.tableHeader}>
                <tr>
                  <th style={{ width: '180px' }}>Created</th>
                  <th style={{ width: '280px' }}>Job Name</th>
                  <th style={{ width: '140px' }}>Source Type</th>
                  <th style={{ width: '140px' }}>Status</th>
                  <th style={{ width: '110px' }}>Format</th>
                  <th style={{ width: '110px' }}>Size</th>
                  <th style={{ width: '180px' }}>Created By</th>
                  <th style={{ width: '100px' }}>Downloads</th>
                  <th style={{ width: '140px' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentItems.map((job) => {
                  const statusBadge = getStatusBadge(job.export_job_status);
                  const sourceBadge = getSourceTypeBadge(job.export_job_source_type);
                  const expired = isExpired(job);
                  const rowClass = `${styles.tableRow} ${expired ? styles.expiredRow : ''}`;

                  return (
                    <tr
                      key={job.export_job_id}
                      className={rowClass}
                      onClick={() => handleRowClick(job)}
                    >
                      <td className={styles.timestampCell}>
                        <Clock size={14} />
                        {formatDateTime(job.export_job_created_at)}
                      </td>
                      <td className={styles.jobNameCell}>
                        <FileText size={16} />
                        <span>{job.export_job_name}</span>
                      </td>
                      <td>
                        <span
                          className={styles.sourceBadge}
                          style={{ background: sourceBadge.bg, color: sourceBadge.color }}
                        >
                          {sourceBadge.icon}
                          {sourceBadge.label}
                        </span>
                      </td>
                      <td>
                        <span
                          className={styles.statusBadge}
                          style={{ background: statusBadge.bg, color: statusBadge.color }}
                        >
                          {job.export_job_status === 'processing' ? (
                            <Loader2 size={14} className={styles.spinning} />
                          ) : (
                            statusBadge.icon
                          )}
                          {statusBadge.label}
                        </span>
                        {job.export_job_status === 'processing' && job.export_job_progress !== undefined && (
                          <div className={styles.inlineProgress}>
                            <div
                              className={styles.inlineProgressFill}
                              style={{ width: `${job.export_job_progress}%` }}
                            />
                          </div>
                        )}
                      </td>
                      <td>
                        {job.export_job_file_format && (
                          <code className={styles.formatCode}>
                            {job.export_job_file_format.toUpperCase()}
                          </code>
                        )}
                      </td>
                      <td className={styles.sizeCell}>
                        {formatFileSize(job.export_job_file_size)}
                      </td>
                      <td className={styles.userCell}>
                        {job.export_job_created_by ? (
                          <>
                            <User size={14} />
                            {job.export_job_created_by}
                          </>
                        ) : (
                          <span className={styles.mutedText}>System</span>
                        )}
                      </td>
                      <td className={styles.downloadCountCell}>
                        {job.export_job_download_count !== undefined && (
                          <span className={styles.downloadCountBadge}>
                            <Download size={12} />
                            {job.export_job_download_count}
                          </span>
                        )}
                      </td>
                      <td>
                        {job.export_job_status === 'completed' && !expired && (
                          <div className={styles.hoverActions}>
                            <button
                              className={styles.actionBtn}
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDownload(job);
                              }}
                            >
                              <Download size={14} />
                              Download
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className={styles.pagination}>
            <div className={styles.paginationLeft}>
              <span className={styles.paginationText}>
                Hiển thị {(currentPage - 1) * itemsPerPage + 1} -{' '}
                {Math.min(currentPage * itemsPerPage, filteredJobs.length)} của{' '}
                {filteredJobs.length.toLocaleString()} jobs
              </span>
            </div>
            <div className={styles.paginationRight}>
              <button
                className={styles.pageButton}
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ChevronLeft size={16} />
                Trước
              </button>
              <span className={styles.pageInfo}>
                Trang {currentPage} / {totalPages}
              </span>
              <button
                className={styles.pageButton}
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Sau
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        </>
      )}

      {/* Drawer: Timeline + Download History */}
      {drawerOpen && selectedJob && (
        <>
          <div className={styles.drawerOverlay} onClick={closeDrawer} />
          <div className={styles.drawer}>
            {/* Drawer Header */}
            <div className={styles.drawerHeader}>
              <div>
                <h2 className={styles.drawerTitle}>{selectedJob.export_job_name}</h2>
                <div className={styles.drawerSubtitle}>
                  <code>ID: {selectedJob.export_job_id}</code>
                  <button
                    className={styles.copyBtnInline}
                    onClick={() => handleCopy(selectedJob.export_job_id, 'Job ID')}
                  >
                    <Copy size={12} />
                  </button>
                </div>
              </div>
              <button className={styles.drawerCloseBtn} onClick={closeDrawer}>
                <X size={24} />
              </button>
            </div>

            {/* Drawer Content */}
            <div className={styles.drawerContent}>
              {/* Job Timeline */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <TrendingUp size={20} />
                  Job Timeline
                </h3>

                <div className={styles.timeline}>
                  {/* Created */}
                  <div className={styles.timelineItem}>
                    <div className={styles.timelineIcon} style={{ background: '#d1ecf1' }}>
                      <Calendar size={16} style={{ color: '#0c5460' }} />
                    </div>
                    <div className={styles.timelineContent}>
                      <div className={styles.timelineTitle}>Job Created</div>
                      <div className={styles.timelineTime}>
                        {formatDateTime(selectedJob.export_job_created_at)}
                      </div>
                      <div className={styles.timelineMeta}>
                        Created by: {selectedJob.export_job_created_by || 'System'}
                      </div>
                    </div>
                  </div>

                  {/* Processing */}
                  {selectedJob.export_job_status !== 'pending' && (
                    <div className={styles.timelineItem}>
                      <div className={styles.timelineIcon} style={{ background: '#fff3cd' }}>
                        <PlayCircle size={16} style={{ color: '#856404' }} />
                      </div>
                      <div className={styles.timelineContent}>
                        <div className={styles.timelineTitle}>Processing Started</div>
                        <div className={styles.timelineMeta}>
                          Duration: {getDuration(selectedJob.export_job_created_at, selectedJob.export_job_completed_at)}
                        </div>
                        {selectedJob.export_job_progress !== undefined && (
                          <div className={styles.timelineProgress}>
                            <div className={styles.progressBar}>
                              <div
                                className={styles.progressFill}
                                style={{ width: `${selectedJob.export_job_progress}%` }}
                              />
                            </div>
                            <span>{selectedJob.export_job_progress}%</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Completed/Failed */}
                  {(selectedJob.export_job_status === 'completed' ||
                    selectedJob.export_job_status === 'failed') && (
                    <div className={styles.timelineItem}>
                      <div
                        className={styles.timelineIcon}
                        style={{
                          background:
                            selectedJob.export_job_status === 'completed' ? '#d4edda' : '#f8d7da',
                        }}
                      >
                        {selectedJob.export_job_status === 'completed' ? (
                          <CheckCircle size={16} style={{ color: '#155724' }} />
                        ) : (
                          <XCircle size={16} style={{ color: '#721c24' }} />
                        )}
                      </div>
                      <div className={styles.timelineContent}>
                        <div className={styles.timelineTitle}>
                          {selectedJob.export_job_status === 'completed'
                            ? 'Job Completed'
                            : 'Job Failed'}
                        </div>
                        {selectedJob.export_job_completed_at && (
                          <div className={styles.timelineTime}>
                            {formatDateTime(selectedJob.export_job_completed_at)}
                          </div>
                        )}
                        {selectedJob.export_job_error_message && (
                          <div className={styles.errorMessage}>
                            <AlertCircle size={14} />
                            {selectedJob.export_job_error_message}
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Expired */}
                  {isExpired(selectedJob) && (
                    <div className={styles.timelineItem}>
                      <div className={styles.timelineIcon} style={{ background: '#f3f4f6' }}>
                        <Archive size={16} style={{ color: '#6b7280' }} />
                      </div>
                      <div className={styles.timelineContent}>
                        <div className={styles.timelineTitle}>Job Expired</div>
                        <div className={styles.timelineTime}>
                          {selectedJob.export_job_expires_at &&
                            formatDateTime(selectedJob.export_job_expires_at)}
                        </div>
                        <div className={styles.timelineMeta}>
                          Download link is no longer available
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Job Details */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <FileText size={20} />
                  Job Details
                </h3>

                <div className={styles.detailsGrid}>
                  <div className={styles.detailItem}>
                    <label>Source Type</label>
                    <span
                      className={styles.sourceBadgeLarge}
                      style={{
                        ...getSourceTypeBadge(selectedJob.export_job_source_type),
                        background: getSourceTypeBadge(selectedJob.export_job_source_type).bg,
                        color: getSourceTypeBadge(selectedJob.export_job_source_type).color,
                      }}
                    >
                      {getSourceTypeBadge(selectedJob.export_job_source_type).icon}
                      {getSourceTypeBadge(selectedJob.export_job_source_type).label}
                    </span>
                  </div>

                  <div className={styles.detailItem}>
                    <label>File Format</label>
                    <code className={styles.formatCodeLarge}>
                      {selectedJob.export_job_file_format?.toUpperCase() || 'N/A'}
                    </code>
                  </div>

                  <div className={styles.detailItem}>
                    <label>File Size</label>
                    <span>{formatFileSize(selectedJob.export_job_file_size)}</span>
                  </div>

                  <div className={styles.detailItem}>
                    <label>Total Downloads</label>
                    <span className={styles.downloadCountLarge}>
                      <Download size={16} />
                      {selectedJob.export_job_download_count || 0} times
                    </span>
                  </div>
                </div>
              </div>

              {/* Download History */}
              <div className={styles.section}>
                <h3 className={styles.sectionTitle}>
                  <Archive size={20} />
                  Download History ({downloadHistory.length})
                </h3>

                {downloadHistory.length === 0 ? (
                  <div className={styles.emptyHistory}>
                    <Download size={32} />
                    <p>No download history yet</p>
                  </div>
                ) : (
                  <div className={styles.historyList}>
                    {downloadHistory.map((record) => (
                      <div key={record.download_id} className={styles.historyItem}>
                        <div className={styles.historyIcon}>
                          <Download size={16} />
                        </div>
                        <div className={styles.historyContent}>
                          <div className={styles.historyUser}>
                            <User size={14} />
                            {record.download_user_email}
                          </div>
                          <div className={styles.historyTime}>
                            <Clock size={12} />
                            {formatDateTime(record.download_timestamp)}
                          </div>
                          {record.download_ip_address && (
                            <div className={styles.historyIp}>
                              IP: {record.download_ip_address}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
