-- RPCs for users search, users-by-role, and bulk role assignment.
-- Do not run from app; apply via Supabase SQL editor after confirmation.

CREATE OR REPLACE FUNCTION public.rpc_users_search(
  p_q text DEFAULT NULL,
  p_status integer DEFAULT NULL,
  p_role_id uuid DEFAULT NULL,
  p_sort_by text DEFAULT 'created_at',
  p_sort_dir text DEFAULT 'desc',
  p_page integer DEFAULT 1,
  p_page_size integer DEFAULT 10
)
RETURNS TABLE (
  _id uuid,
  username text,
  full_name text,
  email text,
  phone text,
  status integer,
  last_login_at timestamptz,
  created_at timestamptz,
  updated_at timestamptz,
  note text,
  roles jsonb,
  primary_role_code text,
  primary_role_name text,
  total_count bigint
)
LANGUAGE sql
STABLE
AS $$
  WITH filtered AS (
    SELECT u.*
    FROM public.users u
    WHERE u.deleted_at IS NULL
      AND (p_status IS NULL OR u.status = p_status)
      AND (
        p_q IS NULL OR p_q = '' OR
        u.username ILIKE '%' || p_q || '%' OR
        u.full_name ILIKE '%' || p_q || '%' OR
        u.email ILIKE '%' || p_q || '%'
      )
      AND (
        p_role_id IS NULL OR
        EXISTS (
          SELECT 1
          FROM public.user_roles ur
          WHERE ur.user_id = u._id
            AND ur.role_id = p_role_id
        )
      )
  )
  SELECT
    u._id,
    u.username,
    u.full_name,
    u.email,
    u.phone,
    u.status,
    u."lastLoginAt" AS last_login_at,
    u.created_at,
    u.updated_at,
    u.note,
    COALESCE(r.roles, '[]'::jsonb) AS roles,
    r.primary_role_code,
    r.primary_role_name,
    COUNT(*) OVER() AS total_count
  FROM filtered u
  LEFT JOIN LATERAL (
    SELECT
      jsonb_agg(
        jsonb_build_object(
          'role_id', r._id,
          'code', r.code,
          'name', r.name,
          'is_primary', ur.is_primary
        )
        ORDER BY ur.is_primary DESC, r.code
      ) AS roles,
      MAX(r.code) FILTER (WHERE ur.is_primary) AS primary_role_code,
      MAX(r.name) FILTER (WHERE ur.is_primary) AS primary_role_name
    FROM public.user_roles ur
    JOIN public.roles r ON r._id = ur.role_id
    WHERE ur.user_id = u._id
  ) r ON TRUE
  ORDER BY
    CASE WHEN p_sort_by = 'username' AND p_sort_dir = 'asc' THEN u.username END ASC,
    CASE WHEN p_sort_by = 'username' AND p_sort_dir = 'desc' THEN u.username END DESC,
    CASE WHEN p_sort_by = 'full_name' AND p_sort_dir = 'asc' THEN u.full_name END ASC,
    CASE WHEN p_sort_by = 'full_name' AND p_sort_dir = 'desc' THEN u.full_name END DESC,
    CASE WHEN p_sort_by = 'email' AND p_sort_dir = 'asc' THEN u.email END ASC,
    CASE WHEN p_sort_by = 'email' AND p_sort_dir = 'desc' THEN u.email END DESC,
    CASE WHEN p_sort_by = 'created_at' AND p_sort_dir = 'asc' THEN u.created_at END ASC,
    CASE WHEN p_sort_by = 'created_at' AND p_sort_dir = 'desc' THEN u.created_at END DESC,
    CASE WHEN p_sort_by = 'last_login_at' AND p_sort_dir = 'asc' THEN u."lastLoginAt" END ASC,
    CASE WHEN p_sort_by = 'last_login_at' AND p_sort_dir = 'desc' THEN u."lastLoginAt" END DESC,
    u.created_at DESC
  LIMIT COALESCE(p_page_size, 10)
  OFFSET GREATEST(COALESCE(p_page, 1) - 1, 0) * COALESCE(p_page_size, 10);
$$;

CREATE OR REPLACE FUNCTION public.rpc_users_by_role(
  p_role_id uuid,
  p_q text DEFAULT NULL,
  p_status integer DEFAULT NULL,
  p_page integer DEFAULT 1,
  p_page_size integer DEFAULT 10
)
RETURNS TABLE (
  _id uuid,
  username text,
  full_name text,
  email text,
  status integer,
  last_login_at timestamptz,
  total_count bigint
)
LANGUAGE sql
STABLE
AS $$
  SELECT
    u._id,
    u.username,
    u.full_name,
    u.email,
    u.status,
    u."lastLoginAt" AS last_login_at,
    COUNT(*) OVER() AS total_count
  FROM public.user_roles ur
  JOIN public.users u ON u._id = ur.user_id
  WHERE ur.role_id = p_role_id
    AND u.deleted_at IS NULL
    AND (p_status IS NULL OR u.status = p_status)
    AND (
      p_q IS NULL OR p_q = '' OR
      u.username ILIKE '%' || p_q || '%' OR
      u.full_name ILIKE '%' || p_q || '%' OR
      u.email ILIKE '%' || p_q || '%'
    )
  ORDER BY u.full_name NULLS LAST, u.username
  LIMIT COALESCE(p_page_size, 10)
  OFFSET GREATEST(COALESCE(p_page, 1) - 1, 0) * COALESCE(p_page_size, 10);
$$;

CREATE OR REPLACE FUNCTION public.rpc_user_set_roles(
  p_user_id uuid,
  p_role_ids uuid[],
  p_primary_role_id uuid DEFAULT NULL,
  p_actor uuid DEFAULT NULL
)
RETURNS TABLE (
  inserted_count integer,
  removed_count integer
)
LANGUAGE plpgsql
AS $$
DECLARE
  v_removed integer := 0;
  v_inserted integer := 0;
BEGIN
  IF p_role_ids IS NULL OR array_length(p_role_ids, 1) IS NULL THEN
    DELETE FROM public.user_roles
    WHERE user_id = p_user_id;
    GET DIAGNOSTICS v_removed = ROW_COUNT;

    UPDATE public.user_roles
    SET is_primary = false
    WHERE user_id = p_user_id;

    RETURN QUERY SELECT 0, v_removed;
  END IF;

  DELETE FROM public.user_roles
  WHERE user_id = p_user_id
    AND role_id NOT IN (SELECT UNNEST(p_role_ids));
  GET DIAGNOSTICS v_removed = ROW_COUNT;

  WITH role_list AS (
    SELECT UNNEST(p_role_ids) AS role_id
  )
  INSERT INTO public.user_roles (user_id, role_id, is_primary, assigned_at, assigned_by)
  SELECT
    p_user_id,
    role_id,
    CASE WHEN role_id = p_primary_role_id THEN true ELSE false END,
    now(),
    p_actor
  FROM role_list
  ON CONFLICT (user_id, role_id) DO UPDATE
  SET is_primary = EXCLUDED.is_primary,
      assigned_at = EXCLUDED.assigned_at,
      assigned_by = EXCLUDED.assigned_by;
  GET DIAGNOSTICS v_inserted = ROW_COUNT;

  IF p_primary_role_id IS NULL THEN
    UPDATE public.user_roles
    SET is_primary = false
    WHERE user_id = p_user_id;
  ELSE
    UPDATE public.user_roles
    SET is_primary = CASE WHEN role_id = p_primary_role_id THEN true ELSE false END
    WHERE user_id = p_user_id;
  END IF;

  RETURN QUERY SELECT v_inserted, v_removed;
END;
$$;
