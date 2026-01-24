# Org Units DB Readiness (departments)

Status: READY (after applying approved migration)

Source: Read-only Supabase `select('*').limit(1)` on tables below (anon key).
Decisions (user-confirmed):
- departments is the Org Units table; PK = _id (uuid).
- Add columns: short_name, type, is_active (soft delete via is_active).
- departmentleader table is not used; only department_users is required.
- RLS not required for now.

## Columns observed

- departments
  - _id
  - parent_id
  - name
  - code
  - level
  - order_index
  - path
  - created_at
  - updated_at
  - deleted_at
  - address
  - latitude
  - longitude
- department_areas
  - _id
  - department_id
  - area_id
  - created_at
  - updated_at
- department_users
  - _id
  - department_id
  - user_id
  - created_at
  - updated_at
- departmentleader
  - id
  - leaderid
  - departmentid
  - fullname
  - position
  - appointmentdate
  - appointmentdecisionnumber
  - workstatus
  - displayorder
  - note

## Key findings

- PK for departments appears to be `_id` (likely uuid; used in existing queries).
- Parent-child supported via `parent_id`.
- `code`, `name`, `level` exist.
- `short_name`, `type`, `is_active` will be added per approval.
- Soft delete will use `is_active` (keep `deleted_at` as-is).
- departmentleader is ignored.
- RLS is not required for now (no policy changes).

## Proposed field mapping (UI -> DB)

- id -> departments._id
- parent_id -> departments.parent_id
- code -> departments.code
- name -> departments.name
- short_name -> departments.short_name (approved to add)
- level -> departments.level
- order_index -> departments.order_index
- type -> departments.type (approved to add)
- status -> departments.is_active (approved to add)
- address -> departments.address
- latitude -> departments.latitude
- longitude -> departments.longitude

## Remaining questions

1) Allowed values for `type` (free text vs. enum list).
2) Confirm whether `code` must be unique (UI validation vs. DB constraint).
