-- View: role permissions matrix (resource x action) to avoid N+1 in UI.
-- Execute manually in Supabase SQL editor if needed.

create or replace view public.v_role_permissions_matrix as
select
  r._id as role_id,
  coalesce(p.module, m.key, m.code) as module_key,
  upper(p.category) as category,
  split_part(coalesce(nullif(p.resource, ''), p.code), '.', 1) as resource_group,
  coalesce(nullif(p.resource, ''), p.code) as resource_key,
  upper(coalesce(p.action, pa.code)) as action,
  coalesce(pa.name, upper(coalesce(p.action, pa.code))) as action_label,
  case upper(coalesce(p.action, pa.code))
    when 'READ' then 1
    when 'CREATE' then 2
    when 'UPDATE' then 3
    when 'DELETE' then 4
    when 'EXPORT' then 5
    when 'RESTORE' then 6
    when 'ASSIGN' then 7
    when 'APPROVE' then 8
    else 99
  end as action_order,
  p._id as permission_id,
  p.code as permission_code,
  p.name as permission_name,
  (rp.permission_id is not null) as is_granted
from public.roles r
cross join public.permissions p
left join public.modules m
  on m._id = p.module_id
left join public.permission_actions pa
  on pa.code = upper(p.action)
left join public.role_permissions rp
  on rp.role_id = r._id
 and rp.permission_id = p._id;
