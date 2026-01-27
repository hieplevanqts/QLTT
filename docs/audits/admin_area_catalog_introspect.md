## Admin Area Catalog Introspect

Run context
- Method: Supabase JS select `*` with limit 1 (read-only).
- Source: `.env` VITE_SUPABASE_URL/VITE_SUPABASE_ANON_KEY.

Results
1) `provinces`
- Columns: `_id`, `code`, `name`, `created_at`, `updated_at`

2) `wards`
- Columns: `_id`, `code`, `name`, `province_id`, `area`, `officer`, `created_at`, `updated_at`

3) `provinces_with_coordinates` (view)
- Columns: `_id`, `code`, `name`, `center_lat`, `center_lng`, `bounds`, `area`, `officer`, `created_at`, `updated_at`

4) `wards_with_coordinates` (view)
- Columns: `_id`, `code`, `name`, `province_id`, `province_name`, `center_lat`, `center_lng`, `bounds`, `area`, `officer`, `created_at`, `updated_at`

5) `province_coordinates`
- Exists. No rows returned in sample query, so columns could not be enumerated.

6) `ward_coordinates`
- Columns: `ward_id`, `center_lat`, `center_lng`, `bounds`, `area`, `officer`, `created_at`, `updated_at`
