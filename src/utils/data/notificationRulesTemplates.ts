/**
 * Notification Rules Data Templates - MAPPA Portal
 * Bảng dữ liệu mẫu cho TAB "Quy tắc thông báo"
 * Trigger – Who – How pattern
 * 
 * Tuân thủ design tokens từ /src/styles/theme.css với Inter font
 */

// ============================================================================
// 1. TYPE DEFINITIONS
// ============================================================================

/**
 * Loại sự kiện kích hoạt thông báo
 */
export type EventType =
  | 'SLA_AT_RISK'
  | 'LEAD_SENSITIVE_CREATED'
  | 'MASTER_DATA_UPDATED'
  | 'EXPORT_JOB_FAILED'
  | 'AUDIT_QUERY_EXECUTED';

/**
 * Vai trò người nhận
 */
export type RecipientRole =
  | 'Supervisor'
  | 'Analyst'
  | 'Reporter'
  | 'Admin'
  | 'IT'
  | 'Director';

/**
 * Phạm vi áp dụng
 */
export type ScopeType =
  | 'SELF_UNIT'      // Đơn vị của chính mình
  | 'UNIT'           // Đơn vị cụ thể
  | 'PROVINCE'       // Cấp tỉnh
  | 'GLOBAL'         // Toàn hệ thống
  | 'BY_JOB_OWNER';  // Theo người sở hữu job

/**
 * Kênh thông báo
 */
export type Channel = 'Push' | 'Email' | 'System';

/**
 * Trạng thái quy tắc
 */
export type RuleStatus = 'Active' | 'Disabled';

/**
 * Mức độ ưu tiên
 */
export type Priority = 'Low' | 'Medium' | 'High';

/**
 * Điều kiện sự kiện (JSON structure)
 */
export interface EventCondition {
  sla_hours?: number;
  priority?: Priority;
  label_code?: string;
  job_type?: string;
  role_excluded?: RecipientRole[];
  custom_conditions?: Record<string, any>;
}

/**
 * Interface cho Notification Rule
 */
export interface NotificationRule {
  // Identification
  id: string;
  rule_code: string;
  rule_name: string;
  description: string;

  // Trigger
  event_type: EventType;
  event_condition: EventCondition;

  // Who (Recipients)
  recipient_roles: RecipientRole[];
  scope_type: ScopeType;

  // How (Channels)
  channels: Channel[];
  cooldown_minutes?: number;

  // Status & Priority
  status: RuleStatus;
  priority: Priority;

  // Audit
  created_by: string;
  created_at: string;
  updated_at: string;
}

// ============================================================================
// 2. SAMPLE DATA (10 notification rules)
// ============================================================================

