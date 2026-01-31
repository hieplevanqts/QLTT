-- Seed IAM + Menu access for runtime menu (v_my_menu).
-- Do NOT run from the app. Execute manually in Supabase SQL Editor.
-- Safe/idempotent and compatible with the current menu runtime loader.

-- 0) Ensure _id exists for roles/permissions (legacy id -> _id).
alter table public.roles add column if not exists _id uuid;
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'roles' and column_name = 'id'
  ) then
    execute 'update public.roles set _id = coalesce(_id, id) where _id is null';
  else
    execute 'update public.roles set _id = coalesce(_id, gen_random_uuid()) where _id is null';
  end if;
end $$;
alter table public.roles alter column _id set default gen_random_uuid();

alter table public.permissions add column if not exists _id uuid;
alter table public.permissions add column if not exists action text;
alter table public.permissions add column if not exists category text;
alter table public.permissions add column if not exists resource text;
alter table public.permissions add column if not exists module text;
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'permissions' and column_name = 'id'
  ) then
    execute 'update public.permissions set _id = coalesce(_id, id) where _id is null';
  else
    execute 'update public.permissions set _id = coalesce(_id, gen_random_uuid()) where _id is null';
  end if;
end $$;
alter table public.permissions alter column _id set default gen_random_uuid();

