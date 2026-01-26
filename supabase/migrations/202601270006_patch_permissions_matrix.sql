-- Permissions matrix support (module/resource/action) + indexes.
-- Do not run from app; apply via Supabase SQL editor after confirmation.

alter table public.permissions
  add column if not exists module text;

alter table public.permissions
  add column if not exists resource text;

alter table public.permissions
  add column if not exists action text;

create index if not exists idx_permissions_module_resource
  on public.permissions (module, resource);

create index if not exists idx_permissions_resource_action
  on public.permissions (resource, action);
