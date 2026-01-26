-- Catalogs item count view + index for fast aggregation.
-- Do not run from app; apply via Supabase SQL editor after confirmation.

create index if not exists idx_catalog_items_catalog_deleted
  on public.catalog_items (catalog_id, deleted_at);

create or replace view public.v_catalogs_with_item_count as
select
  c.*,
  count(ci._id) filter (where ci.deleted_at is null)::int as item_count
from public.catalogs c
left join public.catalog_items ci on ci.catalog_id = c._id
group by c._id;
