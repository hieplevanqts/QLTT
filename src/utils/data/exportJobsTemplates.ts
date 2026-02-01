/**
 * Export Jobs Data Templates - MAPPA Portal
 * Data structures và helper functions cho Export Center
 * Match với database schema: export_jobs table
 */

// Types
export type ExportJobStatus = 'Pending' | 'Processing' | 'Completed' | 'Failed' | 'Cancelled' | 'Expired';
export type SourceType = 'REPORT_RUN' | 'AUDIT_EXCERPT';
export type MonitorItemStatus = 'pending' | 'in_progress' | 'completed' | 'failed';

export interface JobMonitorItem {
  stage_id: string;
  stage_name: string;
  stage_status: MonitorItemStatus;
  stage_progress: number; // 0-100
  stage_started_at?: string;
  stage_completed_at?: string;
  stage_message?: string;
}

export interface DownloadHistoryItem {
  download_id: string;
  downloaded_by: string;
  downloaded_at: string;
  download_ip?: string;
  download_user_agent?: string;
}

export interface ExportJob {
  export_jobs_id: string; // Job ID
  export_jobs_source_name: string; // Source Name (VD: "Quy tắc thông báo Q4 2025")
  export_jobs_source_type: SourceType; // Source Type
  export_jobs_requested_by: string; // Requested By (User name/email)
  export_jobs_status: ExportJobStatus; // Status
  export_jobs_requested_at: string; // Requested At (ISO datetime)
  export_jobs_completed_at?: string; // Completed At (ISO datetime)
  export_jobs_download_count: number; // Download Count
  export_jobs_retention_policy: string; // Retention Policy (VD: "7 days", "30 days")
  export_jobs_progress?: number; // Processing progress (0-100)
  export_jobs_file_format?: string; // File format (Excel, CSV, PDF)
  
  // Additional fields for functionality
  export_jobs_file_url?: string;
  export_jobs_file_size?: number;
  export_jobs_error_message?: string; // Deprecated: Use error_summary instead
  export_jobs_error_summary?: string; // Short error summary
  export_jobs_error_detail?: string; // Detailed error information
  export_jobs_created_at: string;
  export_jobs_updated_at: string;
  export_jobs_download_history?: DownloadHistoryItem[];
  export_jobs_monitor_items?: JobMonitorItem[]; // Processing stages monitoring
}

// Constants
export const ALL_EXPORT_STATUSES: ExportJobStatus[] = [
  'Pending',
  'Processing',
  'Completed',
  'Failed',
  'Cancelled',
  'Expired',
];

export const ALL_SOURCE_TYPES: SourceType[] = [
  'REPORT_RUN',
  'AUDIT_EXCERPT',
];

// Helper Functions
export const getStatusBadgeStyle = (status: ExportJobStatus): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '4px 12px',
    borderRadius: '12px',
    fontSize: '12px',
    fontWeight: 500,
    fontFamily: 'Inter, sans-serif',
  };

  switch (status) {
    case 'Completed':
      return { ...baseStyle, background: '#d4edda', color: '#155724' };
    case 'Processing':
      return { ...baseStyle, background: '#fff3cd', color: '#856404' };
    case 'Pending':
      return { ...baseStyle, background: '#e3f2fd', color: '#1976d2' };
    case 'Failed':
      return { ...baseStyle, background: '#f8d7da', color: '#721c24' };
    case 'Cancelled':
      return { ...baseStyle, background: '#e0e0e0', color: '#424242' };
    case 'Expired':
      return { ...baseStyle, background: '#f3f4f6', color: '#6b7280' };
    default:
      return baseStyle;
  }
};

export const getSourceTypeLabel = (sourceType: SourceType): string => {
  const labels: Record<SourceType, string> = {
    REPORT_RUN: 'Quy tắc thông báo',
    AUDIT_EXCERPT: 'Nhật ký audit',
  };
  return labels[sourceType] || sourceType;
};

export const getSourceTypeIcon = (sourceType: SourceType): string => {
  const icons: Record<SourceType, string> = {
    REPORT_RUN: '🔔',
    AUDIT_EXCERPT: '📋',
  };
  return icons[sourceType] || '📁';
};

