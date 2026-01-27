/**
 * TYPES - SA System Config Module
 * Cấu hình hệ thống
 */

// System Parameter (Thông số hệ thống)
export interface SystemParameter {
  id: string;
  category: string; // General, Performance, Integration, etc.
  code: string;
  name: string;
  value: string;
  dataType: 'string' | 'number' | 'boolean' | 'json';
  description: string;
  isEditable: boolean; // System params không thể sửa
  updatedBy: string;
  updatedAt: string;
}

// Organization Info (Thông tin tổ chức)
export interface OrganizationInfo {
  id: string;
  fullName: string;
  shortName: string;
  englishName: string;
  taxCode: string;
  address: string;
  district: string;
  city: string;
  phone: string;
  fax: string;
  email: string;
  website: string;
  logoUrl: string | null;
  establishedDate: string;
  legalRepresentative: string;
  legalRepresentativePosition: string;
  updatedBy: string;
  updatedAt: string;
}

// Operation Setting (Cài đặt vận hành)
export interface OperationSetting {
  id: string;
  category: 'system' | 'workflow' | 'notification' | 'report';
  code: string;
  name: string;
  description: string;
  enabled: boolean;
  config: Record<string, any>; // JSON config
  updatedBy: string;
  updatedAt: string;
}

// Notification Template (Mẫu thông báo)
export interface NotificationTemplate {
  id: string;
  code: string;
  name: string;
  type: 'email' | 'sms' | 'in-app' | 'push';
  category: string; // User, System, Workflow, etc.
  subject: string;
  content: string; // Template với placeholders
  variables: string[]; // Available variables: {{user.name}}, {{date}}, etc.
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Security Setting (Cài đặt bảo mật)
export interface SecuritySetting {
  id: string;
  category: 'password' | 'session' | 'access' | 'audit';
  code: string;
  name: string;
  description: string;
  value: string | number | boolean;
  dataType: 'string' | 'number' | 'boolean';
  updatedBy: string;
  updatedAt: string;
}

// Database Log (Log database)
export interface DatabaseLog {
  id: string;
  level: 'info' | 'warning' | 'error' | 'critical';
  category: 'query' | 'connection' | 'migration' | 'backup' | 'system';
  message: string;
  details: string | null;
  userId: string | null;
  ipAddress: string | null;
  timestamp: string;
}

// Database Backup (Sao lưu database)
export interface DatabaseBackup {
  id: string;
  fileName: string;
  filePath: string;
  fileSize: number; // bytes
  backupType: 'full' | 'incremental' | 'differential';
  status: 'pending' | 'in-progress' | 'completed' | 'failed';
  startedAt: string;
  completedAt: string | null;
  duration: number | null; // seconds
  errorMessage: string | null;
  createdBy: string; // 'system' or user ID
  canRestore: boolean;
}

// Backup Stats (Thống kê backup)
export interface BackupStats {
  totalBackups: number;
  successfulBackups: number;
  failedBackups: number;
  totalSize: number; // bytes
  latestBackup: DatabaseBackup | null;
  oldestBackup: DatabaseBackup | null;
}
