/**
 * MAPPA Portal - Core System Types
 * Based on supabase.md - Package 'MAPPA SYSTEM' (Core & Identity)
 * Migration từ KV Store sang YSQL/PostgreSQL
 */

// ============================================================================
// A. TENANT (Tổ chức)
// ============================================================================

export type TenantStatus = 'TRIAL' | 'ACTIVE' | 'SUSPENDED' | 'CANCELLED';

export interface TenantProfile {
  logo_url?: string;
  website_url?: string;
  description?: string;
  tax_info?: {
    tax_code?: string;
    address?: string;
  };
  socials?: {
    facebook?: string;
    linkedin?: string;
    twitter?: string;
  };
  industry?: string;
  founded_year?: number;
  contact_person?: string;
}

export interface TenantSettings {
  password_policy?: {
    min_length?: number;
    require_special_char?: boolean;
    expiry_days?: number;
    history_limit?: number;
  };
  mfa_enforced?: boolean;
  ip_whitelist?: string[];
  session_policy?: {
    timeout_minutes?: number;
    max_login_attempts?: number;
  };
  compliance?: string; // GDPR, HIPAA, etc.
  data_residency?: string;
  rate_limiting?: {
    requests_per_minute?: number;
    burst_size?: number;
  };
  archival_policy?: {
    audit_log_retention_days?: number;
    invoice_retention_days?: number;
  };
  approval_required?: boolean;
}

export interface Tenant {
  _id: string; // UUID v7
  code: string; // Slug/subdomain (VD: "mappa-gov")
  name: string; // Tên chính thức
  
  // Infrastructure
  data_region: string; // ap-southeast-1
  timezone: string; // Asia/Ho_Chi_Minh
  locale: string; // vi-VN
  
  // Dynamic metadata (từ KV Store design)
  profile: TenantProfile;
  settings: TenantSettings;
  
  status: TenantStatus;
  
  // Audit
  created_at: string; // ISO timestamp
  updated_at: string;
  deleted_at?: string | null;
  version: number; // Optimistic locking
}

// ============================================================================
// B. USER (Người dùng toàn cục)
// ============================================================================

export type UserStatus = 'ACTIVE' | 'BANNED' | 'DISABLED' | 'PENDING';

export interface User {
  _id: string; // UUID v7
  email: string; // UNIQUE
  password_hash?: string | null; // Null nếu SSO
  full_name: string;
  phone_number?: string | null;
  avatar_url?: string | null;
  
  status: UserStatus;
  is_verified: boolean;
  mfa_enabled: boolean;
  is_support_staff: boolean; // Impersonation support
  locale: string; // vi-VN
  
  last_login_at?: string | null;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
}

// ============================================================================
// C. TENANT MEMBER (Hồ sơ thành viên trong tổ chức)
// ============================================================================

export type MemberStatus = 'INVITED' | 'ACTIVE' | 'SUSPENDED' | 'RESIGNED';

export interface MemberCustomData {
  employee_code?: string;
  job_title?: string;
  shirt_size?: string;
  id_number?: string; // CMND/CCCD
  start_date?: string;
  office_location?: string;
  direct_manager_id?: string;
  [key: string]: any; // Allow other custom fields
}

export interface TenantMember {
  _id: string; // UUID v7
  tenant_id: string; // FK -> tenants
  user_id: string; // FK -> users
  
  // Employee info
  employee_code?: string | null;
  display_name?: string | null; // Tên hiển thị riêng trong tổ chức
  job_title?: string | null;
  department_id?: string | null; // FK -> departments
  
  status: MemberStatus;
  
  // Dynamic data (từ KV Store design)
  custom_data: MemberCustomData;
  
  joined_at: string;
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  created_by?: string | null;
  version: number;
}

// ============================================================================
// D. DEPARTMENT (Cơ cấu tổ chức)
// ============================================================================

export type DepartmentType = 'DIVISION' | 'DEPARTMENT' | 'TEAM';

export interface Department {
  _id: string; // UUID v7
  tenant_id: string; // FK -> tenants
  parent_id?: string | null; // FK -> departments (self-reference)
  
  code?: string | null;
  name: string;
  type: DepartmentType;
  head_member_id?: string | null; // FK -> tenant_members
  
  // Materialized Path (VD: /root/dept_a/team_b/)
  path?: string | null;
  address?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  
  created_at: string;
  updated_at: string;
  deleted_at?: string | null;
  version: number;
}

// ============================================================================
// E. ROLE (Vai trò RBAC)
// ============================================================================

export interface Role {
  _id: string; // UUID v7
  tenant_id: string; // FK -> tenants
  
  code: string; // VD: ADMIN, INSPECTOR, VIEWER
  name: string;
  description?: string | null;
  
  // Array of permission codes (VD: ['lead.create', 'lead.delete'])
  permissions: string[];
  is_system: boolean; // Role mặc định của hệ thống?
  
  created_at: string;
  updated_at: string;
}

// ============================================================================
// F. PERMISSION (Quyền hạn)
// ============================================================================

export type PermissionModule = 
  | 'lead' 
  | 'store' 
  | 'task' 
  | 'plan'
  | 'report' 
  | 'user'
  | 'admin' 
  | 'system';

export interface Permission {
  code: string; // VD: lead.create, lead.update, lead.delete
  name: string;
  module: PermissionModule;
  description?: string;
}