export const getSourceTypeBadgeStyle = (sourceType: SourceType): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-flex',
    alignItems: 'center',
    gap: '4px',
    padding: '4px 10px',
    borderRadius: '6px',
    fontSize: '12px',
    fontWeight: 600,
    fontFamily: 'Inter, sans-serif',
  };

  switch (sourceType) {
    case 'REPORT_RUN':
      return {
        ...baseStyle,
        background: '#e3f2fd',
        color: '#1976d2',
        border: '1px solid #90caf9',
      };
    case 'AUDIT_EXCERPT':
      return {
        ...baseStyle,
        background: '#fff3e0',
        color: '#e65100',
        border: '1px solid #ffb74d',
        fontWeight: 700,
        boxShadow: '0 0 0 3px rgba(230, 81, 0, 0.1)',
      };
    default:
      return baseStyle;
  }
};

export const formatFileSize = (bytes?: number): string => {
  if (!bytes) return '-';
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(1)} GB`;
};

export const formatDateTime = (isoString?: string): string => {
  if (!isoString) return '-';
  const date = new Date(isoString);
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${day}/${month}/${year} ${hours}:${minutes}`;
};

export const getRetentionPolicyBadge = (policy: string): React.CSSProperties => {
  const baseStyle: React.CSSProperties = {
    display: 'inline-block',
    padding: '4px 10px',
    borderRadius: '8px',
    fontSize: '12px',
    fontWeight: 500,
    fontFamily: 'Inter, sans-serif',
  };

  if (policy.includes('7')) {
    return { ...baseStyle, background: '#fff3cd', color: '#856404' };
  } else if (policy.includes('30')) {
    return { ...baseStyle, background: '#d4edda', color: '#155724' };
  } else if (policy.includes('90')) {
    return { ...baseStyle, background: '#e3f2fd', color: '#1976d2' };
  }
  return { ...baseStyle, background: '#f3f4f6', color: '#6b7280' };
};