export const SAMPLE_NOTIFICATION_RULES: NotificationRule[] = [
  // ========================================================================
  // Rule 1: SLA At Risk
  // ========================================================================
  {
    id: 'NR-001',
    rule_code: 'SLA_RISK_HIGH',
    rule_name: 'Cảnh báo SLA vượt ngưỡng nguy hiểm',
    description: 'Thông báo khi nhiệm vụ có SLA >= 2 giờ và ưu tiên cao chưa được xử lý',
    event_type: 'SLA_AT_RISK',
    event_condition: {
      sla_hours: 2,
      priority: 'High',
    },
    recipient_roles: ['Supervisor', 'Director'],
    scope_type: 'UNIT',
    channels: ['Push', 'Email'],
    cooldown_minutes: 30,
    status: 'Active',
    priority: 'High',
    created_by: 'Admin System',
    created_at: '2024-01-01 08:00:00',
    updated_at: '2024-01-14 10:30:00',
  },

  // ========================================================================
  // Rule 2: Sensitive Lead Created
  // ========================================================================
  {
    id: 'NR-002',
    rule_code: 'LEAD_SENSITIVE',
    rule_name: 'Lead nhạy cảm được tạo',
    description: 'Thông báo ngay lập tức khi lead có nhãn "Sensitive" được tạo trong hệ thống',
    event_type: 'LEAD_SENSITIVE_CREATED',
    event_condition: {
      label_code: 'SENSITIVE',
    },
    recipient_roles: ['Admin', 'IT', 'Director'],
    scope_type: 'GLOBAL',
    channels: ['Push', 'Email', 'System'],
    cooldown_minutes: 0,
    status: 'Active',
    priority: 'High',
    created_by: 'Nguyễn Văn A',
    created_at: '2024-01-05 09:00:00',
    updated_at: '2024-01-12 14:20:00',
  },

  // ========================================================================
  // Rule 3: Master Data Updated
  // ========================================================================
  {
    id: 'NR-003',
    rule_code: 'MASTER_DATA_CHANGE',
    rule_name: 'Thay đổi dữ liệu master',
    description: 'Thông báo khi có thay đổi dữ liệu master (Categories, Banks, Areas)',
    event_type: 'MASTER_DATA_UPDATED',
    event_condition: {
      custom_conditions: {
        tables: ['categories', 'banks', 'areas'],
      },
    },
    recipient_roles: ['Admin', 'Analyst'],
    scope_type: 'GLOBAL',
    channels: ['System', 'Email'],
    cooldown_minutes: 60,
    status: 'Active',
    priority: 'Medium',
    created_by: 'Trần Thị B',
    created_at: '2024-01-08 11:00:00',
    updated_at: '2024-01-13 09:15:00',
  },

  // ========================================================================
  // Rule 4: Export Job Failed
  // ========================================================================
  {
    id: 'NR-004',
    rule_code: 'EXPORT_FAIL',
    rule_name: 'Job xuất dữ liệu thất bại',
    description: 'Thông báo khi job xuất dữ liệu (Report/Audit) thất bại',
    event_type: 'EXPORT_JOB_FAILED',
    event_condition: {
      job_type: 'REPORT_RUN',
    },
    recipient_roles: ['IT', 'Admin'],
    scope_type: 'BY_JOB_OWNER',
    channels: ['Push', 'System'],
    cooldown_minutes: 15,
    status: 'Active',
    priority: 'Medium',
    created_by: 'Lê Văn C',
    created_at: '2024-01-10 13:00:00',
    updated_at: '2024-01-14 08:45:00',
  },

  // ========================================================================
  // Rule 5: Audit Query Executed
  // ========================================================================
  {
    id: 'NR-005',
    rule_code: 'AUDIT_QUERY_ALERT',
    rule_name: 'Truy vấn audit quan trọng',
    description: 'Thông báo khi có truy vấn audit trên dữ liệu nhạy cảm',
    event_type: 'AUDIT_QUERY_EXECUTED',
    event_condition: {
      priority: 'High',
      custom_conditions: {
        sensitive_tables: true,
      },
    },
    recipient_roles: ['Admin', 'Director', 'IT'],
    scope_type: 'GLOBAL',
    channels: ['Push', 'Email', 'System'],
    cooldown_minutes: 0,
    status: 'Active',
    priority: 'High',
    created_by: 'Admin System',
    created_at: '2024-01-12 07:00:00',
    updated_at: '2024-01-14 11:00:00',
  },

  // ========================================================================
  // Rule 6: SLA At Risk (Medium)
  // ========================================================================
  {
    id: 'NR-006',
    rule_code: 'SLA_RISK_MEDIUM',
    rule_name: 'Cảnh báo SLA mức trung bình',
    description: 'Thông báo khi nhiệm vụ có SLA >= 4 giờ và ưu tiên trung bình',
    event_type: 'SLA_AT_RISK',
    event_condition: {
      sla_hours: 4,
      priority: 'Medium',
    },
    recipient_roles: ['Supervisor', 'Analyst'],
    scope_type: 'SELF_UNIT',
    channels: ['Push'],
    cooldown_minutes: 60,
    status: 'Active',
    priority: 'Medium',
    created_by: 'Phạm Thị D',
    created_at: '2024-01-06 10:00:00',
    updated_at: '2024-01-11 15:30:00',
  },

  // ========================================================================
  // Rule 7: Province Level Master Data
  // ========================================================================
  {
    id: 'NR-007',
    rule_code: 'PROVINCE_DATA_UPDATE',
    rule_name: 'Cập nhật dữ liệu cấp tỉnh',
    description: 'Thông báo khi có thay đổi dữ liệu master ở cấp tỉnh',
    event_type: 'MASTER_DATA_UPDATED',
    event_condition: {
      custom_conditions: {
        level: 'province',
      },
    },
    recipient_roles: ['Director', 'Analyst'],
    scope_type: 'PROVINCE',
    channels: ['Email', 'System'],
    cooldown_minutes: 120,
    status: 'Active',
    priority: 'Low',
    created_by: 'Nguyễn Văn E',
    created_at: '2024-01-09 12:00:00',
    updated_at: '2024-01-13 16:00:00',
  },

  // ========================================================================
  // Rule 8: Export Audit Failed
  // ========================================================================
  {
    id: 'NR-008',
    rule_code: 'EXPORT_AUDIT_FAIL',
    rule_name: 'Xuất audit log thất bại',
    description: 'Thông báo khi job xuất audit log thất bại (cao hơn report thường)',
    event_type: 'EXPORT_JOB_FAILED',
    event_condition: {
      job_type: 'AUDIT_EXCERPT',
    },
    recipient_roles: ['IT', 'Admin', 'Director'],
    scope_type: 'GLOBAL',
    channels: ['Push', 'Email', 'System'],
    cooldown_minutes: 0,
    status: 'Active',
    priority: 'High',
    created_by: 'Admin System',
    created_at: '2024-01-11 08:30:00',
    updated_at: '2024-01-14 09:00:00',
  },

  // ========================================================================
  // Rule 9: Lead Sensitive (Disabled Example)
  // ========================================================================
  {
    id: 'NR-009',
    rule_code: 'LEAD_VIP',
    rule_name: 'Lead VIP được tạo',
    description: 'Thông báo khi lead có nhãn "VIP" được tạo (Rule này đã tắt)',
    event_type: 'LEAD_SENSITIVE_CREATED',
    event_condition: {
      label_code: 'VIP',
    },
    recipient_roles: ['Director', 'Supervisor'],
    scope_type: 'UNIT',
    channels: ['Push', 'Email'],
    cooldown_minutes: 30,
    status: 'Disabled',
    priority: 'Medium',
    created_by: 'Trần Thị F',
    created_at: '2024-01-07 14:00:00',
    updated_at: '2024-01-12 10:00:00',
  },

  // ========================================================================
  // Rule 10: Low Priority SLA
  // ========================================================================
  {
    id: 'NR-010',
    rule_code: 'SLA_RISK_LOW',
    rule_name: 'Cảnh báo SLA mức thấp',
    description: 'Thông báo khi nhiệm vụ có SLA >= 8 giờ và ưu tiên thấp',
    event_type: 'SLA_AT_RISK',
    event_condition: {
      sla_hours: 8,
      priority: 'Low',
    },
    recipient_roles: ['Reporter', 'Analyst'],
    scope_type: 'SELF_UNIT',
    channels: ['System'],
    cooldown_minutes: 240,
    status: 'Active',
    priority: 'Low',
    created_by: 'Lê Văn G',
    created_at: '2024-01-04 16:00:00',
    updated_at: '2024-01-10 11:30:00',
  },
];

