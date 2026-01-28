-- Fix views for legacy menus schema (name/path/order_index/is_active).
-- Do NOT run from the app. Execute manually in Supabase SQL editor.

drop view if exists public.v_my_menu;
drop view if exists public.v_menus_full;

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
  m.name,
  m.path,
  m.parent_id,
  m.module_id,
  m.icon,
  m.order_index,
  m.is_active,
  m.created_at,
  m.updated_at,
  mod.code as module_code,
  mod.name as module_name,
  mod."group" as module_group,
  coalesce(pa.permission_ids, '{}'::uuid[]) as permission_ids,
  coalesce(pa.permission_codes, '{}'::text[]) as permission_codes
from public.menus m
left join public.modules mod on mod._id = m.module_id
left join permission_agg pa on pa.menu_id = m._id;

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
      where mp.permission_id = any(up.permission_ids)
    ) as matched_count
  from public.menus m
  left join public.menu_permissions mp on mp.menu_id = m._id
  cross join user_perm_ids up
  group by m._id
)
select
  mf.*
from public.v_menus_full mf
join menu_perm_stats stats on stats.menu_id = mf._id
where
  coalesce(mf.is_active, true)
  and (
    stats.permission_count = 0
    or stats.matched_count > 0
  );

