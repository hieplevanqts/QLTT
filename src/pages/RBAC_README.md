# RBAC Management System - MAPPA Portal

## 📋 Tổng Quan

Hệ thống quản lý phân quyền dựa trên vai trò (Role-Based Access Control) hoàn chỉnh với giao diện ma trận phân quyền trực quan.

## 🗄️ Database Schema

### Tables Structure

```
users (Bảng người dùng - Đã tự tạo)
├── id (uuid, PK, auto: uuid_generate_v4())
├── username (varchar(100), NOT NULL, UNIQUE)
├── full_name (varchar(255), NOT NULL)
├── email (varchar(255), NULL)
├── status (int4, NOT NULL, default 1)
└── created_at, updated_at (timestamptz, auto-trigger)

roles
├── id (int4, PK)
├── code (varchar, UNIQUE)
├── name (varchar)
├── description (text)
├── status (int4)
├── is_system (bool)
└── created_at, updated_at (timestamptz)

permissions
├── id (int4, PK)
├── module_id (int4, FK → modules.id)
├── code (varchar, UNIQUE)
├── name (varchar)
├── description (text)
├── permission_type (varchar)
├── is_default (bool)
├── status (int4)
└── created_at, updated_at (timestamptz)

modules
├── id (int4, PK)
├── code (varchar, UNIQUE)
├── name (varchar)
├── icon (varchar)
├── description (text)
├── order_index (int4)
├── status (int4)
└── created_at, updated_at (timestamptz)

user_roles (Junction Table)
├── id (int4, PK)
├── user_id (uuid, FK → users.id)
├── role_id (int4, FK → roles.id)
└── created_at (timestamptz)

role_permissions (Junction Table)
├── id (int4, PK)
├── role_id (int4, FK → roles.id)
├── permission_id (int4, FK → permissions.id)
└── created_at (timestamptz)
```

## 🎨 Design System

### Font Family
- **Primary Font**: Inter (từ `/src/styles/theme.css`)
- Áp dụng cho tất cả typography elements

### Colors (CSS Variables)
```css
--primary: #005cb6 (MAPPA Blue)
--foreground: rgba(16, 24, 40, 1)
--background: rgba(249, 250, 251, 1)
--card: rgba(255, 255, 255, 1)
--border: rgba(208, 213, 221, 1)
--muted: rgba(242, 244, 247, 1)
--muted-foreground: rgba(102, 112, 133, 1)
```

### Typography Scale
```css
--text-xs: 12px
--text-sm: 14px
--text-base: 16px
--text-lg: 20px
--text-xl: 24px
--text-2xl: 30px
--text-page-title: 22px
```

### Border Radius
```css
--radius: 8px
--radius-card: 16px
```

## 🚀 Features

### 1. Ma trận Phân quyền (Permission Matrix)
- ✅ Giao diện bảng 2 chiều: Roles × Permissions
- ✅ Checkbox toggle để gán/gỡ quyền
- ✅ Group permissions theo modules
- ✅ Sticky header và sticky column
- ✅ Search và filter theo module
- ✅ Real-time update với Supabase
- ✅ System roles protection (Admin không thể chỉnh sửa)

### 2. Quản lý Vai trò (Roles)
- ✅ Danh sách tất cả vai trò
- ✅ Phân biệt system roles và custom roles
- ✅ CRUD operations
- ✅ Status management (Active/Inactive)

### 3. Quản lý Quyền (Permissions)
- ✅ Danh sách permissions theo modules
- ✅ Permission types và default permissions
- ✅ CRUD operations
- ✅ Code-based permission management

### 4. Quản lý Người dùng (Users)
- ✅ Danh sách người dùng với vai trò
- ✅ Gán multiple roles cho user
- ✅ User status management
- ✅ Role badges hiển thị

## 📁 File Structure

```
/src/pages/
├── RBACManagement.tsx          # Main component (Tab-based UI)
├── RBACManagement.module.css   # Styles với design tokens
├── PermissionsMatrixTab.tsx    # Legacy component (deprecated)
└── AdminTabComponents.tsx      # Export point
```

