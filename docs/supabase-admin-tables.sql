-- =====================================================
-- MAPPA PORTAL - ADMIN TABLES SCHEMA
-- =====================================================
-- Schema for users, roles, modules, permissions tables
-- Run this SQL in Supabase SQL Editor to create required tables
-- =====================================================

-- =====================================================
-- TABLE: roles
-- =====================================================
CREATE TABLE IF NOT EXISTS public.roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: users
-- =====================================================
CREATE TABLE IF NOT EXISTS public.users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL UNIQUE,
  username TEXT,
  full_name TEXT NOT NULL,
  phone TEXT,
  avatar_url TEXT,
  status INTEGER NOT NULL DEFAULT 1, -- 1 = kích hoạt, 0 = hủy kích hoạt
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_login TIMESTAMP WITH TIME ZONE
);

-- =====================================================
-- TABLE: user_roles (Junction table)
-- =====================================================
CREATE TABLE IF NOT EXISTS public.user_roles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.users(id) ON DELETE CASCADE,
  role_id UUID NOT NULL REFERENCES public.roles(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, role_id)
);

-- =====================================================
-- TABLE: modules
-- =====================================================
CREATE TABLE IF NOT EXISTS public.modules (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL,
  icon TEXT,
  path TEXT,
  description TEXT,
  order_index INTEGER NOT NULL DEFAULT 0,
  status INTEGER NOT NULL DEFAULT 1, -- 1 = active, 0 = inactive
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =====================================================
-- TABLE: permissions
-- =====================================================
CREATE TABLE IF NOT EXISTS public.permissions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  module_id UUID NOT NULL REFERENCES public.modules(id) ON DELETE CASCADE,
  code TEXT NOT NULL,
  name TEXT NOT NULL,
  description TEXT,
  permission_type TEXT NOT NULL, -- e.g., 'view', 'create', 'edit', 'delete'
  status INTEGER NOT NULL DEFAULT 1, -- 1 = active, 0 = inactive
  is_default BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(module_id, code)
);

-- =====================================================
-- INDEXES for Performance
-- =====================================================

-- Users indexes
CREATE INDEX IF NOT EXISTS idx_users_email ON public.users(email);
CREATE INDEX IF NOT EXISTS idx_users_username ON public.users(username);
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users(status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users(created_at DESC);

-- Roles indexes
CREATE INDEX IF NOT EXISTS idx_roles_code ON public.roles(code);
CREATE INDEX IF NOT EXISTS idx_roles_name ON public.roles(name);

-- User roles indexes
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);

-- Modules indexes
CREATE INDEX IF NOT EXISTS idx_modules_code ON public.modules(code);
CREATE INDEX IF NOT EXISTS idx_modules_order_index ON public.modules(order_index);
CREATE INDEX IF NOT EXISTS idx_modules_status ON public.modules(status);

-- Permissions indexes
CREATE INDEX IF NOT EXISTS idx_permissions_module_id ON public.permissions(module_id);
CREATE INDEX IF NOT EXISTS idx_permissions_code ON public.permissions(code);
CREATE INDEX IF NOT EXISTS idx_permissions_status ON public.permissions(status);

-- =====================================================
-- ROW LEVEL SECURITY (RLS)
-- =====================================================

-- Enable RLS
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.modules ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.permissions ENABLE ROW LEVEL SECURITY;

-- Policies: Allow public read access (for development)
-- For production, you should restrict access based on user authentication

-- Users policies
CREATE POLICY "users_select_all" ON public.users
  FOR SELECT USING (true);

CREATE POLICY "users_insert_all" ON public.users
  FOR INSERT WITH CHECK (true);

CREATE POLICY "users_update_all" ON public.users
  FOR UPDATE USING (true);

CREATE POLICY "users_delete_all" ON public.users
  FOR DELETE USING (true);

-- Roles policies
CREATE POLICY "roles_select_all" ON public.roles
  FOR SELECT USING (true);

CREATE POLICY "roles_insert_all" ON public.roles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "roles_update_all" ON public.roles
  FOR UPDATE USING (true);

CREATE POLICY "roles_delete_all" ON public.roles
  FOR DELETE USING (true);

-- User roles policies
CREATE POLICY "user_roles_select_all" ON public.user_roles
  FOR SELECT USING (true);

CREATE POLICY "user_roles_insert_all" ON public.user_roles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "user_roles_update_all" ON public.user_roles
  FOR UPDATE USING (true);

CREATE POLICY "user_roles_delete_all" ON public.user_roles
  FOR DELETE USING (true);

-- Modules policies
CREATE POLICY "modules_select_all" ON public.modules
  FOR SELECT USING (true);

CREATE POLICY "modules_insert_all" ON public.modules
  FOR INSERT WITH CHECK (true);

CREATE POLICY "modules_update_all" ON public.modules
  FOR UPDATE USING (true);

CREATE POLICY "modules_delete_all" ON public.modules
  FOR DELETE USING (true);

-- Permissions policies
CREATE POLICY "permissions_select_all" ON public.permissions
  FOR SELECT USING (true);

CREATE POLICY "permissions_insert_all" ON public.permissions
  FOR INSERT WITH CHECK (true);

CREATE POLICY "permissions_update_all" ON public.permissions
  FOR UPDATE USING (true);

CREATE POLICY "permissions_delete_all" ON public.permissions
  FOR DELETE USING (true);

-- =====================================================
-- SAMPLE DATA (Optional - for testing)
-- =====================================================

-- Sample roles
INSERT INTO public.roles (code, name, description) VALUES
  ('ADMIN', 'Quản trị hệ thống', 'Quyền truy cập đầy đủ hệ thống'),
  ('MANAGER', 'Quản lý', 'Quyền quản lý người dùng và cấu hình'),
  ('OFFICER', 'Cán bộ', 'Quyền cán bộ thực thi'),
  ('CITIZEN', 'Công dân', 'Quyền công dân cơ bản')
ON CONFLICT (code) DO NOTHING;

-- Sample modules (you can customize these)
INSERT INTO public.modules (code, name, description, order_index) VALUES
  ('DASHBOARD', 'Bảng điều khiển', 'Trang tổng quan', 1),
  ('MAP', 'Bản đồ', 'Xem và quản lý bản đồ', 2),
  ('USERS', 'Người dùng', 'Quản lý người dùng', 3),
  ('ROLES', 'Vai trò', 'Quản lý vai trò và phân quyền', 4),
  ('REPORTS', 'Báo cáo', 'Xem và tạo báo cáo', 5)
ON CONFLICT (code) DO NOTHING;

-- =====================================================
-- NOTES
-- =====================================================
-- 1. Run this script in Supabase SQL Editor
-- 2. All tables use UUID as primary key
-- 3. RLS policies are set to allow all operations (for development)
--    In production, you should restrict based on authentication
-- 4. Sample data is optional - remove INSERT statements if not needed
-- 5. After creating tables, verify in Supabase Dashboard:
--    - Database → Tables → should see all 5 tables
--    - Database → Tables → users → RLS enabled
-- =====================================================
