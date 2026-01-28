-- Cleanup roles to whitelist + normalize role codes/names (lowercase).
-- Do NOT run from the app. Execute manually in Supabase SQL editor.
-- WARNING: This script performs hard deletes on roles outside the whitelist.

-- 0) Backup critical tables.
create table if not exists public.roles_bak_20260128 as
table public.roles;

create table if not exists public.user_roles_bak_20260128 as
table public.user_roles;

create table if not exists public.role_permissions_bak_20260128 as
table public.role_permissions;

-- 1) Ensure viewer role exists (default fallback).
insert into public.roles (code, name, status, created_at, updated_at)
select 'viewer', 'viewer', 1, now(), now()
where not exists (
  select 1 from public.roles where lower(code) = 'viewer'
);

-- 2) Deduplicate role codes in whitelist (case-insensitive).
--    Prefer an already-lowercase code if present.
with ranked as (
  select
    _id,
    lower(code) as code_l,
    row_number() over (
      partition by lower(code)
      order by (code = lower(code)) desc, created_at asc nulls last, _id asc
    ) as rn
  from public.roles
  where lower(code) in ('admin','header','leader','manager','viewer','merchant','user')
),
keep as (
  select code_l, _id as keep_id
  from ranked
  where rn = 1
),
dupes as (
  select r._id as role_id, k.keep_id
  from ranked r
  join keep k on k.code_l = r.code_l
  where r._id <> k.keep_id
)
update public.user_roles ur
set role_id = d.keep_id
from dupes d
where ur.role_id = d.role_id;

-- Remove duplicate user_roles after merge.
delete from public.user_roles ur
using (
  select _id
  from (
    select _id,
      row_number() over (partition by user_id, role_id order by _id) as rn
    from public.user_roles
  ) t
  where t.rn > 1
) dup
where ur._id = dup._id;

-- Merge role_permissions into keep role.
with ranked as (
  select
    _id,
    lower(code) as code_l,
    row_number() over (
      partition by lower(code)
      order by (code = lower(code)) desc, created_at asc nulls last, _id asc
    ) as rn
  from public.roles
  where lower(code) in ('admin','header','leader','manager','viewer','merchant','user')
),
keep as (
  select code_l, _id as keep_id
  from ranked
  where rn = 1
),
dupes as (
  select r._id as role_id, k.keep_id
  from ranked r
  join keep k on k.code_l = r.code_l
  where r._id <> k.keep_id
)
update public.role_permissions rp
set role_id = d.keep_id
from dupes d
where rp.role_id = d.role_id;

-- Remove duplicate role_permissions after merge.
delete from public.role_permissions rp
using (
  select _id
  from (
    select _id,
      row_number() over (partition by role_id, permission_id order by _id) as rn
    from public.role_permissions
  ) t
  where t.rn > 1
) dup
where rp._id = dup._id;

-- Delete duplicate role rows (after mapping).
with ranked as (
  select
    _id,
    lower(code) as code_l,
    row_number() over (
      partition by lower(code)
      order by (code = lower(code)) desc, created_at asc nulls last, _id asc
    ) as rn
  from public.roles
  where lower(code) in ('admin','header','leader','manager','viewer','merchant','user')
)
delete from public.roles r
using ranked x
where r._id = x._id
  and x.rn > 1;

-- 3) Move all user_roles from non-whitelist roles to viewer (safe for unique constraint).
with viewer as (
  select _id as viewer_id
  from public.roles
  where lower(code) = 'viewer'
  limit 1
),
to_delete as (
  select _id
  from public.roles
  where lower(code) not in ('admin','header','leader','manager','viewer','merchant','user')
),
candidates as (
  select
    ur._id,
    ur.user_id,
    row_number() over (partition by ur.user_id order by ur._id) as rn
  from public.user_roles ur
  where ur.role_id in (select _id from to_delete)
),
moved as (
  update public.user_roles ur
  set role_id = (select viewer_id from viewer)
  from candidates c
  where ur._id = c._id
    and c.rn = 1
    and not exists (
      select 1
      from public.user_roles ur2
      where ur2.user_id = c.user_id
        and ur2.role_id = (select viewer_id from viewer)
    )
  returning ur._id
)
select count(*) from moved;

-- Remove duplicate user_roles after reassignment.
delete from public.user_roles ur
using (
  select _id
  from (
    select _id,
      row_number() over (partition by user_id, role_id order by _id) as rn
    from public.user_roles
  ) t
  where t.rn > 1
) dup
where ur._id = dup._id;

-- 4) Delete role_permissions for roles that will be removed.
with to_delete as (
  select _id
  from public.roles
  where lower(code) not in ('admin','header','leader','manager','viewer','merchant','user')
)
delete from public.role_permissions rp
where rp.role_id in (select _id from to_delete);

-- 5) Hard delete roles outside whitelist (do NOT delete user).
delete from public.roles r
where lower(r.code) not in ('admin','header','leader','manager','viewer','merchant','user');

-- 6) Normalize whitelist role codes + names to lowercase.
update public.roles
set code = lower(code),
    name = lower(code)
where lower(code) in ('admin','header','leader','manager','viewer','merchant','user');