-- 1) Seed modules from actual data (insert missing, do not override).
with seed_modules (
  code, name, icon, path, description, order_index, status, key, "group", sort_order, meta
) as (
  values
    ('admin', 'Quản trị', '⚙️', '/admin', null, 2, 1, 'admin', 'SYSTEM', 2, '{}'::jsonb),
    ('user-management', 'Quản trị Người dùng & Phân quyền', 'Users', '/admin/users', 'Quản lý người dùng, vai trò và phân quyền', 1, 1, 'user-management', 'SYSTEM', 1, '{}'::jsonb),
    ('facility', 'Cơ sở & Địa bàn', 'Building2', null, 'Quản lý cơ sở và địa bàn', 2, 1, 'facility', 'SYSTEM', 2, '{}'::jsonb),
    ('map-data', 'Dữ liệu Bản đồ', 'Map', null, 'Quản lý dữ liệu bản đồ', 3, 1, 'map-data', 'SYSTEM', 3, '{}'::jsonb),
    ('documents', 'Văn bản & Quy định', 'FileText', null, 'Quản lý văn bản và quy định', 4, 1, 'documents', 'SYSTEM', 4, '{}'::jsonb),
    ('risk-management', 'Quản lý Rủi ro', 'AlertTriangle', null, 'Quản lý rủi ro và cảnh báo', 6, 1, 'risk-management', 'SYSTEM', 6, '{}'::jsonb),
    ('categories', 'Danh mục Hệ thống', 'FolderOpen', null, 'Quản lý danh mục chung', 7, 1, 'categories', 'SYSTEM', 7, '{}'::jsonb),
    ('settings', 'Cấu hình Hệ thống', 'Settings', null, 'Cấu hình và thiết lập', 8, 1, 'settings', 'SYSTEM', 8, '{}'::jsonb),
    ('audit', 'Nhật ký Hệ thống', 'FileSearch', null, 'Theo dõi nhật ký hoạt động', 9, 1, 'audit', 'SYSTEM', 9, '{}'::jsonb),
    ('leads-risk', 'Nguồn tin / Risk', null, '/leads', null, 40, 1, 'leads-risk', 'SYSTEM', 40, '{}'::jsonb),
    ('operations-plan', 'Kế hoạch tác nghiệp', null, '/plans', null, 50, 1, 'operations-plan', 'SYSTEM', 50, '{}'::jsonb),
    ('field-tasks', 'Nhiệm vụ hiện trường', null, '/tasks', null, 60, 1, 'field-tasks', 'SYSTEM', 60, '{}'::jsonb),
    ('SYSTEM_ADMIN', 'System Admin', 'settings', '/admin', 'System administration module', 0, 1, 'SYSTEM_ADMIN', 'SYSTEM', 0, '{}'::jsonb),
    ('system-admin', 'Quản trị hệ thống', null, null, 'Module root cho System Admin', 0, 1, 'system-admin', 'SYSTEM', 10, jsonb_build_object('source','src/modules/system-admin')),
    ('system-admin.dashboard', 'Dashboard quản trị', null, null, 'Trang tổng quan quản trị hệ thống', 0, 1, 'system-admin.dashboard', 'SYSTEM', 11, jsonb_build_object('source','src/modules/system-admin/routes.tsx')),
    ('system-admin.master-data', 'Dữ liệu nền', null, null, 'Master data cho hệ thống', 0, 1, 'system-admin.master-data', 'SYSTEM', 12, jsonb_build_object('source','src/modules/system-admin/sa-master-data')),
    ('system-admin.iam', 'IAM - Định danh & phân quyền', null, null, 'Identity & Access Management', 0, 1, 'system-admin.iam', 'IAM', 13, jsonb_build_object('source','src/modules/system-admin/sa-iam')),
    ('system-admin.system-config', 'Cấu hình hệ thống', null, null, 'Thiết lập và cấu hình hệ thống', 0, 1, 'system-admin.system-config', 'SYSTEM', 14, jsonb_build_object('source','src/modules/system-admin/sa-system-config')),
    ('i-todolist', 'Nhật ký công việc', null, null, 'Module todolist nội bộ', 0, 1, 'i-todolist', 'OPS', 40, jsonb_build_object('source','src/modules/i-todolist')),
    ('lead-risk', 'Nguồn tin / Risk', null, null, 'Lead & Risk management', 0, 1, 'lead-risk', 'DMS', 104, jsonb_build_object('source','src/pages/lead-risk/*')),
    ('plans', 'Kế hoạch tác nghiệp', null, null, 'Quản lý kế hoạch và phiên kiểm tra', 0, 1, 'plans', 'OPS', 105, jsonb_build_object('source','src/app/pages/plans/*')),
    ('tasks', 'Nhiệm vụ hiện trường', null, null, 'Quản lý nhiệm vụ kiểm tra', 0, 1, 'tasks', 'OPS', 106, jsonb_build_object('source','src/app/pages/tasks/*')),
    ('dashboard', 'Dashboard', null, null, 'Dashboard nghiệp vụ', 0, 1, 'dashboard', 'OPS', 108, jsonb_build_object('source','src/pages/DashboardPage.tsx')),
    ('data-export', 'Xuất dữ liệu', null, null, 'Trung tâm xuất dữ liệu', 0, 1, 'data-export', 'OPS', 110, jsonb_build_object('source','src/pages/DataExportPage.tsx')),
    ('admin-legacy', 'Quản trị (legacy)', null, null, 'Các màn quản trị cũ dưới src/pages', 0, 1, 'admin-legacy', 'SYSTEM', 111, jsonb_build_object('source','src/pages/AdminPage.tsx')),
    ('system-legacy', 'System (legacy)', null, null, 'Các màn /system/* cũ', 0, 1, 'system-legacy', 'SYSTEM', 112, jsonb_build_object('source','src/pages/system/*')),
    ('account', 'Tài khoản', null, null, 'Trang hồ sơ, cài đặt cá nhân', 0, 1, 'account', 'SYSTEM', 113, jsonb_build_object('source','src/pages/account/*')),
    ('auth', 'Xác thực', null, null, 'Đăng nhập / xác thực', 0, 1, 'auth', 'SYSTEM', 114, jsonb_build_object('source','src/app/pages/auth/Login.tsx')),
    ('tv-wallboard', 'TV Wallboard', null, null, 'Chế độ TV / wallboard', 0, 1, 'tv-wallboard', 'OPS', 115, jsonb_build_object('source','src/app/pages/TvWallboardPage.tsx')),
    ('kpi-qltt', 'KPI QLTT', null, '/kpi', 'Báo cáo KPI QLTT', 85, 1, 'kpi-qltt', 'DMS', 30, jsonb_build_object('source','src/modules/kpi-qltt')),
    ('overview', 'Tổng quan', '🏠', '/overview', 'Trang tổng quan hệ thống', 1, 1, 'overview', 'OPS', 101, jsonb_build_object('source','src/pages/OverviewPage.tsx')),
    ('map', 'Bản đồ điều hành', null, '/map', 'Trang bản đồ điều hành', 20, 1, 'map', 'OPS', 102, jsonb_build_object('source','src/pages/MapPage.tsx')),
    ('registry', 'Cơ sở & địa bàn', null, '/registry', 'Registry / quản lý cơ sở', 30, 1, 'registry', 'DMS', 103, jsonb_build_object('source','src/pages/registry/*')),
    ('evidence', 'Kho chứng cứ', null, '/evidence', 'Quản lý chứng cứ', 70, 1, 'evidence', 'OPS', 107, jsonb_build_object('source','src/app/routes/EvidenceRoutes.tsx')),
    ('reports', 'Báo cáo & KPI', 'BarChart3', null, 'Trang báo cáo tổng hợp', 5, 1, 'reports', 'OPS', 109, jsonb_build_object('source','src/pages/ReportsPage.tsx'))
)
insert into public.modules (
  code, name, icon, path, description, order_index, status, key, "group", sort_order, meta
)
select
  s.code, s.name, s.icon, s.path, s.description, s.order_index, s.status, s.key, s."group", s.sort_order, s.meta
