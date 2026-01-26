/**
 * MOCK DATA - SA System Config Module
 */

import type {
  SystemParameter,
  OrganizationInfo,
  OperationSetting,
  NotificationTemplate,
  SecuritySetting,
  DatabaseLog,
  DatabaseBackup,
  BackupStats
} from './types';

// Mock System Parameters
export const MOCK_SYSTEM_PARAMETERS: SystemParameter[] = [
  {
    id: '1',
    category: 'General',
    code: 'SYSTEM_NAME',
    name: 'Tên hệ thống',
    value: 'MAPPA Portal - Cục Quản lý Thị trường',
    dataType: 'string',
    description: 'Tên đầy đủ của hệ thống',
    isEditable: false,
    updatedBy: 'system',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    category: 'General',
    code: 'SYSTEM_VERSION',
    name: 'Phiên bản hệ thống',
    value: '1.0.0',
    dataType: 'string',
    description: 'Version hiện tại của hệ thống',
    isEditable: false,
    updatedBy: 'system',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    category: 'Performance',
    code: 'MAX_UPLOAD_SIZE',
    name: 'Kích thước upload tối đa',
    value: '10485760',
    dataType: 'number',
    description: 'Kích thước file upload tối đa (bytes) - 10MB',
    isEditable: true,
    updatedBy: 'qt_admin',
    updatedAt: '2025-01-15T00:00:00Z'
  },
  {
    id: '4',
    category: 'Performance',
    code: 'SESSION_TIMEOUT',
    name: 'Thời gian timeout session',
    value: '3600',
    dataType: 'number',
    description: 'Timeout session (giây) - 1 giờ',
    isEditable: true,
    updatedBy: 'qt_admin',
    updatedAt: '2025-01-10T00:00:00Z'
  },
  {
    id: '5',
    category: 'Integration',
    code: 'API_RATE_LIMIT',
    name: 'Giới hạn API request',
    value: '1000',
    dataType: 'number',
    description: 'Số lượng API calls tối đa mỗi giờ',
    isEditable: true,
    updatedBy: 'qt_admin',
    updatedAt: '2025-01-20T00:00:00Z'
  },
  {
    id: '6',
    category: 'Feature',
    code: 'ENABLE_NOTIFICATIONS',
    name: 'Bật thông báo',
    value: 'true',
    dataType: 'boolean',
    description: 'Bật/tắt hệ thống thông báo',
    isEditable: true,
    updatedBy: 'qt_admin',
    updatedAt: '2025-01-05T00:00:00Z'
  },
  {
    id: '7',
    category: 'Feature',
    code: 'ENABLE_TWO_FACTOR_AUTH',
    name: 'Bật xác thực 2 bước',
    value: 'false',
    dataType: 'boolean',
    description: 'Bật/tắt xác thực 2 bước',
    isEditable: true,
    updatedBy: 'qt_admin',
    updatedAt: '2025-01-12T00:00:00Z'
  }
];

// Mock Organization Info
export const MOCK_ORGANIZATION_INFO: OrganizationInfo = {
  id: '1',
  fullName: 'Cục Quản lý Thị trường',
  shortName: 'QLTT',
  englishName: 'Market Management Department',
  taxCode: '0123456789',
  address: '54 Hai Bà Trưng',
  district: 'Quận Hoàn Kiếm',
  city: 'Hà Nội',
  phone: '024.39366666',
  fax: '024.39366667',
  email: 'contact@qltt.gov.vn',
  website: 'https://qltt.gov.vn',
  logoUrl: null,
  establishedDate: '2005-06-15',
  legalRepresentative: 'Nguyễn Văn Cục Trưởng',
  legalRepresentativePosition: 'Cục trưởng',
  updatedBy: 'qt_admin',
  updatedAt: '2025-01-15T00:00:00Z'
};

