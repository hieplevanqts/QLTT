-- Permissions schema alignment (idempotent).
-- Do not run from app; apply via Supabase SQL editor after confirmation.

-- 1) Add missing columns.
alter table public.permissions
  add column if not exists sort_order integer default 0;

alter table public.permissions
  add column if not exists meta jsonb not null default '{}'::jsonb;

-- 2) Defaults + backfill.
alter table public.permissions
  alter column status set default 1;

update public.permissions
set status = 1
where status is null;

alter table public.permissions
  alter column created_at set default now();

alter table public.permissions
  alter column updated_at set default now();

update public.permissions
set created_at = now()
where created_at is null;

update public.permissions
set updated_at = now()
where updated_at is null;

-- 3) Constraints / indexes.
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'permissions_status_check'
      and conrelid = 'public.permissions'::regclass
  ) then
    alter table public.permissions
      add constraint permissions_status_check
      check (status in (0, 1));
  end if;
end $$;

create index if not exists idx_permissions_status
  on public.permissions (status);

create index if not exists idx_permissions_sort_order
  on public.permissions (sort_order);

create index if not exists idx_permissions_permission_type
  on public.permissions (permission_type);

create index if not exists idx_permissions_module_id
  on public.permissions (module_id);

create index if not exists idx_role_permissions_permission_id
  on public.role_permissions (permission_id);

create index if not exists idx_role_permissions_role_id
  on public.role_permissions (role_id);
