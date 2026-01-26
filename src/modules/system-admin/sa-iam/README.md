# SA IAM Module

Module Identity & Access Management (IAM) cho hệ thống MAPPA Portal.

## Cấu trúc

```
sa-iam/
├── pages/                      # Các trang UI
│   ├── UsersPage.tsx                  # Danh sách người dùng
│   ├── UserDetailPage.tsx             # Chi tiết người dùng
│   ├── RolesPage.tsx                  # Quản lý vai trò
│   ├── PermissionsPage.tsx            # Danh sách quyền hạn
│   ├── AssignmentsPage.tsx            # Tổng quan phân quyền
│   ├── UserAssignmentsPage.tsx        # Phân quyền cho user
│   ├── RoleAssignmentsPage.tsx        # Phân quyền cho role
│   ├── ModulesPage.tsx                # Quản lý module
│   ├── MenusPage.tsx                  # Quản lý menu
│   ├── UsersPage.module.css           # Shared styles
│   ├── UserDetailPage.module.css
│   ├── AssignmentsPage.module.css
│   ├── UserAssignmentsPage.module.css
│   └── index.ts
├── types.ts                    # TypeScript interfaces
├── mock-data.ts                # Dữ liệu mock
├── routes.tsx                  # Route configuration
├── index.ts                    # Module exports
└── README.md
```

## Routes

Base path: `/system-admin/iam`

| Route | Component | Permission | Mô tả |
|-------|-----------|-----------|-------|
| `users` | UsersPage | `sa.iam.user.read` | Danh sách người dùng |
| `users/:id` | UserDetailPage | `sa.iam.user.read` | Chi tiết người dùng |
| `roles` | RolesPage | `sa.iam.role.read` | Danh sách vai trò |
| `permissions` | PermissionsPage | `sa.iam.permission.read` | Danh sách quyền hạn |
| `assignments` | AssignmentsPage | `sa.iam.assignment.read` | Tổng quan phân quyền |
| `assignments/users/:id` | UserAssignmentsPage | `sa.iam.assignment.read` | Phân quyền user |
| `assignments/roles/:id` | RoleAssignmentsPage | `sa.iam.assignment.read` | Phân quyền role |
| `modules` | ModulesPage | `sa.iam.module.read` | Quản lý module |
| `menus` | MenusPage | `sa.iam.menu.read` | Quản lý menu |

## Permissions

### Users
- `sa.iam.user.read` - Xem danh sách và chi tiết người dùng
- `sa.iam.user.create` - Tạo tài khoản mới
- `sa.iam.user.update` - Chỉnh sửa thông tin, khóa/mở khóa
- `sa.iam.user.delete` - Xóa tài khoản

### Roles
- `sa.iam.role.read` - Xem danh sách vai trò
- `sa.iam.role.create` - Tạo vai trò mới
- `sa.iam.role.update` - Chỉnh sửa vai trò
- `sa.iam.role.delete` - Xóa vai trò (không áp dụng cho system roles)

### Permissions
- `sa.iam.permission.read` - Xem danh sách quyền hạn
- `sa.iam.permission.create` - Tạo quyền mới (hiếm khi dùng)
- `sa.iam.permission.update` - Cập nhật quyền
- `sa.iam.permission.delete` - Xóa quyền (không áp dụng cho system permissions)

### Assignments
- `sa.iam.assignment.read` - Xem phân quyền
- `sa.iam.assignment.assign` - Gán vai trò cho user, gán quyền cho role
- `sa.iam.assignment.revoke` - Thu hồi phân quyền

### Modules
- `sa.iam.module.read` - Xem danh sách module
- `sa.iam.module.create` - Tạo module mới
- `sa.iam.module.update` - Chỉnh sửa module
- `sa.iam.module.delete` - Xóa module