// Mock Operation Settings
export const MOCK_OPERATION_SETTINGS: OperationSetting[] = [
  {
    id: '1',
    category: 'system',
    code: 'AUTO_BACKUP',
    name: 'Tự động sao lưu',
    description: 'Tự động sao lưu database theo lịch',
    enabled: true,
    config: {
      schedule: 'daily',
      time: '02:00',
      retention: 30
    },
    updatedBy: 'qt_admin',
    updatedAt: '2025-01-10T00:00:00Z'
  },
  {
    id: '2',
    category: 'workflow',
    code: 'AUTO_ASSIGN_INSPECTOR',
    name: 'Tự động phân công thanh tra viên',
    description: 'Tự động phân công thanh tra viên khi tạo hồ sơ',
    enabled: false,
    config: {
      algorithm: 'round-robin',
      considerWorkload: true
    },
    updatedBy: 'qt_admin',
    updatedAt: '2025-01-15T00:00:00Z'
  },
  {
    id: '3',
    category: 'notification',
    code: 'EMAIL_NOTIFICATION',
    name: 'Thông báo qua email',
    description: 'Gửi thông báo qua email cho người dùng',
    enabled: true,
    config: {
      smtpHost: 'smtp.gmail.com',
      smtpPort: 587,
      fromEmail: 'noreply@qltt.gov.vn',
      fromName: 'MAPPA Portal'
    },
    updatedBy: 'qt_admin',
    updatedAt: '2025-01-05T00:00:00Z'
  },
  {
    id: '4',
    category: 'report',
    code: 'AUTO_GENERATE_REPORT',
    name: 'Tự động tạo báo cáo',
    description: 'Tự động tạo báo cáo định kỳ',
    enabled: true,
    config: {
      frequency: 'monthly',
      recipients: ['qt_lanhdao@qltt.gov.vn'],
      format: 'pdf'
    },
    updatedBy: 'qt_admin',
    updatedAt: '2025-01-18T00:00:00Z'
  }
];

// Mock Notification Templates
export const MOCK_NOTIFICATION_TEMPLATES: NotificationTemplate[] = [
  {
    id: '1',
    code: 'USER_WELCOME',
    name: 'Chào mừng người dùng mới',
    type: 'email',
    category: 'User',
    subject: 'Chào mừng đến với MAPPA Portal',
    content: 'Xin chào {{user.name}},\n\nChúc mừng bạn đã tạo tài khoản thành công trên hệ thống MAPPA Portal.\n\nUsername: {{user.username}}\nĐơn vị: {{user.orgUnit}}\n\nVui lòng đăng nhập và đổi mật khẩu ngay sau lần đăng nhập đầu tiên.\n\nTrân trọng,\nBan quản trị',
    variables: ['user.name', 'user.username', 'user.orgUnit'],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2025-01-10T00:00:00Z'
  },
  {
    id: '2',
    code: 'PASSWORD_RESET',
    name: 'Đặt lại mật khẩu',
    type: 'email',
    category: 'User',
    subject: 'Yêu cầu đặt lại mật khẩu',
    content: 'Xin chào {{user.name}},\n\nChúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản {{user.username}}.\n\nVui lòng click vào link sau để đặt lại mật khẩu:\n{{reset.link}}\n\nLink này có hiệu lực trong {{reset.expiry}} phút.\n\nNếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.\n\nTrân trọng,\nBan quản trị',
    variables: ['user.name', 'user.username', 'reset.link', 'reset.expiry'],
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2025-01-12T00:00:00Z'
  },
  {
    id: '3',
    code: 'INSPECTION_ASSIGNED',
    name: 'Phân công thanh tra',
    type: 'in-app',
    category: 'Workflow',
    subject: 'Bạn được phân công thanh tra mới',
    content: 'Thanh tra viên {{inspector.name}},\n\nBạn vừa được phân công thanh tra:\n\nMã hồ sơ: {{case.code}}\nĐối tượng: {{case.subject}}\nĐịa điểm: {{case.location}}\nThời gian: {{case.date}}\n\nVui lòng kiểm tra chi tiết và chuẩn bị.',
    variables: ['inspector.name', 'case.code', 'case.subject', 'case.location', 'case.date'],
    status: 'active',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2025-01-15T00:00:00Z'
  },
  {
    id: '4',
    code: 'SYSTEM_MAINTENANCE',
    name: 'Bảo trì hệ thống',
    type: 'in-app',
    category: 'System',
    subject: 'Thông báo bảo trì hệ thống',
    content: 'Hệ thống sẽ bảo trì vào {{maintenance.date}} từ {{maintenance.startTime}} đến {{maintenance.endTime}}.\n\nTrong thời gian này, bạn sẽ không thể truy cập hệ thống.\n\nVui lòng lưu công việc và đăng xuất trước thời gian bảo trì.\n\nTrân trọng,\nBan quản trị',
    variables: ['maintenance.date', 'maintenance.startTime', 'maintenance.endTime'],
    status: 'active',
    createdAt: '2024-02-01T00:00:00Z',
    updatedAt: '2025-01-20T00:00:00Z'
  }
];

