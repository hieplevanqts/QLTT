-- Proposal only. Do NOT apply from app.
-- Reuse existing department_areas + areas.

-- Optional indexes to optimize queries (apply only if missing).

CREATE INDEX IF NOT EXISTS idx_department_areas_department_id
  ON public.department_areas (department_id);

CREATE INDEX IF NOT EXISTS idx_department_areas_area_id
  ON public.department_areas (area_id);

CREATE INDEX IF NOT EXISTS idx_areas_province_id
  ON public.areas (province_id);

CREATE INDEX IF NOT EXISTS idx_areas_ward_id
  ON public.areas (ward_id);

CREATE INDEX IF NOT EXISTS idx_areas_level
  ON public.areas (level);