// Sample Data
export const SAMPLE_EXPORT_JOBS: ExportJob[] = [
  {
    export_jobs_id: 'EXP_001',
    export_jobs_source_name: 'Export Quy tắc thông báo - Q4 2025',
    export_jobs_source_type: 'REPORT_RUN',
    export_jobs_requested_by: 'Nguyễn Văn Admin (admin@mappa.gov.vn)',
    export_jobs_status: 'Completed',
    export_jobs_requested_at: '2025-01-15T08:30:00Z',
    export_jobs_completed_at: '2025-01-15T08:32:45Z',
    export_jobs_download_count: 5,
    export_jobs_retention_policy: '7 days',
    export_jobs_progress: 100,
    export_jobs_file_format: 'Excel (.xlsx)',
    export_jobs_file_url: 'https://storage.mappa.gov.vn/exports/EXP_001.xlsx',
    export_jobs_file_size: 2458624,
    export_jobs_created_at: '2025-01-15T08:30:00Z',
    export_jobs_updated_at: '2025-01-15T08:32:45Z',
    export_jobs_download_history: [
      {
        download_id: 'DL_001_001',
        downloaded_by: 'Nguyễn Văn Admin (admin@mappa.gov.vn)',
        downloaded_at: '2025-01-15T08:35:00Z',
        download_ip: '192.168.1.100',
      },
      {
        download_id: 'DL_001_002',
        downloaded_by: 'Trần Thị Kiểm Tra (test@mappa.gov.vn)',
        downloaded_at: '2025-01-15T09:10:00Z',
        download_ip: '192.168.1.105',
      },
      {
        download_id: 'DL_001_003',
        downloaded_by: 'Nguyễn Văn Admin (admin@mappa.gov.vn)',
        downloaded_at: '2025-01-15T10:20:00Z',
        download_ip: '192.168.1.100',
      },
      {
        download_id: 'DL_001_004',
        downloaded_by: 'Lê Văn Supervisor (supervisor@mappa.gov.vn)',
        downloaded_at: '2025-01-15T11:45:00Z',
        download_ip: '192.168.1.110',
      },
      {
        download_id: 'DL_001_005',
        downloaded_by: 'Hoàng Văn Analyst (analyst@mappa.gov.vn)',
        downloaded_at: '2025-01-15T14:30:00Z',
        download_ip: '192.168.1.115',
      },
    ],
  },
  {
    export_jobs_id: 'EXP_002',
    export_jobs_source_name: 'Export Danh sách người dùng - Toàn hệ thống',
    export_jobs_source_type: 'REPORT_RUN',
    export_jobs_requested_by: 'Trần Thị Kiểm Tra (test@mappa.gov.vn)',
    export_jobs_status: 'Processing',
    export_jobs_requested_at: '2025-01-15T09:15:00Z',
    export_jobs_download_count: 0,
    export_jobs_retention_policy: '30 days',
    export_jobs_progress: 67,
    export_jobs_file_format: 'Excel (.xlsx)',
    export_jobs_created_at: '2025-01-15T09:15:00Z',
    export_jobs_updated_at: '2025-01-15T09:18:30Z',
    export_jobs_download_history: [],
    export_jobs_monitor_items: [
      {
        stage_id: 'stage_1',
        stage_name: 'Xác thực yêu cầu',
        stage_status: 'completed',
        stage_progress: 100,
        stage_started_at: '2025-01-15T09:15:00Z',
        stage_completed_at: '2025-01-15T09:15:05Z',
        stage_message: 'Xác thực thành công - Người dùng có quyền truy cập',
      },
      {
        stage_id: 'stage_2',
        stage_name: 'Truy vấn cơ sở dữ liệu',
        stage_status: 'completed',
        stage_progress: 100,
        stage_started_at: '2025-01-15T09:15:05Z',
        stage_completed_at: '2025-01-15T09:16:45Z',
        stage_message: 'Đã truy vấn 1,250 records từ bảng users',
      },
      {
        stage_id: 'stage_3',
        stage_name: 'Xử lý và định dạng dữ liệu',
        stage_status: 'completed',
        stage_progress: 100,
        stage_started_at: '2025-01-15T09:16:45Z',
        stage_completed_at: '2025-01-15T09:17:30Z',
        stage_message: 'Đã xử lý và format tất cả records',
      },
      {
        stage_id: 'stage_4',
        stage_name: 'Tạo file Excel',
        stage_status: 'in_progress',
        stage_progress: 67,
        stage_started_at: '2025-01-15T09:17:30Z',
        stage_message: 'Đang tạo workbook với 5 sheets... (Sheet 4/6)',
      },
      {
        stage_id: 'stage_5',
        stage_name: 'Upload lên Storage',
        stage_status: 'pending',
        stage_progress: 0,
        stage_message: 'Chờ stage trước hoàn thành',
      },
      {
        stage_id: 'stage_6',
        stage_name: 'Hoàn tất',
        stage_status: 'pending',
        stage_progress: 0,
        stage_message: 'Chờ stage trước hoàn thành',
      },
    ],
  },
  {
    export_jobs_id: 'EXP_003',
    export_jobs_source_name: 'Export Cơ sở quản lý - Miền Bắc',
    export_jobs_source_type: 'REPORT_RUN',
    export_jobs_requested_by: 'Lê Văn Supervisor (supervisor@mappa.gov.vn)',
    export_jobs_status: 'Failed',
    export_jobs_requested_at: '2025-01-15T07:45:00Z',
    export_jobs_download_count: 0,
    export_jobs_retention_policy: '7 days',
    export_jobs_progress: 23,
    export_jobs_file_format: 'Excel (.xlsx)',
    export_jobs_error_summary: 'Database Connection Timeout',
    export_jobs_error_detail: `Lỗi kết nối database sau 30 giây timeout.

Chi tiết kỹ thuật:
- Error Code: DB_TIMEOUT_001
- Database: PostgreSQL 14.5
- Host: db.mappa.gov.vn:5432
- Database Name: mappa_production
- Connection Pool: Exhausted (max 100 connections)
- Attempted Retries: 3
- Last Error: ETIMEDOUT (Connection timed out)

Stack Trace:
at PostgresConnection.connect (postgres.js:245)
at QueryExecutor.execute (executor.js:112)
at ExportService.fetchAreasData (export-service.js:89)
at ExportJobWorker.processJob (worker.js:156)

Nguyên nhân có thể:
1. Database server đang quá tải (CPU > 90%)
2. Connection pool đã đạt giới hạn
3. Query chậm do thiếu index trên bảng areas
4. Network latency cao giữa app server và database

Khuyến nghị:
- Kiểm tra performance của database server
- Tăng connection pool size nếu cần
- Optimize query với EXPLAIN ANALYZE
- Thêm index vào các cột được filter nhiều`,
    export_jobs_created_at: '2025-01-15T07:45:00Z',
    export_jobs_updated_at: '2025-01-15T07:48:15Z',
    export_jobs_download_history: [],
  },
  {
    export_jobs_id: 'EXP_004',
    export_jobs_source_name: 'Export Audit Logs - Tháng 01/2025',
    export_jobs_source_type: 'AUDIT_EXCERPT',
    export_jobs_requested_by: 'Phạm Thị Security (security@mappa.gov.vn)',
    export_jobs_status: 'Completed',
    export_jobs_requested_at: '2025-01-14T16:20:00Z',
    export_jobs_completed_at: '2025-01-14T16:25:35Z',
    export_jobs_download_count: 12,
    export_jobs_retention_policy: '90 days',
    export_jobs_progress: 100,
    export_jobs_file_format: 'JSON (.json)',
    export_jobs_file_url: 'https://storage.mappa.gov.vn/exports/EXP_004.json',
    export_jobs_file_size: 5896421,
    export_jobs_created_at: '2025-01-14T16:20:00Z',
    export_jobs_updated_at: '2025-01-14T16:25:35Z',
    export_jobs_download_history: [
      {
        download_id: 'DL_004_001',
        downloaded_by: 'Phạm Thị Security (security@mappa.gov.vn)',
        downloaded_at: '2025-01-14T16:27:00Z',
        download_ip: '192.168.1.120',
      },
      {
        download_id: 'DL_004_002',
        downloaded_by: 'Phạm Thị Security (security@mappa.gov.vn)',
        downloaded_at: '2025-01-14T17:00:00Z',
        download_ip: '192.168.1.120',
      },
      {
        download_id: 'DL_004_003',
        downloaded_by: 'Vũ Thị Director (director@mappa.gov.vn)',
        downloaded_at: '2025-01-14T18:15:00Z',
        download_ip: '192.168.1.200',
      },
    ],
  },
  {
    export_jobs_id: 'EXP_005',
    export_jobs_source_name: 'Export Danh mục - Tất cả',
    export_jobs_source_type: 'REPORT_RUN',
    export_jobs_requested_by: 'Hoàng Văn Analyst (analyst@mappa.gov.vn)',
    export_jobs_status: 'Pending',
    export_jobs_requested_at: '2025-01-15T09:30:00Z',
    export_jobs_download_count: 0,
    export_jobs_retention_policy: '30 days',
    export_jobs_progress: 0,
    export_jobs_file_format: 'Excel (.xlsx)',
    export_jobs_created_at: '2025-01-15T09:30:00Z',
    export_jobs_updated_at: '2025-01-15T09:30:00Z',
    export_jobs_download_history: [],
  },
  {
    export_jobs_id: 'EXP_006',
    export_jobs_source_name: 'Export Ngân hàng - Active Only',
    export_jobs_source_type: 'REPORT_RUN',
    export_jobs_requested_by: 'Đỗ Thị Manager (manager@mappa.gov.vn)',
    export_jobs_status: 'Completed',
    export_jobs_requested_at: '2025-01-14T14:00:00Z',
    export_jobs_completed_at: '2025-01-14T14:01:12Z',
    export_jobs_download_count: 3,
    export_jobs_retention_policy: '7 days',
    export_jobs_progress: 100,
    export_jobs_file_format: 'Excel (.xlsx)',
    export_jobs_file_url: 'https://storage.mappa.gov.vn/exports/EXP_006.xlsx',
    export_jobs_file_size: 458932,
    export_jobs_created_at: '2025-01-14T14:00:00Z',
    export_jobs_updated_at: '2025-01-14T14:01:12Z',
    export_jobs_download_history: [],
  },
  {
    export_jobs_id: 'EXP_007',
    export_jobs_source_name: 'Export Quy tắc thông báo - Failed Only',
    export_jobs_source_type: 'REPORT_RUN',
    export_jobs_requested_by: 'Nguyễn Văn Admin (admin@mappa.gov.vn)',
    export_jobs_status: 'Cancelled',
    export_jobs_requested_at: '2025-01-13T11:20:00Z',
    export_jobs_download_count: 0,
    export_jobs_retention_policy: '7 days',
    export_jobs_progress: 0,
    export_jobs_file_format: 'Excel (.xlsx)',
    export_jobs_created_at: '2025-01-13T11:20:00Z',
    export_jobs_updated_at: '2025-01-13T11:22:10Z',
    export_jobs_download_history: [],
  },
  {
    export_jobs_id: 'EXP_008',
    export_jobs_source_name: 'Export Người dùng - Role: Supervisor',
    export_jobs_source_type: 'REPORT_RUN',
    export_jobs_requested_by: 'Vũ Thị Director (director@mappa.gov.vn)',
    export_jobs_status: 'Completed',
    export_jobs_requested_at: '2025-01-12T10:15:00Z',
    export_jobs_completed_at: '2025-01-12T10:16:45Z',
    export_jobs_download_count: 8,
    export_jobs_retention_policy: '30 days',
    export_jobs_progress: 100,
    export_jobs_file_format: 'Excel (.xlsx)',
    export_jobs_file_url: 'https://storage.mappa.gov.vn/exports/EXP_008.xlsx',
    export_jobs_file_size: 782451,
    export_jobs_created_at: '2025-01-12T10:15:00Z',
    export_jobs_updated_at: '2025-01-12T10:16:45Z',
    export_jobs_download_history: [],
  },
  {
    export_jobs_id: 'EXP_009',
    export_jobs_source_name: 'Export Cơ sở Đà Nẵng - Full Data',
    export_jobs_source_type: 'REPORT_RUN',
    export_jobs_requested_by: 'Nguyễn Văn Admin (admin@mappa.gov.vn)',
    export_jobs_status: 'Completed',
    export_jobs_requested_at: '2025-01-11T15:20:00Z',
    export_jobs_completed_at: '2025-01-11T15:22:30Z',
    export_jobs_download_count: 15,
    export_jobs_retention_policy: '90 days',
    export_jobs_progress: 100,
    export_jobs_file_format: 'Excel (.xlsx)',
    export_jobs_file_url: 'https://storage.mappa.gov.vn/exports/EXP_009.xlsx',
    export_jobs_file_size: 1245678,
    export_jobs_created_at: '2025-01-11T15:20:00Z',
    export_jobs_updated_at: '2025-01-11T15:22:30Z',
    export_jobs_download_history: [],
  },
  {
    export_jobs_id: 'EXP_010',
    export_jobs_source_name: 'Export Danh mục - Financial Only',
    export_jobs_source_type: 'REPORT_RUN',
    export_jobs_requested_by: 'Hoàng Văn Analyst (analyst@mappa.gov.vn)',
    export_jobs_status: 'Completed',
    export_jobs_requested_at: '2025-01-10T10:00:00Z',
    export_jobs_completed_at: '2025-01-10T10:01:45Z',
    export_jobs_download_count: 2,
    export_jobs_retention_policy: '7 days',
    export_jobs_progress: 100,
    export_jobs_file_format: 'PDF (.pdf)',
    export_jobs_file_url: 'https://storage.mappa.gov.vn/exports/EXP_010.pdf',
    export_jobs_file_size: 324567,
    export_jobs_created_at: '2025-01-10T10:00:00Z',
    export_jobs_updated_at: '2025-01-10T10:01:45Z',
    export_jobs_download_history: [],
  },
  {
    export_jobs_id: 'EXP_011',
    export_jobs_source_name: 'Export Người dùng - Q3 2024',
    export_jobs_source_type: 'REPORT_RUN',
    export_jobs_requested_by: 'Trần Thị Kiểm Tra (test@mappa.gov.vn)',
    export_jobs_status: 'Expired',
    export_jobs_requested_at: '2024-10-15T10:00:00Z',
    export_jobs_completed_at: '2024-10-15T10:05:30Z',
    export_jobs_download_count: 3,
    export_jobs_retention_policy: '7 days',
    export_jobs_progress: 100,
    export_jobs_file_format: 'Excel (.xlsx)',
    export_jobs_file_url: undefined, // File đã expired
    export_jobs_file_size: 1234567,
    export_jobs_created_at: '2024-10-15T10:00:00Z',
    export_jobs_updated_at: '2024-10-22T10:05:30Z',
    export_jobs_download_history: [],
  },
  {
    export_jobs_id: 'EXP_012',
    export_jobs_source_name: 'Export Audit Logs - Tháng 12/2024',
    export_jobs_source_type: 'AUDIT_EXCERPT',
    export_jobs_requested_by: 'Phạm Thị Security (security@mappa.gov.vn)',
    export_jobs_status: 'Expired',
    export_jobs_requested_at: '2024-12-01T08:00:00Z',
    export_jobs_completed_at: '2024-12-01T08:10:15Z',
    export_jobs_download_count: 7,
    export_jobs_retention_policy: '30 days',
    export_jobs_progress: 100,
    export_jobs_file_format: 'JSON (.json)',
    export_jobs_file_url: undefined, // File đã expired
    export_jobs_file_size: 8765432,
    export_jobs_created_at: '2024-12-01T08:00:00Z',
    export_jobs_updated_at: '2024-12-31T08:10:15Z',
    export_jobs_download_history: [],
  },
];