// Mock Security Settings
export const MOCK_SECURITY_SETTINGS: SecuritySetting[] = [
  {
    id: '1',
    category: 'password',
    code: 'PASSWORD_MIN_LENGTH',
    name: 'Độ dài mật khẩu tối thiểu',
    description: 'Số ký tự tối thiểu của mật khẩu',
    value: 8,
    dataType: 'number',
    updatedBy: 'qt_admin',
    updatedAt: '2025-01-10T00:00:00Z'
  },
  {
    id: '2',
    category: 'password',
    code: 'PASSWORD_REQUIRE_UPPERCASE',
    name: 'Yêu cầu chữ hoa',
    description: 'Mật khẩu phải chứa ít nhất 1 chữ hoa',
    value: true,
    dataType: 'boolean',
    updatedBy: 'qt_admin',
    updatedAt: '2025-01-10T00:00:00Z'
  },
  {
    id: '3',
    category: 'password',
    code: 'PASSWORD_REQUIRE_NUMBER',
    name: 'Yêu cầu số',
    description: 'Mật khẩu phải chứa ít nhất 1 số',
    value: true,
    dataType: 'boolean',
    updatedBy: 'qt_admin',
    updatedAt: '2025-01-10T00:00:00Z'
  },
  {
    id: '4',
    category: 'password',
    code: 'PASSWORD_EXPIRE_DAYS',
    name: 'Mật khẩu hết hạn sau (ngày)',
    description: 'Số ngày trước khi mật khẩu hết hiệu lực',
    value: 90,
    dataType: 'number',
    updatedBy: 'qt_admin',
    updatedAt: '2025-01-10T00:00:00Z'
  },
  {
    id: '5',
    category: 'session',
    code: 'MAX_LOGIN_ATTEMPTS',
    name: 'Số lần đăng nhập sai tối đa',
    description: 'Số lần đăng nhập sai trước khi khóa tài khoản',
    value: 5,
    dataType: 'number',
    updatedBy: 'qt_admin',
    updatedAt: '2025-01-15T00:00:00Z'
  },
  {
    id: '6',
    category: 'session',
    code: 'LOCKOUT_DURATION',
    name: 'Thời gian khóa (phút)',
    description: 'Thời gian khóa tài khoản sau khi đăng nhập sai quá nhiều',
    value: 30,
    dataType: 'number',
    updatedBy: 'qt_admin',
    updatedAt: '2025-01-15T00:00:00Z'
  },
  {
    id: '7',
    category: 'access',
    code: 'IP_WHITELIST_ENABLED',
    name: 'Bật danh sách IP cho phép',
    description: 'Chỉ cho phép truy cập từ các IP trong whitelist',
    value: false,
    dataType: 'boolean',
    updatedBy: 'qt_admin',
    updatedAt: '2025-01-18T00:00:00Z'
  },
  {
    id: '8',
    category: 'audit',
    code: 'AUDIT_LOG_RETENTION',
    name: 'Thời gian lưu audit log (ngày)',
    description: 'Số ngày lưu trữ audit logs',
    value: 365,
    dataType: 'number',
    updatedBy: 'qt_admin',
    updatedAt: '2025-01-20T00:00:00Z'
  }
];

