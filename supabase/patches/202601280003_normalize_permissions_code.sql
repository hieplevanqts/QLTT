-- Normalize permissions.code to lowercase + standard action suffix.
-- Do NOT run from the app. Execute manually in Supabase SQL editor.
-- NOTE: This is best-effort cleanup; review results before running in prod.

-- 0) Backup permissions.
create table if not exists public.permissions_bak_20260128_code as
table public.permissions;

-- 1) Build normalized code safely (avoid unique collisions).
with normalized as (
  select
    _id,
    code,
    regexp_replace(
      regexp_replace(
        regexp_replace(lower(code), '[:_\\s]+', '.', 'g'),
        '\\.+', '.', 'g'
      ),
      '\\.$', ''
    ) as norm_code
  from public.permissions
  where code is not null
),
ranked as (
  select
    _id,
    norm_code,
    row_number() over (partition by norm_code order by _id) as rn
  from normalized
),
updates as (
  select
    n._id,
    case
      when r.rn = 1 then n.norm_code
      else n.norm_code || '.dup.' || substr(n._id::text, 1, 8)
    end as new_code
  from normalized n
  join ranked r on r._id = n._id
)
update public.permissions p
set code = u.new_code
from updates u
where p._id = u._id;

-- 2) Normalize action suffixes (map synonyms to canonical).
update public.permissions set code = regexp_replace(code, '\\.(view|list|get)$', '.read')
where code ~* '\\.(view|list|get)$';

update public.permissions set code = regexp_replace(code, '\\.(new|add|create)$', '.create')
where code ~* '\\.(new|add|create)$';

update public.permissions set code = regexp_replace(code, '\\.(edit|write|update)$', '.update')
where code ~* '\\.(edit|write|update)$';

update public.permissions set code = regexp_replace(code, '\\.(remove|destroy|delete)$', '.delete')
where code ~* '\\.(remove|destroy|delete)$';

update public.permissions set code = regexp_replace(code, '\\.(export|download)$', '.export')
where code ~* '\\.(export|download)$';

update public.permissions set code = regexp_replace(code, '\\.restore$', '.restore')
where code ~* '\\.restore$';

-- 3) Sync action field to canonical uppercase (if action column exists).
update public.permissions set action = 'READ' where code ~* '\\.read$';
update public.permissions set action = 'CREATE' where code ~* '\\.create$';
update public.permissions set action = 'UPDATE' where code ~* '\\.update$';
update public.permissions set action = 'DELETE' where code ~* '\\.delete$';
update public.permissions set action = 'EXPORT' where code ~* '\\.export$';
update public.permissions set action = 'RESTORE' where code ~* '\\.restore$';
