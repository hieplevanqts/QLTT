-- Admin units profiles + metrics (new tables/views only).
-- Do not run from app; apply via Supabase SQL editor after confirmation.

create table if not exists public.admin_unit_profiles (
  _id uuid primary key default gen_random_uuid(),
  level text not null check (level in ('province', 'ward')),
  source_id uuid not null,
  headline text null,
  summary text null,
  homepage_url text null,
  banner_url text null,
  thumbnail_url text null,
  news_config jsonb null,
  seo_title text null,
  seo_description text null,
  tags text[] null,
  status text not null default 'active' check (status in ('active', 'inactive')),
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  created_by uuid null,
  updated_by uuid null,
  unique (level, source_id)
);

create index if not exists idx_admin_unit_profiles_level_source
  on public.admin_unit_profiles (level, source_id);

create table if not exists public.dim_period (
  _id uuid primary key default gen_random_uuid(),
  granularity text not null check (granularity in ('month', 'quarter', 'year')),
  year int not null,
  quarter int null,
  month int null,
  from_date date not null,
  to_date date not null,
  label text not null,
  unique (granularity, year, quarter, month)
);

create table if not exists public.dim_sector (
  _id uuid primary key default gen_random_uuid(),
  code text not null unique,
  name text not null,
  parent_sector_id uuid null,
  status text default 'active',
  sort_order int default 0
);

create index if not exists idx_dim_sector_parent
  on public.dim_sector (parent_sector_id);

create table if not exists public.fact_admin_unit_sector_metrics (
  _id uuid primary key default gen_random_uuid(),
  level text not null check (level in ('province', 'ward')),
  source_id uuid not null,
  period_id uuid not null references public.dim_period (_id),
  sector_id uuid not null references public.dim_sector (_id),
  merchant_count int null,
  reported_revenue numeric null,
  estimated_revenue numeric null,
  inspection_count int null,
  violation_count int null,
  fine_amount numeric null,
  risk_score numeric null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (level, source_id, period_id, sector_id)
);

create index if not exists idx_fact_admin_unit_sector_level_source_period
  on public.fact_admin_unit_sector_metrics (level, source_id, period_id);

create index if not exists idx_fact_admin_unit_sector_sector_period
  on public.fact_admin_unit_sector_metrics (sector_id, period_id);

create table if not exists public.fact_admin_unit_metrics (
  _id uuid primary key default gen_random_uuid(),
  level text not null check (level in ('province', 'ward')),
  source_id uuid not null,
  period_id uuid not null references public.dim_period (_id),
  population bigint null,
  area_km2 numeric null,
  grdp numeric null,
  total_revenue numeric null,
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique (level, source_id, period_id)
);

create index if not exists idx_fact_admin_unit_level_source_period
  on public.fact_admin_unit_metrics (level, source_id, period_id);

create or replace view public.v_admin_units as
select
  'province'::text as level,
  p._id as source_id,
  p.code,
  p.name,
  null::uuid as parent_id,
  null::text as status
from public.provinces p
union all
select
  'ward'::text as level,
  w._id as source_id,
  w.code,
  w.name,
  w.province_id as parent_id,
  null::text as status
from public.wards w;

create or replace view public.v_admin_units_with_coordinates as
select
  'province'::text as level,
  p._id as source_id,
  p.code,
  p.name,
  null::uuid as parent_id,
  p.center_lat,
  p.center_lng,
  p.bounds,
  p.area,
  p.officer
from public.provinces_with_coordinates p
union all
select
  'ward'::text as level,
  w._id as source_id,
  w.code,
  w.name,
  w.province_id as parent_id,
  w.center_lat,
  w.center_lng,
  w.bounds,
  w.area,
  w.officer
from public.wards_with_coordinates w;

create or replace view public.v_admin_unit_metrics_current as
select distinct on (m.level, m.source_id)
  m.*,
  p.granularity,
  p.year,
  p.quarter,
  p.month,
  p.from_date,
  p.to_date,
  p.label
from public.fact_admin_unit_metrics m
join public.dim_period p on p._id = m.period_id
order by m.level, m.source_id, p.to_date desc, m.updated_at desc;

create or replace view public.v_admin_unit_sector_metrics_current as
select distinct on (m.level, m.source_id, m.sector_id)
  m.*,
  p.granularity,
  p.year,
  p.quarter,
  p.month,
  p.from_date,
  p.to_date,
  p.label
from public.fact_admin_unit_sector_metrics m
join public.dim_period p on p._id = m.period_id
order by m.level, m.source_id, m.sector_id, p.to_date desc, m.updated_at desc;
