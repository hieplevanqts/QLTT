/**
 * MOCK DATA - SA IAM Module
 */

import type {
  User,
  Role,
  Permission,
  UserRoleAssignment,
  RolePermissionAssignment,
  Module,
  Menu,
  AssignmentSummary
} from './types';

// Mock Users
export const MOCK_USERS: User[] = [
  {
    id: '1',
    username: 'qt_admin',
    fullName: 'Nguyễn Văn Quản Trị',
    email: 'admin@qltt.gov.vn',
    phone: '0912345678',
    orgUnitId: '1',
    departmentId: '3',
    position: 'Quản trị viên hệ thống',
    status: 'active',
    lastLoginAt: '2025-01-22T08:30:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2025-01-22T08:30:00Z'
  },
  {
    id: '2',
    username: 'qt_lanhdao',
    fullName: 'Trần Thị Lãnh Đạo',
    email: 'lanhdao@qltt.gov.vn',
    phone: '0912345679',
    orgUnitId: '1',
    departmentId: '1',
    position: 'Trưởng phòng TCKT',
    status: 'active',
    lastLoginAt: '2025-01-21T16:45:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2025-01-21T16:45:00Z'
  },
  {
    id: '3',
    username: 'hn_trungnv',
    fullName: 'Phạm Văn Trưởng',
    email: 'truongnv.hn@qltt.gov.vn',
    phone: '0912345680',
    orgUnitId: '2',
    departmentId: null,
    position: 'Trưởng Chi cục',
    status: 'active',
    lastLoginAt: '2025-01-22T07:15:00Z',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2025-01-22T07:15:00Z'
  },
  {
    id: '4',
    username: 'hn_doi01',
    fullName: 'Lê Văn Kiểm Tra',
    email: 'kiemtra.hn@qltt.gov.vn',
    phone: '0912345681',
    orgUnitId: '4',
    departmentId: null,
    position: 'Đội trưởng Đội 01',
    status: 'active',
    lastLoginAt: '2025-01-22T06:00:00Z',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2025-01-22T06:00:00Z'
  },
  {
    id: '5',
    username: 'test_locked',
    fullName: 'Nguyễn Văn Test',
    email: 'test@qltt.gov.vn',
    phone: '0912345682',
    orgUnitId: '1',
    departmentId: null,
    position: 'Nhân viên',
    status: 'locked',
    lastLoginAt: '2024-12-01T00:00:00Z',
    createdAt: '2024-06-01T00:00:00Z',
    updatedAt: '2024-12-15T00:00:00Z'
  }
];

// Mock Roles
export const MOCK_ROLES: Role[] = [
  {
    id: '1',
    code: 'SUPER_ADMIN',
    name: 'Super Admin',
    description: 'Quản trị viên tối cao, có toàn quyền trên hệ thống',
    type: 'system',
    scope: 'global',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    code: 'LANHDAO_CUC',
    name: 'Lãnh đạo Cục',
    description: 'Lãnh đạo cấp Cục, xem báo cáo tổng hợp',
    type: 'system',
    scope: 'organizational',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    code: 'TRUONG_CHICUC',
    name: 'Trưởng Chi cục',
    description: 'Trưởng Chi cục, quản lý chi cục',
    type: 'system',
    scope: 'organizational',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    code: 'DOI_TRUONG',
    name: 'Đội trưởng',
    description: 'Đội trưởng, quản lý đội kiểm tra',
    type: 'system',
    scope: 'organizational',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    code: 'THANH_TRA_VIEN',
    name: 'Thanh tra viên',
    description: 'Thanh tra viên, thực hiện kiểm tra',
    type: 'custom',
    scope: 'organizational',
    status: 'active',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  },
  {
    id: '6',
    code: 'VAN_THU',
    name: 'Văn thư',
    description: 'Văn thư, quản lý văn bản',
    type: 'custom',
    scope: 'organizational',
    status: 'active',
    createdAt: '2024-01-15T00:00:00Z',
    updatedAt: '2024-01-15T00:00:00Z'
  }
];