### Menus
- `sa.iam.menu.read` - Xem cấu hình menu
- `sa.iam.menu.create` - Tạo menu mới
- `sa.iam.menu.update` - Chỉnh sửa menu
- `sa.iam.menu.delete` - Xóa menu

## Data Types

### User (Người dùng)
- Thông tin cơ bản: username, fullName, email, phone
- Thuộc đơn vị (orgUnitId) và phòng ban (departmentId)
- Status: active, inactive, locked
- Tracking: lastLoginAt, createdAt, updatedAt

### Role (Vai trò)
- Type: system (không thể xóa) vs custom
- Scope: global (toàn hệ thống) vs organizational (theo đơn vị)
- Có thể gán nhiều permissions

### Permission (Quyền hạn)
- Format: `<module>.<resource>.<action>` (e.g., `sa.iam.user.read`)
- Resource: entity được quản lý (user, role, document...)
- Action: hành động (read, create, update, delete, assign, revoke...)
- isSystem: system permissions không thể xóa

### UserRoleAssignment
- Gán role cho user
- Có thể giới hạn scope theo orgUnitId
- Có thể có expiration date
- Status: active, expired, revoked

### RolePermissionAssignment
- Gán permission cho role
- Status: active, revoked

### Module (Phân hệ)
- Cấu trúc cây (parent-child)
- Icon và order để hiển thị menu
- Ví dụ: Operations, System Admin, IAM...

### Menu
- Cấu trúc cây navigation
- Link tới route cụ thể
- Yêu cầu permission để hiển thị (requiredPermission)
- Thuộc module

## Features

### ✅ Hoàn thành

#### UsersPage
- [x] Search và filter theo status
- [x] Pagination
- [x] Hiển thị: username, fullName, email, position, lastLogin, status
- [x] Actions: Xem chi tiết, Khóa/Mở khóa
- [x] Buttons disable theo quyền (create, update)

#### UserDetailPage
- [x] Thông tin chi tiết user
- [x] Danh sách vai trò được gán
- [x] Link tới UserAssignmentsPage
- [x] Actions: Khóa/Mở khóa, Chỉnh sửa
- [x] Danger zone (Xóa tài khoản)

#### RolesPage
- [x] Search và filter theo type (system/custom)
- [x] Pagination
- [x] Actions: Xem phân quyền, Chỉnh sửa, Xóa
- [x] Không cho xóa system roles

#### PermissionsPage
- [x] Search và filter theo module
- [x] Pagination (15/page do nhiều records)
- [x] Hiển thị: code, name, module, resource, action, isSystem
- [x] Read-only (không có create/update buttons)

#### AssignmentsPage
- [x] Stats cards: Users, Roles, Permissions, Assignments
- [x] Recent assignments timeline
- [x] Quick actions tới Users/Roles/Permissions pages

#### UserAssignmentsPage
- [x] Form gán role mới cho user
- [x] Danh sách roles đã gán
- [x] Action: Thu hồi role
- [x] Buttons disable theo quyền assign/revoke

#### RoleAssignmentsPage
- [x] Form gán permission mới cho role
- [x] Danh sách permissions đã gán
- [x] Action: Thu hồi permission
- [x] Hiển thị resource/action của permission

#### ModulesPage
- [x] Search và pagination
- [x] Hiển thị cấu trúc parent-child
- [x] Icon name và order

#### MenusPage
- [x] Search và pagination
- [x] Hiển thị: code, label, path, module, parent, order, requiredPermission
- [x] Link path và permission

### 🚧 Placeholder (Chưa implement)
- [ ] Forms thêm/sửa (Users, Roles, Modules, Menus)
- [ ] User password reset
- [ ] Role permission bulk assignment
- [ ] User-Role assignment với orgUnit scope selector
- [ ] Assignment expiration date picker
- [ ] Permission dependency validation
- [ ] Audit trail cho assignments
- [ ] Export users/roles to Excel
- [ ] Import users from CSV
- [ ] Role templates
- [ ] Permission groups

## Mock Data

