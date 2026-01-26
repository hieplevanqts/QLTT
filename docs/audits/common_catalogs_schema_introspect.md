## Common Catalogs Schema Introspect

Method
- Supabase JS `select('*').limit(1)` on `public.catalogs` and `public.catalog_items`.

Result (from user-provided SQL)
- `catalogs` columns:
  - `_id` uuid
  - `key` text
  - `name` text
  - `group` text
  - `description` text
  - `is_hierarchical` boolean
  - `editable_scope` text
  - `status` text
  - `sort_order` integer
  - `meta` jsonb
  - `created_at` timestamptz
  - `created_by` uuid
  - `updated_at` timestamptz
  - `updated_by` uuid
  - `deleted_at` timestamptz
  - `deleted_by` uuid

- `catalog_items` columns:
  - `_id` uuid
  - `catalog_id` uuid
  - `code` text
  - `name` text
  - `description` text
  - `icon` text
  - `badge_color` text
  - `parent_id` uuid
  - `sort_order` integer
  - `is_default` boolean
  - `status` text
  - `meta` jsonb
  - `created_at` timestamptz
  - `created_by` uuid
  - `updated_at` timestamptz
  - `updated_by` uuid
  - `deleted_at` timestamptz
  - `deleted_by` uuid

Assumptions from user confirmation
- Table names: `public.catalogs`, `public.catalog_items`
- `group` values: `COMMON | DMS | SYSTEM`
- `deleted_at` exists on both tables

Needed from DB (when available)
- `catalog`: `_id`, `key`, `name`, `group`, `description`, `is_hierarchical`, `editable_scope`, `status`, `sort_order`, `meta`, `created_at`, `updated_at`, `deleted_at`
- `catalog_item`: `_id`, `catalog_id`, `parent_id`, `code`, `name`, `description`, `status`, `sort_order`, `meta`, `created_at`, `updated_at`, `deleted_at`

Action
- If the tables exist but are not exposed to PostgREST, refresh the Supabase schema cache or confirm the column list from SQL editor.
