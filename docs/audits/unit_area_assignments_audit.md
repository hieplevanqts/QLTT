# Unit Area Assignments - Audit & Proposal

## Discovery (read-only)

### Organization Units (departments)
Columns (sample):
- _id (uuid)
- parent_id (uuid, nullable)
- name (text)
- code (text)
- level (int)
- path (text)
- created_at, updated_at
- deleted_at
- address, latitude, longitude
- short_name, type, is_active, order_index

### Provinces
Columns (sample):
- _id (uuid)
- code (text)
- name (text)
- created_at, updated_at

### Wards
Columns (sample):
- _id (uuid)
- code (text)
- name (text)
- province_id (uuid)
- area, officer
- created_at, updated_at

### Existing assignment table
- department_areas exists with columns: _id, department_id, area_id, created_at, updated_at
- No unit_area_assignments table exists in schema cache.

### Areas (support province/ward)
Columns (sample):
- _id (uuid)
- code (text)
- name (text)
- level (text)
- province_id (uuid)
- ward_id (uuid)
- description, status
- createdat, updatedat

### Coordinates (views)
- provinces_with_coordinates
- wards_with_coordinates

## Scope mapping (confirmed)
- Use `departments._id` for unit id.
- Use `departments.parent_id` to find chi cuc parent for doi.
- Use `departments.level` to distinguish: level=2 (chi cuc), level=3 (doi).
- Scope enforce by `user.departmentInfo.id` at login; admin cấp cục (level=1) allowed all.

## Reuse existing table
Use `department_areas` + `areas` (level + province_id + ward_id) to represent coverage:
- Chi cục: 1 assignment where areas.ward_id is null (province-level).
- Đội: either 1 province-level assignment (ALL_PROVINCE) or many ward-level assignments (WARD_LIST).

Proposal SQL now only suggests optional indexes; no new table creation.

## Query patterns (to support indexes)
- list assignments by department_id
- join areas to filter province-level vs ward-level
- fetch wards by province_id

## Confirmation received
- Use `_id` PK pattern.
- Level mapping: 2 = chi cục, 3 = đội.
- Scope: user.departmentInfo.id at login (level=1 allowed all).
- Reuse `department_areas`.
- Coordinate tables: provinces_with_coordinates, wards_with_coordinates.
