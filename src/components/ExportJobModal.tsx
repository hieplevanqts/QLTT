/**
 * Export Job Modal - MAPPA Portal
 * Modal để xem chi tiết và tạo export job
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

import React, { useState } from 'react';
import { X, Download, AlertCircle, CheckCircle, Clock } from 'lucide-react';
import {
  ExportJob,
  SourceType,
  getStatusBadgeStyle,
  getSourceTypeIcon,
  getSourceTypeLabel,
  getSourceTypeBadgeStyle,
  formatFileSize,
  formatDateTime,
  getRetentionPolicyBadge,
  ALL_SOURCE_TYPES,
} from '../app/data/exportJobsTemplates';

interface ExportJobModalProps {
  job?: ExportJob | null;
  mode: 'view' | 'add';
  onClose: () => void;
  onSave: (data: Partial<ExportJob>) => void;
}

export const ExportJobModal: React.FC<ExportJobModalProps> = ({ job, mode, onClose, onSave }) => {
  const isViewMode = mode === 'view';

  // Form state (cho mode 'add')
  const [sourceName, setSourceName] = useState(job?.export_jobs_source_name || '');
  const [sourceType, setSourceType] = useState<SourceType>(
    job?.export_jobs_source_type || 'REPORT_RUN'
  );
  const [retentionPolicy, setRetentionPolicy] = useState(job?.export_jobs_retention_policy || '7 days');

  const handleSave = () => {
    if (!sourceName.trim()) {
      alert('Vui lòng nhập tên nguồn dữ liệu');
      return;
    }

    onSave({
      export_jobs_source_name: sourceName,
      export_jobs_source_type: sourceType,
      export_jobs_retention_policy: retentionPolicy,
    });
  };

  const getStatusIcon = () => {
    if (!job) return null;
    switch (job.export_jobs_status) {
      case 'Completed':
        return <CheckCircle size={24} style={{ color: '#155724' }} />;
      case 'Processing':
        return <Clock size={24} style={{ color: '#856404' }} className="animate-spin" />;
      case 'Failed':
        return <AlertCircle size={24} style={{ color: '#721c24' }} />;
      case 'Expired':
        return <AlertCircle size={24} style={{ color: '#6b7280' }} />;
      default:
        return null;
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        background: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 1000,
        padding: '20px',
      }}
      onClick={onClose}
    >
      <div
        style={{
          background: 'var(--card, white)',
          borderRadius: 'var(--radius-lg, 8px)',
          maxWidth: '700px',
          width: '100%',
          maxHeight: '90vh',
          overflow: 'auto',
          boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div
          style={{
            padding: '20px',
            borderBottom: '1px solid var(--border, #d0d5dd)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            position: 'sticky',
            top: 0,
            background: 'var(--card, white)',
            zIndex: 10,
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {isViewMode && getStatusIcon()}
            <h2
              style={{
                margin: 0,
                fontFamily: 'Inter, sans-serif',
                fontSize: '18px',
                fontWeight: 700,
                color: 'var(--foreground, #101828)',
              }}
            >
              {isViewMode ? `Chi Tiết Export Job: ${job?.export_jobs_id}` : 'Tạo Export Job Mới'}
            </h2>
          </div>
          <button
            onClick={onClose}
            style={{
              padding: '6px',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              borderRadius: 'var(--radius, 4px)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.background = 'var(--muted, #f9fafb)')}
            onMouseLeave={(e) => (e.currentTarget.style.background = 'transparent')}
          >
            <X size={20} style={{ color: 'var(--muted-foreground, #667085)' }} />
          </button>
        </div>

        {/* Body */}
        <div style={{ padding: '20px' }}>
          {isViewMode && job ? (
            // VIEW MODE
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
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
                          : '#e3f2fd',
                  borderRadius: 'var(--radius)',
                  border: `1px solid ${
                    job.export_jobs_status === 'Completed'
                      ? '#155724'
                      : job.export_jobs_status === 'Failed'
                        ? '#721c24'
                        : job.export_jobs_status === 'Processing'
                          ? '#856404'
                          : '#1976d2'
                  }`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  {getStatusIcon()}
                  <div>
                    <div style={getStatusBadgeStyle(job.export_jobs_status)}>
                      {job.export_jobs_status}
                    </div>
                  </div>
                </div>
                {job.export_jobs_status === 'Completed' && job.export_jobs_file_url && (
                  <button
                    style={{
                      padding: '8px 16px',
                      background: '#155724',
                      color: 'white',
                      border: 'none',
                      borderRadius: 'var(--radius)',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: 500,
                    }}
                  >
                    <Download size={16} />
                    Tải Xuống
                  </button>
                )}
              </div>

              {/* Error Message (if failed) */}
              {job.export_jobs_status === 'Failed' && job.export_jobs_error_message && (
                <div
                  style={{
                    padding: '12px',
                    background: '#f8d7da',
                    border: '1px solid #721c24',
                    borderRadius: 'var(--radius)',
                    display: 'flex',
                    gap: '8px',
                  }}
                >
                  <AlertCircle size={20} style={{ color: '#721c24', flexShrink: 0 }} />
                  <div>
                    <strong
                      style={{
                        display: 'block',
                        marginBottom: '4px',
                        color: '#721c24',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                      }}
                    >
                      Lỗi:
                    </strong>
                    <p
                      style={{
                        margin: 0,
                        color: '#721c24',
                        fontFamily: 'Inter, sans-serif',
                        fontSize: '14px',
                      }}
                    >
                      {job.export_jobs_error_message}
                    </p>
                  </div>
                </div>
              )}

              {/* Job Details Grid */}
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr 1fr',
                  gap: '16px',
                }}
              >
                <DetailField label="Job ID" value={job.export_jobs_id} mono />
                <DetailField
                  label="Source Type"
                  value={`${getSourceTypeIcon(job.export_jobs_source_type)} ${getSourceTypeLabel(job.export_jobs_source_type)}`}
                />
                <DetailField label="Requested By" value={job.export_jobs_requested_by} />
                <DetailField
                  label="Requested At"
                  value={formatDateTime(job.export_jobs_requested_at)}
                />
                {job.export_jobs_completed_at && (
                  <DetailField
                    label="Completed At"
                    value={formatDateTime(job.export_jobs_completed_at)}
                  />
                )}
                <DetailField
                  label="Download Count"
                  value={String(job.export_jobs_download_count)}
                />
                <DetailField
                  label="Kích Thước File"
                  value={formatFileSize(job.export_jobs_file_size)}
                />
                <DetailField label="Retention Policy" value={job.export_jobs_retention_policy} />
              </div>

              {/* Source Name */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--foreground, #101828)',
                    marginBottom: '8px',
                  }}
                >
                  Source Name
                </label>
                <p
                  style={{
                    margin: 0,
                    padding: '10px 14px',
                    background: 'var(--muted, #f9fafb)',
                    border: '1px solid var(--border, #d0d5dd)',
                    borderRadius: 'var(--radius)',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    color: 'var(--foreground, #101828)',
                  }}
                >
                  {job.export_jobs_source_name}
                </p>
              </div>

              {/* File URL */}
              {job.export_jobs_file_url && (
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--foreground, #101828)',
                      marginBottom: '8px',
                    }}
                  >
                    File URL
                  </label>
                  <p
                    style={{
                      margin: 0,
                      padding: '10px 14px',
                      background: 'var(--muted, #f9fafb)',
                      border: '1px solid var(--border, #d0d5dd)',
                      borderRadius: 'var(--radius)',
                      fontFamily: 'monospace',
                      fontSize: '12px',
                      color: '#1976d2',
                      wordBreak: 'break-all',
                    }}
                  >
                    {job.export_jobs_file_url}
                  </p>
                </div>
              )}
            </div>
          ) : (
            // ADD MODE
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {/* Source Name */}
              <div>
                <label
                  style={{
                    display: 'block',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    fontWeight: 600,
                    color: 'var(--foreground, #101828)',
                    marginBottom: '8px',
                  }}
                >
                  Source Name <span style={{ color: 'var(--destructive, #ef4444)' }}>*</span>
                </label>
                <input
                  type="text"
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="VD: Export danh sách thông báo Q4/2025"
                  style={{
                    width: '100%',
                    padding: '10px 14px',
                    fontFamily: 'Inter, sans-serif',
                    fontSize: '14px',
                    border: '1px solid var(--border, #d0d5dd)',
                    borderRadius: 'var(--radius, 6px)',
                    background: 'white',
                    color: 'var(--foreground, #101828)',
                  }}
                />
              </div>

              {/* Source Type & Retention Policy */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                <div>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--foreground, #101828)',
                      marginBottom: '8px',
                    }}
                  >
                    Source Type <span style={{ color: 'var(--destructive, #ef4444)' }}>*</span>
                  </label>
                  <select
                    value={sourceType}
                    onChange={(e) => setSourceType(e.target.value as SourceType)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      border: '1px solid var(--border, #d0d5dd)',
                      borderRadius: 'var(--radius, 6px)',
                      background: 'white',
                      color: 'var(--foreground, #101828)',
                    }}
                  >
                    {ALL_SOURCE_TYPES.map((type) => (
                      <option key={type} value={type}>
                        {getSourceTypeLabel(type)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label
                    style={{
                      display: 'block',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      fontWeight: 600,
                      color: 'var(--foreground, #101828)',
                      marginBottom: '8px',
                    }}
                  >
                    Retention Policy <span style={{ color: 'var(--destructive, #ef4444)' }}>*</span>
                  </label>
                  <select
                    value={retentionPolicy}
                    onChange={(e) => setRetentionPolicy(e.target.value)}
                    style={{
                      width: '100%',
                      padding: '10px 14px',
                      fontFamily: 'Inter, sans-serif',
                      fontSize: '14px',
                      border: '1px solid var(--border, #d0d5dd)',
                      borderRadius: 'var(--radius, 6px)',
                      background: 'white',
                      color: 'var(--foreground, #101828)',
                    }}
                  >
                    <option value="7 days">7 days</option>
                    <option value="30 days">30 days</option>
                    <option value="90 days">90 days</option>
                  </select>
                </div>
              </div>

              {/* Info Note */}
              <div
                style={{
                  padding: '12px',
                  background: '#e3f2fd',
                  border: '1px solid #1976d2',
                  borderRadius: 'var(--radius)',
                  display: 'flex',
                  gap: '8px',
                }}
              >
                <AlertCircle size={20} style={{ color: '#1976d2', flexShrink: 0 }} />
                <p
                  style={{
                    margin: 0,
                    fontSize: '13px',
                    color: '#1976d2',
                    fontFamily: 'Inter, sans-serif',
                  }}
                >
                  Job sẽ được đưa vào hàng đợi và xử lý theo thứ tự. File export sẽ được lưu trữ theo retention policy đã chọn.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {!isViewMode && (
          <div
            style={{
              padding: '21px 20px',
              borderTop: '1px solid var(--border, #d0d5dd)',
              display: 'flex',
              gap: '12px',
              justifyContent: 'flex-end',
              position: 'sticky',
              bottom: 0,
              background: 'var(--card, white)',
            }}
          >
            <button
              onClick={onClose}
              style={{
                padding: '11px 19px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                border: '1px solid var(--border, #d0d5dd)',
                borderRadius: 'var(--radius, 6px)',
                background: 'white',
                color: 'var(--foreground, #101828)',
                cursor: 'pointer',
              }}
            >
              Hủy
            </button>
            <button
              onClick={handleSave}
              style={{
                padding: '11px 19px',
                fontFamily: 'Inter, sans-serif',
                fontSize: '14px',
                fontWeight: 500,
                border: 'none',
                borderRadius: 'var(--radius, 6px)',
                background: 'var(--primary, #005cb6)',
                color: 'white',
                cursor: 'pointer',
              }}
            >
              Tạo Export Job
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

// Helper component for detail fields
const DetailField: React.FC<{
  label: string;
  value: string;
  mono?: boolean;
  style?: React.CSSProperties;
}> = ({ label, value, mono, style }) => (
  <div>
    <label
      style={{
        display: 'block',
        fontFamily: 'Inter, sans-serif',
        fontSize: '12px',
        fontWeight: 600,
        color: 'var(--muted-foreground, #667085)',
        marginBottom: '4px',
        textTransform: 'uppercase',
      }}
    >
      {label}
    </label>
    <p
      style={{
        margin: 0,
        fontFamily: mono ? 'monospace' : 'Inter, sans-serif',
        fontSize: '14px',
        color: 'var(--foreground, #101828)',
        ...style,
      }}
    >
      {value}
    </p>
  </div>
);