/**
 * Export Job Drawer - MAPPA Portal
 * Drawer hiển thị chi tiết export job (slide from right)
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React from 'react';
import { X, Download, AlertCircle, CheckCircle, Clock, FileText, HardDrive, Calendar, History, User, Loader2 } from 'lucide-react';
import {
  ExportJob,
  getStatusBadgeStyle,
  getSourceTypeIcon,
  getSourceTypeLabel,
  formatFileSize,
  formatDateTime,
  JobMonitorItem,
  MonitorItemStatus,
} from '../app/data/exportJobsTemplates';

interface ExportJobDrawerProps {
  job: ExportJob | null;
  isOpen: boolean;
  onClose: () => void;
  onDownload?: (job: ExportJob) => void;
}

export const ExportJobDrawer: React.FC<ExportJobDrawerProps> = ({ job, isOpen, onClose, onDownload }) => {
  if (!job) return null;

  const getStatusIcon = () => {
    switch (job.export_jobs_status) {
      case 'Completed':
        return <CheckCircle size={24} style={{ color: '#155724' }} />;
      case 'Processing':
        return <Clock size={24} style={{ color: '#856404' }} className="animate-spin" />;
      case 'Failed':
        return <AlertCircle size={24} style={{ color: '#721c24' }} />;
      case 'Expired':
        return <AlertCircle size={24} style={{ color: '#6b7280' }} />;
      case 'Pending':
        return <Clock size={24} style={{ color: '#1976d2' }} />;
      default:
        return null;
    }
  };

  const getExpiryDate = () => {
    if (!job.export_jobs_completed_at) return '-';
    const completedDate = new Date(job.export_jobs_completed_at);
    const days = parseInt(job.export_jobs_retention_policy.match(/\d+/)?.[0] || '0');
    const expiryDate = new Date(completedDate);
    expiryDate.setDate(expiryDate.getDate() + days);
    return formatDateTime(expiryDate.toISOString());
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 999,
            transition: 'opacity 0.3s ease',
          }}
          onClick={onClose}
        />
      )}

      {/* Drawer */}
      <div
        style={{
          position: 'fixed',
          top: 0,
          right: isOpen ? 0 : '-600px',
          width: '600px',
          height: '100vh',
          background: 'var(--card, white)',
          boxShadow: '-4px 0 24px rgba(0, 0, 0, 0.15)',
          zIndex: 1000,
          transition: 'right 0.3s ease',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            padding: '24px',
            borderBottom: '1px solid var(--border, #d0d5dd)',
            background: 'var(--card, white)',
            display: 'flex',
            alignItems: 'flex-start',
            justifyContent: 'space-between',
            gap: '16px',
          }}
        >
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
              {getStatusIcon()}
              <h2
                style={{
                  margin: 0,
                  fontFamily: 'Inter, sans-serif',
                  fontSize: '20px',
                  fontWeight: 700,
                  color: 'var(--foreground, #101828)',
                }}
              >
                Chi Tiết Export Job
              </h2>
            </div>
            <code
              style={{
                fontFamily: 'monospace',
                fontSize: '14px',
                padding: '4px 8px',
                background: 'var(--muted, #f9fafb)',
                borderRadius: 'var(--radius-sm, 4px)',
                color: 'var(--muted-foreground, #667085)',
              }}
            >
              {job.export_jobs_id}
            </code>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '8px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 'var(--radius, 6px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'background 0.15s ease',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--muted, #f9fafb)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <X size={20} style={{ color: 'var(--muted-foreground, #667085)' }} />
          </button>
        </div>

        {/* Body - Scrollable */}
        <div style={{ flex: 1, overflow: 'auto', padding: '24px' }}>
          {/* Status Banner */}
          <div
            style={{
              padding: '16px',
              background:
                job.export_jobs_status === 'Completed'
                  ? '#d4edda'
                  : job.export_jobs_status === 'Failed'
                    ? '#f8d7da'
                    : job.export_jobs_status === 'Processing'
                      ? '#fff3cd'
                      : job.export_jobs_status === 'Expired'
                        ? '#f3f4f6'
                        : '#e3f2fd',
              borderRadius: 'var(--radius, 6px)',
              border: `1px solid ${
                job.export_jobs_status === 'Completed'
                  ? '#155724'
                  : job.export_jobs_status === 'Failed'
                    ? '#721c24'
                    : job.export_jobs_status === 'Processing'
                      ? '#856404'
                      : job.export_jobs_status === 'Expired'
                        ? '#6b7280'
                        : '#1976d2'
              }`,
              marginBottom: '24px',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                {getStatusIcon()}
                <span style={getStatusBadgeStyle(job.export_jobs_status)}>
                  {job.export_jobs_status}
                </span>
              </div>
              {job.export_jobs_status === 'Completed' && job.export_jobs_file_url && onDownload && (
                <button
                  onClick={() => onDownload(job)}
                  style={{
                    padding: '8px 16px',
                    background: '#155724',
                    color: 'white',
                    border: 'none',
                    borderRadius: 'var(--radius, 6px)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '6px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    fontWeight: 500,
                    transition: 'background 0.15s ease',
                  }}
                  onMouseEnter={(e) => (e.currentTarget.style.background = '#0d3d18')}
                  onMouseLeave={(e) => (e.currentTarget.style.background = '#155724')}
                >
                  <Download size={16} />
                  Tải Xuống
                </button>
              )}
            </div>

            {/* Processing Progress */}
            {job.export_jobs_status === 'Processing' && job.export_jobs_progress !== undefined && (
              <div style={{ marginTop: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 500,
                      color: '#856404',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    Tiến trình xử lý
                  </span>
                  <span
                    style={{
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#856404',
                      fontFamily: 'Inter, sans-serif',
                    }}
                  >
                    {job.export_jobs_progress}%
                  </span>
                </div>
                <div
                  style={{
                    width: '100%',
                    height: '8px',
                    background: '#fff',
                    borderRadius: '4px',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      width: `${job.export_jobs_progress}%`,
                      height: '100%',
                      background: '#856404',
                      transition: 'width 0.3s ease',
                    }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* Processing Stages - Monitor Items */}
          {job.export_jobs_status === 'Processing' && job.export_jobs_monitor_items && job.export_jobs_monitor_items.length > 0 && (
            <div
              style={{
                background: 'white',
                border: '2px solid #856404',
                borderRadius: 'var(--radius, 6px)',
                marginBottom: '24px',
                overflow: 'hidden',
              }}
            >
              {/* Header */}
              <div
                style={{
                  padding: '14px 16px',
                  background: '#fff3cd',
                  borderBottom: '1px solid #856404',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                }}
              >
                <Loader2 size={20} style={{ color: '#856404' }} className="animate-spin" />
                <strong
                  style={{
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '15px',
                    fontWeight: 700,
                    color: '#856404',
                  }}
                >
                  Tiến trình xử lý chi tiết
                </strong>
              </div>

              {/* Stages List */}
              <div style={{ padding: '16px' }}>
                {job.export_jobs_monitor_items.map((stage, index) => {
                  const getStageIcon = (status: MonitorItemStatus) => {
                    switch (status) {
                      case 'completed':
                        return <CheckCircle size={18} style={{ color: '#155724', flexShrink: 0 }} />;
                      case 'in_progress':
                        return <Loader2 size={18} style={{ color: '#856404', flexShrink: 0 }} className="animate-spin" />;
                      case 'failed':
                        return <AlertCircle size={18} style={{ color: '#721c24', flexShrink: 0 }} />;
                      case 'pending':
                        return <Clock size={18} style={{ color: '#9ca3af', flexShrink: 0 }} />;
                      default:
                        return null;
                    }
                  };

                  const getStageColor = (status: MonitorItemStatus) => {
                    switch (status) {
                      case 'completed':
                        return { bg: '#d4edda', border: '#155724', text: '#155724' };
                      case 'in_progress':
                        return { bg: '#fff3cd', border: '#856404', text: '#856404' };
                      case 'failed':
                        return { bg: '#f8d7da', border: '#721c24', text: '#721c24' };
                      case 'pending':
                        return { bg: '#f3f4f6', border: '#d0d5dd', text: '#6b7280' };
                      default:
                        return { bg: '#f9fafb', border: '#d0d5dd', text: '#667085' };
                    }
                  };

                  const colors = getStageColor(stage.stage_status);

                  return (
                    <div
                      key={stage.stage_id}
                      style={{
                        position: 'relative',
                        paddingLeft: '32px',
                        paddingBottom: index < job.export_jobs_monitor_items!.length - 1 ? '24px' : '0',
                      }}
                    >
                      {/* Timeline Connector */}
                      {index < job.export_jobs_monitor_items!.length - 1 && (
                        <div
                          style={{
                            position: 'absolute',
                            left: '8px',
                            top: '24px',
                            width: '2px',
                            height: 'calc(100% - 24px)',
                            background: stage.stage_status === 'pending' ? '#d0d5dd' : '#856404',
                          }}
                        />
                      )}

                      {/* Stage Icon */}
                      <div
                        style={{
                          position: 'absolute',
                          left: '0',
                          top: '2px',
                        }}
                      >
                        {getStageIcon(stage.stage_status)}
                      </div>

                      {/* Stage Content */}
                      <div>
                        <div
                          style={{
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            marginBottom: '6px',
                          }}
                        >
                          <span
                            style={{
                              fontFamily: 'Inter, sans-serif',
                              fontSize: '14px',
                              fontWeight: 600,
                              color: colors.text,
                            }}
                          >
                            {stage.stage_name}
                          </span>
                          {stage.stage_status === 'in_progress' && stage.stage_progress > 0 && (
                            <span
                              style={{
                                fontFamily: 'Inter, sans-serif',
                                fontSize: '13px',
                                fontWeight: 700,
                                color: colors.text,
                              }}
                            >
                              {stage.stage_progress}%
                            </span>
                          )}
                        </div>

                        {/* Progress Bar for in_progress stage */}
                        {stage.stage_status === 'in_progress' && stage.stage_progress > 0 && (
                          <div
                            style={{
                              width: '100%',
                              height: '6px',
                              background: '#fff',
                              borderRadius: '3px',
                              overflow: 'hidden',
                              marginBottom: '8px',
                              border: `1px solid ${colors.border}`,
                            }}
                          >
                            <div
                              style={{
                                width: `${stage.stage_progress}%`,
                                height: '100%',
                                background: colors.text,
                                transition: 'width 0.3s ease',
                              }}
                            />
                          </div>
                        )}

                        {/* Stage Message */}
                        {stage.stage_message && (
                          <div
                            style={{
                              fontSize: '13px',
                              color: 'var(--muted-foreground, #667085)',
                              fontFamily: 'Inter, sans-serif',
                              lineHeight: '1.5',
                              marginBottom: '6px',
                            }}
                          >
                            {stage.stage_message}
                          </div>
                        )}

                        {/* Timestamps */}
                        <div
                          style={{
                            display: 'flex',
                            gap: '12px',
                            fontSize: '12px',
                            color: 'var(--muted-foreground, #667085)',
                            fontFamily: 'Inter, sans-serif',
                          }}
                        >
                          {stage.stage_started_at && (
                            <span>🕐 Bắt đầu: {formatDateTime(stage.stage_started_at)}</span>
                          )}
                          {stage.stage_completed_at && (
                            <span>✅ Hoàn thành: {formatDateTime(stage.stage_completed_at)}</span>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Error Message */}
          {job.export_jobs_status === 'Failed' && (job.export_jobs_error_summary || job.export_jobs_error_message) && (
            <div
              style={{
                background: '#f8d7da',
                border: '2px solid #721c24',
                borderRadius: 'var(--radius, 6px)',
                marginBottom: '24px',
                overflow: 'hidden',
              }}
            >
              {/* Error Summary Header */}
              <div
                style={{
                  padding: '16px',
                  background: '#721c24',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                }}
              >
                <AlertCircle size={24} style={{ color: 'white', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <strong
                    style={{
                      display: 'block',
                      color: 'white',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '16px',
                      fontWeight: 700,
                    }}
                  >
                    {job.export_jobs_error_summary || 'Lỗi xảy ra'}
                  </strong>
                  <span
                    style={{
                      color: 'rgba(255, 255, 255, 0.9)',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '13px',
                      fontWeight: 400,
                    }}
                  >
                    Export job thất bại và cần được xử lý
                  </span>
                </div>
              </div>

              {/* Error Detail Body */}
              {job.export_jobs_error_detail && (
                <div style={{ padding: '16px' }}>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '13px',
                      fontWeight: 600,
                      color: '#721c24',
                      marginBottom: '8px',
                      textTransform: 'uppercase',
                      letterSpacing: '0.5px',
                    }}
                  >
                    Chi tiết lỗi:
                  </label>
                  <div
                    style={{
                      padding: '12px',
                      background: 'white',
                      border: '1px solid #721c24',
                      borderRadius: 'var(--radius-sm, 4px)',
                      maxHeight: '300px',
                      overflow: 'auto',
                    }}
                  >
                    <pre
                      style={{
                        margin: 0,
                        color: '#721c24',
                        fontFamily: 'monospace',
                        fontSize: '12px',
                        lineHeight: '1.6',
                        whiteSpace: 'pre-wrap',
                        wordWrap: 'break-word',
                      }}
                    >
                      {job.export_jobs_error_detail}
                    </pre>
                  </div>
                </div>
              )}

              {/* Fallback to old error_message if no detail */}
              {!job.export_jobs_error_detail && job.export_jobs_error_message && (
                <div style={{ padding: '16px' }}>
                  <p
                    style={{
                      margin: 0,
                      color: '#721c24',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      lineHeight: '1.5',
                    }}
                  >
                    {job.export_jobs_error_message}
                  </p>
                </div>
              )}
            </div>
          )}

          {/* Source Name Section */}
          <SectionHeader icon={<FileText size={18} />} title="Thông tin nguồn dữ liệu" />
          <InfoCard>
            <InfoRow label="Tên nguồn" value={job.export_jobs_source_name} />
            <InfoRow
              label="Loại dữ liệu"
              value={getSourceTypeLabel(job.export_jobs_source_type)}
              icon={<span style={{ fontSize: '16px' }}>{getSourceTypeIcon(job.export_jobs_source_type)}</span>}
              badge={
                job.export_jobs_source_type === 'AUDIT_EXCERPT'
                  ? {
                      text: '🔒 AUDIT LOG',
                      color: '#e65100',
                      bg: '#fff3e0',
                    }
                  : undefined
              }
              highlight={job.export_jobs_source_type === 'AUDIT_EXCERPT'}
              style={
                job.export_jobs_source_type === 'AUDIT_EXCERPT'
                  ? {
                      color: '#e65100',
                      fontWeight: 700,
                    }
                  : undefined
              }
            />
            {job.export_jobs_file_format && (
              <InfoRow label="Định dạng file" value={job.export_jobs_file_format} />
            )}
          </InfoCard>

          {/* File Information */}
          <SectionHeader icon={<HardDrive size={18} />} title="Thông tin file xuất" />
          <InfoCard>
            <InfoRow label="Dung lượng file" value={formatFileSize(job.export_jobs_file_size)} />
            <InfoRow
              label="Số lần tải xuống"
              value={String(job.export_jobs_download_count)}
              badge={
                job.export_jobs_download_count > 0
                  ? {
                      text: job.export_jobs_download_count > 10 ? 'Phổ biến' : 'Đã tải',
                      color: job.export_jobs_download_count > 10 ? '#155724' : '#856404',
                      bg: job.export_jobs_download_count > 10 ? '#d4edda' : '#fff3cd',
                    }
                  : undefined
              }
            />
            {job.export_jobs_file_url && (
              <InfoRow
                label="File URL"
                value={job.export_jobs_file_url}
                mono
                style={{ wordBreak: 'break-all', fontSize: '12px' }}
              />
            )}
            {job.export_jobs_status === 'Expired' && !job.export_jobs_file_url && (
              <div
                style={{
                  padding: '12px',
                  background: '#f3f4f6',
                  border: '1px solid #6b7280',
                  borderRadius: 'var(--radius, 6px)',
                  fontSize: '13px',
                  color: '#6b7280',
                  fontFamily: 'Inter, sans-serif',
                  fontStyle: 'italic',
                }}
              >
                ⚠️ File đã hết hạn và không còn khả dụng
              </div>
            )}
          </InfoCard>

          {/* Time & Schedule */}
          <SectionHeader icon={<Calendar size={18} />} title="Thời gian & Lưu trữ" />
          <InfoCard>
            <InfoRow label="Người yêu cầu" value={job.export_jobs_requested_by} icon={<User size={14} />} />
            <InfoRow label="Thời gian yêu cầu" value={formatDateTime(job.export_jobs_requested_at)} />
            <InfoRow
              label="Thời gian hoàn thành"
              value={formatDateTime(job.export_jobs_completed_at)}
              highlight={job.export_jobs_status === 'Completed'}
            />
            <InfoRow
              label="Chính sách lưu trữ"
              value={job.export_jobs_retention_policy}
              badge={{
                text: job.export_jobs_retention_policy,
                color:
                  job.export_jobs_retention_policy.includes('90')
                    ? '#1976d2'
                    : job.export_jobs_retention_policy.includes('30')
                      ? '#155724'
                      : '#856404',
                bg:
                  job.export_jobs_retention_policy.includes('90')
                    ? '#e3f2fd'
                    : job.export_jobs_retention_policy.includes('30')
                      ? '#d4edda'
                      : '#fff3cd',
              }}
            />
            {job.export_jobs_status === 'Completed' && (
              <InfoRow label="Hết hạn vào" value={getExpiryDate()} />
            )}
          </InfoCard>

          {/* Download History */}
          {job.export_jobs_download_history && job.export_jobs_download_history.length > 0 && (
            <>
              <SectionHeader icon={<History size={18} />} title="Lịch sử tải xuống" />
              <div
                style={{
                  background: 'white',
                  border: '1px solid var(--border, #d0d5dd)',
                  borderRadius: 'var(--radius, 6px)',
                  marginBottom: '24px',
                  overflow: 'hidden',
                }}
              >
                {job.export_jobs_download_history.map((history, index) => (
                  <div
                    key={history.download_id}
                    style={{
                      padding: '16px',
                      borderBottom:
                        index < job.export_jobs_download_history!.length - 1
                          ? '1px solid var(--border, #d0d5dd)'
                          : 'none',
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: '12px',
                    }}
                  >
                    <div
                      style={{
                        width: '8px',
                        height: '8px',
                        borderRadius: '50%',
                        background: '#155724',
                        marginTop: '6px',
                        flexShrink: 0,
                      }}
                    />
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px',
                          marginBottom: '4px',
                        }}
                      >
                        <User size={14} style={{ color: 'var(--muted-foreground, #667085)' }} />
                        <span
                          style={{
                            fontFamily: 'Inter, sans-serif',
                            fontSize: '14px',
                            fontWeight: 500,
                            color: 'var(--foreground, #101828)',
                          }}
                        >
                          {history.downloaded_by.split('(')[0].trim()}
                        </span>
                      </div>
                      <div
                        style={{
                          fontSize: '13px',
                          color: 'var(--muted-foreground, #667085)',
                          fontFamily: 'Inter, sans-serif',
                        }}
                      >
                        📅 {formatDateTime(history.downloaded_at)}
                      </div>
                      {history.download_ip && (
                        <div
                          style={{
                            fontSize: '12px',
                            color: 'var(--muted-foreground, #667085)',
                            fontFamily: 'monospace',
                            marginTop: '4px',
                          }}
                        >
                          🌐 IP: {history.download_ip}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}

          {/* Empty Download History */}
          {job.export_jobs_download_history && job.export_jobs_download_history.length === 0 && (
            <>
              <SectionHeader icon={<History size={18} />} title="Lịch sử tải xuống" />
              <div
                style={{
                  padding: '32px 16px',
                  textAlign: 'center',
                  background: 'var(--muted, #f9fafb)',
                  border: '1px solid var(--border, #d0d5dd)',
                  borderRadius: 'var(--radius, 6px)',
                  marginBottom: '24px',
                }}
              >
                <History
                  size={48}
                  style={{ color: 'var(--muted-foreground, #667085)', marginBottom: '12px' }}
                />
                <p
                  style={{
                    margin: 0,
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    color: 'var(--muted-foreground, #667085)',
                  }}
                >
                  Chưa có lịch sử tải xuống
                </p>
              </div>
            </>
          )}
        </div>
      </div>
    </>
  );
};

// Helper Components

const SectionHeader: React.FC<{ icon: React.ReactNode; title: string }> = ({ icon, title }) => (
  <div
    style={{
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '12px',
      marginTop: '24px',
    }}
  >
    <div style={{ color: 'var(--primary, #005cb6)' }}>{icon}</div>
    <h3
      style={{
        margin: 0,
        fontFamily: 'Inter, sans-serif',
        fontSize: '16px',
        fontWeight: 600,
        color: 'var(--foreground, #101828)',
      }}
    >
      {title}
    </h3>
  </div>
);

const InfoCard: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div
    style={{
      background: 'white',
      border: '1px solid var(--border, #d0d5dd)',
      borderRadius: 'var(--radius, 6px)',
      marginBottom: '16px',
      overflow: 'hidden',
    }}
  >
    {children}
  </div>
);

const InfoRow: React.FC<{
  label: string;
  value: string;
  icon?: React.ReactNode;
  mono?: boolean;
  highlight?: boolean;
  badge?: { text: string; color: string; bg: string };
  style?: React.CSSProperties;
}> = ({ label, value, icon, mono, highlight, badge, style }) => (
  <div
    style={{
      padding: '14px 16px',
      borderBottom: '1px solid var(--border, #d0d5dd)',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      gap: '12px',
    }}
  >
    <span
      style={{
        fontFamily: 'Inter, sans-serif',
        fontSize: '13px',
        fontWeight: 500,
        color: 'var(--muted-foreground, #667085)',
        display: 'flex',
        alignItems: 'center',
        gap: '6px',
      }}
    >
      {icon}
      {label}
    </span>
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      {badge && (
        <span
          style={{
            padding: '4px 10px',
            borderRadius: '6px',
            fontSize: '11px',
            fontWeight: 600,
            fontFamily: 'Inter, sans-serif',
            color: badge.color,
            background: badge.bg,
          }}
        >
          {badge.text}
        </span>
      )}
      <span
        style={{
          fontFamily: mono ? 'monospace' : 'Inter, sans-serif',
          fontSize: mono ? '12px' : '14px',
          fontWeight: highlight ? 600 : 400,
          color: highlight ? '#155724' : 'var(--foreground, #101828)',
          textAlign: 'right',
          ...style,
        }}
      >
        {value}
      </span>
    </div>
  </div>
);