-- Seed modules registry from src/modules + src/pages (safe upsert without UNIQUE constraint).
-- Run AFTER: supabase/patches/202601270012_patch_modules_registry.sql
-- Do NOT run from the app.

with seed(key, code, name, "group", description, sort_order, status, meta) as (
  values
    -- ===== src/modules (module-first) =====
    ('system-admin', 'system-admin', 'Quản trị hệ thống', 'SYSTEM', 'Module root cho System Admin', 10, 1, '{"source":"src/modules/system-admin"}'::jsonb),
    ('system-admin.dashboard', 'system-admin.dashboard', 'Dashboard quản trị', 'SYSTEM', 'Trang tổng quan quản trị hệ thống', 11, 1, '{"source":"src/modules/system-admin/routes.tsx"}'::jsonb),
    ('system-admin.master-data', 'system-admin.master-data', 'Dữ liệu nền', 'SYSTEM', 'Master data cho hệ thống', 12, 1, '{"source":"src/modules/system-admin/sa-master-data"}'::jsonb),
    ('system-admin.iam', 'system-admin.iam', 'IAM - Định danh & phân quyền', 'IAM', 'Identity & Access Management', 13, 1, '{"source":"src/modules/system-admin/sa-iam"}'::jsonb),
    ('system-admin.system-config', 'system-admin.system-config', 'Cấu hình hệ thống', 'SYSTEM', 'Thiết lập và cấu hình hệ thống', 14, 1, '{"source":"src/modules/system-admin/sa-system-config"}'::jsonb),
    ('kpi-qltt', 'kpi-qltt', 'KPI QLTT', 'DMS', 'Báo cáo KPI QLTT', 30, 1, '{"source":"src/modules/kpi-qltt"}'::jsonb),
    ('i-todolist', 'i-todolist', 'Nhật ký công việc', 'OPS', 'Module todolist nội bộ', 40, 1, '{"source":"src/modules/i-todolist"}'::jsonb),

    -- ===== src/pages (legacy but still routed) =====
    ('overview', 'overview', 'Tổng quan', 'OPS', 'Trang tổng quan hệ thống', 101, 1, '{"source":"src/pages/OverviewPage.tsx"}'::jsonb),
    ('map', 'map', 'Bản đồ điều hành', 'OPS', 'Trang bản đồ điều hành', 102, 1, '{"source":"src/pages/MapPage.tsx"}'::jsonb),
    ('registry', 'registry', 'Cơ sở quản lý', 'DMS', 'Registry / quản lý cơ sở', 103, 1, '{"source":"src/pages/registry/*"}'::jsonb),
    ('lead-risk', 'lead-risk', 'Nguồn tin / Risk', 'DMS', 'Lead & Risk management', 104, 1, '{"source":"src/pages/lead-risk/*"}'::jsonb),
    ('plans', 'plans', 'Kế hoạch tác nghiệp', 'OPS', 'Quản lý kế hoạch và phiên kiểm tra', 105, 1, '{"source":"src/app/pages/plans/*"}'::jsonb),
    ('tasks', 'tasks', 'Nhiệm vụ hiện trường', 'OPS', 'Quản lý nhiệm vụ kiểm tra', 106, 1, '{"source":"src/app/pages/tasks/*"}'::jsonb),
    ('evidence', 'evidence', 'Kho chứng cứ', 'OPS', 'Quản lý chứng cứ', 107, 1, '{"source":"src/app/routes/EvidenceRoutes.tsx"}'::jsonb),
    ('dashboard', 'dashboard', 'Dashboard', 'OPS', 'Dashboard nghiệp vụ', 108, 1, '{"source":"src/pages/DashboardPage.tsx"}'::jsonb),
    ('reports', 'reports', 'Báo cáo & KPI', 'OPS', 'Trang báo cáo tổng hợp', 109, 1, '{"source":"src/pages/ReportsPage.tsx"}'::jsonb),
    ('data-export', 'data-export', 'Xuất dữ liệu', 'OPS', 'Trung tâm xuất dữ liệu', 110, 1, '{"source":"src/pages/DataExportPage.tsx"}'::jsonb),
    ('admin-legacy', 'admin-legacy', 'Quản trị (legacy)', 'SYSTEM', 'Các màn quản trị cũ dưới src/pages', 111, 1, '{"source":"src/pages/AdminPage.tsx"}'::jsonb),
    ('system-legacy', 'system-legacy', 'System (legacy)', 'SYSTEM', 'Các màn /system/* cũ', 112, 1, '{"source":"src/pages/system/*"}'::jsonb),
    ('account', 'account', 'Tài khoản', 'SYSTEM', 'Trang hồ sơ, cài đặt cá nhân', 113, 1, '{"source":"src/pages/account/*"}'::jsonb),
    ('auth', 'auth', 'Xác thực', 'SYSTEM', 'Đăng nhập / xác thực', 114, 1, '{"source":"src/app/pages/auth/Login.tsx"}'::jsonb),
    ('tv-wallboard', 'tv-wallboard', 'TV Wallboard', 'OPS', 'Chế độ TV / wallboard', 115, 1, '{"source":"src/app/pages/TvWallboardPage.tsx"}'::jsonb)
),
updated as (
  update public.modules m
  set
    code = coalesce(s.code, m.code),
    name = s.name,
    "group" = s."group",
    description = s.description,
    sort_order = s.sort_order,
    status = coalesce(m.status, s.status),
    meta = coalesce(m.meta, '{}'::jsonb) || coalesce(s.meta, '{}'::jsonb),
    updated_at = now()
  from seed s
  where m.key = s.key
    and m.deleted_at is null
  returning m.key
)
insert into public.modules (key, code, name, "group", description, sort_order, status, meta, created_at, updated_at)
select
  s.key, s.code, s.name, s."group", s.description, s.sort_order, s.status, s.meta, now(), now()
from seed s
where not exists (
  select 1 from public.modules m where m.key = s.key
);

