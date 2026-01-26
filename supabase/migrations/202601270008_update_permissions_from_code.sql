-- SAMPLE: Map module_id + derive module/resource/action from permissions.code.
-- Do not run from app; apply via Supabase SQL editor after confirmation.
-- NOTE: Review mapping rules before applying on production data.

with parsed as (
  select
    p._id,
    p.code,
    lower(p.code) as code_l,
    -- Normalize separators to dot for parsing.
    regexp_replace(lower(p.code), '[:_]+', '.', 'g') as code_norm,
    -- Strip action suffix (read/view/create/update/delete/export...) if present.
    regexp_replace(
      regexp_replace(lower(p.code), '[:_]+', '.', 'g'),
      '(\\.|:|_)?(read|view|list|get|create|add|new|update|edit|write|delete|remove|destroy|export|download)$',
      ''
    ) as code_no_action,
    (regexp_match(
      lower(p.code),
      '(read|view|list|get|create|add|new|update|edit|write|delete|remove|destroy|export|download)$'
    ))[1] as action_raw
  from public.permissions p
),
normalized as (
  select
    _id,
    code,
    code_norm,
    code_no_action,
    case
      when action_raw in ('read','view','list','get') then 'READ'
      when action_raw in ('create','add','new') then 'CREATE'
      when action_raw in ('update','edit','write') then 'UPDATE'
      when action_raw in ('delete','remove','destroy') then 'DELETE'
      when action_raw in ('export','download') then 'EXPORT'
      else null
    end as action_key,
    case
      when code_no_action like 'sa.%' then split_part(code_no_action, '.', 2)
      when position('.' in code_no_action) > 0 then split_part(code_no_action, '.', 1)
      else code_no_action
    end as module_key,
    case
      when code_no_action like 'sa.%' then regexp_replace(code_no_action, '^sa\\.[^.]+\\.', '')
      when position('.' in code_no_action) > 0 then regexp_replace(code_no_action, '^[^.]+\\.', '')
      else code_no_action
    end as resource_key
  from parsed
)
update public.permissions p
set
  action = coalesce(p.action, n.action_key),
  resource = coalesce(p.resource, nullif(n.resource_key, '')),
  module = coalesce(p.module, nullif(n.module_key, '')),
  module_id = coalesce(p.module_id, m._id)
from normalized n
left join public.modules m
  on m.code = coalesce(p.permission_type, n.module_key)
where p._id = n._id
  and (
    p.action is null
    or p.resource is null
    or p.module is null
    or p.module_id is null
  );
