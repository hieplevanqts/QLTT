-- Seed menus for legacy schema (name/path/order_index/is_active).
-- Do NOT run from the app. Execute manually in Supabase SQL editor.
-- Assumes menus.code is unique and modules.code is available for module mapping.

-- 1) Ensure root "Quản trị" node exists.
insert into public.menus (code, name, path, icon, order_index, parent_id, module_id, is_active)
select
  'admin',
  'Quản trị',
  '/admin',
  'Settings',
  0,
  null,
  (select _id from public.modules where code = 'system-admin' limit 1),
  true
on conflict (code) do update
set
  name = excluded.name,
  path = excluded.path,
  icon = excluded.icon,
  order_index = excluded.order_index,
  parent_id = excluded.parent_id,
  module_id = excluded.module_id,
  is_active = excluded.is_active;

-- 2) Seed children under "admin" (no permissions).
with seed (code, name, path, icon, order_index, module_code, parent_code) as (
  values
    ('admin-dashboard', 'Dashboard Quản trị', '/system-admin', 'LayoutDashboard', 10, 'system-admin', 'admin'),
    ('admin-org-units', 'Đơn vị tổ chức', '/system-admin/master-data/org-units', 'Building2', 21, 'system-admin-master-data', 'admin'),
    ('admin-departments', 'Phòng ban', '/system-admin/master-data/departments', 'Users', 22, 'system-admin-master-data', 'admin'),
    ('admin-jurisdictions', 'Danh mục hành chính', '/system-admin/master-data/admin-areas', 'MapPin', 23, 'system-admin-master-data', 'admin'),
    ('admin-catalogs-common', 'Danh mục dùng chung', '/system-admin/master-data/common-catalogs', 'Folder', 24, 'system-admin-master-data', 'admin'),
    ('admin-catalogs-domain', 'Danh mục nghiệp vụ QLTT', '/system-admin/master-data/dms-catalogs', 'Layers', 25, 'system-admin-master-data', 'admin'),
    ('admin-catalogs-system', 'Danh mục kỹ thuật', '/system-admin/master-data/system-catalogs', 'GitBranch', 26, 'system-admin-master-data', 'admin'),
    ('admin-users', 'Người dùng', '/system-admin/iam/users', 'Users', 31, 'system-admin-iam', 'admin'),
    ('admin-roles', 'Vai trò', '/system-admin/iam/roles', 'Shield', 32, 'system-admin-iam', 'admin'),
    ('admin-permissions', 'Danh mục quyền', '/system-admin/iam/permissions', 'KeyRound', 33, 'system-admin-iam', 'admin'),
    ('admin-assignments', 'Phân quyền', '/system-admin/iam/role-permissions', 'UserCheck', 34, 'system-admin-iam', 'admin'),
    ('admin-modules', 'Phân hệ', '/system-admin/iam/modules', 'Boxes', 35, 'system-admin-iam', 'admin'),
    ('admin-menus', 'Menu', '/system-admin/iam/menus', 'Menu', 36, 'system-admin-iam', 'admin'),
    ('admin-parameters', 'Thông số hệ thống', '/system-admin/system-config/parameters', 'Sliders', 41, 'system-admin-config', 'admin'),
    ('admin-organization-info', 'Thông tin tổ chức', '/system-admin/system-config/organization-info', 'Landmark', 42, 'system-admin-config', 'admin'),
    ('admin-operations', 'Cài đặt vận hành', '/system-admin/system-config/operations', 'Settings', 43, 'system-admin-config', 'admin'),
    ('admin-notifications', 'Mẫu thông báo', '/system-admin/system-config/notifications', 'Bell', 44, 'system-admin-config', 'admin'),
    ('admin-security', 'Cài đặt bảo mật', '/system-admin/system-config/security', 'ShieldCheck', 45, 'system-admin-config', 'admin'),
    ('admin-db-logs', 'Database Logs', '/system-admin/system-config/database/logs', 'FileBox', 46, 'system-admin-config', 'admin'),
    ('admin-db-backups', 'Database Backups', '/system-admin/system-config/database/backups', 'HardDrive', 47, 'system-admin-config', 'admin'),
    ('admin-module-registry', 'Quản trị Module', '/system/modules', null, 90, 'system-admin', 'admin'),
    ('admin-menu-registry', 'Quản trị Menu', '/system/menus', null, 91, 'system-admin', 'admin'),
    ('admin-users-legacy', 'Người dùng (cũ)', '/system/users', null, 92, 'system-admin', 'admin'),
    ('admin-roles-legacy', 'Vai trò (cũ)', '/system/roles', null, 93, 'system-admin', 'admin'),
    ('admin-settings-legacy', 'Cấu hình hệ thống', '/system/settings', null, 94, 'system-admin', 'admin')
)
insert into public.menus (code, name, path, icon, order_index, parent_id, module_id, is_active)
select
  s.code,
  s.name,
  s.path,
  s.icon,
  s.order_index,
  (select _id from public.menus where code = s.parent_code),
  (select _id from public.modules where code = s.module_code limit 1),
  true
from seed s
on conflict (code) do update
set
  name = excluded.name,
  path = excluded.path,
  icon = excluded.icon,
  order_index = excluded.order_index,
  parent_id = excluded.parent_id,
  module_id = excluded.module_id,
  is_active = excluded.is_active;
