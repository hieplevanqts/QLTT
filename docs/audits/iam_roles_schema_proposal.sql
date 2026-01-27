-- IAM Roles schema alignment + user count view (proposal).
-- Do not run from app; apply via Supabase SQL editor after confirmation.

-- 1) Add missing columns (idempotent).
alter table public.roles
  add column if not exists sort_order integer default 0;

alter table public.roles
  add column if not exists created_by uuid;

alter table public.roles
  add column if not exists updated_by uuid;

alter table public.roles
  add column if not exists deleted_at timestamptz;

alter table public.roles
  add column if not exists deleted_by uuid;

-- 2) Defaults + backfill for existing rows.
alter table public.roles
  alter column is_system set default false;

update public.roles
set is_system = false
where is_system is null;

alter table public.roles
  alter column created_at set default now();

alter table public.roles
  alter column updated_at set default now();

update public.roles
set created_at = now()
where created_at is null;

update public.roles
set updated_at = now()
where updated_at is null;

-- 3) Constraints / indexes (idempotent).
do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'roles_status_check'
      and conrelid = 'public.roles'::regclass
  ) then
    alter table public.roles
      add constraint roles_status_check
      check (status in (0, 1));
  end if;
end $$;

create index if not exists idx_roles_status
  on public.roles (status);

create index if not exists idx_roles_sort_order
  on public.roles (sort_order);

create index if not exists idx_user_roles_role_id
  on public.user_roles (role_id);

create index if not exists idx_user_roles_user_id
  on public.user_roles (user_id);

-- 4) View to avoid N+1 for user count.
create or replace view public.v_roles_with_user_count as
select
  r.*,
  coalesce(u.cnt, 0)::int as user_count
from public.roles r
left join (
  select role_id, count(*) cnt
  from public.user_roles
  group by role_id
) u on u.role_id = r._id;
