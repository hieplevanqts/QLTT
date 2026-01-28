-- Patch IAM users with department scope and list view/RPCs.
-- Do not run from app; apply via Supabase SQL editor after confirmation.

-- 1) Users: add department_id + lastLoginAt if missing, and backfill.
alter table public.users
  add column if not exists department_id uuid;

alter table public.users
  add column if not exists "lastLoginAt" timestamptz;

update public.users
set department_id = "departmentId"
where department_id is null
  and "departmentId" is not null;

-- Keep legacy camelCase column in sync for compatibility.
update public.users
set "departmentId" = department_id
where department_id is not null
  and ("departmentId" is null or "departmentId" <> department_id);

-- 2) Indexes for performance.
create index if not exists idx_users_department_id
  on public.users (department_id);

create index if not exists idx_departments_parent_id
  on public.departments (parent_id);

create index if not exists idx_departments_level
  on public.departments (level);

-- 3) Department scope RPC (single query, no N+1).
create or replace function public.rpc_my_department_scope(
  p_scope_department_id uuid,
  p_scope_level integer
)
returns table (
  _id uuid,
  parent_id uuid,
  name text,
  code text,
  level integer,
  order_index integer,
  is_active boolean
)
language sql
stable
as $$
  with recursive scope_root as (
    select d._id, d.parent_id, d.name, d.code, d.level, d.order_index, d.is_active
    from public.departments d
    where d._id = p_scope_department_id
  ),
  scope_tree as (
    select * from scope_root
    union all
    select child._id, child.parent_id, child.name, child.code, child.level, child.order_index, child.is_active
    from public.departments child
    join scope_tree parent on child.parent_id = parent._id
  ),
  scope_all as (
    select d._id, d.parent_id, d.name, d.code, d.level, d.order_index, d.is_active
    from public.departments d
    where coalesce(d.is_active, true)
  ),
  final_scope as (
    select * from scope_all where p_scope_level = 1
    union all
    select * from scope_tree where p_scope_level = 2
    union all
    select * from scope_root where p_scope_level = 3
  )
  select distinct fs._id, fs.parent_id, fs.name, fs.code, fs.level, fs.order_index, fs.is_active
  from final_scope fs
  where coalesce(fs.is_active, true)
  order by fs.level, fs.order_index nulls last, fs.name;
$$;

