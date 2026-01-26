-- System-admin DB readiness audit (read-only)
-- NOTE: This file contains SELECT-only queries for inventory and security review.

-- 1) Tables inventory (non-system schemas)
SELECT table_schema,
       table_name,
       table_type
FROM information_schema.tables
WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY table_schema, table_name;

-- 2) Views inventory (non-system schemas)
SELECT table_schema,
       table_name
FROM information_schema.views
WHERE table_schema NOT IN ('pg_catalog', 'information_schema')
ORDER BY table_schema, table_name;

-- 3) Columns detail (system-admin related tables)
SELECT table_name,
       column_name,
       data_type,
       is_nullable,
       column_default
FROM information_schema.columns
WHERE table_schema = 'public'
  AND table_name IN (
    'users',
    'roles',
    'permissions',
    'role_permissions',
    'user_roles',
    'modules',
    'menus',
    'menu_permissions',
    'department_users',
    'departments',
    'profiles'
  )
ORDER BY table_name, ordinal_position;

-- 4) Constraints + FK details
SELECT tc.table_name,
       tc.constraint_type,
       tc.constraint_name,
       kcu.column_name,
       ccu.table_name AS foreign_table,
       ccu.column_name AS foreign_column
FROM information_schema.table_constraints AS tc
LEFT JOIN information_schema.key_column_usage AS kcu
  ON tc.constraint_name = kcu.constraint_name
  AND tc.table_schema = kcu.table_schema
LEFT JOIN information_schema.constraint_column_usage AS ccu
  ON ccu.constraint_name = tc.constraint_name
  AND ccu.table_schema = tc.table_schema
WHERE tc.table_schema = 'public'
  AND tc.table_name IN (
    'users',
    'roles',
    'permissions',
    'role_permissions',
    'user_roles',
    'modules',
    'menus',
    'menu_permissions',
    'department_users',
    'departments',
    'profiles'
  )
ORDER BY tc.table_name, tc.constraint_type, tc.constraint_name;

-- 5) Indexes
SELECT schemaname,
       tablename,
       indexname,
       indexdef
FROM pg_indexes
WHERE schemaname = 'public'
  AND tablename IN (
    'users',
    'roles',
    'permissions',
    'role_permissions',
    'user_roles',
    'modules',
    'menus',
    'menu_permissions',
    'department_users',
    'departments',
    'profiles'
  )
ORDER BY tablename, indexname;

-- 6) RLS enabled
SELECT n.nspname AS schema_name,
       c.relname AS table_name,
       c.relrowsecurity AS rls_enabled,
       c.relforcerowsecurity AS rls_forced
FROM pg_class c
JOIN pg_namespace n ON n.oid = c.relnamespace
WHERE n.nspname = 'public'
  AND c.relkind = 'r'
  AND c.relname IN (
    'users',
    'roles',
    'permissions',
    'role_permissions',
    'user_roles',
    'modules',
    'menus',
    'menu_permissions',
    'department_users',
    'departments',
    'profiles'
  )
ORDER BY c.relname;

-- 7) Policies
SELECT schemaname,
       tablename,
       policyname,
       permissive,
       roles,
       cmd,
       qual,
       with_check
FROM pg_policies
WHERE schemaname = 'public'
  AND tablename IN (
    'users',
    'roles',
    'permissions',
    'role_permissions',
    'user_roles',
    'modules',
    'menus',
    'menu_permissions',
    'department_users',
    'departments',
    'profiles'
  )
ORDER BY tablename, policyname;

-- 8) Views that can reduce FE logic (optional if present)
SELECT table_schema,
       table_name
FROM information_schema.views
WHERE table_schema = 'public'
  AND table_name IN ('v_my_permissions', 'v_my_roles', 'v_my_menu')
ORDER BY table_name;
