/**
 * TYPES - SA IAM Module
 * Identity & Access Management
 */

// User (Người dùng)
export interface User {
  id: string;
  username: string;
  fullName: string;
  email: string;
  phone: string;
  orgUnitId: string; // Thuộc đơn vị
  departmentId: string | null; // Thuộc phòng ban
  position: string; // Chức vụ
  status: 'active' | 'inactive' | 'locked';
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

// Role (Vai trò)
export interface Role {
  id: string;
  code: string;
  name: string;
  description: string;
  type: 'system' | 'custom'; // System roles không được xóa
  scope: 'global' | 'organizational'; // global = toàn hệ thống, organizational = theo đơn vị
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Permission (Quyền hạn)
export interface Permission {
  id: string;
  code: string;
  name: string;
  description: string;
  moduleId: string; // Thuộc module nào
  resource: string; // Resource/entity (e.g., 'user', 'role', 'document')
  action: string; // Action (e.g., 'read', 'create', 'update', 'delete')
  isSystem: boolean; // System permissions không được xóa
  createdAt: string;
  updatedAt: string;
}

// User-Role Assignment (Gán vai trò cho người dùng)
export interface UserRoleAssignment {
  id: string;
  userId: string;
  roleId: string;
  orgUnitId: string | null; // Null = áp dụng toàn cục, có giá trị = chỉ áp dụng trong đơn vị này
  assignedBy: string; // User ID của người gán
  assignedAt: string;
  expiresAt: string | null; // Null = không hết hạn
  status: 'active' | 'expired' | 'revoked';
}

// Role-Permission Assignment (Gán quyền cho vai trò)
export interface RolePermissionAssignment {
  id: string;
  roleId: string;
  permissionId: string;
  assignedBy: string;
  assignedAt: string;
  status: 'active' | 'revoked';
}

// Module (Phân hệ/Module trong hệ thống)
export interface Module {
  id: string;
  code: string;
  name: string;
  description: string;
  icon: string; // Icon name (lucide-react)
  order: number;
  parentId: string | null; // Null = module gốc
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Menu (Menu item trong navigation)
export interface Menu {
  id: string;
  code: string;
  label: string;
  path: string;
  icon: string | null;
  moduleId: string; // Thuộc module nào
  parentId: string | null; // Null = menu gốc
  order: number;
  requiredPermission: string | null; // Permission code cần có để xem menu
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

// Assignment Summary (Tổng hợp assignments)
export interface AssignmentSummary {
  totalUsers: number;
  totalRoles: number;
  totalPermissions: number;
  totalUserRoleAssignments: number;
  totalRolePermissionAssignments: number;
  recentAssignments: Array<{
    id: string;
    type: 'user-role' | 'role-permission';
    description: string;
    assignedBy: string;
    assignedAt: string;
  }>;
}