### Users (5)
- `qt_admin` - Super Admin
- `qt_lanhdao` - Lãnh đạo Cục
- `hn_trungnv` - Trưởng Chi cục HN
- `hn_doi01` - Đội trưởng
- `test_locked` - User bị khóa

### Roles (6)
- SUPER_ADMIN (system)
- LANHDAO_CUC (system)
- TRUONG_CHICUC (system)
- DOI_TRUONG (system)
- THANH_TRA_VIEN (custom)
- VAN_THU (custom)

### Permissions (14)
- IAM: user (CRUD), role (CRUD), permission (read), assignment (read/assign/revoke), module (read), menu (read)

### Modules (4)
- OPERATIONS (Điều hành)
- SYSTEM_ADMIN (Quản trị hệ thống)
  - SA_IAM (Quản lý truy cập)
  - SA_MASTER_DATA (Dữ liệu nền)

### Menus (5)
- Operations menu
- System Admin menu
  - IAM menu
    - Users submenu
    - Roles submenu

## Usage

### Tích hợp vào app routes

```typescript
import { saIamRoutes } from '@/modules/system-admin/sa-iam';

const routes: RouteObject[] = [
  // ... other routes
  saIamRoutes,
  // ... other routes
];
```

### Sử dụng shared components

```typescript
import { PermissionGate, ModuleShell } from '../../_shared';

function MyPage() {
  return (
    <PermissionGate permission="sa.iam.user.read">
      <ModuleShell title="My Page">
        {/* content */}
      </ModuleShell>
    </PermissionGate>
  );
}
```

### Permission checking

```typescript
import { usePermissions } from '../../_shared';

function MyComponent() {
  const { hasPermission } = usePermissions();
  const canCreate = hasPermission('sa.iam.user.create');
  
  return (
    <button disabled={!canCreate}>Create User</button>
  );
}
```

## Development Notes

- Tất cả components sử dụng CSS variables từ `/src/styles/global.css`
- Typography: `--font-heading`, `--font-body`, `--font-mono`
- Spacing: `--spacing-*` tokens
- Colors: `--text-*`, `--bg-*`, `--border-*` tokens
- Import sử dụng relative paths
- Mỗi page bọc trong PermissionGate
- Buttons disable theo quyền thực tế của user
- Mock data có relationships (user -> roles, role -> permissions)
- System entities (roles, permissions) không cho xóa

## Integration Notes

### Connecting to AuthContext

Module này sử dụng `usePermissions()` hook từ `_shared`, hook này lấy data từ `useAuth()`:

```typescript
// In _shared/usePermissions.ts
import { useAuth } from '../../../contexts/AuthContext';

export function usePermissions() {
  const { user } = useAuth();
  const userPermissions = user?.permissions || [];
  // ...
}
```

Đảm bảo `user` object trong AuthContext có field `permissions: string[]`:

```typescript
interface UserInfo {
  // ... existing fields
  permissions?: string[]; // Add this
}
```

### Mock vs Real Data

Hiện tại module sử dụng mock data. Để chuyển sang real API:

1. Tạo service layer: `sa-iam/services/`
2. Replace import từ `mock-data.ts` bằng API calls
3. Add loading states với `LoadingState` component
4. Add error handling với `ErrorState` component
5. Implement optimistic updates cho assignments

## Security Considerations

- **Permission-first**: Tất cả pages check permission trước khi render
- **Button-level control**: Mọi action button check quyền real-time
- **System protection**: System roles/permissions không thể xóa/sửa
- **Audit trail**: (Chưa implement) Track tất cả assignment changes
- **Session timeout**: (Rely on AuthContext)
- **RBAC model**: Role-Based Access Control chuẩn
- **Scope-based**: Assignments có thể giới hạn theo orgUnit

---

**Status**: ✅ HOÀN THÀNH 100% theo yêu cầu  
**Date**: 2025-01-22  
**Author**: AI Assistant
