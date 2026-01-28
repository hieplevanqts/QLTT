-- Normalize permissions: add category + standardize action.
-- Do NOT run from the app. Execute manually in Supabase SQL editor.

-- 1) Backup permissions for rollback safety.
create table if not exists public.permissions_bak_20260128 as
table public.permissions;

-- 2) Add category column (business classification).
alter table public.permissions
add column if not exists category varchar(20) not null default 'FEATURE';

-- 3) Normalize action to UPPERCASE (if already present).
update public.permissions
set action = upper(action)
where action is not null;

-- 4) Override action based on code suffix (case-insensitive).
update public.permissions set action='CREATE'  where code ~* '\\.create$';
update public.permissions set action='UPDATE'  where code ~* '\\.update$';
update public.permissions set action='DELETE'  where code ~* '\\.delete$';
update public.permissions set action='READ'    where code ~* '\\.(read|view)$';
update public.permissions set action='EXPORT'  where code ~* '\\.export$';
update public.permissions set action='RESTORE' where code ~* '\\.restore$';

-- 5) Category heuristic (PAGE vs FEATURE).
update public.permissions
set category = 'PAGE'
where upper(permission_type) = 'PAGE'
   or code ~* '\\.page$'
   or (lower(permission_type) in ('admin','system','overview','reports','user-management','leads-risk') and upper(action)='READ');

update public.permissions
set category = 'FEATURE'
where category is null or category not in ('PAGE','FEATURE');

-- 6) Constraints (safe, not valid first).
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'permissions_action_enum_chk'
      and conrelid = 'public.permissions'::regclass
  ) then
    alter table public.permissions
      add constraint permissions_action_enum_chk
      check (action is null or action in ('READ','CREATE','UPDATE','DELETE','EXPORT','RESTORE')) not valid;
  end if;
end $$;

alter table public.permissions
  validate constraint permissions_action_enum_chk;

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'permissions_category_enum_chk'
      and conrelid = 'public.permissions'::regclass
  ) then
    alter table public.permissions
      add constraint permissions_category_enum_chk
      check (category in ('PAGE','FEATURE')) not valid;
  end if;
end $$;

alter table public.permissions
  validate constraint permissions_category_enum_chk;

-- 7) Index for UI filter.
create index if not exists idx_permissions_module_cat_action
on public.permissions(module_id, category, action);
