/**
 * Mock data for System Admin Module
 */

export interface ModuleInfo {
  id: string;
  name: string;
  version: string;
  basePath: string;
  installedAt: string;
  status: 'active' | 'inactive' | 'error';
  checksum: string;
  fileCount: number;
  size: number;
  permissions: string[];
  description?: string;
}

export interface ImportJob {
  id: string;
  moduleId: string;
  moduleName: string;
  version: string;
  status: 'pending' | 'validating' | 'importing' | 'completed' | 'failed';
  createdAt: string;
  completedAt?: string;
  createdBy: string;
  fileName: string;
  fileSize: number;
  validationResults?: ValidationResult[];
  errorMessage?: string;
  timeline: TimelineEvent[];
}

export interface ValidationResult {
  type: 'error' | 'warning' | 'success';
  message: string;
  details?: string;
}

export interface TimelineEvent {
  timestamp: string;
  status: string;
  message: string;
  details?: string;
}

export const mockInstalledModules: ModuleInfo[] = [
  {
    id: 'kpi-qltt',
    name: 'KPI & Thống kê QLTT',
    version: '1.0.0',
    basePath: '/kpi',
    installedAt: '2026-01-15T10:30:00Z',
    status: 'active',
    checksum: 'sha256:a1b2c3d4e5f6...',
    fileCount: 24,
    size: 245760,
    permissions: ['kpi:view', 'kpi:create', 'kpi:export'],
    description: 'Module quản lý KPI và báo cáo thống kê QLTT'
  },
  {
    id: 'system-admin',
    name: 'Quản trị hệ thống',
    version: '0.1.0',
    basePath: '/system/modules',
    installedAt: '2026-01-19T08:00:00Z',
    status: 'active',
    checksum: 'sha256:f7e8d9c0b1a2...',
    fileCount: 18,
    size: 180224,
    permissions: ['system:admin'],
    description: 'Module quản trị và import các module khác'
  }
];

export const mockImportJobs: ImportJob[] = [
  {
    id: 'job-001',
    moduleId: 'kpi-qltt',
    moduleName: 'KPI & Thống kê QLTT',
    version: '1.0.0',
    status: 'completed',
    createdAt: '2026-01-15T10:25:00Z',
    completedAt: '2026-01-15T10:30:00Z',
    createdBy: 'admin@mappa.gov.vn',
    fileName: 'kpi-qltt-v1.0.0.zip',
    fileSize: 245760,
    validationResults: [
      { type: 'success', message: 'Cấu trúc module hợp lệ' },
      { type: 'success', message: 'module.json hợp lệ' },
      { type: 'success', message: 'Không có file nguy hiểm' },
      { type: 'success', message: 'BasePath không trùng lặp' }
    ],
    timeline: [
      {
        timestamp: '2026-01-15T10:25:00Z',
        status: 'pending',
        message: 'Tạo job import'
      },
      {
        timestamp: '2026-01-15T10:25:05Z',
        status: 'validating',
        message: 'Đang kiểm tra file upload'
      },
      {
        timestamp: '2026-01-15T10:25:10Z',
        status: 'validating',
        message: 'Kiểm tra cấu trúc module'
      },
      {
        timestamp: '2026-01-15T10:25:15Z',
        status: 'importing',
        message: 'Bắt đầu import module'
      },
      {
        timestamp: '2026-01-15T10:30:00Z',
        status: 'completed',
        message: 'Import thành công'
      }
    ]
  },
  {
    id: 'job-002',
    moduleId: 'demo-module',
    moduleName: 'Demo Module',
    version: '0.5.0',
    status: 'failed',
    createdAt: '2026-01-18T14:20:00Z',
    completedAt: '2026-01-18T14:20:30Z',
    createdBy: 'admin@mappa.gov.vn',
    fileName: 'demo-module-v0.5.0.zip',
    fileSize: 102400,
    errorMessage: 'Thiếu file module.json bắt buộc',
    validationResults: [
      { type: 'error', message: 'Thiếu file module.json', details: 'File module.json không tồn tại trong gói module' },
      { type: 'warning', message: 'Cấu trúc thư mục không chuẩn' }
    ],
    timeline: [
      {
        timestamp: '2026-01-18T14:20:00Z',
        status: 'pending',
        message: 'Tạo job import'
      },
      {
        timestamp: '2026-01-18T14:20:10Z',
        status: 'validating',
        message: 'Đang kiểm tra file upload'
      },
      {
        timestamp: '2026-01-18T14:20:30Z',
        status: 'failed',
        message: 'Validation thất bại: Thiếu file module.json'
      }
    ]
  }
];