## 🎯 Usage

### Import Component
```tsx
import { RBACManagement } from './pages/AdminTabComponents';
// hoặc backward compatible:
import { PermissionsMatrixTab } from './pages/AdminTabComponents';
```

### Render
```tsx
<RBACManagement />
```

## 🔐 Permission Matrix Logic

### Toggle Permission
```typescript
const togglePermission = async (roleId: number, permissionId: number) => {
  const exists = hasPermission(roleId, permissionId);
  
  if (exists) {
    // Remove permission
    await supabase
      .from('role_permissions')
      .delete()
      .eq('role_id', roleId)
      .eq('permission_id', permissionId);
  } else {
    // Add permission
    await supabase
      .from('role_permissions')
      .insert([{ role_id: roleId, permission_id: permissionId }]);
  }
};
```

### Check Permission
```typescript
const hasPermission = (roleId: number, permissionId: number): boolean => {
  return rolePermissions.some(
    (rp) => rp.role_id === roleId && rp.permission_id === permissionId
  );
};
```

## 📊 Component Structure

```
RBACManagement
├── Header (Title + Icon)
├── Tabs Navigation
│   ├── Ma trận Phân quyền (Matrix View)
│   ├── Vai trò (Roles List)
│   ├── Quyền hạn (Permissions List)
│   └── Người dùng (Users List)
├── Tab Content
│   ├── PermissionMatrixView
│   │   ├── Filters (Search + Module filter)
│   │   └── Matrix Table (Roles × Permissions)
│   ├── RolesView
│   ├── PermissionsView
│   └── UsersView
└── Stats Footer
```

## 🎨 CSS Classes

### Key Classes
```css
.container              /* Main container */
.header                 /* Header section */
.tabsContainer          /* Tabs navigation wrapper */
.tab / .tabActive       /* Tab buttons */
.matrixTable            /* Permission matrix table */
.stickyColumn           /* Sticky first column */
.checkboxButton         /* Permission toggle button */
.moduleRow              /* Module grouping row */
.permissionRow          /* Permission data row */
```

### Button Variants
```css
.btnPrimary             /* Primary action button */
.btnIconEdit            /* Edit icon button */
.btnIconDelete          /* Delete icon button */
```

## 🔄 Data Flow

1. **Initial Load**: Fetch all data from Supabase (users, roles, permissions, modules, junctions)
2. **Matrix Render**: Group permissions by modules, display in 2D table
3. **Toggle Permission**: Update role_permissions junction table
4. **Real-time Update**: UI reflects changes immediately

## 🚧 Future Enhancements

- [ ] Batch permission assignment
- [ ] Permission templates
- [ ] Role cloning
- [ ] Audit log for permission changes
- [ ] Export/Import permission matrix
- [ ] Advanced filtering and sorting
- [ ] Permission conflict detection
- [ ] User permission preview

## 📝 Notes

- **System Roles**: Roles với `is_system = true` không thể xóa
- **Admin Protection**: Admin role tự động có tất cả permissions
- **Inter Font**: Sử dụng `font-family: 'Inter', sans-serif` cho consistency
- **CSS Variables**: Tất cả màu sắc từ `theme.css` để dễ customize
- **Responsive**: Hỗ trợ mobile với breakpoint 768px

## 🐛 Troubleshooting

### Lỗi: Column "type" does not exist
- **Nguyên nhân**: Database schema không khớp với code
- **Giải pháp**: Kiểm tra tên bảng là `modules` (không phải `map_modules`)

### Lỗi: Permission not updating
- **Nguyên nhân**: RLS policies chặn
- **Giải pháp**: Kiểm tra Supabase RLS policies cho `role_permissions` table

### Matrix không hiển thị
- **Nguyên nhân**: Data chưa load hoặc permissions rỗng
- **Giải pháp**: Kiểm tra console logs và network tab

---

**Author**: MAPPA Development Team  
**Version**: 1.0.0  
**Last Updated**: 2026-01-09