-- Permissions usage stats view (role count).
-- Do not run from app; apply via Supabase SQL editor after confirmation.

create or replace view public.v_permissions_stats as
select
  p.*,
  coalesce(rp.role_count, 0)::int as role_count
from public.permissions p
left join (
  select permission_id, count(distinct role_id) as role_count
  from public.role_permissions
  group by permission_id
) rp on rp.permission_id = p._id;