// ============================================================================
// 3. HELPER FUNCTIONS
// ============================================================================

/**
 * Lấy label tiếng Việt cho Event Type
 */
export const getEventTypeLabel = (eventType: EventType): string => {
  const labels: Record<EventType, string> = {
    SLA_AT_RISK: 'SLA vượt ngưỡng',
    LEAD_SENSITIVE_CREATED: 'Lead nhạy cảm',
    MASTER_DATA_UPDATED: 'Dữ liệu master thay đổi',
    EXPORT_JOB_FAILED: 'Xuất dữ liệu thất bại',
    AUDIT_QUERY_EXECUTED: 'Truy vấn audit',
  };
  return labels[eventType] || eventType;
};

/**
 * Lấy tooltip mô tả cho Event Type
 */
export const getEventTypeTooltip = (eventType: EventType): string => {
  const tooltips: Record<EventType, string> = {
    SLA_AT_RISK: 'Kích hoạt khi nhiệm vụ vượt ngưỡng SLA an toàn',
    LEAD_SENSITIVE_CREATED: 'Kích hoạt khi tạo lead có nhãn nhạy cảm',
    MASTER_DATA_UPDATED: 'Kích hoạt khi có thay đổi dữ liệu danh mục',
    EXPORT_JOB_FAILED: 'Kích hoạt khi job xuất dữ liệu thất bại',
    AUDIT_QUERY_EXECUTED: 'Kích hoạt khi có truy vấn audit quan trọng',
  };
  return tooltips[eventType] || '';
};