-- 4) Users list RPC with scope + department subtree filter, no N+1.
create or replace function public.rpc_iam_users_search(
  p_q text default null,
  p_status integer default null,
  p_role_id uuid default null,
  p_department_id uuid default null,
  p_scope_department_id uuid default null,
  p_scope_level integer default null,
  p_sort_by text default 'created_at',
  p_sort_dir text default 'desc',
  p_page integer default 1,
  p_page_size integer default 10
)
returns table (
  _id uuid,
  username text,
  full_name text,
  email text,
  phone text,
  status integer,
  last_login_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz,
  note text,
  department_id uuid,
  department_name text,
  department_level integer,
  roles jsonb,
  primary_role_code text,
  primary_role_name text,
  total_count bigint
)
language sql
stable
as $$
  with recursive scope_root as (
    select d._id, d.parent_id, d.level
    from public.departments d
    where p_scope_department_id is not null
      and d._id = p_scope_department_id
  ),
  scope_tree as (
    select * from scope_root
    union all
    select child._id, child.parent_id, child.level
    from public.departments child
    join scope_tree parent on child.parent_id = parent._id
  ),
  scope_all as (
    select d._id, d.parent_id, d.level
    from public.departments d
    where coalesce(d.is_active, true)
  ),
  scope_final as (
    select _id from scope_all where p_scope_level = 1
    union
    select _id from scope_tree where p_scope_level = 2
    union
    select _id from scope_root where p_scope_level = 3
  ),
  dept_filter_root as (
    select d._id, d.parent_id
    from public.departments d
    where p_department_id is not null
      and d._id = p_department_id
  ),
  dept_filter_tree as (
    select * from dept_filter_root
    union all
    select child._id, child.parent_id
    from public.departments child
    join dept_filter_tree parent on child.parent_id = parent._id
  ),
  dept_filter_final as (
    select _id from dept_filter_tree
  ),
  allowed_departments as (
    select sf._id
    from scope_final sf
    where p_department_id is null
    union
    select sf._id
    from scope_final sf
    join dept_filter_final df on df._id = sf._id
    where p_department_id is not null
  ),
  filtered as (
    select u.*
    from public.users u
    where u.deleted_at is null
      and (p_status is null or u.status = p_status)
      and (
        p_q is null or p_q = '' or
        u.username ilike '%' || p_q || '%' or
        u.full_name ilike '%' || p_q || '%' or
        u.email ilike '%' || p_q || '%'
      )
      and (
        p_role_id is null or exists (
          select 1
          from public.user_roles ur
          where ur.user_id = u._id
            and ur.role_id = p_role_id
        )
      )
      and (
        p_scope_department_id is null
        or exists (
          select 1
          from allowed_departments ad
          where ad._id = coalesce(u.department_id, u."departmentId")
        )
      )
  )
  select
    u._id,
    u.username,
    u.full_name,
    u.email,
    u.phone,
    u.status,
    u."lastLoginAt" as last_login_at,
    u.created_at,
    u.updated_at,
    u.note,
    coalesce(u.department_id, u."departmentId") as department_id,
    d.name as department_name,
    d.level as department_level,
    coalesce(r.roles, '[]'::jsonb) as roles,
    r.primary_role_code,
    r.primary_role_name,
    count(*) over() as total_count
  from filtered u
  left join public.departments d
    on d._id = coalesce(u.department_id, u."departmentId")
  left join lateral (
    select
      jsonb_agg(
        jsonb_build_object(
          'role_id', r._id,
          'code', r.code,
          'name', r.name,
          'is_primary', ur.is_primary
        )
        order by ur.is_primary desc, r.code
      ) as roles,
      max(r.code) filter (where ur.is_primary) as primary_role_code,
      max(r.name) filter (where ur.is_primary) as primary_role_name
    from public.user_roles ur
    join public.roles r on r._id = ur.role_id
    where ur.user_id = u._id
  ) r on true
  order by
    case when p_sort_by = 'username' and p_sort_dir = 'asc' then u.username end asc,
    case when p_sort_by = 'username' and p_sort_dir = 'desc' then u.username end desc,
    case when p_sort_by = 'full_name' and p_sort_dir = 'asc' then u.full_name end asc,
    case when p_sort_by = 'full_name' and p_sort_dir = 'desc' then u.full_name end desc,
    case when p_sort_by = 'email' and p_sort_dir = 'asc' then u.email end asc,
    case when p_sort_by = 'email' and p_sort_dir = 'desc' then u.email end desc,
    case when p_sort_by = 'created_at' and p_sort_dir = 'asc' then u.created_at end asc,
    case when p_sort_by = 'created_at' and p_sort_dir = 'desc' then u.created_at end desc,
    case when p_sort_by = 'last_login_at' and p_sort_dir = 'asc' then u."lastLoginAt" end asc,
    case when p_sort_by = 'last_login_at' and p_sort_dir = 'desc' then u."lastLoginAt" end desc,
    u.created_at desc
  limit coalesce(p_page_size, 10)
  offset greatest(coalesce(p_page, 1) - 1, 0) * coalesce(p_page_size, 10);
$$;

-- 5) Convenience view for simple selects (still uses aggregates, no N+1).
create or replace view public.v_iam_users_list as
select
  u._id,
  u.username,
  u.full_name,
  u.email,
  u.phone,
  u.status,
  u."lastLoginAt" as last_login_at,
  u.created_at,
  u.updated_at,
  u.note,
  coalesce(u.department_id, u."departmentId") as department_id,
  d.name as department_name,
  d.level as department_level,
  coalesce(r.roles, '[]'::jsonb) as roles,
  r.primary_role_code,
  r.primary_role_name
from public.users u
left join public.departments d
  on d._id = coalesce(u.department_id, u."departmentId")
left join lateral (
  select
    jsonb_agg(
      jsonb_build_object(
        'role_id', r._id,
        'code', r.code,
        'name', r.name,
        'is_primary', ur.is_primary
      )
      order by ur.is_primary desc, r.code
    ) as roles,
    max(r.code) filter (where ur.is_primary) as primary_role_code,
    max(r.name) filter (where ur.is_primary) as primary_role_name
  from public.user_roles ur
  join public.roles r on r._id = ur.role_id
  where ur.user_id = u._id
) r on true
where u.deleted_at is null;