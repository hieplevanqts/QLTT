# System-admin DB readiness audit

I. Conclusion: PARTIAL
- Core RBAC tables exist (users, roles, permissions, user_roles, role_permissions) with FK + unique constraints in schema snapshot.
- Module registry table exists (public.modules) but there is no menu registry table or menu-permission mapping.
- RLS appears enabled only on public.users; policies exist for RBAC tables but RLS is not enabled for them in the snapshot.
- No dedicated audit_logs table found for admin changes.

II. Capability Matrix
| Capability | Status | Evidence |
| --- | --- | --- |
| User Management | PASS | public.users table exists with status + departmentId; handle_new_user() syncs auth.users -> public.users; department_users table exists for org membership. |
| RBAC | PASS | public.roles, public.permissions, public.user_roles, public.role_permissions exist with FK + unique constraints; get_user_permissions() function + sync_user_permissions_to_auth trigger. |
| Menu | FAIL | No public.menus / menu_permissions (or equivalent) found in schema snapshot. |
| Module registry | PARTIAL | public.modules exists; no menu linkage or menu registry table; permissions reference modules. |

III. Data Integrity (constraints/indexes)
- Constraints present: unique on roles.code, permissions.code, modules.code; unique on user_roles(user_id, role_id) and role_permissions(role_id, permission_id); FKs from permissions -> modules, role_permissions -> roles/permissions, user_roles -> roles/users.
- No explicit indexes found for RBAC join columns (user_roles.user_id, user_roles.role_id, role_permissions.role_id, role_permissions.permission_id) in schema snapshot. Consider adding for list/search performance.
- No FK from public.users to auth.users (mapping is implied by handle_new_user trigger). This is acceptable but lacks referential integrity.

IV. Security (RLS/Policies)
- RLS: only public.users has FORCE ROW LEVEL SECURITY in schema snapshot.
- Policies exist for roles/permissions/user_roles/role_permissions with "Enable read access for all users", but RLS is not enabled on those tables, so policies are not enforced.
- users has policies for SELECT all and UPDATE self (auth.uid() = id).

V. GAP list (priority)
P0
- Missing menu registry tables (public.menus + menu_permissions or menus.required_permissions jsonb). Impact: Menu management UI cannot persist or enforce permissions. Proposed fix: create menus + menu_permissions (or JSONB) and FK to modules if needed.
- RLS not enabled on RBAC + modules tables. Impact: data exposure risk and inconsistent security. Proposed fix: ENABLE RLS and define policies for roles, permissions, role_permissions, user_roles, modules, menus.

P1
- No RBAC scope columns in user_roles (scope_type/scope_id). Impact: cannot express department/area scoped roles via DB. Proposed fix: add scope_type/scope_id or a separate user_role_scopes table.
- No explicit FK between public.users and auth.users. Impact: orphaned records possible if auth users deleted outside trigger flow. Proposed fix: add FK or scheduled cleanup.

P2
- No audit_logs table for admin actions (role/menu/module changes). Impact: no change history in DB. Proposed fix: create audit_logs table and write from admin actions.
- Missing helper views (v_my_permissions, v_my_roles, v_my_menu). Impact: FE needs more logic and can drift. Proposed fix: add views based on current RBAC tables.

VI. Appendix: Evidence
- No DATABASE_URL / SUPABASE_DB_URL in repo; only VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY found. DB audit queries were not executed.
- Evidence source: schema snapshot at `backups/mwuhuixkybbwrnoqcibg/2026-01-18/mwuhuixkybbwrnoqcibg_20260118_115510.schema.sql`.
  - Tables: public.users, public.roles, public.permissions, public.role_permissions, public.user_roles, public.modules, public.departments, public.department_users.
  - Functions: get_user_permissions(), get_user_roles_by_email(), handle_new_user(), sync_user_permissions_to_auth().
  - Trigger: on_user_role_change -> sync_user_permissions_to_auth().
  - RLS: FORCE RLS on public.users only.

Run the audit queries from `sql/audits/system_admin_readiness.sql` once a DB connection is available to confirm live state.
