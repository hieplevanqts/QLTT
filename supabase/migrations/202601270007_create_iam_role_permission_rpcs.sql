-- IAM role-permission matrix RPCs.
-- Do not run from app; apply via Supabase SQL editor after confirmation.

create or replace function public.iam_get_role_permission_matrix(p_role_id uuid)
returns table (
  permission_id uuid,
  module text,
  permission_type text,
  resource text,
  action text,
  code text,
  name text,
  description text,
  sort_order integer,
  status integer,
  granted boolean
)
language sql
stable
as $$
  select
    p._id as permission_id,
    p.module as module,
    p.permission_type as permission_type,
    p.resource as resource,
    p.action as action,
    p.code as code,
    p.name as name,
    p.description as description,
    p.sort_order as sort_order,
    p.status as status,
    (rp.permission_id is not null) as granted
  from public.permissions p
  left join public.role_permissions rp
    on rp.permission_id = p._id
   and rp.role_id = p_role_id
  order by
    coalesce(p.module, p.permission_type),
    p.resource,
    p.sort_order,
    p.code;
$$;

create or replace function public.iam_set_role_permissions(
  p_role_id uuid,
  p_permission_ids uuid[]
)
returns integer
language plpgsql
as $$
declare
  inserted_count integer := 0;
begin
  delete from public.role_permissions
  where role_id = p_role_id;

  if p_permission_ids is not null then
    insert into public.role_permissions (role_id, permission_id)
    select p_role_id, unnest(p_permission_ids)
    on conflict (role_id, permission_id) do nothing;

    get diagnostics inserted_count = row_count;
  end if;

  return inserted_count;
end;
$$;