// Mock Modules
export const MOCK_MODULES: Module[] = [
  {
    id: '1',
    code: 'OPERATIONS',
    name: 'Điều hành',
    description: 'Phân hệ điều hành nghiệp vụ',
    icon: 'LayoutDashboard',
    order: 1,
    parentId: null,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    code: 'SYSTEM_ADMIN',
    name: 'Quản trị hệ thống',
    description: 'Phân hệ quản trị hệ thống',
    icon: 'Settings',
    order: 2,
    parentId: null,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    code: 'SA_IAM',
    name: 'Quản lý truy cập',
    description: 'Quản lý người dùng, vai trò, quyền hạn',
    icon: 'Shield',
    order: 1,
    parentId: '2',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    code: 'SA_MASTER_DATA',
    name: 'Dữ liệu nền',
    description: 'Quản lý dữ liệu nền hệ thống',
    icon: 'Database',
    order: 2,
    parentId: '2',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock Permissions
export const MOCK_PERMISSIONS: Permission[] = [
  // IAM Permissions
  {
    id: '1',
    code: 'sa.iam.user.read',
    name: 'Xem người dùng',
    description: 'Xem danh sách và chi tiết người dùng',
    moduleId: '3',
    resource: 'user',
    action: 'read',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    code: 'sa.iam.user.create',
    name: 'Tạo người dùng',
    description: 'Tạo tài khoản người dùng mới',
    moduleId: '3',
    resource: 'user',
    action: 'create',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    code: 'sa.iam.user.update',
    name: 'Cập nhật người dùng',
    description: 'Chỉnh sửa thông tin người dùng',
    moduleId: '3',
    resource: 'user',
    action: 'update',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    code: 'sa.iam.user.delete',
    name: 'Xóa người dùng',
    description: 'Xóa tài khoản người dùng',
    moduleId: '3',
    resource: 'user',
    action: 'delete',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    code: 'sa.iam.role.read',
    name: 'Xem vai trò',
    description: 'Xem danh sách và chi tiết vai trò',
    moduleId: '3',
    resource: 'role',
    action: 'read',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '6',
    code: 'sa.iam.role.create',
    name: 'Tạo vai trò',
    description: 'Tạo vai trò mới',
    moduleId: '3',
    resource: 'role',
    action: 'create',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '7',
    code: 'sa.iam.role.update',
    name: 'Cập nhật vai trò',
    description: 'Chỉnh sửa thông tin vai trò',
    moduleId: '3',
    resource: 'role',
    action: 'update',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '8',
    code: 'sa.iam.role.delete',
    name: 'Xóa vai trò',
    description: 'Xóa vai trò (không áp dụng cho system roles)',
    moduleId: '3',
    resource: 'role',
    action: 'delete',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '9',
    code: 'sa.iam.permission.read',
    name: 'Xem quyền hạn',
    description: 'Xem danh sách quyền hạn',
    moduleId: '3',
    resource: 'permission',
    action: 'read',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '10',
    code: 'sa.iam.assignment.read',
    name: 'Xem phân quyền',
    description: 'Xem danh sách phân quyền',
    moduleId: '3',
    resource: 'assignment',
    action: 'read',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '11',
    code: 'sa.iam.assignment.assign',
    name: 'Gán quyền',
    description: 'Gán vai trò cho người dùng, gán quyền cho vai trò',
    moduleId: '3',
    resource: 'assignment',
    action: 'assign',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '12',
    code: 'sa.iam.assignment.revoke',
    name: 'Thu hồi quyền',
    description: 'Thu hồi vai trò, quyền đã gán',
    moduleId: '3',
    resource: 'assignment',
    action: 'revoke',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '13',
    code: 'sa.iam.module.read',
    name: 'Xem module',
    description: 'Xem danh sách module',
    moduleId: '3',
    resource: 'module',
    action: 'read',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '14',
    code: 'sa.iam.menu.read',
    name: 'Xem menu',
    description: 'Xem cấu hình menu',
    moduleId: '3',
    resource: 'menu',
    action: 'read',
    isSystem: true,
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock Menus
export const MOCK_MENUS: Menu[] = [
  {
    id: '1',
    code: 'OPERATIONS',
    label: 'Điều hành',
    path: '/operations',
    icon: 'LayoutDashboard',
    moduleId: '1',
    parentId: null,
    order: 1,
    requiredPermission: null,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '2',
    code: 'SYSTEM_ADMIN',
    label: 'Quản trị hệ thống',
    path: '/system-admin',
    icon: 'Settings',
    moduleId: '2',
    parentId: null,
    order: 2,
    requiredPermission: null,
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '3',
    code: 'SA_IAM',
    label: 'Quản lý truy cập',
    path: '/system-admin/iam',
    icon: 'Shield',
    moduleId: '3',
    parentId: '2',
    order: 1,
    requiredPermission: 'sa.iam.user.read',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '4',
    code: 'SA_IAM_USERS',
    label: 'Người dùng',
    path: '/system-admin/iam/users',
    icon: 'Users',
    moduleId: '3',
    parentId: '3',
    order: 1,
    requiredPermission: 'sa.iam.user.read',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  },
  {
    id: '5',
    code: 'SA_IAM_ROLES',
    label: 'Vai trò',
    path: '/system-admin/iam/roles',
    icon: 'UserCog',
    moduleId: '3',
    parentId: '3',
    order: 2,
    requiredPermission: 'sa.iam.role.read',
    status: 'active',
    createdAt: '2024-01-01T00:00:00Z',
    updatedAt: '2024-01-01T00:00:00Z'
  }
];

// Mock User-Role Assignments
export const MOCK_USER_ROLE_ASSIGNMENTS: UserRoleAssignment[] = [
  {
    id: '1',
    userId: '1',
    roleId: '1',
    orgUnitId: null,
    assignedBy: 'system',
    assignedAt: '2024-01-01T00:00:00Z',
    expiresAt: null,
    status: 'active'
  },
  {
    id: '2',
    userId: '2',
    roleId: '2',
    orgUnitId: '1',
    assignedBy: '1',
    assignedAt: '2024-01-01T00:00:00Z',
    expiresAt: null,
    status: 'active'
  },
  {
    id: '3',
    userId: '3',
    roleId: '3',
    orgUnitId: '2',
    assignedBy: '1',
    assignedAt: '2024-01-01T00:00:00Z',
    expiresAt: null,
    status: 'active'
  },
  {
    id: '4',
    userId: '4',
    roleId: '4',
    orgUnitId: '4',
    assignedBy: '1',
    assignedAt: '2024-01-15T00:00:00Z',
    expiresAt: null,
    status: 'active'
  }
];

// Mock Role-Permission Assignments
export const MOCK_ROLE_PERMISSION_ASSIGNMENTS: RolePermissionAssignment[] = [
  // Super Admin has all permissions
  { id: '1', roleId: '1', permissionId: '1', assignedBy: 'system', assignedAt: '2024-01-01T00:00:00Z', status: 'active' },
  { id: '2', roleId: '1', permissionId: '2', assignedBy: 'system', assignedAt: '2024-01-01T00:00:00Z', status: 'active' },
  { id: '3', roleId: '1', permissionId: '3', assignedBy: 'system', assignedAt: '2024-01-01T00:00:00Z', status: 'active' },
  { id: '4', roleId: '1', permissionId: '4', assignedBy: 'system', assignedAt: '2024-01-01T00:00:00Z', status: 'active' },
  { id: '5', roleId: '1', permissionId: '5', assignedBy: 'system', assignedAt: '2024-01-01T00:00:00Z', status: 'active' },
  
  // Lãnh đạo Cục - read only
  { id: '6', roleId: '2', permissionId: '1', assignedBy: 'system', assignedAt: '2024-01-01T00:00:00Z', status: 'active' },
  { id: '7', roleId: '2', permissionId: '5', assignedBy: 'system', assignedAt: '2024-01-01T00:00:00Z', status: 'active' },
  { id: '8', roleId: '2', permissionId: '10', assignedBy: 'system', assignedAt: '2024-01-01T00:00:00Z', status: 'active' },
];

// Mock Assignment Summary
export const MOCK_ASSIGNMENT_SUMMARY: AssignmentSummary = {
  totalUsers: MOCK_USERS.length,
  totalRoles: MOCK_ROLES.length,
  totalPermissions: MOCK_PERMISSIONS.length,
  totalUserRoleAssignments: MOCK_USER_ROLE_ASSIGNMENTS.filter(a => a.status === 'active').length,
  totalRolePermissionAssignments: MOCK_ROLE_PERMISSION_ASSIGNMENTS.filter(a => a.status === 'active').length,
  recentAssignments: [
    {
      id: '4',
      type: 'user-role',
      description: 'Gán vai trò "Đội trưởng" cho Lê Văn Kiểm Tra',
      assignedBy: 'Nguyễn Văn Quản Trị',
      assignedAt: '2024-01-15T00:00:00Z'
    },
    {
      id: '3',
      type: 'user-role',
      description: 'Gán vai trò "Trưởng Chi cục" cho Phạm Văn Trưởng',
      assignedBy: 'Nguyễn Văn Quản Trị',
      assignedAt: '2024-01-01T00:00:00Z'
    }
  ]
};