// Mock Database Logs
export const MOCK_DATABASE_LOGS: DatabaseLog[] = [
  {
    id: '1',
    level: 'info',
    category: 'backup',
    message: 'Backup completed successfully',
    details: 'Full backup: mappa_portal_20250122_020000.sql',
    userId: 'system',
    ipAddress: null,
    timestamp: '2025-01-22T02:00:15Z'
  },
  {
    id: '2',
    level: 'warning',
    category: 'query',
    message: 'Slow query detected',
    details: 'SELECT * FROM users JOIN roles ON... (executed in 3.5s)',
    userId: 'qt_admin',
    ipAddress: '192.168.1.100',
    timestamp: '2025-01-22T08:15:30Z'
  },
  {
    id: '3',
    level: 'error',
    category: 'connection',
    message: 'Connection pool exhausted',
    details: 'Max connections (100) reached. Request queued.',
    userId: null,
    ipAddress: null,
    timestamp: '2025-01-21T14:30:00Z'
  },
  {
    id: '4',
    level: 'info',
    category: 'migration',
    message: 'Migration completed',
    details: 'Applied migration: 20250120_add_audit_fields',
    userId: 'system',
    ipAddress: null,
    timestamp: '2025-01-20T03:00:00Z'
  },
  {
    id: '5',
    level: 'critical',
    category: 'system',
    message: 'Database disk space low',
    details: 'Available: 5GB (5% remaining)',
    userId: null,
    ipAddress: null,
    timestamp: '2025-01-19T10:00:00Z'
  }
];

// Mock Database Backups
export const MOCK_DATABASE_BACKUPS: DatabaseBackup[] = [
  {
    id: '1',
    fileName: 'mappa_portal_20250122_020000.sql',
    filePath: '/backups/2025/01/mappa_portal_20250122_020000.sql',
    fileSize: 524288000, // 500MB
    backupType: 'full',
    status: 'completed',
    startedAt: '2025-01-22T02:00:00Z',
    completedAt: '2025-01-22T02:15:23Z',
    duration: 923,
    errorMessage: null,
    createdBy: 'system',
    canRestore: true
  },
  {
    id: '2',
    fileName: 'mappa_portal_20250121_020000.sql',
    filePath: '/backups/2025/01/mappa_portal_20250121_020000.sql',
    fileSize: 518144000, // 494MB
    backupType: 'full',
    status: 'completed',
    startedAt: '2025-01-21T02:00:00Z',
    completedAt: '2025-01-21T02:14:55Z',
    duration: 895,
    errorMessage: null,
    createdBy: 'system',
    canRestore: true
  },
  {
    id: '3',
    fileName: 'mappa_portal_20250120_020000.sql',
    filePath: '/backups/2025/01/mappa_portal_20250120_020000.sql',
    fileSize: 512000000, // 488MB
    backupType: 'full',
    status: 'completed',
    startedAt: '2025-01-20T02:00:00Z',
    completedAt: '2025-01-20T02:14:12Z',
    duration: 852,
    errorMessage: null,
    createdBy: 'system',
    canRestore: true
  },
  {
    id: '4',
    fileName: 'mappa_portal_20250119_020000.sql',
    filePath: '/backups/2025/01/mappa_portal_20250119_020000.sql',
    fileSize: 0,
    backupType: 'full',
    status: 'failed',
    startedAt: '2025-01-19T02:00:00Z',
    completedAt: '2025-01-19T02:05:30Z',
    duration: 330,
    errorMessage: 'Disk space insufficient',
    createdBy: 'system',
    canRestore: false
  },
  {
    id: '5',
    fileName: 'mappa_portal_manual_20250118.sql',
    filePath: '/backups/2025/01/mappa_portal_manual_20250118.sql',
    fileSize: 505856000, // 482MB
    backupType: 'full',
    status: 'completed',
    startedAt: '2025-01-18T15:30:00Z',
    completedAt: '2025-01-18T15:44:18Z',
    duration: 858,
    errorMessage: null,
    createdBy: 'qt_admin',
    canRestore: true
  }
];

// Mock Backup Stats
export const MOCK_BACKUP_STATS: BackupStats = {
  totalBackups: MOCK_DATABASE_BACKUPS.length,
  successfulBackups: MOCK_DATABASE_BACKUPS.filter(b => b.status === 'completed').length,
  failedBackups: MOCK_DATABASE_BACKUPS.filter(b => b.status === 'failed').length,
  totalSize: MOCK_DATABASE_BACKUPS.reduce((sum, b) => sum + b.fileSize, 0),
  latestBackup: MOCK_DATABASE_BACKUPS[0],
  oldestBackup: MOCK_DATABASE_BACKUPS[MOCK_DATABASE_BACKUPS.length - 1]
};