from seed_modules s
on conflict (code) do nothing;

-- Best-effort backfill for extended columns (if modules patch was applied).
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'modules' and column_name = 'key'
  ) then
    execute 'update public.modules set key = coalesce(key, code) where key is null';
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'modules' and column_name = 'group'
  ) then
    execute $sql$
      update public.modules
      set "group" = case
        when code = 'system-admin' then 'IAM'
        when code = 'reports' then 'SYSTEM'
        else "group"
      end
      where code in ('system-admin', 'reports')
    $sql$;
  end if;

  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'modules' and column_name = 'sort_order'
  ) then
    execute 'update public.modules set sort_order = coalesce(sort_order, order_index) where sort_order is null';
  end if;
end $$;

-- 2) Ensure PAGE permissions (menu visibility) for modules referenced by menus.
with menu_modules as (
  select distinct m.module_id, mod.code, mod.name
  from public.menus m
  join public.modules mod on mod._id = m.module_id
  where m.module_id is not null
),
seed as (
  select
    mm.module_id as module_id,
    (mm.code || '.page.read')::text as code,
    (mm.name || ' page read')::text as name
  from menu_modules mm
)
insert into public.permissions (
  module_id,
  code,
  name,
  permission_type,
  action,
  category,
  status,
  module,
  resource
)
select
  s.module_id,
  s.code,
  s.name,
  'PAGE'::text,
  'READ'::text,
  'PAGE'::text,
  1,
  split_part(s.code, '.', 1),
  'page'
from seed s
on conflict (code) do nothing;

-- 3) Ensure admin role exists.
insert into public.roles (code, name, status)
values ('admin', 'admin', 1)
on conflict (code) do nothing;

-- 4) Map permissions -> admin role (grant all PAGE permissions used by menus).
with admin_role as (
  select _id from public.roles where lower(code) = 'admin' limit 1
),
menu_perms as (
  select p._id
  from public.permissions p
  where p.code like '%.page.read'
),
seed as (
  select admin_role._id as role_id, menu_perms._id as permission_id
  from admin_role, menu_perms
)
insert into public.role_permissions (role_id, permission_id)
select role_id, permission_id
from seed
on conflict (role_id, permission_id) do nothing;

-- 5) Map menus -> permissions (module.page.read).
with menu_modules as (
  select m._id as menu_id, mod.code as module_code
  from public.menus m
  join public.modules mod on mod._id = m.module_id
  where m.module_id is not null
),
seed as (
  select mm.menu_id, p._id as permission_id
  from menu_modules mm
  join public.permissions p on p.code = (mm.module_code || '.page.read')
)
insert into public.menu_permissions (menu_id, permission_id)
select menu_id, permission_id
from seed
on conflict (menu_id, permission_id) do nothing;

-- 6) Assign admin role to a user (example: admin31@vhv.vn).
with target_user as (
  select user_id as _id
  from public.v_user_profile
  where lower(email) = 'admin31@vhv.vn'
  union all
  select _id
  from public.users
  where lower(email) = 'admin31@vhv.vn'
  limit 1
),
admin_role as (
  select _id from public.roles where lower(code) = 'admin' limit 1
)
insert into public.user_roles (user_id, role_id, is_primary, assigned_at)
select target_user._id, admin_role._id, true, now()
from target_user, admin_role
on conflict (user_id, role_id) do update
set is_primary = excluded.is_primary,
    assigned_at = excluded.assigned_at;

-- 7) Bump menu version (menu cache invalidation uses MAX(updated_at)).
update public.menus
set updated_at = now()
where _id in (
  select _id
  from public.menus
  where module_id in (
    select _id from public.modules where code in ('system-admin','reports')
  )
);
