-- TV Wallboard schema support (complaints-driven hotspots)
-- Run in Supabase SQL editor as admin.

-- 1) Config table for hotspot rules (default: 3 days, min 3 stores)
CREATE TABLE IF NOT EXISTS tv_hotspot_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  window_days integer NOT NULL DEFAULT 3,
  min_merchants integer NOT NULL DEFAULT 3,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

INSERT INTO tv_hotspot_rules (window_days, min_merchants)
SELECT 3, 3
WHERE NOT EXISTS (SELECT 1 FROM tv_hotspot_rules);

-- Helpful indexes for tv views
CREATE INDEX IF NOT EXISTS idx_complaints_createdtime ON complaints ("createdTime");
CREATE INDEX IF NOT EXISTS idx_complaints_mappoint ON complaints ("mapPointId");
CREATE INDEX IF NOT EXISTS idx_complaints_ward ON complaints (ward_id);
CREATE INDEX IF NOT EXISTS idx_complaints_province ON complaints (province_id);
CREATE INDEX IF NOT EXISTS idx_complaint_violation_map ON "complaintViolationMap" ("complaintId");
CREATE INDEX IF NOT EXISTS idx_map_point_status_point ON map_point_status (map_point_id, point_status_id);

-- 2) Violation category score (1-10)
ALTER TABLE "violationCategory"
  ADD COLUMN IF NOT EXISTS score integer DEFAULT 5;

-- 3) Evidence review table (pending/approved/rejected)
CREATE TABLE IF NOT EXISTS evidence_reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  evidence_id uuid NOT NULL,
  status text NOT NULL DEFAULT 'pending',
  reviewed_by uuid,
  reviewed_at timestamptz,
  note text,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- 4) Add location hooks to risk_cases (optional but needed for /tv map)
ALTER TABLE risk_cases
  ADD COLUMN IF NOT EXISTS province_id uuid,
  ADD COLUMN IF NOT EXISTS ward_id uuid,
  ADD COLUMN IF NOT EXISTS map_point_id uuid,
  ADD COLUMN IF NOT EXISTS merchant_id uuid;

-- 5) Ensure hotspot status exists
INSERT INTO point_status (code, name)
SELECT 'hotspot', 'Hotspot'
WHERE NOT EXISTS (SELECT 1 FROM point_status WHERE code = 'hotspot');

-- 6) Complaint scores (avg score per complaint based on violationCategory)
CREATE OR REPLACE VIEW tv_complaint_scores AS
SELECT
  c._id AS complaint_id,
  c.id AS complaint_number,
  c.description,
  c.images,
  c.status,
  to_timestamp(c."createdTime") AS created_at,
  c."mapPointId" AS map_point_id,
  c.merchant_id,
  c.province_id,
  c.ward_id,
  COALESCE(AVG(vc.score), 0) AS avg_score,
  (ARRAY_AGG(vc.name ORDER BY vc.score DESC NULLS LAST, vc.id ASC))[1] AS category_name,
  (ARRAY_AGG(vc.id ORDER BY vc.score DESC NULLS LAST, vc.id ASC))[1] AS category_id
FROM complaints c
LEFT JOIN "complaintViolationMap" cvm
  ON cvm."complaintId" = c.id
LEFT JOIN "violationCategory" vc
  ON vc.id = cvm."violationCategoryId"
GROUP BY
  c._id,
  c.id,
  c.description,
  c.images,
  c.status,
  c."createdTime",
  c."mapPointId",
  c.merchant_id,
  c.province_id,
  c.ward_id;

-- 7) Complaints enriched with location + ward/province names
CREATE OR REPLACE VIEW tv_complaints_enriched AS
SELECT
  cs.*,
  mp.title AS map_point_title,
  (mp.location->>'lat')::double precision AS lat,
  (mp.location->>'lon')::double precision AS lng,
  w.name AS ward_name,
  p.name AS province_name
FROM tv_complaint_scores cs
LEFT JOIN map_points mp ON mp._id = cs.map_point_id
LEFT JOIN wards w ON w.id = cs.ward_id
LEFT JOIN provinces p ON p.id = cs.province_id;

-- 8) Hotspot candidates by ward (>= min_merchants in window_days)
CREATE OR REPLACE VIEW tv_hotspot_candidates AS
WITH rules AS (
  SELECT window_days, min_merchants
  FROM tv_hotspot_rules
  ORDER BY updated_at DESC NULLS LAST
  LIMIT 1
),
recent AS (
  SELECT cs.*
  FROM tv_complaint_scores cs, rules r
  WHERE cs.created_at >= now() - (r.window_days || ' days')::interval
),
ward_stats AS (
  SELECT ward_id, COUNT(DISTINCT map_point_id) AS distinct_points
  FROM recent
  WHERE map_point_id IS NOT NULL
  GROUP BY ward_id
)
SELECT
  r.ward_id,
  r.map_point_id,
  COUNT(*) AS complaint_count,
  AVG(r.avg_score) AS avg_score,
  (ARRAY_AGG(r.category_name ORDER BY r.avg_score DESC NULLS LAST))[1] AS category_name,
  MAX(r.created_at) AS last_complaint_at
FROM recent r
JOIN ward_stats ws ON ws.ward_id = r.ward_id
JOIN rules rl ON true
WHERE ws.distinct_points >= rl.min_merchants
GROUP BY r.ward_id, r.map_point_id;

