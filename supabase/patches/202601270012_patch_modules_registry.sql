-- Patch: normalize public.modules for module-aware routing + admin UI.
-- Do NOT run from the app. Execute manually in Supabase SQL editor.
-- This script is defensive/idempotent and avoids destructive changes.

-- 1) Add standard columns (non-breaking).
alter table public.modules
  add column if not exists _id uuid,
  add column if not exists key text,
  add column if not exists "group" text,
  add column if not exists sort_order integer,
  add column if not exists meta jsonb default '{}'::jsonb,
  add column if not exists deleted_at timestamptz;

-- 2) Backfill _id from legacy id when present.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'modules'
      and column_name = 'id'
  ) then
    execute $sql$
      update public.modules
      set _id = coalesce(_id, id)
      where _id is null
    $sql$;
  else
    update public.modules
    set _id = coalesce(_id, gen_random_uuid())
    where _id is null;
  end if;
end $$;

-- Ensure _id has a default for new rows.
alter table public.modules
  alter column _id set default gen_random_uuid();

-- 3) Backfill key from code when present.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'modules'
      and column_name = 'code'
  ) then
    execute $sql$
      update public.modules
      set key = coalesce(key, code)
      where key is null
    $sql$;
  end if;
end $$;

-- 4) Backfill sort_order from order_index when present.
do $$
begin
  if exists (
    select 1
    from information_schema.columns
    where table_schema = 'public'
      and table_name = 'modules'
      and column_name = 'order_index'
  ) then
    execute $sql$
      update public.modules
      set sort_order = coalesce(sort_order, order_index)
      where sort_order is null
    $sql$;
  end if;
end $$;

update public.modules
set sort_order = coalesce(sort_order, 0)
where sort_order is null;

-- 5) Normalize group values conservatively.
-- Default to SYSTEM if group is missing.
update public.modules
set "group" = coalesce("group", 'SYSTEM')
where "group" is null;

-- Optional: add a lightweight check constraint if not present.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'modules_group_check'
      and conrelid = 'public.modules'::regclass
  ) then
    alter table public.modules
      add constraint modules_group_check
      check ("group" in ('IAM','DMS','OPS','SYSTEM'));
  end if;
exception
  when others then
    -- If existing data violates the check, keep going (manual cleanup later).
    raise notice 'Skipping modules_group_check due to existing data.';
end $$;

-- 6) Indexes for list performance.
create index if not exists idx_modules_key on public.modules (key);
create index if not exists idx_modules_group_status on public.modules ("group", status);
create index if not exists idx_modules_sort_order on public.modules (sort_order);

-- Add a unique index on key only when safe (no duplicates).
do $$
begin
  if not exists (
    select 1
    from pg_indexes
    where schemaname = 'public'
      and tablename = 'modules'
      and indexname = 'ux_modules_key'
  ) then
    if not exists (
      select 1
      from (
        select key, count(*) as c
        from public.modules
        where key is not null
        group by key
        having count(*) > 1
      ) dup
    ) then
      create unique index ux_modules_key on public.modules (key);
    else
      raise notice 'Skipping ux_modules_key due to duplicate keys.';
    end if;
  end if;
end $$;

-- 7) Stats view to avoid N+1 in module list screens.
-- This view counts permissions once per module. Menu counts can be added later.
create or replace view public.v_modules_stats as
select
  m.*,
  coalesce(p.permission_count, 0)::int as permission_count,
  0::int as menu_count
from public.modules m
left join (
  select module_id, count(*) as permission_count
  from public.permissions
  group by module_id
) p on p.module_id = m._id
where m.deleted_at is null
order by m.sort_order nulls last, m.name;

