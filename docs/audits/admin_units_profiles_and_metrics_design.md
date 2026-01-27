## Admin Units Profiles + Metrics Design

Scope
- Add new catalog metadata for province/ward profiles.
- Add time-series foundation for QLTT metrics by period and by sector.
- Keep existing tables/views intact (no ALTER/DROP).

Existing admin area tables/views
- `provinces`, `wards` (2-level admin units)
- `provinces_with_coordinates`, `wards_with_coordinates` (center/bounds view)

Proposed new tables
1) `admin_unit_profiles`
- PK: `_id` (uuid).
- Polymorphic profile for `provinces`/`wards` via `(level, source_id)`.
- No FK to avoid cross-table constraints; enforce in app layer.
- Unique: `(level, source_id)`.

2) `dim_period`
- PK: `_id` (uuid).
- Period dimension for month/quarter/year.
- Unique: `(granularity, year, quarter, month)`.

3) `dim_sector`
- PK: `_id` (uuid).
- Sector dimension (nganh hang).
- Supports hierarchy via `parent_sector_id`.

4) `fact_admin_unit_sector_metrics`
- PK: `_id` (uuid); FK `period_id` -> `dim_period._id`, `sector_id` -> `dim_sector._id`.
- Metrics by admin unit + period + sector.
- Unique: `(level, source_id, period_id, sector_id)`.

5) `fact_admin_unit_metrics`
- PK: `_id` (uuid); FK `period_id` -> `dim_period._id`.
- Metrics by admin unit + period (no sector).
- Unique: `(level, source_id, period_id)`.

Proposed new views
1) `v_admin_units`
- Union of provinces + wards for lookup/search.
- Columns: `level`, `source_id`, `code`, `name`, `parent_id`, `status`.
- Note: `provinces`/`wards` currently have no `status` column; view will expose `status` as NULL.

2) `v_admin_units_with_coordinates`
- Union of `provinces_with_coordinates` + `wards_with_coordinates`.
- Columns: `level`, `source_id`, `code`, `name`, `parent_id`, `center_lat`, `center_lng`, `bounds`, `area`, `officer`.

3) `v_admin_unit_metrics_current`
- Latest metrics per `(level, source_id)` by max `dim_period.to_date`.

4) `v_admin_unit_sector_metrics_current`
- Latest metrics per `(level, source_id, sector_id)` by max `dim_period.to_date`.

Notes
- All objects are additive (new tables/views/indexes).
- No changes to `provinces_with_coordinates` / `wards_with_coordinates`.
- No changes to existing assignment tables.