-- 9) Hotspots view (use for /tv map)
CREATE OR REPLACE VIEW tv_hotspots AS
SELECT
  hc.map_point_id,
  mp.title,
  hc.complaint_count,
  hc.avg_score,
  hc.category_name,
  hc.last_complaint_at,
  CASE
    WHEN hc.avg_score >= 8 THEN 'P1'
    WHEN hc.avg_score >= 5 THEN 'P2'
    ELSE 'P3'
  END AS severity,
  (mp.location->>'lat')::double precision AS lat,
  (mp.location->>'lon')::double precision AS lng,
  mp.ward_id,
  mp.province_id,
  w.name AS ward,
  p.name AS province
FROM tv_hotspot_candidates hc
JOIN map_points mp ON mp._id = hc.map_point_id
LEFT JOIN wards w ON w.id = mp.ward_id
LEFT JOIN provinces p ON p.id = mp.province_id;

-- 10) Risk cases view with SLA and location
CREATE OR REPLACE VIEW tv_risk_cases AS
WITH policy AS (
  SELECT prioritylevel, resolutiontimehours
  FROM slapolicies
  WHERE isactive = true
)
SELECT
  rc.id,
  rc.title,
  rc.created_at,
  COALESCE(
    rc.due_at,
    rc.created_at + (COALESCE(p.resolutiontimehours, rc.sla_hours, 0) || ' hours')::interval
  ) AS due_at,
  COALESCE(rc.is_overdue, now() > COALESCE(rc.due_at, rc.created_at)) AS is_overdue,
  rc.status,
  rc.severity,
  rc.category,
  rc.province_id,
  rc.ward_id,
  rc.map_point_id,
  rc.merchant_id,
  mp._id AS resolved_map_point_id,
  (mp.location->>'lat')::double precision AS lat,
  (mp.location->>'lon')::double precision AS lng,
  w.name AS ward,
  p2.name AS province
FROM risk_cases rc
LEFT JOIN policy p ON p.prioritylevel = rc.severity
LEFT JOIN LATERAL (
  SELECT mp.*
  FROM map_points mp
  WHERE mp._id = rc.map_point_id
     OR (rc.map_point_id IS NULL AND rc.merchant_id IS NOT NULL AND mp.merchant_id = rc.merchant_id)
  LIMIT 1
) mp ON true
LEFT JOIN wards w ON w.id = COALESCE(rc.ward_id, mp.ward_id)
LEFT JOIN provinces p2 ON p2.id = COALESCE(rc.province_id, mp.province_id);

-- 11) Evidence reviews view for /tv KPI
CREATE OR REPLACE VIEW tv_evidence_reviews AS
SELECT
  er.id AS review_id,
  er.status,
  er.created_at,
  e._id AS evidence_id,
  e.file_name,
  e.file_url,
  e.file_type,
  e.session_id,
  s.map_point_id,
  (mp.location->>'lat')::double precision AS lat,
  (mp.location->>'lon')::double precision AS lng,
  mp.ward_id,
  mp.province_id,
  w.name AS ward,
  p.name AS province
FROM evidence_reviews er
JOIN map_inspection_evidences e ON e._id = er.evidence_id
LEFT JOIN map_inspection_sessions s ON s._id = e.session_id
LEFT JOIN map_points mp ON mp._id = s.map_point_id
LEFT JOIN wards w ON w.id = mp.ward_id
LEFT JOIN provinces p ON p.id = mp.province_id;

-- 12) Refresh hotspot status in map_point_status (optional)
CREATE OR REPLACE FUNCTION refresh_map_point_hotspots()
RETURNS void
LANGUAGE plpgsql
AS $$
DECLARE
  hotspot_status_id uuid;
BEGIN
  SELECT id INTO hotspot_status_id FROM point_status WHERE code = 'hotspot' LIMIT 1;

  IF hotspot_status_id IS NULL THEN
    RAISE NOTICE 'Missing point_status with code=hotspot';
    RETURN;
  END IF;

  -- Remove old hotspot statuses not in current candidates
  DELETE FROM map_point_status mps
  WHERE mps.point_status_id = hotspot_status_id
    AND NOT EXISTS (
      SELECT 1 FROM tv_hotspot_candidates hc
      WHERE hc.map_point_id = mps.map_point_id
    );

  -- Insert new hotspot statuses
  INSERT INTO map_point_status (map_point_id, point_status_id, created_at)
  SELECT hc.map_point_id, hotspot_status_id, now()
  FROM tv_hotspot_candidates hc
  ON CONFLICT DO NOTHING;
END;
$$;

-- 13) Public read policies (anon) for /tv views + new tables
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'tv_hotspot_rules' AND policyname = 'tv_hotspot_rules_read'
  ) THEN
    ALTER TABLE tv_hotspot_rules ENABLE ROW LEVEL SECURITY;
    CREATE POLICY tv_hotspot_rules_read ON tv_hotspot_rules FOR SELECT USING (true);
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE schemaname = 'public' AND tablename = 'evidence_reviews' AND policyname = 'evidence_reviews_read'
  ) THEN
    ALTER TABLE evidence_reviews ENABLE ROW LEVEL SECURITY;
    CREATE POLICY evidence_reviews_read ON evidence_reviews FOR SELECT USING (true);
  END IF;
END $$;
