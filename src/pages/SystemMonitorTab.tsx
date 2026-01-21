/**
 * System Monitor Tab - MAPPA Portal
 * Giám sát hệ thống - theo dõi các job nền và hàng đợi
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState, useEffect, useMemo } from 'react';
import {
  Activity,
  Search,
  Filter,
  RefreshCw,
  ChevronDown,
  ChevronRight,
  Play,
  CheckCircle,
  XCircle,
  Clock,
  Pause,
  Loader2,
  Eye,
  AlertCircle,
  Zap,
  Database,
  Mail,
  FileText,
  Calendar,
  User,
} from 'lucide-react';
import styles from './SystemMonitorTab.module.css';
import { toast } from 'sonner';
import { supabase } from '../lib/supabase';

// ============================================
// TYPES
// ============================================

type JobStatus = 'pending' | 'running' | 'completed' | 'failed' | 'cancelled';

interface JobMonitorItem {
  job_monitor_items_id: string;
  job_monitor_items_job_id: string;
  job_monitor_items_job_type: string;
  job_monitor_items_status: JobStatus;
  job_monitor_items_started_at: string;
  job_monitor_items_completed_at?: string;
  job_monitor_items_error_code?: string;
  job_monitor_items_error_summary?: string;
  job_monitor_items_progress?: number;
  job_monitor_items_total_steps?: number;
  job_monitor_items_current_step?: number;
  job_monitor_items_retry_count?: number;
  job_monitor_items_created_by?: string;
}

// ============================================
// MAIN COMPONENT
// ============================================

export const SystemMonitorTab: React.FC = () => {
  // State
  const [loading, setLoading] = useState(true);
  const [jobs, setJobs] = useState<JobMonitorItem[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJobType, setFilterJobType] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [expandedJobs, setExpandedJobs] = useState<Set<string>>(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const itemsPerPage = 20;

  // ============================================
  // DATA FETCHING
  // ============================================

  const fetchJobs = async () => {
    try {
      // Don't show loading on auto-refresh to avoid flicker
      if (jobs.length === 0) {
        setLoading(true);
      }

      const { data, error } = await supabase
        .from('job_monitor_items')
        .select('*, id:_id')
        .order('job_monitor_items_started_at', { ascending: false });

      if (error) {
        console.error('❌ Error fetching jobs:', error);
        if (jobs.length === 0) {
          toast.error(`Lỗi tải dữ liệu: ${error.message}`);
        }
        return;
      }

      setJobs(data || []);
    } catch (error) {
      console.error('❌ Error:', error);
      if (jobs.length === 0) {
        toast.error('Lỗi kết nối cơ sở dữ liệu');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  // Auto-refresh every 5 seconds - smooth updates
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      fetchJobs();
    }, 5000);

    return () => clearInterval(interval);
  }, [autoRefresh, jobs.length]);

  // ============================================
  // FILTERING & PAGINATION
  // ============================================

  // Unique values for filters
  const uniqueJobTypes = useMemo(() => {
    const types = new Set(jobs.map((j) => j.job_monitor_items_job_type));
    return Array.from(types).sort();
  }, [jobs]);

  // Filtered jobs
  const filteredJobs = useMemo(() => {
    let filtered = [...jobs];

    // Search by Job ID or Job Type
    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(
        (job) =>
          job.job_monitor_items_job_id.toLowerCase().includes(term) ||
          job.job_monitor_items_job_type.toLowerCase().includes(term)
      );
    }

    // Filter by Job Type
    if (filterJobType !== 'all') {
      filtered = filtered.filter((j) => j.job_monitor_items_job_type === filterJobType);
    }

    // Filter by Status
    if (filterStatus !== 'all') {
      filtered = filtered.filter((j) => j.job_monitor_items_status === filterStatus);
    }

    return filtered;
  }, [jobs, searchTerm, filterJobType, filterStatus]);

  // Pagination
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);
  const currentItems = filteredJobs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Stats
  const pendingCount = jobs.filter((j) => j.job_monitor_items_status === 'pending').length;
  const runningCount = jobs.filter((j) => j.job_monitor_items_status === 'running').length;
  const completedCount = jobs.filter((j) => j.job_monitor_items_status === 'completed').length;
  const failedCount = jobs.filter((j) => j.job_monitor_items_status === 'failed').length;

  // ============================================
  // HANDLERS
  // ============================================

  const toggleJob = (jobId: string) => {
    const newExpanded = new Set(expandedJobs);
    if (newExpanded.has(jobId)) {
      newExpanded.delete(jobId);
    } else {
      newExpanded.add(jobId);
    }
    setExpandedJobs(newExpanded);
  };

  const handleRefresh = () => {
    toast.info('Đang làm mới dữ liệu...');
    fetchJobs();
  };

  const toggleAutoRefresh = () => {
    setAutoRefresh(!autoRefresh);
    toast.success(autoRefresh ? 'Đã tắt auto-refresh' : 'Đã bật auto-refresh (5s)');
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

  const getStatusBadge = (status: JobStatus) => {
    const styles_map = {
      pending: { bg: '#e2e3e5', color: '#383d41', label: 'PENDING', icon: <Clock size={14} /> },
      running: { bg: '#d1ecf1', color: '#0c5460', label: 'RUNNING', icon: <Play size={14} /> },
      completed: { bg: '#d4edda', color: '#155724', label: 'COMPLETED', icon: <CheckCircle size={14} /> },
      failed: { bg: '#f8d7da', color: '#721c24', label: 'FAILED', icon: <XCircle size={14} /> },
      cancelled: { bg: '#fef3c7', color: '#92400e', label: 'CANCELLED', icon: <Pause size={14} /> },
    };
    return styles_map[status];
  };

  const getJobTypeIcon = (jobType: string) => {
    const lower = jobType.toLowerCase();
    if (lower.includes('export')) return <FileText size={16} />;
    if (lower.includes('sync')) return <RefreshCw size={16} />;
    if (lower.includes('email')) return <Mail size={16} />;
    if (lower.includes('database')) return <Database size={16} />;
    return <Zap size={16} />;
  };

  const calculateDuration = (startedAt: string, completedAt?: string) => {
    const start = new Date(startedAt).getTime();
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
          <Activity className={styles.headerIcon} />
          <div>
            <h1 className={styles.title}>Giám sát Hệ thống</h1>
            <p className={styles.subtitle}>
              Theo dõi real-time các job nền và hàng đợi trong hệ thống MAPPA
            </p>
          </div>
        </div>
        <div className={styles.headerRight}>
          <button
            onClick={toggleAutoRefresh}
            className={autoRefresh ? styles.btnAutoRefreshActive : styles.btnSecondary}
          >
            <RefreshCw size={16} className={autoRefresh ? styles.spinning : ''} />
            {autoRefresh ? 'Auto (5s)' : 'Auto-refresh'}
          </button>
          <button onClick={handleRefresh} className={styles.btnPrimary}>
            <RefreshCw size={16} />
            Làm mới
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <Clock className={styles.statIconGray} />
            <span className={styles.statLabel}>Pending</span>
          </div>
          <div className={styles.statValue}>{pendingCount}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <Play className={styles.statIconBlue} />
            <span className={styles.statLabel}>Running</span>
          </div>
          <div className={styles.statValue}>{runningCount}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <CheckCircle className={styles.statIconGreen} />
            <span className={styles.statLabel}>Completed</span>
          </div>
          <div className={styles.statValue}>{completedCount}</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statCardHeader}>
            <XCircle className={styles.statIconRed} />
            <span className={styles.statLabel}>Failed</span>
          </div>
          <div className={styles.statValue}>{failedCount}</div>
        </div>
      </div>

      {/* Filters + Actions Row */}
      <div className={styles.filterActionsRow}>
        <div className={styles.filterGroup}>
          <div className={styles.searchBox}>
            <Search className={styles.searchIcon} />
            <input
              type="text"
              placeholder="Tìm theo Job ID hoặc Job Type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.searchInput}
            />
          </div>

          {/* Job Type Filter */}
          <select
            value={filterJobType}
            onChange={(e) => setFilterJobType(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Tất cả Job Types</option>
            {uniqueJobTypes.map((type) => (
              <option key={type} value={type}>
                {type}
              </option>
            ))}
          </select>

          {/* Status Filter */}
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className={styles.filterSelect}
          >
            <option value="all">Tất cả Status</option>
            <option value="pending">Pending</option>
            <option value="running">Running</option>
            <option value="completed">Completed</option>
            <option value="failed">Failed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      {/* Jobs List (Accordion) */}
      {loading ? (
        <div className={styles.loadingContainer}>
          <Loader2 className={styles.spinner} />
          <p className={styles.loadingText}>Đang tải job monitor...</p>
        </div>
      ) : filteredJobs.length === 0 ? (
        <div className={styles.emptyState}>
          <Activity size={64} />
          <p>Không tìm thấy job nào</p>
        </div>
      ) : (
        <>
          <div className={styles.modulesList}>
            {currentItems.map((job) => {
              const isExpanded = expandedJobs.has(job.job_monitor_items_id);
              const statusBadge = getStatusBadge(job.job_monitor_items_status);
              const progress = job.job_monitor_items_progress || 0;
              const isRunning = job.job_monitor_items_status === 'running';

              return (
                <div key={job.job_monitor_items_id} className={styles.moduleCard}>
                  {/* Job Header */}
                  <div className={styles.moduleHeader}>
                    <button
                      className={styles.moduleToggle}
                      onClick={() => toggleJob(job.job_monitor_items_id)}
                    >
                      {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </button>

                    <div className={styles.moduleInfo}>
                      <div className={styles.moduleNameRow}>
                        <span className={styles.jobTypeIcon}>
                          {getJobTypeIcon(job.job_monitor_items_job_type)}
                        </span>
                        <h3 className={styles.moduleName}>{job.job_monitor_items_job_type}</h3>
                        <code className={styles.moduleCode}>
                          #{job.job_monitor_items_job_id.slice(0, 8)}
                        </code>
                      </div>
                      <p className={styles.moduleDescription}>
                        {job.job_monitor_items_created_by && (
                          <>
                            <User size={14} style={{ display: 'inline', marginRight: '4px' }} />
                            {job.job_monitor_items_created_by} •{' '}
                          </>
                        )}
                        {calculateDuration(
                          job.job_monitor_items_started_at,
                          job.job_monitor_items_completed_at
                        )}
                      </p>
                    </div>

                    <div className={styles.moduleMeta}>
                      <span className={styles.timestamp}>
                        <Clock size={14} />
                        {formatDateTime(job.job_monitor_items_started_at)}
                      </span>
                    </div>

                    <div className={styles.moduleMeta}>
                      <span
                        className={styles.statusBadge}
                        style={{
                          background: statusBadge.bg,
                          color: statusBadge.color,
                        }}
                      >
                        {statusBadge.icon}
                        {statusBadge.label}
                      </span>
                    </div>
                  </div>

                  {/* Progress Bar for Running Jobs */}
                  {isRunning && (
                    <div className={styles.progressSection}>
                      <div className={styles.progressHeader}>
                        <span className={styles.progressLabel}>
                          {job.job_monitor_items_current_step && job.job_monitor_items_total_steps
                            ? `Step ${job.job_monitor_items_current_step}/${job.job_monitor_items_total_steps}`
                            : 'Processing...'}
                        </span>
                        <span className={styles.progressValue}>{progress}%</span>
                      </div>
                      <div className={styles.progressBar}>
                        <div
                          className={styles.progressFill}
                          style={{ width: `${progress}%` }}
                        />
                      </div>
                    </div>
                  )}

                  {/* Error Summary (if failed) */}
                  {job.job_monitor_items_status === 'failed' &&
                    job.job_monitor_items_error_summary && (
                      <div className={styles.errorSummary}>
                        <AlertCircle size={16} style={{ flexShrink: 0 }} />
                        <div>
                          {job.job_monitor_items_error_code && (
                            <code className={styles.errorCode}>
                              {job.job_monitor_items_error_code}
                            </code>
                          )}
                          <span>{job.job_monitor_items_error_summary}</span>
                        </div>
                      </div>
                    )}

                  {/* Job Details (Expanded) */}
                  {isExpanded && (
                    <div className={styles.permissionsTable}>
                      <div className={styles.permissionsTableHeader}>
                        <h4 className={styles.permissionsTableTitle}>Thông tin chi tiết</h4>
                      </div>

                      <table className={styles.table}>
                        <tbody>
                          <tr>
                            <th style={{ width: '200px' }}>Job ID</th>
                            <td>
                              <code style={{ fontSize: '13px', color: '#666' }}>
                                {job.job_monitor_items_job_id}
                              </code>
                            </td>
                          </tr>
                          <tr>
                            <th>Job Type</th>
                            <td>
                              <span
                                style={{
                                  padding: '4px 10px',
                                  background: 'rgba(0, 92, 182, 0.1)',
                                  color: '#005cb6',
                                  borderRadius: '4px',
                                  fontSize: '13px',
                                  fontWeight: 600,
                                }}
                              >
                                {job.job_monitor_items_job_type}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <th>Status</th>
                            <td>
                              <span
                                style={{
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  gap: '6px',
                                  padding: '6px 12px',
                                  borderRadius: '12px',
                                  fontSize: '13px',
                                  fontWeight: 600,
                                  background: statusBadge.bg,
                                  color: statusBadge.color,
                                }}
                              >
                                {statusBadge.icon}
                                {statusBadge.label}
                              </span>
                            </td>
                          </tr>
                          <tr>
                            <th>Started At</th>
                            <td>{formatDateTime(job.job_monitor_items_started_at)}</td>
                          </tr>
                          {job.job_monitor_items_completed_at && (
                            <tr>
                              <th>Completed At</th>
                              <td>{formatDateTime(job.job_monitor_items_completed_at)}</td>
                            </tr>
                          )}
                          {job.job_monitor_items_progress !== undefined && (
                            <tr>
                              <th>Progress</th>
                              <td style={{ fontWeight: 600, color: '#005cb6' }}>
                                {job.job_monitor_items_progress}%
                              </td>
                            </tr>
                          )}
                          {job.job_monitor_items_retry_count !== undefined && (
                            <tr>
                              <th>Retry Count</th>
                              <td>{job.job_monitor_items_retry_count}</td>
                            </tr>
                          )}
                          {job.job_monitor_items_error_code && (
                            <tr>
                              <th>Error Code</th>
                              <td>
                                <code
                                  style={{
                                    padding: '4px 8px',
                                    background: '#fef2f2',
                                    color: '#991b1b',
                                    borderRadius: '4px',
                                    fontSize: '13px',
                                  }}
                                >
                                  {job.job_monitor_items_error_code}
                                </code>
                              </td>
                            </tr>
                          )}
                          {job.job_monitor_items_error_summary && (
                            <tr>
                              <th>Error Summary</th>
                              <td style={{ color: '#dc2626' }}>
                                {job.job_monitor_items_error_summary}
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
    </div>
  );
};