/**
 * Lấy label tiếng Việt cho Scope Type
 */
export const getScopeTypeLabel = (scopeType: ScopeType): string => {
  const labels: Record<ScopeType, string> = {
    SELF_UNIT: 'Đơn vị riêng',
    UNIT: 'Đơn vị',
    PROVINCE: 'Cấp tỉnh',
    GLOBAL: 'Toàn hệ thống',
    BY_JOB_OWNER: 'Theo người tạo',
  };
  return labels[scopeType] || scopeType;
};

/**
 * Lấy màu badge cho Status
 */
export const getStatusBadgeStyle = (status: RuleStatus): {
  background: string;
  color: string;
} => {
  switch (status) {
    case 'Active':
      return {
        background: 'var(--success-light, #e6f4ea)',
        color: 'var(--success, #0f9d58)',
      };
    case 'Disabled':
      return {
        background: 'var(--muted)',
        color: 'var(--muted-foreground)',
      };
    default:
      return {
        background: 'var(--muted)',
        color: 'var(--foreground)',
      };
  }
};

/**
 * Lấy màu badge cho Priority
 */
export const getPriorityBadgeStyle = (priority: Priority): {
  background: string;
  color: string;
} => {
  switch (priority) {
    case 'High':
      return {
        background: 'var(--destructive-light, #fce8e6)',
        color: 'var(--destructive, #d32f2f)',
      };
    case 'Medium':
      return {
        background: 'var(--warning-light, #fff3e0)',
        color: 'var(--warning, #f57c00)',
      };
    case 'Low':
      return {
        background: 'var(--info-light, #e3f2fd)',
        color: 'var(--info, #1976d2)',
      };
    default:
      return {
        background: 'var(--muted)',
        color: 'var(--foreground)',
      };
  }
};

/**
 * Format danh sách channels thành text
 */
export const formatChannels = (channels: Channel[]): string => {
  const channelLabels: Record<Channel, string> = {
    Push: 'Push',
    Email: 'Email',
    System: 'Hệ thống',
  };
  return channels.map((ch) => channelLabels[ch]).join(', ');
};

/**
 * Format danh sách roles thành text
 */
export const formatRoles = (roles: RecipientRole[]): string => {
  const roleLabels: Record<RecipientRole, string> = {
    Supervisor: 'Giám sát',
    Analyst: 'Phân tích',
    Reporter: 'Báo cáo',
    Admin: 'Quản trị',
    IT: 'IT',
    Director: 'Giám đốc',
  };
  return roles.map((role) => roleLabels[role]).join(', ');
};

/**
 * Danh sách tất cả event types
 */
export const ALL_EVENT_TYPES: EventType[] = [
  'SLA_AT_RISK',
  'LEAD_SENSITIVE_CREATED',
  'MASTER_DATA_UPDATED',
  'EXPORT_JOB_FAILED',
  'AUDIT_QUERY_EXECUTED',
];

/**
 * Danh sách tất cả roles
 */
export const ALL_RECIPIENT_ROLES: RecipientRole[] = [
  'Supervisor',
  'Analyst',
  'Reporter',
  'Admin',
  'IT',
  'Director',
];

/**
 * Danh sách tất cả scope types
 */
export const ALL_SCOPE_TYPES: ScopeType[] = [
  'SELF_UNIT',
  'UNIT',
  'PROVINCE',
  'GLOBAL',
  'BY_JOB_OWNER',
];

/**
 * Danh sách tất cả channels
 */
export const ALL_CHANNELS: Channel[] = ['Push', 'Email', 'System'];

/**
 * Danh sách tất cả priorities
 */
export const ALL_PRIORITIES: Priority[] = ['Low', 'Medium', 'High'];

// ============================================================================
// 4. EXPORT DEFAULT
// ============================================================================

export default {
  SAMPLE_DATA: SAMPLE_NOTIFICATION_RULES,
  helpers: {
    getEventTypeLabel,
    getEventTypeTooltip,
    getScopeTypeLabel,
    getStatusBadgeStyle,
    getPriorityBadgeStyle,
    formatChannels,
    formatRoles,
  },
  enums: {
    ALL_EVENT_TYPES,
    ALL_RECIPIENT_ROLES,
    ALL_SCOPE_TYPES,
    ALL_CHANNELS,
    ALL_PRIORITIES,
  },
};