// Standard permissions per module
export const STANDARD_PERMISSIONS: Record<PermissionModule, string[]> = {
  lead: [
    'lead.view',
    'lead.create',
    'lead.update',
    'lead.delete',
    'lead.assign',
    'lead.approve',
    'lead.reject',
    'lead.escalate',
    'lead.export',
  ],
  store: [
    'store.view',
    'store.create',
    'store.update',
    'store.delete',
    'store.export',
  ],
  task: [
    'task.view',
    'task.create',
    'task.update',
    'task.delete',
    'task.assign',
    'task.complete',
  ],
  plan: [
    'plan.view',
    'plan.create',
    'plan.update',
    'plan.delete',
    'plan.approve',
  ],
  report: [
    'report.view',
    'report.create',
    'report.export',
  ],
  user: [
    'user.view',
    'user.create',
    'user.update',
    'user.delete',
    'user.invite',
  ],
  admin: [
    'admin.settings',
    'admin.roles',
    'admin.permissions',
    'admin.audit_log',
  ],
  system: [
    'system.config',
    'system.backup',
    'system.maintenance',
  ],
};

// ============================================================================
// G. MEMBER ROLE (Gán vai trò cho thành viên)
// ============================================================================

export interface MemberRole {
  member_id: string; // FK -> tenant_members
  role_id: string; // FK -> roles
  assigned_by: string;
  assigned_at: string;
}

// ============================================================================
// H. USER SESSION (Phiên đăng nhập)
// ============================================================================

export interface UserSession {
  _id: string; // UUID v7
  tenant_id: string;
  user_id: string;
  
  // Token rotation
  family_id: string;
  refresh_token_hash?: string | null;
  rotation_counter: number;
  is_revoked: boolean;
  
  // Device info
  ip_address?: string | null;
  user_agent?: string | null;
  device_type?: string | null;
  os_name?: string | null;
  browser_name?: string | null;
  location_city?: string | null;
  location_country?: string | null;
  
  // Timestamps
  created_at: string;
  last_active_at: string;
  expires_at: string;
}

// ============================================================================
// I. AUDIT LOG (Nhật ký truy vết)
// ============================================================================

export type AuditAction = 
  | 'create' 
  | 'update' 
  | 'delete' 
  | 'login' 
  | 'logout'
  | 'export'
  | 'assign'
  | 'approve'
  | 'reject';

export type AuditResourceType = 
  | 'lead' 
  | 'store' 
  | 'user' 
  | 'role'
  | 'task'
  | 'plan'
  | 'report'
  | 'setting';

export interface AuditLog {
  _id: string; // UUID v7
  tenant_id: string;
  user_id: string;
  
  action: AuditAction;
  resource_type: AuditResourceType;
  resource_id?: string | null;
  
  old_value?: Record<string, any> | null;
  new_value?: Record<string, any> | null;
  
  ip_address?: string | null;
  user_agent?: string | null;
  
  created_at: string;
}

// ============================================================================
// J. SYSTEM SETTINGS (Cấu hình hệ thống)
// ============================================================================

export interface SystemSetting {
  key: string;
  value: any; // string, number, boolean, object
  description?: string;
  is_public: boolean; // Hiển thị công khai?
  updated_by: string;
  updated_at: string;
}

// ============================================================================
// K. LOCATION (Địa điểm văn phòng)
// ============================================================================

export interface LocationAddress {
  street?: string;
  ward?: string;
  district: string;
  province: string;
  country?: string;
  postal_code?: string;
}

export interface Location {
  _id: string; // UUID v7
  tenant_id: string;
  
  name: string;
  code?: string | null;
  address: LocationAddress;
  coordinates?: { lat: number; lng: number } | null;
  radius_meters?: number | null;
  timezone: string;
  is_headquarter: boolean;
  
  created_at: string;
  updated_at: string;
  version: number;
}

// ============================================================================
// L. HELPER TYPES
// ============================================================================

// API Response wrapper
export interface ApiResponse<T> {
  success: boolean;
  data: T;
  message?: string;
  error?: string;
}

// Paginated response
export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  page_size: number;
  total_pages: number;
}

// Filter base
export interface BaseFilter {
  tenant_id: string;
  search?: string;
  page?: number;
  page_size?: number;
  sort_by?: string;
  sort_order?: 'asc' | 'desc';
}

// User with member info (JOIN result)
export interface UserWithMember extends User {
  member?: TenantMember;
  department?: Department;
  roles?: Role[];
}

// Department with hierarchy
export interface DepartmentWithHierarchy extends Department {
  parent?: Department;
  children?: Department[];
  member_count?: number;
}

// ============================================================================
// M. CONSTANTS
// ============================================================================

export const DEFAULT_TIMEZONE = 'Asia/Ho_Chi_Minh';
export const DEFAULT_LOCALE = 'vi-VN';
export const DEFAULT_DATA_REGION = 'ap-southeast-1';

export const TENANT_STATUS_LABELS: Record<TenantStatus, string> = {
  TRIAL: 'Dùng thử',
  ACTIVE: 'Hoạt động',
  SUSPENDED: 'Tạm ngưng',
  CANCELLED: 'Đã hủy',
};

export const USER_STATUS_LABELS: Record<UserStatus, string> = {
  ACTIVE: 'Hoạt động',
  BANNED: 'Bị cấm',
  DISABLED: 'Vô hiệu hóa',
  PENDING: 'Chờ xác thực',
};

export const MEMBER_STATUS_LABELS: Record<MemberStatus, string> = {
  INVITED: 'Đã mời',
  ACTIVE: 'Hoạt động',
  SUSPENDED: 'Tạm ngưng',
  RESIGNED: 'Đã nghỉ việc',
};

export const DEPARTMENT_TYPE_LABELS: Record<DepartmentType, string> = {
  DIVISION: 'Khối',
  DEPARTMENT: 'Phòng',
  TEAM: 'Nhóm',
};
