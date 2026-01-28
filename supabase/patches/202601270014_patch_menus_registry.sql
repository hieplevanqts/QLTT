-- Patch: menu registry tables + views for menu builder and sidebar rendering.
-- Do NOT run from the app. Execute manually in Supabase SQL editor.
-- This script is defensive/idempotent and avoids destructive changes.

-- 1) Core menu table (create if missing, then align columns).
create table if not exists public.menus (
  _id uuid primary key default gen_random_uuid(),
  code text not null,
  label text not null,
  parent_id uuid null,
  module_id uuid null,
  route_path text null,
  icon text null,
  sort_order integer not null default 0,
  status text not null default 'ACTIVE',
  is_visible boolean not null default true,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  deleted_at timestamptz null
);

alter table public.menus
  add column if not exists _id uuid,
  add column if not exists code text,
  add column if not exists label text,
  add column if not exists parent_id uuid,
  add column if not exists module_id uuid,
  add column if not exists route_path text,
  add column if not exists icon text,
  add column if not exists sort_order integer,
  add column if not exists status text,
  add column if not exists is_visible boolean,
  add column if not exists meta jsonb default '{}'::jsonb,
  add column if not exists created_at timestamptz default now(),
  add column if not exists updated_at timestamptz default now(),
  add column if not exists deleted_at timestamptz;

alter table public.menus
  alter column _id set default gen_random_uuid();

update public.menus
set sort_order = coalesce(sort_order, 0)
where sort_order is null;

update public.menus
set status = coalesce(status, 'ACTIVE')
where status is null;

update public.menus
set is_visible = coalesce(is_visible, true)
where is_visible is null;

-- Self reference FK (best-effort; skip on error).
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'menus_parent_id_fkey'
      and conrelid = 'public.menus'::regclass
  ) then
    alter table public.menus
      add constraint menus_parent_id_fkey
      foreign key (parent_id) references public.menus(_id)
      on delete set null;
  end if;
exception
  when others then
    raise notice 'Skipping menus_parent_id_fkey due to existing data issues.';
end $$;

-- Optional FK to modules (best-effort; depends on modules patch).
do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'modules'
  ) then
    if not exists (
      select 1
      from pg_constraint
      where conname = 'menus_module_id_fkey'
        and conrelid = 'public.menus'::regclass
    ) then
      alter table public.menus
        add constraint menus_module_id_fkey
        foreign key (module_id) references public.modules(_id)
        on delete set null;
    end if;
  end if;
exception
  when others then
    raise notice 'Skipping menus_module_id_fkey due to missing modules._id or data mismatch.';
end $$;

-- 2) Menu-permission mapping table.
create table if not exists public.menu_permissions (
  _id uuid primary key default gen_random_uuid(),
  menu_id uuid not null,
  permission_id uuid not null,
  rule text not null default 'ANY',
  created_at timestamptz not null default now()
);

alter table public.menu_permissions
  add column if not exists _id uuid,
  add column if not exists menu_id uuid,
  add column if not exists permission_id uuid,
  add column if not exists rule text default 'ANY',
  add column if not exists created_at timestamptz default now();

alter table public.menu_permissions
  alter column _id set default gen_random_uuid();

-- FKs (best-effort; skip on error).
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'menu_permissions_menu_id_fkey'
      and conrelid = 'public.menu_permissions'::regclass
  ) then
    alter table public.menu_permissions
      add constraint menu_permissions_menu_id_fkey
      foreign key (menu_id) references public.menus(_id)
      on delete cascade;
  end if;
exception
  when others then
    raise notice 'Skipping menu_permissions_menu_id_fkey due to existing data issues.';
end $$;

do $$
begin
  if exists (
    select 1
    from information_schema.tables
    where table_schema = 'public' and table_name = 'permissions'
  ) then
    if not exists (
      select 1
      from pg_constraint
      where conname = 'menu_permissions_permission_id_fkey'
        and conrelid = 'public.menu_permissions'::regclass
    ) then
      alter table public.menu_permissions
        add constraint menu_permissions_permission_id_fkey
        foreign key (permission_id) references public.permissions(_id)
        on delete cascade;
    end if;
  end if;
exception
  when others then
    raise notice 'Skipping menu_permissions_permission_id_fkey due to existing data issues.';
end $$;

-- Uniqueness + indexes.
create unique index if not exists ux_menu_permissions_menu_permission
  on public.menu_permissions(menu_id, permission_id);

create index if not exists idx_menu_permissions_menu
  on public.menu_permissions(menu_id);

create index if not exists idx_menu_permissions_permission
  on public.menu_permissions(permission_id);

-- Menu list performance indexes.
create unique index if not exists ux_menus_code
  on public.menus(code);

create index if not exists idx_menus_parent_sort
  on public.menus(parent_id, sort_order);

create index if not exists idx_menus_module
  on public.menus(module_id);

create index if not exists idx_menus_status
  on public.menus(status);

-- 3) Full menu view (modules + aggregated permissions) to avoid N+1 in admin UIs.
create or replace view public.v_menus_full as
with permission_agg as (
  select
    mp.menu_id,
    array_remove(array_agg(distinct mp.permission_id), null) as permission_ids,
    array_remove(array_agg(distinct p.code), null) as permission_codes
  from public.menu_permissions mp
  left join public.permissions p on p._id = mp.permission_id
  group by mp.menu_id
)
select
  m._id,
  m.code,
  m.label,
  m.parent_id,
  m.module_id,
  m.route_path,
  m.icon,
  m.sort_order,
  m.status,
  m.is_visible,
  m.meta,
  m.created_at,
  m.updated_at,
  m.deleted_at,
  mod.code as module_code,
  mod.name as module_name,
  mod."group" as module_group,
  coalesce(pa.permission_ids, '{}'::uuid[]) as permission_ids,
  coalesce(pa.permission_codes, '{}'::text[]) as permission_codes
from public.menus m
left join public.modules mod on mod._id = m.module_id
left join permission_agg pa on pa.menu_id = m._id
where m.deleted_at is null;

-- 4) Current-user menu view (permission-aware, rule ANY).
-- Notes:
-- - Menus with no permissions are considered public.
-- - Status accepts both text ACTIVE and numeric 1 (cast to text).
create or replace view public.v_my_menu as
with user_perm_ids as (
  select coalesce(array_agg(distinct rp.permission_id), '{}'::uuid[]) as permission_ids
  from public.user_roles ur
  join public.role_permissions rp on rp.role_id = ur.role_id
  where ur.user_id = auth.uid()
),
menu_perm_stats as (
  select
    m._id as menu_id,
    count(mp.permission_id) as permission_count,
    count(mp.permission_id) filter (
      where mp.permission_id = any((select permission_ids from user_perm_ids))
    ) as matched_count
  from public.menus m
  left join public.menu_permissions mp on mp.menu_id = m._id
  group by m._id
)
select
  mf.*
from public.v_menus_full mf
join menu_perm_stats stats on stats.menu_id = mf._id
where
  (mf.status is null or mf.status::text in ('ACTIVE', 'active', '1'))
  and coalesce(mf.is_visible, true)
  and (
    stats.permission_count = 0
    or stats.matched_count > 0
  );

