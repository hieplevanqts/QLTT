--
-- PostgreSQL database dump
--

\restrict UvUuSS1PC3soxGKobWlJEVl0hEX4JU3cjMoofaEAwO7PJeDpAip6oheamkh09d0

-- Dumped from database version 17.6
-- Dumped by pg_dump version 17.7 (Debian 17.7-3.pgdg13+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: auth; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA auth;


--
-- Name: public; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA public;


--
-- Name: SCHEMA public; Type: COMMENT; Schema: -; Owner: -
--

COMMENT ON SCHEMA public IS 'standard public schema';


--
-- Name: storage; Type: SCHEMA; Schema: -; Owner: -
--

CREATE SCHEMA storage;


--
-- Name: aal_level; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.aal_level AS ENUM (
    'aal1',
    'aal2',
    'aal3'
);


--
-- Name: code_challenge_method; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.code_challenge_method AS ENUM (
    's256',
    'plain'
);


--
-- Name: factor_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_status AS ENUM (
    'unverified',
    'verified'
);


--
-- Name: factor_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.factor_type AS ENUM (
    'totp',
    'webauthn',
    'phone'
);


--
-- Name: oauth_authorization_status; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_authorization_status AS ENUM (
    'pending',
    'approved',
    'denied',
    'expired'
);


--
-- Name: oauth_client_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_client_type AS ENUM (
    'public',
    'confidential'
);


--
-- Name: oauth_registration_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_registration_type AS ENUM (
    'dynamic',
    'manual'
);


--
-- Name: oauth_response_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.oauth_response_type AS ENUM (
    'code'
);


--
-- Name: one_time_token_type; Type: TYPE; Schema: auth; Owner: -
--

CREATE TYPE auth.one_time_token_type AS ENUM (
    'confirmation_token',
    'reauthentication_token',
    'recovery_token',
    'email_change_token_new',
    'email_change_token_current',
    'phone_change_token'
);


--
-- Name: inspection_result_status; Type: TYPE; Schema: public; Owner: -
--

CREATE TYPE public.inspection_result_status AS ENUM (
    'pass',
    'fail',
    'warning',
    'not_applicable'
);


--
-- Name: buckettype; Type: TYPE; Schema: storage; Owner: -
--

CREATE TYPE storage.buckettype AS ENUM (
    'STANDARD',
    'ANALYTICS',
    'VECTOR'
);


--
-- Name: email(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.email() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.email', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'email')
  )::text
$$;


--
-- Name: FUNCTION email(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.email() IS 'Deprecated. Use auth.jwt() -> ''email'' instead.';


--
-- Name: jwt(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.jwt() RETURNS jsonb
    LANGUAGE sql STABLE
    AS $$
  select 
    coalesce(
        nullif(current_setting('request.jwt.claim', true), ''),
        nullif(current_setting('request.jwt.claims', true), '')
    )::jsonb
$$;


--
-- Name: role(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.role() RETURNS text
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.role', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'role')
  )::text
$$;


--
-- Name: FUNCTION role(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.role() IS 'Deprecated. Use auth.jwt() -> ''role'' instead.';


--
-- Name: uid(); Type: FUNCTION; Schema: auth; Owner: -
--

CREATE FUNCTION auth.uid() RETURNS uuid
    LANGUAGE sql STABLE
    AS $$
  select 
  coalesce(
    nullif(current_setting('request.jwt.claim.sub', true), ''),
    (nullif(current_setting('request.jwt.claims', true), '')::jsonb ->> 'sub')
  )::uuid
$$;


--
-- Name: FUNCTION uid(); Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON FUNCTION auth.uid() IS 'Deprecated. Use auth.jwt() -> ''sub'' instead.';


--
-- Name: api_assign_role(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.api_assign_role(p_email text, p_role_name text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$DECLARE
    v_user_id uuid;
    v_role_id uuid;
    v_exists boolean;
    v_result jsonb;
BEGIN
    -- 1. Tìm ID của User từ bảng Auth
    SELECT id INTO v_user_id FROM auth.users WHERE email = p_email;
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('status', 'error', 'message', 'User không tồn tại');
    END IF;

    -- 2. Tìm ID của Role
    SELECT id INTO v_role_id FROM public.roles WHERE code ILIKE p_role_name;
    IF v_role_id IS NULL THEN
        RETURN jsonb_build_object('status', 'error', 'message', 'Role không hợp lệ');
    END IF;

    -- 3. Kiểm tra user đã có quyền này chưa
    SELECT EXISTS (
        SELECT 1 FROM public.user_roles 
        WHERE user_id = v_user_id AND role_id = v_role_id
    ) INTO v_exists;

    -- 4. Nếu chưa có thì gán, nếu có rồi thì báo tin
    IF v_exists THEN
        v_result := jsonb_build_object('status', 'already_exists', 'message', 'User đã có quyền này rồi');
    ELSE
        INSERT INTO public.user_roles (user_id, role_id) VALUES (v_user_id, v_role_id);
        
        -- Cập nhật metadata để JWT nhận diện ngay lập tức
        UPDATE auth.users 
        SET raw_app_meta_data = jsonb_set(
            COALESCE(raw_app_meta_data, '{}'::jsonb),
            '{role}',
            to_jsonb(p_role_name)
        ) WHERE id = v_user_id;

        v_result := jsonb_build_object('status', 'success', 'message', 'Gán quyền thành công');
    END IF;

    RETURN v_result;
END;$$;


--
-- Name: create_full_complaint(integer, uuid, text, integer[]); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_full_complaint(p_user_id integer, p_map_point_id uuid, p_description text, p_violation_ids integer[]) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_complaint_id int;
    v_id int;
BEGIN
    -- 1. Insert vào complaint
    INSERT INTO "complaints" ("userId", "mapPointId", "description", "status", "createdTime")
    VALUES (p_user_id, p_map_point_id, p_description, 0, extract(epoch from now()))
    RETURNING id INTO new_complaint_id;

    -- 2. Insert các lỗi vi phạm
    FOREACH v_id IN ARRAY p_violation_ids
    LOOP
        INSERT INTO "complaintViolationMap" ("complaintId", "violationCategoryId")
        VALUES (new_complaint_id, v_id);
    END LOOP;

    -- 3. Tạo timeline mặc định
    INSERT INTO "complaintTimeline" ("complaintId", "stepName", "logTime", "isCompleted", "sortOrder")
    VALUES (new_complaint_id, 'Đã tiếp nhận phản ánh', extract(epoch from now()), true, 1);

    RETURN new_complaint_id;
END;
$$;


--
-- Name: create_full_complaint(integer, uuid, text, text[], integer[]); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_full_complaint(p_user_id integer, p_map_point_id uuid, p_description text, p_images text[], p_violation_ids integer[]) RETURNS integer
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_complaint_id int;
    v_id int;
BEGIN
    -- 1. Insert vào bảng complaints (lưu ý dùng tên bảng mới có chữ 's')
    INSERT INTO "complaints" (
        "userId", 
        "mapPointId", 
        "description", 
        "images", 
        "status", 
        "createdTime", 
        "lastUpdateTime"
    )
    VALUES (
        p_user_id, 
        p_map_point_id, 
        p_description, 
        p_images, 
        0, 
        extract(epoch from now()), 
        extract(epoch from now())
    )
    RETURNING id INTO new_complaint_id;

    -- 2. Insert các lỗi vi phạm vào bảng trung gian
    IF p_violation_ids IS NOT NULL THEN
        FOREACH v_id IN ARRAY p_violation_ids
        LOOP
            INSERT INTO "complaintViolationMap" ("complaintId", "violationCategoryId")
            VALUES (new_complaint_id, v_id);
        END LOOP;
    END IF;

    -- 3. Tự động tạo mốc tiến độ đầu tiên: "Đã tiếp nhận"
    INSERT INTO "complaintTimeline" (
        "complaintId", 
        "stepName", 
        "logTime", 
        "isCompleted", 
        "sortOrder"
    )
    VALUES (
        new_complaint_id, 
        'Đã tiếp nhận phản ánh', 
        extract(epoch from now()), 
        true, 
        1
    );

    RETURN new_complaint_id;
END;
$$;


--
-- Name: create_map_point_with_hours(text, text, text, integer, jsonb, jsonb); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.create_map_point_with_hours(p_title text, p_address text, p_hotline text, p_status integer, p_images jsonb, p_hours jsonb) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    new_point_id UUID;
BEGIN
    -- 1. Thêm địa điểm vào bảng map_points
    -- Lưu ý: Đã đổi cột "name" thành "title"
    INSERT INTO "public"."map_points" (
        "title", "address", "hotline", "status", "images"
    )
    VALUES (
        p_title, p_address, p_hotline, p_status, p_images
    )
    RETURNING "_id" INTO new_point_id;

    -- 2. Thêm giờ làm việc vào bảng map_point_hours (Giữ nguyên logic cũ)
    IF p_hours IS NOT NULL THEN
        INSERT INTO "public"."map_point_hours" (
            "map_point_id", 
            "day_of_week", 
            "open_time", 
            "close_time"
        )
        SELECT
            new_point_id,
            (item->>'day')::smallint,
            (item->>'open')::time,
            (item->>'close')::time
        FROM jsonb_array_elements(p_hours) AS item;
    END IF;

    -- 3. Trả về kết quả
    RETURN json_build_object(
        'success', true,
        'id', new_point_id,
        'message', 'Thêm cơ sở mới thành công'
    );

EXCEPTION WHEN OTHERS THEN
    RAISE EXCEPTION 'Lỗi khi tạo địa điểm: %', SQLERRM;
END;
$$;


--
-- Name: fn_log_all_merchant_changes(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.fn_log_all_merchant_changes() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    key_name TEXT;
    old_val TEXT;
    new_val TEXT;
    field_display_name TEXT;
BEGIN
    -- Lặp qua từng trường trong bản ghi dưới dạng JSON
    -- (Sử dụng jsonb_each_text để lấy cặp key-value)
    FOR key_name, old_val IN SELECT * FROM jsonb_each_text(to_jsonb(OLD))
    LOOP
        -- Lấy giá trị mới tương ứng với key_name
        SELECT value INTO new_val FROM jsonb_each_text(to_jsonb(NEW)) WHERE key = key_name;

        -- So sánh giá trị cũ và mới (Bỏ qua trường updated_at và id hệ thống)
        IF (old_val IS DISTINCT FROM new_val) AND (key_name NOT IN ('updated_at', 'created_at')) THEN
            
            -- Chuyển đổi field_code thành tên hiển thị dễ đọc (Optional)
            field_display_name := CASE key_name
                WHEN 'business_name' THEN 'Tên kinh doanh'
                WHEN 'owner_name' THEN 'Tên chủ sở hữu'
                WHEN 'owner_phone' THEN 'Số điện thoại'
                WHEN 'address' THEN 'Địa chỉ'
                WHEN 'status' THEN 'Trạng thái'
                WHEN 'monthly_revenue' THEN 'Doanh thu tháng'
                -- Thêm các trường khác vào đây nếu muốn Việt hóa tên trường
                ELSE key_name 
            END;

            -- Ghi vào bảng lịch sử
            INSERT INTO public.merchant_histories (
                merchant_id, 
                user_id, 
                feild_name, 
                feild_code, 
                old_data, 
                new_data, 
                status
            ) VALUES (
                NEW._id, 
                COALESCE(auth.uid(), '643de813-678a-4533-8294-a508045df572'::uuid),
                field_display_name,
                key_name,
                old_val,
                new_val,
                1 -- Approved mặc định cho các thay đổi trực tiếp
            );
        END IF;
    END LOOP;

    RETURN NEW;
END;
$$;


--
-- Name: format_relative_time(bigint); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.format_relative_time(ts bigint) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    diff_seconds int;
    days int;
    hours int;
BEGIN
    -- Nếu ts là 13 số (miligiây), chia cho 1000 để thành giây
    IF ts > 9999999999 THEN
        ts := ts / 1000;
    END IF;

    diff_seconds := extract(epoch from now())::int - ts::int;
    days := diff_seconds / 86400;
    hours := diff_seconds / 3600;

    IF days > 0 THEN
        RETURN days || ' ngày trước';
    ELSIF hours > 0 THEN
        RETURN hours || ' giờ trước';
    ELSE
        RETURN 'Vừa xong';
    END IF;
END;
$$;


--
-- Name: getArticleCounts(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public."getArticleCounts"("currentUserId" uuid) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
  newest_count int;
  hot_count int;
  saved_count int;
BEGIN
  -- 1. Đếm tab Mới nhất (Tất cả bài được hiển thị)
  SELECT count(*) INTO newest_count 
  FROM public.articles 
  WHERE "isDisplay" = true;

  -- 2. Đếm tab Tin Hot (Hiển thị + Hot)
  SELECT count(*) INTO hot_count 
  FROM public.articles 
  WHERE "isDisplay" = true AND "isHot" = true;

  -- 3. Đếm tab Tin đã lưu (Của user hiện tại)
  -- Nếu currentUserId là NULL (khách vãng lai) thì trả về 0
  IF "currentUserId" IS NULL THEN
    saved_count := 0;
  ELSE
    SELECT count(*) INTO saved_count 
    FROM public."savedArticles" 
    WHERE "userId" = "currentUserId";
  END IF;

  -- Trả về 1 cục JSON
  RETURN json_build_object(
    'newest', newest_count,
    'hot', hot_count,
    'saved', saved_count
  );
END;
$$;


--
-- Name: get_complaint_chart_data(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_complaint_chart_data() RETURNS TABLE(status_group text, count bigint)
    LANGUAGE sql
    AS $$
  SELECT 
    status as status_group,
    COUNT(*) as count
  FROM "public"."complaints"
  GROUP BY status;
$$;


--
-- Name: get_complaint_chart_data_2(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_complaint_chart_data_2() RETURNS TABLE(status_group text, count bigint)
    LANGUAGE sql
    AS $$
  SELECT 
    CASE 
        WHEN status = 1 THEN 'new'       -- Quy ước: 1 là Mới
        WHEN status = 2 THEN 'pending'   -- Quy ước: 2 là Đang xử lý
        WHEN status = 3 THEN 'resolved'  -- Quy ước: 3 là Đã xong
        ELSE 'unknown'
    END as status_group,
    COUNT(*) as count
  FROM "public"."complaints"
  GROUP BY status;
$$;


--
-- Name: get_dashboard_overview(uuid, uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_dashboard_overview(p_province_id uuid DEFAULT NULL::uuid, p_ward_id uuid DEFAULT NULL::uuid) RETURNS json
    LANGUAGE plpgsql
    AS $$
DECLARE
    v_store_count INTEGER;
    v_pending_complaint_count INTEGER;
    v_total_violations_count INTEGER;
    v_tax_debt_count INTEGER;
BEGIN
    -- 1. Đếm số cửa hàng
    SELECT count(*) INTO v_store_count 
    FROM public.merchants AS m
    WHERE (get_dashboard_overview.p_province_id IS NULL OR m.province_id = get_dashboard_overview.p_province_id)
      AND (get_dashboard_overview.p_ward_id IS NULL OR m.ward_id = get_dashboard_overview.p_ward_id);

    -- 2. Đếm phản ánh CHƯA XỬ LÝ
    SELECT count(*) INTO v_pending_complaint_count 
    FROM public.complaints AS c
    WHERE c.status IN (1, 2)
      AND (get_dashboard_overview.p_province_id IS NULL OR c.province_id = get_dashboard_overview.p_province_id)
      AND (get_dashboard_overview.p_ward_id IS NULL OR c.ward_id = get_dashboard_overview.p_ward_id);

    -- 3. Tổng số vi phạm
    SELECT COALESCE(SUM(v.total_violations), 0) INTO v_total_violations_count 
    FROM public.map_inspection_violation_reports AS v
    WHERE (get_dashboard_overview.p_province_id IS NULL OR v.province_id = get_dashboard_overview.p_province_id)
      AND (get_dashboard_overview.p_ward_id IS NULL OR v.ward_id = get_dashboard_overview.p_ward_id);

    -- 4. Nợ thuế
    SELECT count(*) INTO v_tax_debt_count 
    FROM public.merchants AS m
    WHERE m.status = 'warning'
      AND (get_dashboard_overview.p_province_id IS NULL OR m.province_id = get_dashboard_overview.p_province_id)
      AND (get_dashboard_overview.p_ward_id IS NULL OR m.ward_id = get_dashboard_overview.p_ward_id);

    RETURN json_build_object(
        'store_count', v_store_count,
        'pending_complaint_count', v_pending_complaint_count,
        'total_violations_count', v_total_violations_count,
        'tax_debt_count', v_tax_debt_count
    );
END;
$$;


--
-- Name: get_department_ids(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_department_ids(p_user_id uuid) RETURNS SETOF uuid
    LANGUAGE sql SECURITY DEFINER
    AS $$
    WITH RECURSIVE department_tree AS (
        -- Bước 1: Lấy ID phòng ban gốc
        SELECT d.id
        FROM departments d
        JOIN department_users du ON d.id = du.department_id
        WHERE du.user_id = p_user_id
          AND d.deleted_at IS NULL

        UNION

        -- Bước 2: Đệ quy lấy ID phòng ban con
        SELECT child.id
        FROM departments child
        JOIN department_tree parent ON child.parent_id = parent.id
        WHERE child.deleted_at IS NULL
    )
    SELECT id FROM department_tree;
$$;


--
-- Name: get_department_ids_array(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_department_ids_array(p_user_id uuid) RETURNS SETOF uuid
    LANGUAGE sql SECURITY DEFINER
    AS $$
    WITH RECURSIVE department_tree AS (
        -- Bước 1: Lấy ID phòng ban gốc
        SELECT d.id
        FROM departments d
        JOIN department_users du ON d.id = du.department_id
        WHERE du.user_id = p_user_id
          AND d.deleted_at IS NULL

        UNION

        -- Bước 2: Đệ quy lấy ID phòng ban con
        SELECT child.id
        FROM departments child
        JOIN department_tree parent ON child.parent_id = parent.id
        WHERE child.deleted_at IS NULL
    )
    SELECT id FROM department_tree;
$$;


--
-- Name: get_department_ids_by_user(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_department_ids_by_user(p_user_id uuid) RETURNS TABLE(id uuid)
    LANGUAGE sql SECURITY DEFINER
    AS $$
    WITH RECURSIVE department_tree AS (
        -- Bước 1: Lấy ID các phòng ban gốc của User
        SELECT d.id
        FROM departments d
        JOIN department_users du ON d.id = du.department_id
        WHERE du.user_id = p_user_id
          AND d.deleted_at IS NULL

        UNION

        -- Bước 2: Đệ quy lấy ID của các phòng ban con
        SELECT child.id
        FROM departments child
        JOIN department_tree parent ON child.parent_id = parent.id
        WHERE child.deleted_at IS NULL
    )
    SELECT id FROM department_tree;
$$;


SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: departments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.departments (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    parent_id uuid,
    name text NOT NULL,
    code character varying(50),
    level integer NOT NULL,
    path text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    address text,
    CONSTRAINT departments_check CHECK ((updated_at >= created_at)),
    CONSTRAINT departments_level_check CHECK ((level = ANY (ARRAY[1, 2, 3]))),
    CONSTRAINT departments_name_check CHECK ((length(name) > 0))
);


--
-- Name: TABLE departments; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.departments IS 'Danh sách phòng ban theo cấu trúc phân cấp';


--
-- Name: COLUMN departments.level; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.departments.level IS 'Cấp tổ chức: 1=Cục, 2=Chi cục, 3=Đội';


--
-- Name: get_department_tree_by_user(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_department_tree_by_user(p_user_id uuid) RETURNS SETOF public.departments
    LANGUAGE sql SECURITY DEFINER
    AS $$
    WITH RECURSIVE department_tree AS (
        -- Bước 1: Lấy các phòng ban gốc của User (chưa bị xóa)
        SELECT d.*
        FROM departments d
        JOIN department_users du ON d.id = du.department_id
        WHERE du.user_id = p_user_id
          AND d.deleted_at IS NULL

        UNION

        -- Bước 2: Đệ quy lấy tất cả các phòng ban con (chưa bị xóa)
        SELECT child.*
        FROM departments child
        JOIN department_tree parent ON child.parent_id = parent.id
        WHERE child.deleted_at IS NULL
    )
    SELECT * FROM department_tree;
$$;


--
-- Name: get_merchant_details(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_merchant_details(p_merchant_id uuid) RETURNS TABLE(merchant_info jsonb, licenses jsonb, owners jsonb)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
  RETURN QUERY
  SELECT 
    jsonb_build_object(
      'business_name', m.business_name,
      'tax_code', m.tax_code,
      'business_type', m.business_type,
      'address', m.address,
      'province', m.province,
      'status', m.status,
      'issued_date', (
          SELECT l_sub.issued_date 
          FROM merchant_licenses l_sub 
          WHERE l_sub.merchant_id = m.id 
          AND l_sub.license_type = 'Giấy phép kinh doanh' 
          LIMIT 1
      )
    ) AS merchant_info,
    
    COALESCE(
      jsonb_agg(DISTINCT l.*) FILTER (WHERE l.id IS NOT NULL), 
      '[]'::jsonb
    ) AS licenses,
    
    -- SỬA TẠI ĐÂY: Dùng jsonb_build_object bên trong jsonb_agg
    COALESCE(
      jsonb_agg(
        DISTINCT jsonb_build_object(
          'id', o.id,
          'full_name', o.full_name,
          'id_card_number', o.id_card_number,
          'phone_number', o.phone_number,
          'birth_year', o.birth_year
        )
      ) FILTER (WHERE o.id IS NOT NULL), 
      '[]'::jsonb
    ) AS owners
    
  FROM merchants m
  LEFT JOIN merchant_licenses l ON m.id = l.merchant_id
  LEFT JOIN merchant_owners o ON m.owner_id = o.id
  WHERE m.id = p_merchant_id
  GROUP BY 
    m.id, 
    m.business_name, 
    m.tax_code, 
    m.business_type, 
    m.address, 
    m.province, 
    m.status;
END;
$$;


--
-- Name: get_merchants_with_stats(boolean); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_merchants_with_stats(p_is_hot boolean DEFAULT NULL::boolean) RETURNS TABLE(id uuid, name text, address text, phone text, is_hot boolean, total_complaints bigint)
    LANGUAGE plpgsql
    AS $$
BEGIN
    RETURN QUERY
    SELECT 
        m._id,
        m.business_name,
        m.address,
        m.owner_phone,
        m.is_hot,
        COUNT(c._id) as total_complaints -- Đếm số ID bên bảng complaint
    FROM "public"."merchants" m
    LEFT JOIN "public"."complaints" c ON m._id = c.merchant_id
    WHERE (p_is_hot IS NULL OR m.is_hot = p_is_hot) -- Logic filter: Nếu p_is_hot null thì lấy hết, ngược lại thì lọc
    GROUP BY m._id; -- Gom nhóm theo Merchant để đếm
END;
$$;


--
-- Name: articles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.articles (
    id bigint NOT NULL,
    title text NOT NULL,
    "rewriteURL" text,
    brief text,
    content text,
    thumbnail text,
    "viewCount" integer DEFAULT 0,
    "isHot" boolean DEFAULT false,
    "isFeatured" boolean DEFAULT false,
    "isDisplay" boolean DEFAULT true,
    "creatorId" bigint,
    "lastUpdateUserId" bigint,
    "publishDate" bigint,
    "createdTime" bigint DEFAULT (EXTRACT(epoch FROM now()))::bigint,
    "updatedTime" bigint DEFAULT (EXTRACT(epoch FROM now()))::bigint
);


--
-- Name: get_my_saved_articles(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_my_saved_articles(uid uuid) RETURNS SETOF public.articles
    LANGUAGE sql STABLE
    AS $$
  SELECT a.*
  FROM articles a
  JOIN "savedArticles" sa ON a.id = sa.article_id -- (1) Kiểm tra lại tên cột này trong bảng savedArticles của bạn
  WHERE sa."user_id" = uid                         -- (2) Khớp tên cột userId
  ORDER BY sa."createdTime" DESC;                 -- (3) Sắp xếp theo thời gian lưu mới nhất
$$;


--
-- Name: get_result_text(public.inspection_result_status); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_result_text(res public.inspection_result_status) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
BEGIN
    RETURN CASE res
        WHEN 'pass' THEN 'Đạt'
        WHEN 'fail' THEN 'Không đạt'
        WHEN 'warning' THEN 'Cảnh cáo'
        WHEN 'not_applicable' THEN 'Không áp dụng'
        ELSE 'Chờ xử lý'
    END;
END;
$$;


--
-- Name: get_user_area_details(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_area_details(p_user_id uuid) RETURNS TABLE("provinceId" uuid, "wardId" uuid, department_id uuid)
    LANGUAGE sql SECURITY DEFINER
    AS $$
    SELECT 
        a."provinceId", 
        a."wardId",
        du.department_id
    FROM users u
    JOIN department_users du ON u.id = du.user_id
    JOIN departments d ON du.department_id = d.id
    JOIN department_areas da ON d.id = da.department_id
    JOIN areas a ON da.area_id = a.id
    WHERE u.id = p_user_id;
$$;


--
-- Name: get_user_area_info(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_area_info(p_user_id uuid) RETURNS TABLE(province_id uuid, ward_id uuid, dept_id uuid)
    LANGUAGE sql SECURITY DEFINER
    AS $$
    SELECT 
        a."provinceId", 
        a."wardId",
        du.department_id
    FROM users u
    JOIN department_users du ON u.id = du.user_id
    JOIN departments d ON du.department_id = d.id
    JOIN department_areas da ON d.id = da.department_id
    JOIN areas a ON da.area_id = a.id
    WHERE u.id = p_user_id;
$$;


--
-- Name: get_user_permissions(uuid); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_permissions(input_user_id uuid) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
  permissions_list jsonb;
BEGIN
  SELECT jsonb_agg(DISTINCT p.code)
  INTO permissions_list
  FROM public.permissions p
  JOIN public.role_permissions rp ON p.id = rp.permission_id
  JOIN public.user_roles ur ON rp.role_id = ur.role_id
  WHERE ur.user_id = input_user_id; -- Sử dụng tên tham số đã đổi để hết bị trùng

  RETURN COALESCE(permissions_list, '[]'::jsonb);
END;
$$;


--
-- Name: get_user_roles_by_email(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.get_user_roles_by_email(target_email text) RETURNS TABLE(code character varying)
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
begin
  return query
  select r.code::varchar 
  from public.roles r
  join public.user_roles ur on r.id = ur.role_id
  join auth.users u on u.id = ur.user_id
  where u.email = target_email;
end;
$$;


--
-- Name: handle_new_user(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'public'
    AS $$
begin
  insert into public.users (
    id,
    email,
    phone,
    username,
    full_name,
    avatar_url,
    "avatarUrl",
    "departmentId",
    "status",
    "lastLoginAt",
    created_at,
    updated_at
  )
  values (
    new.id,
    new.email,
    new.phone,
    -- Lấy từ metadata, nếu không có thì lấy phần trước dấu @ của email làm username tạm
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1)),
    new.raw_user_meta_data->>'full_name',
    new.raw_user_meta_data->>'avatar_url',
    new.raw_user_meta_data->>'avatar_url', -- Đồng bộ cho cả 2 cột avatar
    (new.raw_user_meta_data->>'departmentId')::uuid, -- Ép kiểu text sang UUID
    coalesce((new.raw_user_meta_data->>'status')::integer, 1), -- Ưu tiên status truyền vào, mặc định là 1
    null, -- lastLoginAt mặc định null khi mới đăng ký
    now(),
    now()
  );
  return new;
end;
$$;


--
-- Name: handle_new_user_sync(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_new_user_sync() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, avatar_url)
  VALUES (
    new.id, 
    new.email, 
    new.raw_user_meta_data->>'full_name', -- Lấy từ metadata nếu có
    new.raw_user_meta_data->>'avatar_url'
  )
  ON CONFLICT (id) DO UPDATE SET
    email = EXCLUDED.email,
    updated_at = now();
  RETURN new;
END;
$$;


--
-- Name: handle_update_user_login(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_update_user_login() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE public.users
  SET "lastLoginAt" = NEW.last_sign_in_at
  WHERE id = NEW.id;
  RETURN NEW;
END;
$$;


--
-- Name: handle_updated_at(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.handle_updated_at() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    new.updated_at = now();
    return new;
end;
$$;


--
-- Name: multi_login(text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.multi_login(p_login_identifier text) RETURNS text
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_email text;
BEGIN
    -- Ưu tiên 1: Tìm theo Email (phổ biến nhất)
    SELECT email INTO v_email 
    FROM auth.users 
    WHERE email = p_login_identifier;

    -- Ưu tiên 2: Nếu chưa tìm thấy, thử tìm theo Username lưu trong metadata
    IF v_email IS NULL THEN
        SELECT email INTO v_email 
        FROM auth.users 
        WHERE raw_user_meta_data->>'username' = p_login_identifier;
    END IF;

    -- Ưu tiên 3: Nếu vẫn chưa thấy, thử tìm theo Số điện thoại (Phone)
    IF v_email IS NULL THEN
        SELECT email INTO v_email 
        FROM auth.users 
        WHERE phone = p_login_identifier 
           OR raw_user_meta_data->>'phone' = p_login_identifier;
    END IF;

    -- Trả về email tìm được (nếu không thấy sẽ trả về NULL)
    RETURN v_email;
END;
$$;


--
-- Name: remove_specific_user_role(text, text); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.remove_specific_user_role(p_email text, p_role_code text) RETURNS jsonb
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_user_id uuid;
    v_role_id uuid;
    v_new_permissions jsonb;
    v_next_role_code text;
BEGIN
    -- 1. Lấy User ID từ email
    SELECT id INTO v_user_id FROM auth.users WHERE email = p_email;
    IF v_user_id IS NULL THEN
        RETURN jsonb_build_object('status', 'error', 'message', 'Không tìm thấy người dùng');
    END IF;

    -- 2. Lấy Role ID từ code
    SELECT id INTO v_role_id FROM public.roles WHERE code = p_role_code;
    IF v_role_id IS NULL THEN
        RETURN jsonb_build_object('status', 'error', 'message', 'Mã Role không tồn tại');
    END IF;

    -- 3. Xóa bản ghi trong bảng user_roles
    DELETE FROM public.user_roles 
    WHERE user_id = v_user_id AND role_id = v_role_id;

    -- 4. Tính toán lại danh sách permissions còn lại
    SELECT COALESCE(jsonb_agg(DISTINCT p.code), '[]'::jsonb)
    INTO v_new_permissions
    FROM public.user_roles ur
    JOIN public.role_permissions rp ON ur.role_id = rp.role_id
    JOIN public.permissions p ON rp.permission_id = p.id
    WHERE ur.user_id = v_user_id;

    -- 5. Lấy một mã Role bất kỳ còn lại (nếu còn) để cập nhật vào metadata
    SELECT r.code INTO v_next_role_code
    FROM public.user_roles ur
    JOIN public.roles r ON ur.role_id = r.id
    WHERE ur.user_id = v_user_id
    LIMIT 1;

    -- 6. Cập nhật Metadata
    IF v_next_role_code IS NULL THEN
        -- Nếu không còn Role nào, xóa sạch role và permissions
        UPDATE auth.users 
        SET raw_app_meta_data = (raw_app_meta_data - 'role') - 'permissions'
        WHERE id = v_user_id;
    ELSE
        -- Cập nhật Role mới và danh sách Permissions mới
        UPDATE auth.users 
        SET raw_app_meta_data = raw_app_meta_data || 
            jsonb_build_object(
                'role', v_next_role_code,
                'permissions', v_new_permissions
            )
        WHERE id = v_user_id;
    END IF;

    RETURN jsonb_build_object(
        'status', 'success', 
        'message', 'Đã cập nhật lại Role và Permissions cho ' || p_email,
        'current_role', v_next_role_code,
        'permissions', v_new_permissions
    );

EXCEPTION WHEN OTHERS THEN
    RETURN jsonb_build_object('status', 'error', 'message', SQLERRM);
END;
$$;


--
-- Name: rls_auto_enable(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.rls_auto_enable() RETURNS event_trigger
    LANGUAGE plpgsql SECURITY DEFINER
    SET search_path TO 'pg_catalog'
    AS $$
DECLARE
  cmd record;
BEGIN
  FOR cmd IN
    SELECT *
    FROM pg_event_trigger_ddl_commands()
    WHERE command_tag IN ('CREATE TABLE', 'CREATE TABLE AS', 'SELECT INTO')
      AND object_type IN ('table','partitioned table')
  LOOP
     IF cmd.schema_name IS NOT NULL AND cmd.schema_name IN ('public') AND cmd.schema_name NOT IN ('pg_catalog','information_schema') AND cmd.schema_name NOT LIKE 'pg_toast%' AND cmd.schema_name NOT LIKE 'pg_temp%' THEN
      BEGIN
        EXECUTE format('alter table if exists %s enable row level security', cmd.object_identity);
        RAISE LOG 'rls_auto_enable: enabled RLS on %', cmd.object_identity;
      EXCEPTION
        WHEN OTHERS THEN
          RAISE LOG 'rls_auto_enable: failed to enable RLS on %', cmd.object_identity;
      END;
     ELSE
        RAISE LOG 'rls_auto_enable: skip % (either system schema or not in enforced list: %.)', cmd.object_identity, cmd.schema_name;
     END IF;
  END LOOP;
END;
$$;


--
-- Name: map_points; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map_points (
    createdtime bigint,
    lastupdatetime bigint,
    sortorder bigint,
    creatorid bigint,
    site bigint,
    type text,
    mapgroupid text,
    title text,
    mapcategoryids text[],
    mappointtypeid text,
    properties jsonb,
    address text,
    hotline text,
    location jsonb,
    status integer,
    logo text,
    images jsonb,
    reviewscore numeric,
    suggesttitle text,
    lastupdateuserid bigint,
    reviewcount integer,
    totalreviewscore bigint,
    videos text[],
    mapcoupontypeid text,
    type1 character varying(255),
    geo_location public.geography(Point,4326),
    _id uuid DEFAULT gen_random_uuid() NOT NULL,
    province_id uuid,
    ward_id uuid,
    location_type character varying(50),
    merchant_id uuid,
    department_id uuid
);


--
-- Name: COLUMN map_points.province_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_points.province_id IS 'ID của Tỉnh/Thành phố';


--
-- Name: COLUMN map_points.ward_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_points.ward_id IS 'ID của Phường/Xã';


--
-- Name: COLUMN map_points.location_type; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_points.location_type IS 'Loại địa điểm (Phân loại nghiệp vụ)';


--
-- Name: search_nearby_locations(double precision, double precision, integer); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.search_nearby_locations(lat double precision, long double precision, radius_meters integer) RETURNS SETOF public.map_points
    LANGUAGE sql
    AS $$
  select *
  from map_points
  where 
    -- Dùng cột mới 'geo_location' để tính toán trực tiếp (Cực nhanh nhờ Index)
    geo_location is not null
    and ST_DWithin(
      geo_location, 
      ST_SetSRID(ST_MakePoint(long, lat), 4326)::geography,
      radius_meters
    );
$$;


--
-- Name: sync_permissions_to_metadata(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_permissions_to_metadata() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$DECLARE
    _permissions jsonb;
BEGIN
    -- 1. Lấy danh sách quyền mới nhất dựa trên Role Code trong metadata
    SELECT COALESCE(jsonb_agg(p.code), '[]'::jsonb)
    INTO _permissions
    FROM public.permissions p
    JOIN public.role_permissions rp ON p.id = rp.permission_id
    JOIN public.roles r ON rp.role_id = r.id
    WHERE r.code = (NEW.raw_app_meta_data->>'role');

    -- 2. Chỉ cập nhật nếu Role tồn tại
    IF (NEW.raw_app_meta_data->>'role') IS NOT NULL THEN
        NEW.raw_app_meta_data := NEW.raw_app_meta_data || 
                                 jsonb_build_object('permissions', _permissions);
    END IF;

    RETURN NEW;
END;$$;


--
-- Name: sync_user_permissions_to_auth(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.sync_user_permissions_to_auth() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
  UPDATE auth.users
  SET raw_app_meta_data = jsonb_set(
    COALESCE(raw_app_meta_data, '{}'::jsonb),
    '{permissions}',
    public.get_user_permissions(new.user_id)
  )
  WHERE id = new.user_id;
  
  RETURN new;
END;
$$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    new.updated_at = now();
    return new;
end;
$$;


--
-- Name: uuid_generate_v7(); Type: FUNCTION; Schema: public; Owner: -
--

CREATE FUNCTION public.uuid_generate_v7() RETURNS uuid
    LANGUAGE plpgsql
    AS $$
DECLARE
  timestamp    timestamptz;
  microseconds int8;
BEGIN
  timestamp    := clock_timestamp();
  microseconds := (extract(epoch from timestamp) * 1000)::int8;
  RETURN encode(
    set_bit(
      set_bit(
        overlay(uuid_send(gen_random_uuid()) placing substring(decode(lpad(to_hex(microseconds), 12, '0'), 'hex') from 1) from 1 for 6),
        52, 1
      ),
      53, 1
    ),
    'hex')::uuid;
END;
$$;


--
-- Name: add_prefixes(text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.add_prefixes(_bucket_id text, _name text) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    prefixes text[];
BEGIN
    prefixes := "storage"."get_prefixes"("_name");

    IF array_length(prefixes, 1) > 0 THEN
        INSERT INTO storage.prefixes (name, bucket_id)
        SELECT UNNEST(prefixes) as name, "_bucket_id" ON CONFLICT DO NOTHING;
    END IF;
END;
$$;


--
-- Name: can_insert_object(text, text, uuid, jsonb); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.can_insert_object(bucketid text, name text, owner uuid, metadata jsonb) RETURNS void
    LANGUAGE plpgsql
    AS $$
BEGIN
  INSERT INTO "storage"."objects" ("bucket_id", "name", "owner", "metadata") VALUES (bucketid, name, owner, metadata);
  -- hack to rollback the successful insert
  RAISE sqlstate 'PT200' using
  message = 'ROLLBACK',
  detail = 'rollback successful insert';
END
$$;


--
-- Name: delete_leaf_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.delete_leaf_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_rows_deleted integer;
BEGIN
    LOOP
        WITH candidates AS (
            SELECT DISTINCT
                t.bucket_id,
                unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        ),
        uniq AS (
             SELECT
                 bucket_id,
                 name,
                 storage.get_level(name) AS level
             FROM candidates
             WHERE name <> ''
             GROUP BY bucket_id, name
        ),
        leaf AS (
             SELECT
                 p.bucket_id,
                 p.name,
                 p.level
             FROM storage.prefixes AS p
                  JOIN uniq AS u
                       ON u.bucket_id = p.bucket_id
                           AND u.name = p.name
                           AND u.level = p.level
             WHERE NOT EXISTS (
                 SELECT 1
                 FROM storage.objects AS o
                 WHERE o.bucket_id = p.bucket_id
                   AND o.level = p.level + 1
                   AND o.name COLLATE "C" LIKE p.name || '/%'
             )
             AND NOT EXISTS (
                 SELECT 1
                 FROM storage.prefixes AS c
                 WHERE c.bucket_id = p.bucket_id
                   AND c.level = p.level + 1
                   AND c.name COLLATE "C" LIKE p.name || '/%'
             )
        )
        DELETE
        FROM storage.prefixes AS p
            USING leaf AS l
        WHERE p.bucket_id = l.bucket_id
          AND p.name = l.name
          AND p.level = l.level;

        GET DIAGNOSTICS v_rows_deleted = ROW_COUNT;
        EXIT WHEN v_rows_deleted = 0;
    END LOOP;
END;
$$;


--
-- Name: delete_prefix(text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.delete_prefix(_bucket_id text, _name text) RETURNS boolean
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
BEGIN
    -- Check if we can delete the prefix
    IF EXISTS(
        SELECT FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name") + 1
          AND "prefixes"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    )
    OR EXISTS(
        SELECT FROM "storage"."objects"
        WHERE "objects"."bucket_id" = "_bucket_id"
          AND "storage"."get_level"("objects"."name") = "storage"."get_level"("_name") + 1
          AND "objects"."name" COLLATE "C" LIKE "_name" || '/%'
        LIMIT 1
    ) THEN
    -- There are sub-objects, skip deletion
    RETURN false;
    ELSE
        DELETE FROM "storage"."prefixes"
        WHERE "prefixes"."bucket_id" = "_bucket_id"
          AND level = "storage"."get_level"("_name")
          AND "prefixes"."name" = "_name";
        RETURN true;
    END IF;
END;
$$;


--
-- Name: delete_prefix_hierarchy_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.delete_prefix_hierarchy_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    prefix text;
BEGIN
    prefix := "storage"."get_prefix"(OLD."name");

    IF coalesce(prefix, '') != '' THEN
        PERFORM "storage"."delete_prefix"(OLD."bucket_id", prefix);
    END IF;

    RETURN OLD;
END;
$$;


--
-- Name: enforce_bucket_name_length(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.enforce_bucket_name_length() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
begin
    if length(new.name) > 100 then
        raise exception 'bucket name "%" is too long (% characters). Max is 100.', new.name, length(new.name);
    end if;
    return new;
end;
$$;


--
-- Name: extension(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.extension(name text) RETURNS text
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
    _filename text;
BEGIN
    SELECT string_to_array(name, '/') INTO _parts;
    SELECT _parts[array_length(_parts,1)] INTO _filename;
    RETURN reverse(split_part(reverse(_filename), '.', 1));
END
$$;


--
-- Name: filename(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.filename(name text) RETURNS text
    LANGUAGE plpgsql
    AS $$
DECLARE
_parts text[];
BEGIN
	select string_to_array(name, '/') into _parts;
	return _parts[array_length(_parts,1)];
END
$$;


--
-- Name: foldername(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.foldername(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE
    AS $$
DECLARE
    _parts text[];
BEGIN
    -- Split on "/" to get path segments
    SELECT string_to_array(name, '/') INTO _parts;
    -- Return everything except the last segment
    RETURN _parts[1 : array_length(_parts,1) - 1];
END
$$;


--
-- Name: get_level(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_level(name text) RETURNS integer
    LANGUAGE sql IMMUTABLE STRICT
    AS $$
SELECT array_length(string_to_array("name", '/'), 1);
$$;


--
-- Name: get_prefix(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_prefix(name text) RETURNS text
    LANGUAGE sql IMMUTABLE STRICT
    AS $_$
SELECT
    CASE WHEN strpos("name", '/') > 0 THEN
             regexp_replace("name", '[\/]{1}[^\/]+\/?$', '')
         ELSE
             ''
        END;
$_$;


--
-- Name: get_prefixes(text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_prefixes(name text) RETURNS text[]
    LANGUAGE plpgsql IMMUTABLE STRICT
    AS $$
DECLARE
    parts text[];
    prefixes text[];
    prefix text;
BEGIN
    -- Split the name into parts by '/'
    parts := string_to_array("name", '/');
    prefixes := '{}';

    -- Construct the prefixes, stopping one level below the last part
    FOR i IN 1..array_length(parts, 1) - 1 LOOP
            prefix := array_to_string(parts[1:i], '/');
            prefixes := array_append(prefixes, prefix);
    END LOOP;

    RETURN prefixes;
END;
$$;


--
-- Name: get_size_by_bucket(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.get_size_by_bucket() RETURNS TABLE(size bigint, bucket_id text)
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    return query
        select sum((metadata->>'size')::bigint) as size, obj.bucket_id
        from "storage".objects as obj
        group by obj.bucket_id;
END
$$;


--
-- Name: list_multipart_uploads_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_multipart_uploads_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, next_key_token text DEFAULT ''::text, next_upload_token text DEFAULT ''::text) RETURNS TABLE(key text, id text, created_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(key COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                        substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1)))
                    ELSE
                        key
                END AS key, id, created_at
            FROM
                storage.s3_multipart_uploads
            WHERE
                bucket_id = $5 AND
                key ILIKE $1 || ''%'' AND
                CASE
                    WHEN $4 != '''' AND $6 = '''' THEN
                        CASE
                            WHEN position($2 IN substring(key from length($1) + 1)) > 0 THEN
                                substring(key from 1 for length($1) + position($2 IN substring(key from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                key COLLATE "C" > $4
                            END
                    ELSE
                        true
                END AND
                CASE
                    WHEN $6 != '''' THEN
                        id COLLATE "C" > $6
                    ELSE
                        true
                    END
            ORDER BY
                key COLLATE "C" ASC, created_at ASC) as e order by key COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_key_token, bucket_id, next_upload_token;
END;
$_$;


--
-- Name: list_objects_with_delimiter(text, text, text, integer, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.list_objects_with_delimiter(bucket_id text, prefix_param text, delimiter_param text, max_keys integer DEFAULT 100, start_after text DEFAULT ''::text, next_token text DEFAULT ''::text) RETURNS TABLE(name text, id uuid, metadata jsonb, updated_at timestamp with time zone)
    LANGUAGE plpgsql
    AS $_$
BEGIN
    RETURN QUERY EXECUTE
        'SELECT DISTINCT ON(name COLLATE "C") * from (
            SELECT
                CASE
                    WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                        substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1)))
                    ELSE
                        name
                END AS name, id, metadata, updated_at
            FROM
                storage.objects
            WHERE
                bucket_id = $5 AND
                name ILIKE $1 || ''%'' AND
                CASE
                    WHEN $6 != '''' THEN
                    name COLLATE "C" > $6
                ELSE true END
                AND CASE
                    WHEN $4 != '''' THEN
                        CASE
                            WHEN position($2 IN substring(name from length($1) + 1)) > 0 THEN
                                substring(name from 1 for length($1) + position($2 IN substring(name from length($1) + 1))) COLLATE "C" > $4
                            ELSE
                                name COLLATE "C" > $4
                            END
                    ELSE
                        true
                END
            ORDER BY
                name COLLATE "C" ASC) as e order by name COLLATE "C" LIMIT $3'
        USING prefix_param, delimiter_param, max_keys, next_token, bucket_id, start_after;
END;
$_$;


--
-- Name: lock_top_prefixes(text[], text[]); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.lock_top_prefixes(bucket_ids text[], names text[]) RETURNS void
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket text;
    v_top text;
BEGIN
    FOR v_bucket, v_top IN
        SELECT DISTINCT t.bucket_id,
            split_part(t.name, '/', 1) AS top
        FROM unnest(bucket_ids, names) AS t(bucket_id, name)
        WHERE t.name <> ''
        ORDER BY 1, 2
        LOOP
            PERFORM pg_advisory_xact_lock(hashtextextended(v_bucket || '/' || v_top, 0));
        END LOOP;
END;
$$;


--
-- Name: objects_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


--
-- Name: objects_insert_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_insert_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    NEW.level := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- Name: objects_update_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_update_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    -- NEW - OLD (destinations to create prefixes for)
    v_add_bucket_ids text[];
    v_add_names      text[];

    -- OLD - NEW (sources to prune)
    v_src_bucket_ids text[];
    v_src_names      text[];
BEGIN
    IF TG_OP <> 'UPDATE' THEN
        RETURN NULL;
    END IF;

    -- 1) Compute NEW−OLD (added paths) and OLD−NEW (moved-away paths)
    WITH added AS (
        SELECT n.bucket_id, n.name
        FROM new_rows n
        WHERE n.name <> '' AND position('/' in n.name) > 0
        EXCEPT
        SELECT o.bucket_id, o.name FROM old_rows o WHERE o.name <> ''
    ),
    moved AS (
         SELECT o.bucket_id, o.name
         FROM old_rows o
         WHERE o.name <> ''
         EXCEPT
         SELECT n.bucket_id, n.name FROM new_rows n WHERE n.name <> ''
    )
    SELECT
        -- arrays for ADDED (dest) in stable order
        COALESCE( (SELECT array_agg(a.bucket_id ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        COALESCE( (SELECT array_agg(a.name      ORDER BY a.bucket_id, a.name) FROM added a), '{}' ),
        -- arrays for MOVED (src) in stable order
        COALESCE( (SELECT array_agg(m.bucket_id ORDER BY m.bucket_id, m.name) FROM moved m), '{}' ),
        COALESCE( (SELECT array_agg(m.name      ORDER BY m.bucket_id, m.name) FROM moved m), '{}' )
    INTO v_add_bucket_ids, v_add_names, v_src_bucket_ids, v_src_names;

    -- Nothing to do?
    IF (array_length(v_add_bucket_ids, 1) IS NULL) AND (array_length(v_src_bucket_ids, 1) IS NULL) THEN
        RETURN NULL;
    END IF;

    -- 2) Take per-(bucket, top) locks: ALL prefixes in consistent global order to prevent deadlocks
    DECLARE
        v_all_bucket_ids text[];
        v_all_names text[];
    BEGIN
        -- Combine source and destination arrays for consistent lock ordering
        v_all_bucket_ids := COALESCE(v_src_bucket_ids, '{}') || COALESCE(v_add_bucket_ids, '{}');
        v_all_names := COALESCE(v_src_names, '{}') || COALESCE(v_add_names, '{}');

        -- Single lock call ensures consistent global ordering across all transactions
        IF array_length(v_all_bucket_ids, 1) IS NOT NULL THEN
            PERFORM storage.lock_top_prefixes(v_all_bucket_ids, v_all_names);
        END IF;
    END;

    -- 3) Create destination prefixes (NEW−OLD) BEFORE pruning sources
    IF array_length(v_add_bucket_ids, 1) IS NOT NULL THEN
        WITH candidates AS (
            SELECT DISTINCT t.bucket_id, unnest(storage.get_prefixes(t.name)) AS name
            FROM unnest(v_add_bucket_ids, v_add_names) AS t(bucket_id, name)
            WHERE name <> ''
        )
        INSERT INTO storage.prefixes (bucket_id, name)
        SELECT c.bucket_id, c.name
        FROM candidates c
        ON CONFLICT DO NOTHING;
    END IF;

    -- 4) Prune source prefixes bottom-up for OLD−NEW
    IF array_length(v_src_bucket_ids, 1) IS NOT NULL THEN
        -- re-entrancy guard so DELETE on prefixes won't recurse
        IF current_setting('storage.gc.prefixes', true) <> '1' THEN
            PERFORM set_config('storage.gc.prefixes', '1', true);
        END IF;

        PERFORM storage.delete_leaf_prefixes(v_src_bucket_ids, v_src_names);
    END IF;

    RETURN NULL;
END;
$$;


--
-- Name: objects_update_level_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_update_level_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Set the new level
        NEW."level" := "storage"."get_level"(NEW."name");
    END IF;
    RETURN NEW;
END;
$$;


--
-- Name: objects_update_prefix_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.objects_update_prefix_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
DECLARE
    old_prefixes TEXT[];
BEGIN
    -- Ensure this is an update operation and the name has changed
    IF TG_OP = 'UPDATE' AND (NEW."name" <> OLD."name" OR NEW."bucket_id" <> OLD."bucket_id") THEN
        -- Retrieve old prefixes
        old_prefixes := "storage"."get_prefixes"(OLD."name");

        -- Remove old prefixes that are only used by this object
        WITH all_prefixes as (
            SELECT unnest(old_prefixes) as prefix
        ),
        can_delete_prefixes as (
             SELECT prefix
             FROM all_prefixes
             WHERE NOT EXISTS (
                 SELECT 1 FROM "storage"."objects"
                 WHERE "bucket_id" = OLD."bucket_id"
                   AND "name" <> OLD."name"
                   AND "name" LIKE (prefix || '%')
             )
         )
        DELETE FROM "storage"."prefixes" WHERE name IN (SELECT prefix FROM can_delete_prefixes);

        -- Add new prefixes
        PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    END IF;
    -- Set the new level
    NEW."level" := "storage"."get_level"(NEW."name");

    RETURN NEW;
END;
$$;


--
-- Name: operation(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.operation() RETURNS text
    LANGUAGE plpgsql STABLE
    AS $$
BEGIN
    RETURN current_setting('storage.operation', true);
END;
$$;


--
-- Name: prefixes_delete_cleanup(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.prefixes_delete_cleanup() RETURNS trigger
    LANGUAGE plpgsql SECURITY DEFINER
    AS $$
DECLARE
    v_bucket_ids text[];
    v_names      text[];
BEGIN
    IF current_setting('storage.gc.prefixes', true) = '1' THEN
        RETURN NULL;
    END IF;

    PERFORM set_config('storage.gc.prefixes', '1', true);

    SELECT COALESCE(array_agg(d.bucket_id), '{}'),
           COALESCE(array_agg(d.name), '{}')
    INTO v_bucket_ids, v_names
    FROM deleted AS d
    WHERE d.name <> '';

    PERFORM storage.lock_top_prefixes(v_bucket_ids, v_names);
    PERFORM storage.delete_leaf_prefixes(v_bucket_ids, v_names);

    RETURN NULL;
END;
$$;


--
-- Name: prefixes_insert_trigger(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.prefixes_insert_trigger() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    PERFORM "storage"."add_prefixes"(NEW."bucket_id", NEW."name");
    RETURN NEW;
END;
$$;


--
-- Name: search(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql
    AS $$
declare
    can_bypass_rls BOOLEAN;
begin
    SELECT rolbypassrls
    INTO can_bypass_rls
    FROM pg_roles
    WHERE rolname = coalesce(nullif(current_setting('role', true), 'none'), current_user);

    IF can_bypass_rls THEN
        RETURN QUERY SELECT * FROM storage.search_v1_optimised(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    ELSE
        RETURN QUERY SELECT * FROM storage.search_legacy_v1(prefix, bucketname, limits, levels, offsets, search, sortcolumn, sortorder);
    END IF;
end;
$$;


--
-- Name: search_legacy_v1(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_legacy_v1(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select path_tokens[$1] as folder
           from storage.objects
             where objects.name ilike $2 || $3 || ''%''
               and bucket_id = $4
               and array_length(objects.path_tokens, 1) <> $1
           group by folder
           order by folder ' || v_sort_order || '
     )
     (select folder as "name",
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[$1] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where objects.name ilike $2 || $3 || ''%''
       and bucket_id = $4
       and array_length(objects.path_tokens, 1) = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- Name: search_v1_optimised(text, text, integer, integer, integer, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v1_optimised(prefix text, bucketname text, limits integer DEFAULT 100, levels integer DEFAULT 1, offsets integer DEFAULT 0, search text DEFAULT ''::text, sortcolumn text DEFAULT 'name'::text, sortorder text DEFAULT 'asc'::text) RETURNS TABLE(name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
declare
    v_order_by text;
    v_sort_order text;
begin
    case
        when sortcolumn = 'name' then
            v_order_by = 'name';
        when sortcolumn = 'updated_at' then
            v_order_by = 'updated_at';
        when sortcolumn = 'created_at' then
            v_order_by = 'created_at';
        when sortcolumn = 'last_accessed_at' then
            v_order_by = 'last_accessed_at';
        else
            v_order_by = 'name';
        end case;

    case
        when sortorder = 'asc' then
            v_sort_order = 'asc';
        when sortorder = 'desc' then
            v_sort_order = 'desc';
        else
            v_sort_order = 'asc';
        end case;

    v_order_by = v_order_by || ' ' || v_sort_order;

    return query execute
        'with folders as (
           select (string_to_array(name, ''/''))[level] as name
           from storage.prefixes
             where lower(prefixes.name) like lower($2 || $3) || ''%''
               and bucket_id = $4
               and level = $1
           order by name ' || v_sort_order || '
     )
     (select name,
            null as id,
            null as updated_at,
            null as created_at,
            null as last_accessed_at,
            null as metadata from folders)
     union all
     (select path_tokens[level] as "name",
            id,
            updated_at,
            created_at,
            last_accessed_at,
            metadata
     from storage.objects
     where lower(objects.name) like lower($2 || $3) || ''%''
       and bucket_id = $4
       and level = $1
     order by ' || v_order_by || ')
     limit $5
     offset $6' using levels, prefix, search, bucketname, limits, offsets;
end;
$_$;


--
-- Name: search_v2(text, text, integer, integer, text, text, text, text); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.search_v2(prefix text, bucket_name text, limits integer DEFAULT 100, levels integer DEFAULT 1, start_after text DEFAULT ''::text, sort_order text DEFAULT 'asc'::text, sort_column text DEFAULT 'name'::text, sort_column_after text DEFAULT ''::text) RETURNS TABLE(key text, name text, id uuid, updated_at timestamp with time zone, created_at timestamp with time zone, last_accessed_at timestamp with time zone, metadata jsonb)
    LANGUAGE plpgsql STABLE
    AS $_$
DECLARE
    sort_col text;
    sort_ord text;
    cursor_op text;
    cursor_expr text;
    sort_expr text;
BEGIN
    -- Validate sort_order
    sort_ord := lower(sort_order);
    IF sort_ord NOT IN ('asc', 'desc') THEN
        sort_ord := 'asc';
    END IF;

    -- Determine cursor comparison operator
    IF sort_ord = 'asc' THEN
        cursor_op := '>';
    ELSE
        cursor_op := '<';
    END IF;
    
    sort_col := lower(sort_column);
    -- Validate sort column  
    IF sort_col IN ('updated_at', 'created_at') THEN
        cursor_expr := format(
            '($5 = '''' OR ROW(date_trunc(''milliseconds'', %I), name COLLATE "C") %s ROW(COALESCE(NULLIF($6, '''')::timestamptz, ''epoch''::timestamptz), $5))',
            sort_col, cursor_op
        );
        sort_expr := format(
            'COALESCE(date_trunc(''milliseconds'', %I), ''epoch''::timestamptz) %s, name COLLATE "C" %s',
            sort_col, sort_ord, sort_ord
        );
    ELSE
        cursor_expr := format('($5 = '''' OR name COLLATE "C" %s $5)', cursor_op);
        sort_expr := format('name COLLATE "C" %s', sort_ord);
    END IF;

    RETURN QUERY EXECUTE format(
        $sql$
        SELECT * FROM (
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    NULL::uuid AS id,
                    updated_at,
                    created_at,
                    NULL::timestamptz AS last_accessed_at,
                    NULL::jsonb AS metadata
                FROM storage.prefixes
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
            UNION ALL
            (
                SELECT
                    split_part(name, '/', $4) AS key,
                    name,
                    id,
                    updated_at,
                    created_at,
                    last_accessed_at,
                    metadata
                FROM storage.objects
                WHERE name COLLATE "C" LIKE $1 || '%%'
                    AND bucket_id = $2
                    AND level = $4
                    AND %s
                ORDER BY %s
                LIMIT $3
            )
        ) obj
        ORDER BY %s
        LIMIT $3
        $sql$,
        cursor_expr,    -- prefixes WHERE
        sort_expr,      -- prefixes ORDER BY
        cursor_expr,    -- objects WHERE
        sort_expr,      -- objects ORDER BY
        sort_expr       -- final ORDER BY
    )
    USING prefix, bucket_name, limits, levels, start_after, sort_column_after;
END;
$_$;


--
-- Name: update_updated_at_column(); Type: FUNCTION; Schema: storage; Owner: -
--

CREATE FUNCTION storage.update_updated_at_column() RETURNS trigger
    LANGUAGE plpgsql
    AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW; 
END;
$$;


--
-- Name: audit_log_entries; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.audit_log_entries (
    instance_id uuid,
    id uuid NOT NULL,
    payload json,
    created_at timestamp with time zone,
    ip_address character varying(64) DEFAULT ''::character varying NOT NULL
);


--
-- Name: TABLE audit_log_entries; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.audit_log_entries IS 'Auth: Audit trail for user actions.';


--
-- Name: flow_state; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.flow_state (
    id uuid NOT NULL,
    user_id uuid,
    auth_code text NOT NULL,
    code_challenge_method auth.code_challenge_method NOT NULL,
    code_challenge text NOT NULL,
    provider_type text NOT NULL,
    provider_access_token text,
    provider_refresh_token text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    authentication_method text NOT NULL,
    auth_code_issued_at timestamp with time zone
);


--
-- Name: TABLE flow_state; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.flow_state IS 'stores metadata for pkce logins';


--
-- Name: identities; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.identities (
    provider_id text NOT NULL,
    user_id uuid NOT NULL,
    identity_data jsonb NOT NULL,
    provider text NOT NULL,
    last_sign_in_at timestamp with time zone,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    email text GENERATED ALWAYS AS (lower((identity_data ->> 'email'::text))) STORED,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: TABLE identities; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.identities IS 'Auth: Stores identities associated to a user.';


--
-- Name: COLUMN identities.email; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.identities.email IS 'Auth: Email is a generated column that references the optional email property in the identity_data';


--
-- Name: instances; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.instances (
    id uuid NOT NULL,
    uuid uuid,
    raw_base_config text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


--
-- Name: TABLE instances; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.instances IS 'Auth: Manages users across multiple sites.';


--
-- Name: mfa_amr_claims; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_amr_claims (
    session_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    authentication_method text NOT NULL,
    id uuid NOT NULL
);


--
-- Name: TABLE mfa_amr_claims; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_amr_claims IS 'auth: stores authenticator method reference claims for multi factor authentication';


--
-- Name: mfa_challenges; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_challenges (
    id uuid NOT NULL,
    factor_id uuid NOT NULL,
    created_at timestamp with time zone NOT NULL,
    verified_at timestamp with time zone,
    ip_address inet NOT NULL,
    otp_code text,
    web_authn_session_data jsonb
);


--
-- Name: TABLE mfa_challenges; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_challenges IS 'auth: stores metadata about challenge requests made';


--
-- Name: mfa_factors; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.mfa_factors (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    friendly_name text,
    factor_type auth.factor_type NOT NULL,
    status auth.factor_status NOT NULL,
    created_at timestamp with time zone NOT NULL,
    updated_at timestamp with time zone NOT NULL,
    secret text,
    phone text,
    last_challenged_at timestamp with time zone,
    web_authn_credential jsonb,
    web_authn_aaguid uuid,
    last_webauthn_challenge_data jsonb
);


--
-- Name: TABLE mfa_factors; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.mfa_factors IS 'auth: stores metadata about factors';


--
-- Name: COLUMN mfa_factors.last_webauthn_challenge_data; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.mfa_factors.last_webauthn_challenge_data IS 'Stores the latest WebAuthn challenge data including attestation/assertion for customer verification';


--
-- Name: oauth_authorizations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_authorizations (
    id uuid NOT NULL,
    authorization_id text NOT NULL,
    client_id uuid NOT NULL,
    user_id uuid,
    redirect_uri text NOT NULL,
    scope text NOT NULL,
    state text,
    resource text,
    code_challenge text,
    code_challenge_method auth.code_challenge_method,
    response_type auth.oauth_response_type DEFAULT 'code'::auth.oauth_response_type NOT NULL,
    status auth.oauth_authorization_status DEFAULT 'pending'::auth.oauth_authorization_status NOT NULL,
    authorization_code text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    expires_at timestamp with time zone DEFAULT (now() + '00:03:00'::interval) NOT NULL,
    approved_at timestamp with time zone,
    nonce text,
    CONSTRAINT oauth_authorizations_authorization_code_length CHECK ((char_length(authorization_code) <= 255)),
    CONSTRAINT oauth_authorizations_code_challenge_length CHECK ((char_length(code_challenge) <= 128)),
    CONSTRAINT oauth_authorizations_expires_at_future CHECK ((expires_at > created_at)),
    CONSTRAINT oauth_authorizations_nonce_length CHECK ((char_length(nonce) <= 255)),
    CONSTRAINT oauth_authorizations_redirect_uri_length CHECK ((char_length(redirect_uri) <= 2048)),
    CONSTRAINT oauth_authorizations_resource_length CHECK ((char_length(resource) <= 2048)),
    CONSTRAINT oauth_authorizations_scope_length CHECK ((char_length(scope) <= 4096)),
    CONSTRAINT oauth_authorizations_state_length CHECK ((char_length(state) <= 4096))
);


--
-- Name: oauth_client_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_client_states (
    id uuid NOT NULL,
    provider_type text NOT NULL,
    code_verifier text,
    created_at timestamp with time zone NOT NULL
);


--
-- Name: TABLE oauth_client_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.oauth_client_states IS 'Stores OAuth states for third-party provider authentication flows where Supabase acts as the OAuth client.';


--
-- Name: oauth_clients; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_clients (
    id uuid NOT NULL,
    client_secret_hash text,
    registration_type auth.oauth_registration_type NOT NULL,
    redirect_uris text NOT NULL,
    grant_types text NOT NULL,
    client_name text,
    client_uri text,
    logo_uri text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    deleted_at timestamp with time zone,
    client_type auth.oauth_client_type DEFAULT 'confidential'::auth.oauth_client_type NOT NULL,
    CONSTRAINT oauth_clients_client_name_length CHECK ((char_length(client_name) <= 1024)),
    CONSTRAINT oauth_clients_client_uri_length CHECK ((char_length(client_uri) <= 2048)),
    CONSTRAINT oauth_clients_logo_uri_length CHECK ((char_length(logo_uri) <= 2048))
);


--
-- Name: oauth_consents; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.oauth_consents (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    client_id uuid NOT NULL,
    scopes text NOT NULL,
    granted_at timestamp with time zone DEFAULT now() NOT NULL,
    revoked_at timestamp with time zone,
    CONSTRAINT oauth_consents_revoked_after_granted CHECK (((revoked_at IS NULL) OR (revoked_at >= granted_at))),
    CONSTRAINT oauth_consents_scopes_length CHECK ((char_length(scopes) <= 2048)),
    CONSTRAINT oauth_consents_scopes_not_empty CHECK ((char_length(TRIM(BOTH FROM scopes)) > 0))
);


--
-- Name: one_time_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.one_time_tokens (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    token_type auth.one_time_token_type NOT NULL,
    token_hash text NOT NULL,
    relates_to text NOT NULL,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT one_time_tokens_token_hash_check CHECK ((char_length(token_hash) > 0))
);


--
-- Name: refresh_tokens; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.refresh_tokens (
    instance_id uuid,
    id bigint NOT NULL,
    token character varying(255),
    user_id character varying(255),
    revoked boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    parent character varying(255),
    session_id uuid
);


--
-- Name: TABLE refresh_tokens; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.refresh_tokens IS 'Auth: Store of tokens used to refresh JWT tokens once they expire.';


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE; Schema: auth; Owner: -
--

CREATE SEQUENCE auth.refresh_tokens_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: refresh_tokens_id_seq; Type: SEQUENCE OWNED BY; Schema: auth; Owner: -
--

ALTER SEQUENCE auth.refresh_tokens_id_seq OWNED BY auth.refresh_tokens.id;


--
-- Name: saml_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_providers (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    entity_id text NOT NULL,
    metadata_xml text NOT NULL,
    metadata_url text,
    attribute_mapping jsonb,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    name_id_format text,
    CONSTRAINT "entity_id not empty" CHECK ((char_length(entity_id) > 0)),
    CONSTRAINT "metadata_url not empty" CHECK (((metadata_url = NULL::text) OR (char_length(metadata_url) > 0))),
    CONSTRAINT "metadata_xml not empty" CHECK ((char_length(metadata_xml) > 0))
);


--
-- Name: TABLE saml_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_providers IS 'Auth: Manages SAML Identity Provider connections.';


--
-- Name: saml_relay_states; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.saml_relay_states (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    request_id text NOT NULL,
    for_email text,
    redirect_to text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    flow_state_id uuid,
    CONSTRAINT "request_id not empty" CHECK ((char_length(request_id) > 0))
);


--
-- Name: TABLE saml_relay_states; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.saml_relay_states IS 'Auth: Contains SAML Relay State information for each Service Provider initiated login.';


--
-- Name: schema_migrations; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.schema_migrations (
    version character varying(255) NOT NULL
);


--
-- Name: TABLE schema_migrations; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.schema_migrations IS 'Auth: Manages updates to the auth system.';


--
-- Name: sessions; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sessions (
    id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    factor_id uuid,
    aal auth.aal_level,
    not_after timestamp with time zone,
    refreshed_at timestamp without time zone,
    user_agent text,
    ip inet,
    tag text,
    oauth_client_id uuid,
    refresh_token_hmac_key text,
    refresh_token_counter bigint,
    scopes text,
    CONSTRAINT sessions_scopes_length CHECK ((char_length(scopes) <= 4096))
);


--
-- Name: TABLE sessions; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sessions IS 'Auth: Stores session data associated to a user.';


--
-- Name: COLUMN sessions.not_after; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.not_after IS 'Auth: Not after is a nullable column that contains a timestamp after which the session should be regarded as expired.';


--
-- Name: COLUMN sessions.refresh_token_hmac_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.refresh_token_hmac_key IS 'Holds a HMAC-SHA256 key used to sign refresh tokens for this session.';


--
-- Name: COLUMN sessions.refresh_token_counter; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sessions.refresh_token_counter IS 'Holds the ID (counter) of the last issued refresh token.';


--
-- Name: sso_domains; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_domains (
    id uuid NOT NULL,
    sso_provider_id uuid NOT NULL,
    domain text NOT NULL,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    CONSTRAINT "domain not empty" CHECK ((char_length(domain) > 0))
);


--
-- Name: TABLE sso_domains; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_domains IS 'Auth: Manages SSO email address domain mapping to an SSO Identity Provider.';


--
-- Name: sso_providers; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.sso_providers (
    id uuid NOT NULL,
    resource_id text,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    disabled boolean,
    CONSTRAINT "resource_id not empty" CHECK (((resource_id = NULL::text) OR (char_length(resource_id) > 0)))
);


--
-- Name: TABLE sso_providers; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.sso_providers IS 'Auth: Manages SSO identity provider information; see saml_providers for SAML.';


--
-- Name: COLUMN sso_providers.resource_id; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.sso_providers.resource_id IS 'Auth: Uniquely identifies a SSO provider according to a user-chosen resource ID (case insensitive), useful in infrastructure as code.';


--
-- Name: users; Type: TABLE; Schema: auth; Owner: -
--

CREATE TABLE auth.users (
    instance_id uuid,
    id uuid NOT NULL,
    aud character varying(255),
    role character varying(255),
    email character varying(255),
    encrypted_password character varying(255),
    email_confirmed_at timestamp with time zone,
    invited_at timestamp with time zone,
    confirmation_token character varying(255),
    confirmation_sent_at timestamp with time zone,
    recovery_token character varying(255),
    recovery_sent_at timestamp with time zone,
    email_change_token_new character varying(255),
    email_change character varying(255),
    email_change_sent_at timestamp with time zone,
    last_sign_in_at timestamp with time zone,
    raw_app_meta_data jsonb,
    raw_user_meta_data jsonb,
    is_super_admin boolean,
    created_at timestamp with time zone,
    updated_at timestamp with time zone,
    phone text DEFAULT NULL::character varying,
    phone_confirmed_at timestamp with time zone,
    phone_change text DEFAULT ''::character varying,
    phone_change_token character varying(255) DEFAULT ''::character varying,
    phone_change_sent_at timestamp with time zone,
    confirmed_at timestamp with time zone GENERATED ALWAYS AS (LEAST(email_confirmed_at, phone_confirmed_at)) STORED,
    email_change_token_current character varying(255) DEFAULT ''::character varying,
    email_change_confirm_status smallint DEFAULT 0,
    banned_until timestamp with time zone,
    reauthentication_token character varying(255) DEFAULT ''::character varying,
    reauthentication_sent_at timestamp with time zone,
    is_sso_user boolean DEFAULT false NOT NULL,
    deleted_at timestamp with time zone,
    is_anonymous boolean DEFAULT false NOT NULL,
    CONSTRAINT users_email_change_confirm_status_check CHECK (((email_change_confirm_status >= 0) AND (email_change_confirm_status <= 2)))
);


--
-- Name: TABLE users; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON TABLE auth.users IS 'Auth: Stores user login data within a secure schema.';


--
-- Name: COLUMN users.is_sso_user; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON COLUMN auth.users.is_sso_user IS 'Auth: Set this column to true when the account comes from SSO. These accounts can have duplicate emails.';


--
-- Name: activityreport; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.activityreport (
    id integer NOT NULL,
    reportid character varying(36) NOT NULL,
    departmentid character varying(36) NOT NULL,
    reportingyear integer NOT NULL,
    reportingperiod character varying(20),
    inspectioncount integer DEFAULT 0,
    violationcount integer DEFAULT 0,
    totalfineamount numeric(15,2),
    reportdate bigint,
    status smallint DEFAULT 0,
    note text,
    CONSTRAINT activityreport_reportingperiod_check CHECK (((reportingperiod)::text = ANY (ARRAY[('Month'::character varying)::text, ('Quarter'::character varying)::text, ('Year'::character varying)::text])))
);


--
-- Name: COLUMN activityreport.status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.activityreport.status IS '0: Nháp (Draft), 1: Đã gửi (Sent)';


--
-- Name: activityreport_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.activityreport_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: activityreport_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.activityreport_id_seq OWNED BY public.activityreport.id;


--
-- Name: areas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.areas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    name text NOT NULL,
    level character varying(20) NOT NULL,
    "provinceId" uuid,
    "wardId" uuid,
    description text,
    status integer DEFAULT 1,
    createdat timestamp with time zone DEFAULT now(),
    updatedat timestamp with time zone DEFAULT now()
);


--
-- Name: articles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.articles ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.articles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: banks; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.banks (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    name text NOT NULL,
    short_name character varying(100),
    bin character varying(10),
    logo_url text,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.categories (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    name text NOT NULL,
    icon text
);


--
-- Name: category_map_points; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.category_map_points (
    id bigint NOT NULL,
    category_id uuid NOT NULL,
    map_point_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);


--
-- Name: category_map_points_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.category_map_points ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.category_map_points_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: check_in_points; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.check_in_points (
    id text NOT NULL,
    name text NOT NULL,
    lat double precision NOT NULL,
    lng double precision NOT NULL,
    reward jsonb,
    collected boolean DEFAULT false
);


--
-- Name: complaintTimeline; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."complaintTimeline" (
    id integer NOT NULL,
    "complaintId" integer,
    "stepName" character varying(255),
    "logTime" bigint,
    "isCompleted" boolean DEFAULT false,
    "sortOrder" integer
);


--
-- Name: complaintTimeline_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."complaintTimeline_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: complaintTimeline_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."complaintTimeline_id_seq" OWNED BY public."complaintTimeline".id;


--
-- Name: complaintViolationMap; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."complaintViolationMap" (
    "complaintId" integer NOT NULL,
    "violationCategoryId" integer NOT NULL
);


--
-- Name: complaints; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.complaints (
    id integer NOT NULL,
    "userId" integer,
    "mapPointId" uuid,
    description text NOT NULL,
    images text[],
    status smallint DEFAULT 0,
    "qlttResponse" text,
    "qlttResponseTime" bigint,
    "createdTime" bigint,
    "lastUpdateTime" bigint,
    merchant_id uuid,
    province_id uuid,
    ward_id uuid,
    _id uuid,
    complaint_count integer DEFAULT 0
);


--
-- Name: complaint_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.complaint_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: complaint_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.complaint_id_seq OWNED BY public.complaints.id;


--
-- Name: complaint_view; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.complaint_view AS
 SELECT id,
    "userId",
    "mapPointId",
    description,
    images,
    status,
    "qlttResponse",
    "qlttResponseTime",
    "createdTime",
    "lastUpdateTime",
    public.format_relative_time("qlttResponseTime") AS "friendlyResponseTime"
   FROM public.complaints;


--
-- Name: coupons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coupons (
    id integer NOT NULL,
    name text NOT NULL,
    category text,
    discount integer,
    value numeric,
    original_price numeric,
    description text,
    lat double precision,
    lng double precision,
    rating numeric(3,2),
    reviews integer,
    distance double precision,
    expires_in text,
    is_flash_sale boolean DEFAULT false,
    flash_sale_end timestamp with time zone,
    image text,
    tags text[]
);


--
-- Name: coupons_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.coupons_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: coupons_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.coupons_id_seq OWNED BY public.coupons.id;


--
-- Name: department_areas; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.department_areas (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    department_id uuid NOT NULL,
    area_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT department_areas_check CHECK ((updated_at >= created_at))
);


--
-- Name: department_schedules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.department_schedules (
    id bigint NOT NULL,
    department_id bigint,
    day_of_week integer NOT NULL,
    open_time time without time zone NOT NULL,
    close_time time without time zone NOT NULL,
    is_active boolean DEFAULT true,
    CONSTRAINT department_schedules_day_of_week_check CHECK (((day_of_week >= 0) AND (day_of_week <= 6)))
);


--
-- Name: department_schedules_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.department_schedules ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.department_schedules_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: department_users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.department_users (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    department_id uuid NOT NULL,
    user_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT department_users_check CHECK ((updated_at >= created_at))
);


--
-- Name: departmentleader; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.departmentleader (
    id integer NOT NULL,
    leaderid character varying(36) NOT NULL,
    departmentid character varying(36) NOT NULL,
    fullname character varying(100) NOT NULL,
    "position" character varying(50),
    appointmentdate bigint,
    appointmentdecisionnumber character varying(100),
    workstatus smallint DEFAULT 1,
    displayorder integer,
    note text,
    CONSTRAINT departmentleader_position_check CHECK ((("position")::text = ANY (ARRAY[('Director'::character varying)::text, ('Deputy Director'::character varying)::text])))
);


--
-- Name: COLUMN departmentleader.workstatus; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.departmentleader.workstatus IS '1: Đương nhiệm (Incumbent), 0: Đã nghỉ/Miễn nhiệm (Resigned)';


--
-- Name: departmentleader_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.departmentleader_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: departmentleader_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.departmentleader_id_seq OWNED BY public.departmentleader.id;


--
-- Name: district_boundaries; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.district_boundaries (
    id bigint NOT NULL,
    name text NOT NULL,
    polygon public.geometry(Polygon,4326),
    center public.geometry(Point,4326),
    bounds_min public.geometry(Point,4326),
    bounds_max public.geometry(Point,4326),
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: district_boundaries_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.district_boundaries ALTER COLUMN id ADD GENERATED ALWAYS AS IDENTITY (
    SEQUENCE NAME public.district_boundaries_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: heatmap_data; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.heatmap_data (
    id integer NOT NULL,
    lat double precision NOT NULL,
    lng double precision NOT NULL,
    intensity real NOT NULL
);


--
-- Name: heatmap_data_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.heatmap_data_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: heatmap_data_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.heatmap_data_id_seq OWNED BY public.heatmap_data.id;


--
-- Name: kv_store_b36723fe; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kv_store_b36723fe (
    key text NOT NULL,
    value jsonb NOT NULL
);


--
-- Name: kv_store_bb2eb709; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kv_store_bb2eb709 (
    key text NOT NULL,
    value jsonb NOT NULL
);


--
-- Name: kv_store_bbddaf26; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kv_store_bbddaf26 (
    key text NOT NULL,
    value jsonb NOT NULL
);


--
-- Name: kv_store_e994bb5d; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.kv_store_e994bb5d (
    key text NOT NULL,
    value jsonb NOT NULL
);


--
-- Name: leads; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.leads (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(50) NOT NULL,
    title text NOT NULL,
    description text NOT NULL,
    reporter_name text NOT NULL,
    assignee_name text,
    created_by text NOT NULL,
    store_id text,
    store_name text,
    category character varying(50) NOT NULL,
    status character varying(20) DEFAULT 'new'::character varying NOT NULL,
    severity character varying(20) NOT NULL,
    sla jsonb NOT NULL,
    location jsonb,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    resolved_at timestamp with time zone,
    closed_at timestamp with time zone
);


--
-- Name: map_group_detail; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map_group_detail (
    _id uuid NOT NULL,
    map_group_id character varying(255),
    tax_code character varying(50),
    establishment_date bigint,
    business_sector text,
    city character varying(100),
    website character varying(255),
    fax character varying(50),
    landline_phone character varying(50),
    owner_name character varying(255),
    owner_birth_year integer,
    owner_phone character varying(50),
    owner_id_card character varying(50),
    headquarter_address text,
    production_address text,
    branch_address text,
    latitude numeric(10,7),
    longitude numeric(10,7),
    monthly_revenue numeric(20,2),
    total_tax numeric(20,2),
    tax_vat numeric(20,2),
    tax_tncn numeric(20,2),
    tax_ttdb numeric(20,2),
    tax_resource numeric(20,2),
    tax_env_protection numeric(20,2),
    fee_env_protection numeric(20,2),
    created_time bigint,
    updated_time bigint,
    images text[]
);


--
-- Name: COLUMN map_group_detail.establishment_date; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_group_detail.establishment_date IS 'Ngày thành lập (Unix timestamp)';


--
-- Name: COLUMN map_group_detail.monthly_revenue; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_group_detail.monthly_revenue IS 'Doanh thu hàng tháng';


--
-- Name: map_groups; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map_groups (
    id text NOT NULL,
    created_time bigint,
    last_update_time bigint,
    sort_order bigint,
    creator_id integer,
    site integer,
    type text,
    type1 text,
    type2 text,
    code text,
    title text,
    email text,
    phone text,
    address text,
    map_category_ids text[],
    status integer,
    censor_status integer
);


--
-- Name: map_inspection_campaigns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map_inspection_campaigns (
    id text NOT NULL,
    plan_id text,
    campaign_name text NOT NULL,
    campaign_status text,
    assigned_team text,
    created_by text,
    owner_dept text,
    site_id bigint,
    created_time bigint,
    last_update_time bigint,
    created_at bigint,
    updated_at bigint
);


--
-- Name: map_inspection_checklist_results; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map_inspection_checklist_results (
    _id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id character varying(50) NOT NULL,
    template_id uuid,
    item_name character varying(255),
    status character varying(50),
    note text,
    created_at bigint DEFAULT EXTRACT(epoch FROM now())
);


--
-- Name: map_inspection_checklist_templates; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map_inspection_checklist_templates (
    _id uuid DEFAULT gen_random_uuid() NOT NULL,
    category character varying(255),
    item_name character varying(255) NOT NULL,
    description text,
    is_required boolean DEFAULT true,
    created_at bigint DEFAULT EXTRACT(epoch FROM now())
);


--
-- Name: map_inspection_evidences; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map_inspection_evidences (
    _id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id character varying(50) NOT NULL,
    checklist_result_id uuid,
    file_name character varying(255),
    file_url text NOT NULL,
    file_type character varying(50),
    description text,
    created_at bigint DEFAULT EXTRACT(epoch FROM now()),
    is_delete smallint DEFAULT 0
);


--
-- Name: map_inspection_plans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map_inspection_plans (
    id text DEFAULT extensions.uuid_generate_v4() NOT NULL,
    plan_name text NOT NULL,
    plan_type text,
    legal_bases jsonb,
    application_scope jsonb,
    time_frame jsonb,
    plan_status text,
    created_by text,
    creator_name text,
    owner_dept text,
    site_id bigint,
    created_time bigint,
    last_update_time bigint,
    created_at bigint,
    updated_at bigint,
    department_id uuid
);


--
-- Name: map_inspection_reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map_inspection_reports (
    id text NOT NULL,
    session_id text,
    report_number text NOT NULL,
    content text,
    is_violation boolean DEFAULT false,
    attachments jsonb,
    signature jsonb,
    site_id bigint,
    created_at bigint,
    updated_at bigint
);


--
-- Name: map_inspection_sessions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map_inspection_sessions (
    _id text NOT NULL,
    campaign_id character varying(255),
    status text,
    start_time bigint,
    end_time bigint,
    site_id character varying(50),
    created_at bigint,
    updated_at bigint,
    session_name character varying(255),
    description text,
    result public.inspection_result_status,
    reopen_reason text,
    map_point_id uuid,
    result_text text GENERATED ALWAYS AS (public.get_result_text(result)) STORED,
    merchant_id uuid
);


--
-- Name: map_inspection_violation_reports; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map_inspection_violation_reports (
    _id uuid DEFAULT gen_random_uuid() NOT NULL,
    session_id character varying(50) NOT NULL,
    violation_code character varying(50),
    report_status character varying(50) DEFAULT 'open'::character varying,
    total_violations integer DEFAULT 0,
    created_at bigint DEFAULT EXTRACT(epoch FROM now()),
    updated_at bigint DEFAULT EXTRACT(epoch FROM now()),
    total_file integer DEFAULT 0,
    province_id uuid,
    ward_id uuid
);


--
-- Name: map_legal_documents; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map_legal_documents (
    id text NOT NULL,
    title text NOT NULL,
    document_type text,
    created_by text,
    owner_dept text,
    site_id bigint,
    created_time bigint,
    last_update_time bigint,
    created_at bigint,
    updated_at bigint,
    "documentNumber" text,
    "issuingAuthority" text,
    "issuanceDate" bigint,
    "effectiveDate" bigint,
    summary text,
    "isImportant" boolean DEFAULT false,
    file text
);


--
-- Name: map_point_hours; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map_point_hours (
    id bigint NOT NULL,
    map_point_id uuid NOT NULL,
    day_of_week smallint NOT NULL,
    open_time time without time zone NOT NULL,
    close_time time without time zone NOT NULL,
    day_name text GENERATED ALWAYS AS (
CASE day_of_week
    WHEN 1 THEN 'Thứ 2'::text
    WHEN 2 THEN 'Thứ 3'::text
    WHEN 3 THEN 'Thứ 4'::text
    WHEN 4 THEN 'Thứ 5'::text
    WHEN 5 THEN 'Thứ 6'::text
    WHEN 6 THEN 'Thứ 7'::text
    WHEN 7 THEN 'Chủ Nhật'::text
    ELSE NULL::text
END) STORED,
    merchant_id uuid,
    CONSTRAINT check_time_logic CHECK ((close_time > open_time)),
    CONSTRAINT map_point_hours_day_of_week_check CHECK (((day_of_week >= 1) AND (day_of_week <= 7)))
);


--
-- Name: map_point_hours_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public.map_point_hours ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public.map_point_hours_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: map_point_status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map_point_status (
    map_point_id uuid NOT NULL,
    point_status_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: map_region_data; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map_region_data (
    id text DEFAULT (extensions.uuid_generate_v4())::text NOT NULL,
    region_key text NOT NULL,
    merchants integer DEFAULT 0 NOT NULL,
    reports7days integer DEFAULT 0 NOT NULL,
    pending_dossiers integer DEFAULT 0 NOT NULL,
    risk_alerts integer DEFAULT 0 NOT NULL,
    marker_density text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT map_region_data_marker_density_check CHECK ((marker_density = ANY (ARRAY['high'::text, 'medium'::text, 'low'::text])))
);


--
-- Name: map_session_inspectors; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.map_session_inspectors (
    session_id character varying(50) NOT NULL,
    personnel_id integer NOT NULL,
    role character varying(20) DEFAULT 'member'::character varying
);


--
-- Name: COLUMN map_session_inspectors.role; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.map_session_inspectors.role IS 'Vai trò: leader (Trưởng đoàn) hoặc member (Thành viên)';


--
-- Name: market_management_department; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.market_management_department (
    id integer NOT NULL,
    departmentid character varying(36) NOT NULL,
    departmentcode character varying(50) NOT NULL,
    departmentname character varying(255) NOT NULL,
    managementlevel character varying(50),
    establishmentdate bigint,
    establishmentdecisionnumber character varying(100),
    headquartersaddress character varying(255),
    phonenumber character varying(20),
    email character varying(100),
    managementscope text,
    status smallint DEFAULT 1,
    note text,
    createdat bigint,
    updatedat bigint,
    location double precision[],
    "statusTitle" text,
    "statusColor" character varying(20),
    images text[],
    videos text[],
    "tagColor" character varying(20)
);


--
-- Name: COLUMN market_management_department.status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.market_management_department.status IS '1: Hoạt động (Active), 0: Tạm dừng (Suspended)';


--
-- Name: market_management_officials; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.market_management_officials (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    ward_id uuid,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: TABLE market_management_officials; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON TABLE public.market_management_officials IS 'Bảng danh sách cán bộ quản lý thị trường theo đơn vị hành chính xã/phường';


--
-- Name: COLUMN market_management_officials.ward_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.market_management_officials.ward_id IS 'Khóa ngoại liên kết tới bảng danh mục xã (wards)';


--
-- Name: market_management_team; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.market_management_team (
    id integer NOT NULL,
    teamid character varying(36) NOT NULL,
    departmentid character varying(36) NOT NULL,
    teamcode character varying(50) NOT NULL,
    teamname character varying(100) NOT NULL,
    managementscope text NOT NULL,
    teamleader character varying(100),
    phonenumber character varying(20),
    status smallint DEFAULT 1,
    note text
);


--
-- Name: COLUMN market_management_team.status; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.market_management_team.status IS '1: Hoạt động (Active), 0: Tạm dừng (Suspended)';


--
-- Name: marketmanagementdepartment_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.marketmanagementdepartment_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: marketmanagementdepartment_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.marketmanagementdepartment_id_seq OWNED BY public.market_management_department.id;


--
-- Name: marketmanagementteam_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.marketmanagementteam_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: marketmanagementteam_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.marketmanagementteam_id_seq OWNED BY public.market_management_team.id;


--
-- Name: merchant_histories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.merchant_histories (
    _id uuid DEFAULT public.uuid_generate_v7() NOT NULL,
    user_id uuid NOT NULL,
    feild_name text NOT NULL,
    feild_code character varying(100) NOT NULL,
    old_data text,
    new_data text,
    status smallint DEFAULT 0 NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    merchant_id uuid NOT NULL,
    CONSTRAINT merchant_histories_status_check CHECK ((status = ANY (ARRAY[0, 1, 2])))
);


--
-- Name: COLUMN merchant_histories.merchant_id; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.merchant_histories.merchant_id IS 'ID của Merchant liên quan đến lịch sử thay đổi này';


--
-- Name: merchant_licenses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.merchant_licenses (
    _id text NOT NULL,
    merchant_id uuid NOT NULL,
    license_type text NOT NULL,
    license_number text NOT NULL,
    issued_date date NOT NULL,
    expiry_date date NOT NULL,
    status text NOT NULL,
    issued_by text NOT NULL,
    issued_by_name text,
    file_url text,
    notes text,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    CONSTRAINT merchant_licenses_status_check CHECK ((status = ANY (ARRAY['valid'::text, 'expiring'::text, 'expired'::text, 'revoked'::text])))
);


--
-- Name: merchant_owners; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.merchant_owners (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    full_name text NOT NULL,
    id_card_number text,
    phone_number text NOT NULL,
    province_id text,
    birth_year integer,
    avatar_url text,
    id_card_image_url text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: merchant_photos; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.merchant_photos (
    category text NOT NULL,
    url text NOT NULL,
    captured_date timestamp with time zone NOT NULL,
    source text NOT NULL,
    uploaded_by text,
    notes text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    merchant_id uuid NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    CONSTRAINT merchant_photos_category_check CHECK ((category = ANY (ARRAY['signboard'::text, 'business-space'::text, 'products'::text, 'production-area'::text, 'documents'::text, 'other'::text]))),
    CONSTRAINT merchant_photos_source_check CHECK ((source = ANY (ARRAY['user'::text, 'inspector'::text, 'system'::text])))
);


--
-- Name: merchants; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.merchants (
    business_name text NOT NULL,
    owner_name text NOT NULL,
    owner_phone text NOT NULL,
    tax_code text NOT NULL,
    address text NOT NULL,
    province_id uuid,
    province text NOT NULL,
    district text NOT NULL,
    ward_id uuid,
    ward text NOT NULL,
    business_type text NOT NULL,
    status text NOT NULL,
    license_status text NOT NULL,
    license_count integer DEFAULT 0 NOT NULL,
    last_inspection date,
    monthly_revenue bigint DEFAULT 0 NOT NULL,
    total_tax bigint DEFAULT 0 NOT NULL,
    latitude double precision,
    longitude double precision,
    rejection_reason text,
    suspension_reason text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    owner_id uuid,
    _id uuid DEFAULT public.uuid_generate_v7() NOT NULL,
    department_id uuid,
    is_hot boolean DEFAULT false,
    complaint_count integer DEFAULT 0,
    CONSTRAINT merchants_license_status_check CHECK ((license_status = ANY (ARRAY['valid'::text, 'expiring'::text, 'expired'::text, 'none'::text]))),
    CONSTRAINT merchants_status_check CHECK ((status = ANY (ARRAY['active'::text, 'pending'::text, 'suspended'::text, 'rejected'::text])))
);


--
-- Name: modules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.modules (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    icon character varying(100),
    path character varying(255),
    description text,
    order_index integer DEFAULT 0 NOT NULL,
    status integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    _id uuid DEFAULT gen_random_uuid() NOT NULL,
    user_id uuid NOT NULL,
    title character varying(255) NOT NULL,
    description text,
    is_read boolean DEFAULT false,
    type character varying(50) DEFAULT 'info'::character varying,
    priority character varying(20) DEFAULT 'normal'::character varying,
    metadata jsonb,
    sender_id character varying(50),
    created_at bigint DEFAULT EXTRACT(epoch FROM now())
);


--
-- Name: objecttypes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.objecttypes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    objecttypecode character varying(50) NOT NULL,
    objecttypename text NOT NULL,
    topicid uuid,
    isactive boolean DEFAULT true,
    createdat timestamp with time zone DEFAULT now()
);


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    module_id uuid NOT NULL,
    code character varying(100) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    permission_type character varying(50) NOT NULL,
    status integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    is_default boolean DEFAULT false
);


--
-- Name: personnel; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.personnel (
    id integer NOT NULL,
    personnelid character varying(36) NOT NULL,
    departmentid character varying(36) NOT NULL,
    teamid character varying(36),
    fullname character varying(100) NOT NULL,
    title character varying(100),
    rank character varying(50),
    contracttype character varying(50),
    startdate bigint,
    workstatus smallint DEFAULT 1,
    note text,
    CONSTRAINT personnel_contracttype_check CHECK (((contracttype)::text = ANY (ARRAY[('Official'::character varying)::text, ('Contract'::character varying)::text])))
);


--
-- Name: COLUMN personnel.workstatus; Type: COMMENT; Schema: public; Owner: -
--

COMMENT ON COLUMN public.personnel.workstatus IS '1: Đang làm việc (Working), 0: Đã nghỉ hưu/Nghỉ việc (Retired)';


--
-- Name: personnel_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public.personnel_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: personnel_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public.personnel_id_seq OWNED BY public.personnel.id;


--
-- Name: point_status; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.point_status (
    name text NOT NULL,
    code text NOT NULL,
    created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL
);


--
-- Name: product_scans; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_scans (
    _id uuid DEFAULT gen_random_uuid() NOT NULL,
    product_barcode character varying(50),
    product_name character varying(255),
    manufacturer character varying(255),
    origin character varying(100),
    scan_status character varying(20),
    scan_time bigint,
    store_name character varying(255),
    violation_details text,
    has_violation boolean DEFAULT false,
    created_at bigint DEFAULT EXTRACT(epoch FROM now()),
    updated_at bigint DEFAULT EXTRACT(epoch FROM now()),
    CONSTRAINT chk_scan_status CHECK (((scan_status)::text = ANY ((ARRAY['valid'::character varying, 'invalid'::character varying])::text[])))
);


--
-- Name: provinces; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.provinces (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    name text NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: reasoncodes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reasoncodes (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    reasoncode character varying(50) NOT NULL,
    reasontext text NOT NULL,
    category character varying(50),
    isactive boolean DEFAULT true,
    createdat timestamp with time zone DEFAULT now()
);


--
-- Name: review_media; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.review_media (
    _id uuid DEFAULT gen_random_uuid() NOT NULL,
    review_id uuid NOT NULL,
    file_url text NOT NULL,
    file_type text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT review_media_file_type_check CHECK ((file_type = ANY (ARRAY['IMAGE'::text, 'VIDEO'::text])))
);


--
-- Name: review_quick_tag_maps; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.review_quick_tag_maps (
    review_id uuid NOT NULL,
    tag_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: review_quick_tags; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.review_quick_tags (
    _id uuid DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL,
    is_active boolean DEFAULT true,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.reviews (
    _id uuid DEFAULT gen_random_uuid() NOT NULL,
    merchant_id uuid NOT NULL,
    user_id uuid NOT NULL,
    rating smallint NOT NULL,
    comment text,
    is_anonymous boolean DEFAULT false,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    CONSTRAINT reviews_rating_check CHECK (((rating >= 1) AND (rating <= 5)))
);


--
-- Name: risk_cases; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.risk_cases (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    title text NOT NULL,
    content text,
    store_name text NOT NULL,
    reporter_name text,
    category text NOT NULL,
    severity text NOT NULL,
    status text DEFAULT 'new'::text NOT NULL,
    sla_hours integer DEFAULT 24,
    due_at timestamp without time zone,
    is_overdue boolean DEFAULT false,
    assigned_to text,
    created_at timestamp without time zone DEFAULT now() NOT NULL,
    updated_at timestamp without time zone DEFAULT now() NOT NULL,
    CONSTRAINT risk_cases_category_check CHECK ((category = ANY (ARRAY['counterfeit'::text, 'smuggling'::text, 'illegal_trading'::text, 'food_safety'::text, 'price_fraud'::text, 'unlicensed'::text, 'other'::text]))),
    CONSTRAINT risk_cases_severity_check CHECK ((severity = ANY (ARRAY['low'::text, 'medium'::text, 'high'::text, 'critical'::text]))),
    CONSTRAINT risk_cases_status_check CHECK ((status = ANY (ARRAY['new'::text, 'verifying'::text, 'processing'::text, 'resolved'::text, 'rejected'::text])))
);


--
-- Name: role_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.role_permissions (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.roles (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    code character varying(50) NOT NULL,
    name character varying(255) NOT NULL,
    description text,
    status integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    is_system boolean DEFAULT false
);


--
-- Name: route_suggestions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.route_suggestions (
    id text NOT NULL,
    name text NOT NULL,
    origin text NOT NULL,
    destination text NOT NULL,
    coupons integer[],
    distance double precision,
    savings numeric
);


--
-- Name: savedArticles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."savedArticles" (
    id bigint NOT NULL,
    user_id uuid NOT NULL,
    article_id bigint NOT NULL,
    "createdTime" bigint DEFAULT (EXTRACT(epoch FROM now()))::bigint
);


--
-- Name: savedArticles_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

ALTER TABLE public."savedArticles" ALTER COLUMN id ADD GENERATED BY DEFAULT AS IDENTITY (
    SEQUENCE NAME public."savedArticles_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1
);


--
-- Name: sensitivitylabels; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.sensitivitylabels (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    levelcode character varying(20) NOT NULL,
    labelname text NOT NULL,
    colorcode character varying(7),
    description text,
    createdat timestamp with time zone DEFAULT now()
);


--
-- Name: slapolicies; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.slapolicies (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    policyname text NOT NULL,
    responsetimehours integer,
    resolutiontimehours integer,
    prioritylevel character varying(20),
    isactive boolean DEFAULT true,
    createdat timestamp with time zone DEFAULT now()
);


--
-- Name: topics; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.topics (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    topiccode character varying(50) NOT NULL,
    topicname text NOT NULL,
    description text,
    isactive boolean DEFAULT true,
    createdat timestamp with time zone DEFAULT now()
);


--
-- Name: user_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_roles (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    user_id uuid NOT NULL,
    role_id uuid NOT NULL,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid DEFAULT extensions.uuid_generate_v4() NOT NULL,
    username character varying(100),
    full_name character varying(255),
    email character varying(255),
    status integer DEFAULT 1 NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    phone character varying(20),
    "avatarUrl" text,
    "departmentId" uuid,
    "lastLoginAt" timestamp with time zone,
    avatar_url text
);

ALTER TABLE ONLY public.users FORCE ROW LEVEL SECURITY;


--
-- Name: view_department_status; Type: VIEW; Schema: public; Owner: -
--

CREATE VIEW public.view_department_status AS
 SELECT d.id,
    d.departmentid,
    d.departmentcode,
    d.departmentname,
    d.managementlevel,
    d.establishmentdate,
    d.establishmentdecisionnumber,
    d.headquartersaddress,
    d.phonenumber,
    d.email,
    d.managementscope,
    d.status,
    d.note,
    d.createdat,
    d.updatedat,
    d.location,
    d."statusTitle",
    d."statusColor",
    d.images,
    d.videos,
    d."tagColor",
    s.open_time,
    s.close_time,
        CASE
            WHEN (s.id IS NULL) THEN false
            WHEN (s.is_active IS FALSE) THEN false
            WHEN ((((now() AT TIME ZONE 'Asia/Ho_Chi_Minh'::text))::time without time zone >= s.open_time) AND (((now() AT TIME ZONE 'Asia/Ho_Chi_Minh'::text))::time without time zone <= s.close_time)) THEN true
            ELSE false
        END AS is_open,
        CASE
            WHEN (s.id IS NULL) THEN 'Hôm nay nghỉ'::text
            WHEN ((((now() AT TIME ZONE 'Asia/Ho_Chi_Minh'::text))::time without time zone >= s.open_time) AND (((now() AT TIME ZONE 'Asia/Ho_Chi_Minh'::text))::time without time zone <= s.close_time)) THEN 'Đang mở cửa'::text
            ELSE 'Đã đóng cửa'::text
        END AS status_text
   FROM (public.market_management_department d
     LEFT JOIN public.department_schedules s ON (((d.id = s.department_id) AND (s.day_of_week = (EXTRACT(dow FROM (now() AT TIME ZONE 'Asia/Ho_Chi_Minh'::text)))::integer))));


--
-- Name: violationCategory; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public."violationCategory" (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    "colorCode" character varying(10),
    "isActive" boolean DEFAULT true
);


--
-- Name: violationCategory_id_seq; Type: SEQUENCE; Schema: public; Owner: -
--

CREATE SEQUENCE public."violationCategory_id_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


--
-- Name: violationCategory_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: -
--

ALTER SEQUENCE public."violationCategory_id_seq" OWNED BY public."violationCategory".id;


--
-- Name: wards; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.wards (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    code character varying(20) NOT NULL,
    name text NOT NULL,
    province_id uuid NOT NULL,
    area numeric,
    officer text,
    created_at timestamp with time zone DEFAULT now()
);


--
-- Name: buckets; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets (
    id text NOT NULL,
    name text NOT NULL,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    public boolean DEFAULT false,
    avif_autodetection boolean DEFAULT false,
    file_size_limit bigint,
    allowed_mime_types text[],
    owner_id text,
    type storage.buckettype DEFAULT 'STANDARD'::storage.buckettype NOT NULL
);


--
-- Name: COLUMN buckets.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.buckets.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: buckets_analytics; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets_analytics (
    name text NOT NULL,
    type storage.buckettype DEFAULT 'ANALYTICS'::storage.buckettype NOT NULL,
    format text DEFAULT 'ICEBERG'::text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL,
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    deleted_at timestamp with time zone
);


--
-- Name: buckets_vectors; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.buckets_vectors (
    id text NOT NULL,
    type storage.buckettype DEFAULT 'VECTOR'::storage.buckettype NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: migrations; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.migrations (
    id integer NOT NULL,
    name character varying(100) NOT NULL,
    hash character varying(40) NOT NULL,
    executed_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP
);


--
-- Name: objects; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.objects (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    bucket_id text,
    name text,
    owner uuid,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now(),
    last_accessed_at timestamp with time zone DEFAULT now(),
    metadata jsonb,
    path_tokens text[] GENERATED ALWAYS AS (string_to_array(name, '/'::text)) STORED,
    version text,
    owner_id text,
    user_metadata jsonb,
    level integer
);


--
-- Name: COLUMN objects.owner; Type: COMMENT; Schema: storage; Owner: -
--

COMMENT ON COLUMN storage.objects.owner IS 'Field is deprecated, use owner_id instead';


--
-- Name: prefixes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.prefixes (
    bucket_id text NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    level integer GENERATED ALWAYS AS (storage.get_level(name)) STORED NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    updated_at timestamp with time zone DEFAULT now()
);


--
-- Name: s3_multipart_uploads; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads (
    id text NOT NULL,
    in_progress_size bigint DEFAULT 0 NOT NULL,
    upload_signature text NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    version text NOT NULL,
    owner_id text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    user_metadata jsonb
);


--
-- Name: s3_multipart_uploads_parts; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.s3_multipart_uploads_parts (
    id uuid DEFAULT gen_random_uuid() NOT NULL,
    upload_id text NOT NULL,
    size bigint DEFAULT 0 NOT NULL,
    part_number integer NOT NULL,
    bucket_id text NOT NULL,
    key text NOT NULL COLLATE pg_catalog."C",
    etag text NOT NULL,
    owner_id text,
    version text NOT NULL,
    created_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: vector_indexes; Type: TABLE; Schema: storage; Owner: -
--

CREATE TABLE storage.vector_indexes (
    id text DEFAULT gen_random_uuid() NOT NULL,
    name text NOT NULL COLLATE pg_catalog."C",
    bucket_id text NOT NULL,
    data_type text NOT NULL,
    dimension integer NOT NULL,
    distance_metric text NOT NULL,
    metadata_configuration jsonb,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    updated_at timestamp with time zone DEFAULT now() NOT NULL
);


--
-- Name: refresh_tokens id; Type: DEFAULT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens ALTER COLUMN id SET DEFAULT nextval('auth.refresh_tokens_id_seq'::regclass);


--
-- Name: activityreport id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activityreport ALTER COLUMN id SET DEFAULT nextval('public.activityreport_id_seq'::regclass);


--
-- Name: complaintTimeline id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."complaintTimeline" ALTER COLUMN id SET DEFAULT nextval('public."complaintTimeline_id_seq"'::regclass);


--
-- Name: complaints id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints ALTER COLUMN id SET DEFAULT nextval('public.complaint_id_seq'::regclass);


--
-- Name: coupons id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupons ALTER COLUMN id SET DEFAULT nextval('public.coupons_id_seq'::regclass);


--
-- Name: departmentleader id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departmentleader ALTER COLUMN id SET DEFAULT nextval('public.departmentleader_id_seq'::regclass);


--
-- Name: heatmap_data id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.heatmap_data ALTER COLUMN id SET DEFAULT nextval('public.heatmap_data_id_seq'::regclass);


--
-- Name: market_management_department id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.market_management_department ALTER COLUMN id SET DEFAULT nextval('public.marketmanagementdepartment_id_seq'::regclass);


--
-- Name: market_management_team id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.market_management_team ALTER COLUMN id SET DEFAULT nextval('public.marketmanagementteam_id_seq'::regclass);


--
-- Name: personnel id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personnel ALTER COLUMN id SET DEFAULT nextval('public.personnel_id_seq'::regclass);


--
-- Name: violationCategory id; Type: DEFAULT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."violationCategory" ALTER COLUMN id SET DEFAULT nextval('public."violationCategory_id_seq"'::regclass);


--
-- Name: mfa_amr_claims amr_id_pk; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT amr_id_pk PRIMARY KEY (id);


--
-- Name: audit_log_entries audit_log_entries_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.audit_log_entries
    ADD CONSTRAINT audit_log_entries_pkey PRIMARY KEY (id);


--
-- Name: flow_state flow_state_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.flow_state
    ADD CONSTRAINT flow_state_pkey PRIMARY KEY (id);


--
-- Name: identities identities_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_pkey PRIMARY KEY (id);


--
-- Name: identities identities_provider_id_provider_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_provider_id_provider_unique UNIQUE (provider_id, provider);


--
-- Name: instances instances_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.instances
    ADD CONSTRAINT instances_pkey PRIMARY KEY (id);


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_authentication_method_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_authentication_method_pkey UNIQUE (session_id, authentication_method);


--
-- Name: mfa_challenges mfa_challenges_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_pkey PRIMARY KEY (id);


--
-- Name: mfa_factors mfa_factors_last_challenged_at_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_last_challenged_at_key UNIQUE (last_challenged_at);


--
-- Name: mfa_factors mfa_factors_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_pkey PRIMARY KEY (id);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_code_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_code_key UNIQUE (authorization_code);


--
-- Name: oauth_authorizations oauth_authorizations_authorization_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_authorization_id_key UNIQUE (authorization_id);


--
-- Name: oauth_authorizations oauth_authorizations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_pkey PRIMARY KEY (id);


--
-- Name: oauth_client_states oauth_client_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_client_states
    ADD CONSTRAINT oauth_client_states_pkey PRIMARY KEY (id);


--
-- Name: oauth_clients oauth_clients_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_clients
    ADD CONSTRAINT oauth_clients_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_pkey PRIMARY KEY (id);


--
-- Name: oauth_consents oauth_consents_user_client_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_client_unique UNIQUE (user_id, client_id);


--
-- Name: one_time_tokens one_time_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_pkey PRIMARY KEY (id);


--
-- Name: refresh_tokens refresh_tokens_token_unique; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_token_unique UNIQUE (token);


--
-- Name: saml_providers saml_providers_entity_id_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_entity_id_key UNIQUE (entity_id);


--
-- Name: saml_providers saml_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_pkey PRIMARY KEY (id);


--
-- Name: saml_relay_states saml_relay_states_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_pkey PRIMARY KEY (id);


--
-- Name: schema_migrations schema_migrations_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.schema_migrations
    ADD CONSTRAINT schema_migrations_pkey PRIMARY KEY (version);


--
-- Name: sessions sessions_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_pkey PRIMARY KEY (id);


--
-- Name: sso_domains sso_domains_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_pkey PRIMARY KEY (id);


--
-- Name: sso_providers sso_providers_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_providers
    ADD CONSTRAINT sso_providers_pkey PRIMARY KEY (id);


--
-- Name: users users_phone_key; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_phone_key UNIQUE (phone);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: activityreport activityreport_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activityreport
    ADD CONSTRAINT activityreport_pkey PRIMARY KEY (id);


--
-- Name: activityreport activityreport_reportid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activityreport
    ADD CONSTRAINT activityreport_reportid_key UNIQUE (reportid);


--
-- Name: areas areas_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.areas
    ADD CONSTRAINT areas_code_key UNIQUE (code);


--
-- Name: areas areas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.areas
    ADD CONSTRAINT areas_pkey PRIMARY KEY (id);


--
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- Name: articles articles_rewriteURL_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT "articles_rewriteURL_key" UNIQUE ("rewriteURL");


--
-- Name: banks banks_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banks
    ADD CONSTRAINT banks_code_key UNIQUE (code);


--
-- Name: banks banks_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.banks
    ADD CONSTRAINT banks_pkey PRIMARY KEY (id);


--
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- Name: category_map_points category_map_points_category_id_map_point_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_map_points
    ADD CONSTRAINT category_map_points_category_id_map_point_id_key UNIQUE (category_id, map_point_id);


--
-- Name: category_map_points category_map_points_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_map_points
    ADD CONSTRAINT category_map_points_pkey PRIMARY KEY (id);


--
-- Name: check_in_points check_in_points_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.check_in_points
    ADD CONSTRAINT check_in_points_pkey PRIMARY KEY (id);


--
-- Name: complaintTimeline complaintTimeline_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."complaintTimeline"
    ADD CONSTRAINT "complaintTimeline_pkey" PRIMARY KEY (id);


--
-- Name: complaintViolationMap complaintViolationMap_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."complaintViolationMap"
    ADD CONSTRAINT "complaintViolationMap_pkey" PRIMARY KEY ("complaintId", "violationCategoryId");


--
-- Name: complaints complaint_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaint_pkey PRIMARY KEY (id);


--
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- Name: department_areas department_areas_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_areas
    ADD CONSTRAINT department_areas_pkey PRIMARY KEY (id);


--
-- Name: department_schedules department_schedules_department_id_day_of_week_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_schedules
    ADD CONSTRAINT department_schedules_department_id_day_of_week_key UNIQUE (department_id, day_of_week);


--
-- Name: department_schedules department_schedules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_schedules
    ADD CONSTRAINT department_schedules_pkey PRIMARY KEY (id);


--
-- Name: department_users department_users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_users
    ADD CONSTRAINT department_users_pkey PRIMARY KEY (id);


--
-- Name: departmentleader departmentleader_leaderid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departmentleader
    ADD CONSTRAINT departmentleader_leaderid_key UNIQUE (leaderid);


--
-- Name: departmentleader departmentleader_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departmentleader
    ADD CONSTRAINT departmentleader_pkey PRIMARY KEY (id);


--
-- Name: departments departments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT departments_pkey PRIMARY KEY (id);


--
-- Name: district_boundaries district_boundaries_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.district_boundaries
    ADD CONSTRAINT district_boundaries_pkey PRIMARY KEY (id);


--
-- Name: heatmap_data heatmap_data_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.heatmap_data
    ADD CONSTRAINT heatmap_data_pkey PRIMARY KEY (id);


--
-- Name: kv_store_b36723fe kv_store_b36723fe_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kv_store_b36723fe
    ADD CONSTRAINT kv_store_b36723fe_pkey PRIMARY KEY (key);


--
-- Name: kv_store_bb2eb709 kv_store_bb2eb709_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kv_store_bb2eb709
    ADD CONSTRAINT kv_store_bb2eb709_pkey PRIMARY KEY (key);


--
-- Name: kv_store_bbddaf26 kv_store_bbddaf26_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kv_store_bbddaf26
    ADD CONSTRAINT kv_store_bbddaf26_pkey PRIMARY KEY (key);


--
-- Name: kv_store_e994bb5d kv_store_e994bb5d_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.kv_store_e994bb5d
    ADD CONSTRAINT kv_store_e994bb5d_pkey PRIMARY KEY (key);


--
-- Name: leads leads_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.leads
    ADD CONSTRAINT leads_pkey PRIMARY KEY (id);


--
-- Name: map_group_detail map_group_detail_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_group_detail
    ADD CONSTRAINT map_group_detail_pkey PRIMARY KEY (_id);


--
-- Name: map_groups map_groups_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_groups
    ADD CONSTRAINT map_groups_pkey PRIMARY KEY (id);


--
-- Name: map_inspection_campaigns map_inspection_campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inspection_campaigns
    ADD CONSTRAINT map_inspection_campaigns_pkey PRIMARY KEY (id);


--
-- Name: map_inspection_checklist_results map_inspection_checklist_results_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inspection_checklist_results
    ADD CONSTRAINT map_inspection_checklist_results_pkey PRIMARY KEY (_id);


--
-- Name: map_inspection_checklist_templates map_inspection_checklist_templates_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inspection_checklist_templates
    ADD CONSTRAINT map_inspection_checklist_templates_pkey PRIMARY KEY (_id);


--
-- Name: map_inspection_evidences map_inspection_evidences_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inspection_evidences
    ADD CONSTRAINT map_inspection_evidences_pkey PRIMARY KEY (_id);


--
-- Name: map_inspection_plans map_inspection_plans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inspection_plans
    ADD CONSTRAINT map_inspection_plans_pkey PRIMARY KEY (id);


--
-- Name: map_inspection_reports map_inspection_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inspection_reports
    ADD CONSTRAINT map_inspection_reports_pkey PRIMARY KEY (id);


--
-- Name: map_inspection_sessions map_inspection_sessions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inspection_sessions
    ADD CONSTRAINT map_inspection_sessions_pkey PRIMARY KEY (_id);


--
-- Name: map_inspection_violation_reports map_inspection_violation_reports_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inspection_violation_reports
    ADD CONSTRAINT map_inspection_violation_reports_pkey PRIMARY KEY (_id);


--
-- Name: map_legal_documents map_legal_documents_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_legal_documents
    ADD CONSTRAINT map_legal_documents_pkey PRIMARY KEY (id);


--
-- Name: map_point_hours map_point_hours_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_point_hours
    ADD CONSTRAINT map_point_hours_pkey PRIMARY KEY (id);


--
-- Name: map_point_status map_point_status_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_point_status
    ADD CONSTRAINT map_point_status_pkey PRIMARY KEY (map_point_id, point_status_id);


--
-- Name: map_points map_points_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_points
    ADD CONSTRAINT map_points_pkey PRIMARY KEY (_id);


--
-- Name: map_region_data map_region_data_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_region_data
    ADD CONSTRAINT map_region_data_pkey PRIMARY KEY (id);


--
-- Name: map_region_data map_region_data_region_key_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_region_data
    ADD CONSTRAINT map_region_data_region_key_key UNIQUE (region_key);


--
-- Name: map_session_inspectors map_session_inspectors_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_session_inspectors
    ADD CONSTRAINT map_session_inspectors_pkey PRIMARY KEY (session_id, personnel_id);


--
-- Name: market_management_officials market_management_officials_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.market_management_officials
    ADD CONSTRAINT market_management_officials_pkey PRIMARY KEY (id);


--
-- Name: market_management_officials market_management_officials_user_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.market_management_officials
    ADD CONSTRAINT market_management_officials_user_unique UNIQUE (user_id);


--
-- Name: market_management_department marketmanagementdepartment_departmentcode_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.market_management_department
    ADD CONSTRAINT marketmanagementdepartment_departmentcode_key UNIQUE (departmentcode);


--
-- Name: market_management_department marketmanagementdepartment_departmentid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.market_management_department
    ADD CONSTRAINT marketmanagementdepartment_departmentid_key UNIQUE (departmentid);


--
-- Name: market_management_department marketmanagementdepartment_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.market_management_department
    ADD CONSTRAINT marketmanagementdepartment_pkey PRIMARY KEY (id);


--
-- Name: market_management_team marketmanagementteam_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.market_management_team
    ADD CONSTRAINT marketmanagementteam_pkey PRIMARY KEY (id);


--
-- Name: market_management_team marketmanagementteam_teamid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.market_management_team
    ADD CONSTRAINT marketmanagementteam_teamid_key UNIQUE (teamid);


--
-- Name: merchant_histories merchant_histories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.merchant_histories
    ADD CONSTRAINT merchant_histories_pkey PRIMARY KEY (_id);


--
-- Name: merchant_licenses merchant_licenses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.merchant_licenses
    ADD CONSTRAINT merchant_licenses_pkey PRIMARY KEY (_id);


--
-- Name: merchant_owners merchant_owners_id_card_number_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.merchant_owners
    ADD CONSTRAINT merchant_owners_id_card_number_key UNIQUE (id_card_number);


--
-- Name: merchant_owners merchant_owners_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.merchant_owners
    ADD CONSTRAINT merchant_owners_pkey PRIMARY KEY (id);


--
-- Name: merchant_photos merchant_photos_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.merchant_photos
    ADD CONSTRAINT merchant_photos_pkey PRIMARY KEY (id);


--
-- Name: merchants merchants_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.merchants
    ADD CONSTRAINT merchants_pkey PRIMARY KEY (_id);


--
-- Name: modules modules_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_code_key UNIQUE (code);


--
-- Name: modules modules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.modules
    ADD CONSTRAINT modules_pkey PRIMARY KEY (id);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (_id);


--
-- Name: objecttypes objecttypes_objecttypecode_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.objecttypes
    ADD CONSTRAINT objecttypes_objecttypecode_key UNIQUE (objecttypecode);


--
-- Name: objecttypes objecttypes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.objecttypes
    ADD CONSTRAINT objecttypes_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_code_key UNIQUE (code);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: personnel personnel_personnelid_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personnel
    ADD CONSTRAINT personnel_personnelid_key UNIQUE (personnelid);


--
-- Name: personnel personnel_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personnel
    ADD CONSTRAINT personnel_pkey PRIMARY KEY (id);


--
-- Name: point_status point_status_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.point_status
    ADD CONSTRAINT point_status_code_key UNIQUE (code);


--
-- Name: point_status point_status_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.point_status
    ADD CONSTRAINT point_status_pkey PRIMARY KEY (id);


--
-- Name: product_scans product_scans_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_scans
    ADD CONSTRAINT product_scans_pkey PRIMARY KEY (_id);


--
-- Name: provinces provinces_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.provinces
    ADD CONSTRAINT provinces_pkey PRIMARY KEY (id);


--
-- Name: reasoncodes reasoncodes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reasoncodes
    ADD CONSTRAINT reasoncodes_pkey PRIMARY KEY (id);


--
-- Name: reasoncodes reasoncodes_reasoncode_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reasoncodes
    ADD CONSTRAINT reasoncodes_reasoncode_key UNIQUE (reasoncode);


--
-- Name: review_media review_media_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_media
    ADD CONSTRAINT review_media_pkey PRIMARY KEY (_id);


--
-- Name: review_quick_tag_maps review_quick_tag_maps_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_quick_tag_maps
    ADD CONSTRAINT review_quick_tag_maps_pkey PRIMARY KEY (review_id, tag_id);


--
-- Name: review_quick_tags review_quick_tags_name_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_quick_tags
    ADD CONSTRAINT review_quick_tags_name_key UNIQUE (name);


--
-- Name: review_quick_tags review_quick_tags_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_quick_tags
    ADD CONSTRAINT review_quick_tags_pkey PRIMARY KEY (_id);


--
-- Name: reviews reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.reviews
    ADD CONSTRAINT reviews_pkey PRIMARY KEY (_id);


--
-- Name: risk_cases risk_cases_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.risk_cases
    ADD CONSTRAINT risk_cases_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_pkey PRIMARY KEY (id);


--
-- Name: role_permissions role_permissions_role_id_permission_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_permission_id_key UNIQUE (role_id, permission_id);


--
-- Name: roles roles_code_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_code_key UNIQUE (code);


--
-- Name: roles roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.roles
    ADD CONSTRAINT roles_pkey PRIMARY KEY (id);


--
-- Name: route_suggestions route_suggestions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.route_suggestions
    ADD CONSTRAINT route_suggestions_pkey PRIMARY KEY (id);


--
-- Name: savedArticles savedArticles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."savedArticles"
    ADD CONSTRAINT "savedArticles_pkey" PRIMARY KEY (id);


--
-- Name: sensitivitylabels sensitivitylabels_levelcode_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sensitivitylabels
    ADD CONSTRAINT sensitivitylabels_levelcode_key UNIQUE (levelcode);


--
-- Name: sensitivitylabels sensitivitylabels_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.sensitivitylabels
    ADD CONSTRAINT sensitivitylabels_pkey PRIMARY KEY (id);


--
-- Name: slapolicies slapolicies_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.slapolicies
    ADD CONSTRAINT slapolicies_pkey PRIMARY KEY (id);


--
-- Name: topics topics_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_pkey PRIMARY KEY (id);


--
-- Name: topics topics_topiccode_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.topics
    ADD CONSTRAINT topics_topiccode_key UNIQUE (topiccode);


--
-- Name: savedArticles unique_user_article; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."savedArticles"
    ADD CONSTRAINT unique_user_article UNIQUE (user_id, article_id);


--
-- Name: department_areas uq_department_areas_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_areas
    ADD CONSTRAINT uq_department_areas_unique UNIQUE (department_id, area_id);


--
-- Name: department_users uq_department_users_unique; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_users
    ADD CONSTRAINT uq_department_users_unique UNIQUE (department_id, user_id);


--
-- Name: user_roles user_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_pkey PRIMARY KEY (id);


--
-- Name: user_roles user_roles_user_id_role_id_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_role_id_key UNIQUE (user_id, role_id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: violationCategory violationCategory_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."violationCategory"
    ADD CONSTRAINT "violationCategory_pkey" PRIMARY KEY (id);


--
-- Name: wards wards_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wards
    ADD CONSTRAINT wards_pkey PRIMARY KEY (id);


--
-- Name: buckets_analytics buckets_analytics_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets_analytics
    ADD CONSTRAINT buckets_analytics_pkey PRIMARY KEY (id);


--
-- Name: buckets buckets_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets
    ADD CONSTRAINT buckets_pkey PRIMARY KEY (id);


--
-- Name: buckets_vectors buckets_vectors_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.buckets_vectors
    ADD CONSTRAINT buckets_vectors_pkey PRIMARY KEY (id);


--
-- Name: migrations migrations_name_key; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_name_key UNIQUE (name);


--
-- Name: migrations migrations_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.migrations
    ADD CONSTRAINT migrations_pkey PRIMARY KEY (id);


--
-- Name: objects objects_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT objects_pkey PRIMARY KEY (id);


--
-- Name: prefixes prefixes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT prefixes_pkey PRIMARY KEY (bucket_id, level, name);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_pkey PRIMARY KEY (id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_pkey PRIMARY KEY (id);


--
-- Name: vector_indexes vector_indexes_pkey; Type: CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_pkey PRIMARY KEY (id);


--
-- Name: audit_logs_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX audit_logs_instance_id_idx ON auth.audit_log_entries USING btree (instance_id);


--
-- Name: confirmation_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX confirmation_token_idx ON auth.users USING btree (confirmation_token) WHERE ((confirmation_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_current_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_current_idx ON auth.users USING btree (email_change_token_current) WHERE ((email_change_token_current)::text !~ '^[0-9 ]*$'::text);


--
-- Name: email_change_token_new_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX email_change_token_new_idx ON auth.users USING btree (email_change_token_new) WHERE ((email_change_token_new)::text !~ '^[0-9 ]*$'::text);


--
-- Name: factor_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX factor_id_created_at_idx ON auth.mfa_factors USING btree (user_id, created_at);


--
-- Name: flow_state_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX flow_state_created_at_idx ON auth.flow_state USING btree (created_at DESC);


--
-- Name: identities_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_email_idx ON auth.identities USING btree (email text_pattern_ops);


--
-- Name: INDEX identities_email_idx; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.identities_email_idx IS 'Auth: Ensures indexed queries on the email column';


--
-- Name: identities_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX identities_user_id_idx ON auth.identities USING btree (user_id);


--
-- Name: idx_auth_code; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_auth_code ON auth.flow_state USING btree (auth_code);


--
-- Name: idx_oauth_client_states_created_at; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_oauth_client_states_created_at ON auth.oauth_client_states USING btree (created_at);


--
-- Name: idx_user_id_auth_method; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX idx_user_id_auth_method ON auth.flow_state USING btree (user_id, authentication_method);


--
-- Name: mfa_challenge_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_challenge_created_at_idx ON auth.mfa_challenges USING btree (created_at DESC);


--
-- Name: mfa_factors_user_friendly_name_unique; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX mfa_factors_user_friendly_name_unique ON auth.mfa_factors USING btree (friendly_name, user_id) WHERE (TRIM(BOTH FROM friendly_name) <> ''::text);


--
-- Name: mfa_factors_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX mfa_factors_user_id_idx ON auth.mfa_factors USING btree (user_id);


--
-- Name: oauth_auth_pending_exp_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_auth_pending_exp_idx ON auth.oauth_authorizations USING btree (expires_at) WHERE (status = 'pending'::auth.oauth_authorization_status);


--
-- Name: oauth_clients_deleted_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_clients_deleted_at_idx ON auth.oauth_clients USING btree (deleted_at);


--
-- Name: oauth_consents_active_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_active_client_idx ON auth.oauth_consents USING btree (client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_active_user_client_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_active_user_client_idx ON auth.oauth_consents USING btree (user_id, client_id) WHERE (revoked_at IS NULL);


--
-- Name: oauth_consents_user_order_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX oauth_consents_user_order_idx ON auth.oauth_consents USING btree (user_id, granted_at DESC);


--
-- Name: one_time_tokens_relates_to_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_relates_to_hash_idx ON auth.one_time_tokens USING hash (relates_to);


--
-- Name: one_time_tokens_token_hash_hash_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX one_time_tokens_token_hash_hash_idx ON auth.one_time_tokens USING hash (token_hash);


--
-- Name: one_time_tokens_user_id_token_type_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX one_time_tokens_user_id_token_type_key ON auth.one_time_tokens USING btree (user_id, token_type);


--
-- Name: reauthentication_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX reauthentication_token_idx ON auth.users USING btree (reauthentication_token) WHERE ((reauthentication_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: recovery_token_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX recovery_token_idx ON auth.users USING btree (recovery_token) WHERE ((recovery_token)::text !~ '^[0-9 ]*$'::text);


--
-- Name: refresh_tokens_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_idx ON auth.refresh_tokens USING btree (instance_id);


--
-- Name: refresh_tokens_instance_id_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_instance_id_user_id_idx ON auth.refresh_tokens USING btree (instance_id, user_id);


--
-- Name: refresh_tokens_parent_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_parent_idx ON auth.refresh_tokens USING btree (parent);


--
-- Name: refresh_tokens_session_id_revoked_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_session_id_revoked_idx ON auth.refresh_tokens USING btree (session_id, revoked);


--
-- Name: refresh_tokens_updated_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX refresh_tokens_updated_at_idx ON auth.refresh_tokens USING btree (updated_at DESC);


--
-- Name: saml_providers_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_providers_sso_provider_id_idx ON auth.saml_providers USING btree (sso_provider_id);


--
-- Name: saml_relay_states_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_created_at_idx ON auth.saml_relay_states USING btree (created_at DESC);


--
-- Name: saml_relay_states_for_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_for_email_idx ON auth.saml_relay_states USING btree (for_email);


--
-- Name: saml_relay_states_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX saml_relay_states_sso_provider_id_idx ON auth.saml_relay_states USING btree (sso_provider_id);


--
-- Name: sessions_not_after_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_not_after_idx ON auth.sessions USING btree (not_after DESC);


--
-- Name: sessions_oauth_client_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_oauth_client_id_idx ON auth.sessions USING btree (oauth_client_id);


--
-- Name: sessions_user_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sessions_user_id_idx ON auth.sessions USING btree (user_id);


--
-- Name: sso_domains_domain_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_domains_domain_idx ON auth.sso_domains USING btree (lower(domain));


--
-- Name: sso_domains_sso_provider_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_domains_sso_provider_id_idx ON auth.sso_domains USING btree (sso_provider_id);


--
-- Name: sso_providers_resource_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX sso_providers_resource_id_idx ON auth.sso_providers USING btree (lower(resource_id));


--
-- Name: sso_providers_resource_id_pattern_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX sso_providers_resource_id_pattern_idx ON auth.sso_providers USING btree (resource_id text_pattern_ops);


--
-- Name: unique_phone_factor_per_user; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX unique_phone_factor_per_user ON auth.mfa_factors USING btree (user_id, phone);


--
-- Name: user_id_created_at_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX user_id_created_at_idx ON auth.sessions USING btree (user_id, created_at);


--
-- Name: users_email_partial_key; Type: INDEX; Schema: auth; Owner: -
--

CREATE UNIQUE INDEX users_email_partial_key ON auth.users USING btree (email) WHERE (is_sso_user = false);


--
-- Name: INDEX users_email_partial_key; Type: COMMENT; Schema: auth; Owner: -
--

COMMENT ON INDEX auth.users_email_partial_key IS 'Auth: A partial unique index that applies only when is_sso_user is false';


--
-- Name: users_instance_id_email_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_email_idx ON auth.users USING btree (instance_id, lower((email)::text));


--
-- Name: users_instance_id_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_instance_id_idx ON auth.users USING btree (instance_id);


--
-- Name: users_is_anonymous_idx; Type: INDEX; Schema: auth; Owner: -
--

CREATE INDEX users_is_anonymous_idx ON auth.users USING btree (is_anonymous);


--
-- Name: district_boundaries_geo_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX district_boundaries_geo_idx ON public.district_boundaries USING gist (polygon);


--
-- Name: idx_areas_province; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_areas_province ON public.areas USING btree ("provinceId");


--
-- Name: idx_areas_ward; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_areas_ward ON public.areas USING btree ("wardId");


--
-- Name: idx_articles_filter; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_articles_filter ON public.articles USING btree ("isDisplay", "isFeatured", "isHot");


--
-- Name: idx_articles_publishDate; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_articles_publishDate" ON public.articles USING btree ("publishDate" DESC);


--
-- Name: idx_articles_rewriteURL; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_articles_rewriteURL" ON public.articles USING btree ("rewriteURL");


--
-- Name: idx_map_point_hours_lookup; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_map_point_hours_lookup ON public.map_point_hours USING btree (map_point_id, day_of_week);


--
-- Name: idx_map_points_location_type; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_map_points_location_type ON public.map_points USING btree (location_type);


--
-- Name: idx_map_points_province; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_map_points_province ON public.map_points USING btree (province_id);


--
-- Name: idx_map_region_data_region_key; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_map_region_data_region_key ON public.map_region_data USING btree (region_key);


--
-- Name: idx_merchant_histories_created_at; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_merchant_histories_created_at ON public.merchant_histories USING btree (created_at DESC);


--
-- Name: idx_merchant_histories_merchant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_merchant_histories_merchant_id ON public.merchant_histories USING btree (merchant_id);


--
-- Name: idx_merchant_histories_user_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_merchant_histories_user_id ON public.merchant_histories USING btree (user_id);


--
-- Name: idx_merchant_licenses_expiry_date; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_merchant_licenses_expiry_date ON public.merchant_licenses USING btree (expiry_date);


--
-- Name: idx_merchant_licenses_merchant_id; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_merchant_licenses_merchant_id ON public.merchant_licenses USING btree (merchant_id);


--
-- Name: idx_merchant_licenses_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_merchant_licenses_status ON public.merchant_licenses USING btree (status);


--
-- Name: idx_merchant_photos_category; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_merchant_photos_category ON public.merchant_photos USING btree (category);


--
-- Name: idx_merchants_license_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_merchants_license_status ON public.merchants USING btree (license_status);


--
-- Name: idx_merchants_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_merchants_status ON public.merchants USING btree (status);


--
-- Name: idx_notif_unread; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notif_unread ON public.notifications USING btree (user_id, is_read);


--
-- Name: idx_notif_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_notif_user ON public.notifications USING btree (user_id, created_at DESC);


--
-- Name: idx_product_scans_barcode; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_scans_barcode ON public.product_scans USING btree (product_barcode);


--
-- Name: idx_product_scans_time; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_product_scans_time ON public.product_scans USING btree (scan_time DESC);


--
-- Name: idx_savedArticles_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX "idx_savedArticles_user" ON public."savedArticles" USING btree (user_id, "createdTime" DESC);


--
-- Name: idx_schedules_dept_day; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_schedules_dept_day ON public.department_schedules USING btree (department_id, day_of_week);


--
-- Name: idx_users_email; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_email ON public.users USING btree (email);


--
-- Name: idx_users_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_status ON public.users USING btree (status);


--
-- Name: idx_users_username; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_users_username ON public.users USING btree (username);


--
-- Name: idx_wards_provinceid; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_wards_provinceid ON public.wards USING btree (province_id);


--
-- Name: kv_store_b36723fe_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_b36723fe_key_idx ON public.kv_store_b36723fe USING btree (key text_pattern_ops);


--
-- Name: kv_store_b36723fe_key_idx1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_b36723fe_key_idx1 ON public.kv_store_b36723fe USING btree (key text_pattern_ops);


--
-- Name: kv_store_b36723fe_key_idx2; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_b36723fe_key_idx2 ON public.kv_store_b36723fe USING btree (key text_pattern_ops);


--
-- Name: kv_store_b36723fe_key_idx3; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_b36723fe_key_idx3 ON public.kv_store_b36723fe USING btree (key text_pattern_ops);


--
-- Name: kv_store_bb2eb709_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_bb2eb709_key_idx ON public.kv_store_bb2eb709 USING btree (key text_pattern_ops);


--
-- Name: kv_store_bb2eb709_key_idx1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_bb2eb709_key_idx1 ON public.kv_store_bb2eb709 USING btree (key text_pattern_ops);


--
-- Name: kv_store_bb2eb709_key_idx2; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_bb2eb709_key_idx2 ON public.kv_store_bb2eb709 USING btree (key text_pattern_ops);


--
-- Name: kv_store_bb2eb709_key_idx3; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_bb2eb709_key_idx3 ON public.kv_store_bb2eb709 USING btree (key text_pattern_ops);


--
-- Name: kv_store_bbddaf26_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_bbddaf26_key_idx ON public.kv_store_bbddaf26 USING btree (key text_pattern_ops);


--
-- Name: kv_store_bbddaf26_key_idx1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_bbddaf26_key_idx1 ON public.kv_store_bbddaf26 USING btree (key text_pattern_ops);


--
-- Name: kv_store_bbddaf26_key_idx2; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_bbddaf26_key_idx2 ON public.kv_store_bbddaf26 USING btree (key text_pattern_ops);


--
-- Name: kv_store_bbddaf26_key_idx3; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_bbddaf26_key_idx3 ON public.kv_store_bbddaf26 USING btree (key text_pattern_ops);


--
-- Name: kv_store_bbddaf26_key_idx4; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_bbddaf26_key_idx4 ON public.kv_store_bbddaf26 USING btree (key text_pattern_ops);


--
-- Name: kv_store_bbddaf26_key_idx5; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_bbddaf26_key_idx5 ON public.kv_store_bbddaf26 USING btree (key text_pattern_ops);


--
-- Name: kv_store_bbddaf26_key_idx6; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_bbddaf26_key_idx6 ON public.kv_store_bbddaf26 USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx1; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx1 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx10; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx10 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx11; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx11 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx12; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx12 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx13; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx13 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx14; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx14 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx15; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx15 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx16; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx16 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx17; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx17 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx18; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx18 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx19; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx19 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx2; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx2 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx20; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx20 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx21; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx21 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx22; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx22 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx23; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx23 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx24; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx24 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx25; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx25 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx3; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx3 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx4; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx4 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx5; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx5 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx6; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx6 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx7; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx7 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx8; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx8 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: kv_store_e994bb5d_key_idx9; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX kv_store_e994bb5d_key_idx9 ON public.kv_store_e994bb5d USING btree (key text_pattern_ops);


--
-- Name: uq_provinces_code; Type: INDEX; Schema: public; Owner: -
--

CREATE UNIQUE INDEX uq_provinces_code ON public.provinces USING btree (code);


--
-- Name: bname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bname ON storage.buckets USING btree (name);


--
-- Name: bucketid_objname; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX bucketid_objname ON storage.objects USING btree (bucket_id, name);


--
-- Name: buckets_analytics_unique_name_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX buckets_analytics_unique_name_idx ON storage.buckets_analytics USING btree (name) WHERE (deleted_at IS NULL);


--
-- Name: idx_multipart_uploads_list; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_multipart_uploads_list ON storage.s3_multipart_uploads USING btree (bucket_id, key, created_at);


--
-- Name: idx_name_bucket_level_unique; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX idx_name_bucket_level_unique ON storage.objects USING btree (name COLLATE "C", bucket_id, level);


--
-- Name: idx_objects_bucket_id_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_bucket_id_name ON storage.objects USING btree (bucket_id, name COLLATE "C");


--
-- Name: idx_objects_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_objects_lower_name ON storage.objects USING btree ((path_tokens[level]), lower(name) text_pattern_ops, bucket_id, level);


--
-- Name: idx_prefixes_lower_name; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX idx_prefixes_lower_name ON storage.prefixes USING btree (bucket_id, level, ((string_to_array(name, '/'::text))[level]), lower(name) text_pattern_ops);


--
-- Name: name_prefix_search; Type: INDEX; Schema: storage; Owner: -
--

CREATE INDEX name_prefix_search ON storage.objects USING btree (name text_pattern_ops);


--
-- Name: objects_bucket_id_level_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX objects_bucket_id_level_idx ON storage.objects USING btree (bucket_id, level, name COLLATE "C");


--
-- Name: vector_indexes_name_bucket_id_idx; Type: INDEX; Schema: storage; Owner: -
--

CREATE UNIQUE INDEX vector_indexes_name_bucket_id_idx ON storage.vector_indexes USING btree (name, bucket_id);


--
-- Name: users on_auth_user_created; Type: TRIGGER; Schema: auth; Owner: -
--

CREATE TRIGGER on_auth_user_created AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();


--
-- Name: users on_auth_user_login; Type: TRIGGER; Schema: auth; Owner: -
--

CREATE TRIGGER on_auth_user_login BEFORE UPDATE ON auth.users FOR EACH ROW WHEN ((old.last_sign_in_at IS DISTINCT FROM new.last_sign_in_at)) EXECUTE FUNCTION public.sync_permissions_to_metadata();


--
-- Name: users on_auth_user_updated; Type: TRIGGER; Schema: auth; Owner: -
--

CREATE TRIGGER on_auth_user_updated AFTER UPDATE OF last_sign_in_at ON auth.users FOR EACH ROW EXECUTE FUNCTION public.handle_update_user_login();


--
-- Name: user_roles on_user_role_change; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER on_user_role_change AFTER INSERT OR DELETE OR UPDATE ON public.user_roles FOR EACH ROW EXECUTE FUNCTION public.sync_user_permissions_to_auth();


--
-- Name: point_status set_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER set_updated_at BEFORE UPDATE ON public.point_status FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: modules tr_update_modules; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_update_modules BEFORE UPDATE ON public.modules FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: permissions tr_update_permissions; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_update_permissions BEFORE UPDATE ON public.permissions FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: roles tr_update_roles; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_update_roles BEFORE UPDATE ON public.roles FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: users tr_update_users; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER tr_update_users BEFORE UPDATE ON public.users FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();


--
-- Name: merchants trg_after_update_merchant; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER trg_after_update_merchant AFTER UPDATE ON public.merchants FOR EACH ROW EXECUTE FUNCTION public.fn_log_all_merchant_changes();


--
-- Name: merchants update_merchants_updated_at; Type: TRIGGER; Schema: public; Owner: -
--

CREATE TRIGGER update_merchants_updated_at BEFORE UPDATE ON public.merchants FOR EACH ROW EXECUTE FUNCTION public.handle_updated_at();


--
-- Name: buckets enforce_bucket_name_length_trigger; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER enforce_bucket_name_length_trigger BEFORE INSERT OR UPDATE OF name ON storage.buckets FOR EACH ROW EXECUTE FUNCTION storage.enforce_bucket_name_length();


--
-- Name: objects objects_delete_delete_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_delete_delete_prefix AFTER DELETE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects objects_insert_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_insert_create_prefix BEFORE INSERT ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.objects_insert_prefix_trigger();


--
-- Name: objects objects_update_create_prefix; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER objects_update_create_prefix BEFORE UPDATE ON storage.objects FOR EACH ROW WHEN (((new.name <> old.name) OR (new.bucket_id <> old.bucket_id))) EXECUTE FUNCTION storage.objects_update_prefix_trigger();


--
-- Name: prefixes prefixes_create_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER prefixes_create_hierarchy BEFORE INSERT ON storage.prefixes FOR EACH ROW WHEN ((pg_trigger_depth() < 1)) EXECUTE FUNCTION storage.prefixes_insert_trigger();


--
-- Name: prefixes prefixes_delete_hierarchy; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER prefixes_delete_hierarchy AFTER DELETE ON storage.prefixes FOR EACH ROW EXECUTE FUNCTION storage.delete_prefix_hierarchy_trigger();


--
-- Name: objects update_objects_updated_at; Type: TRIGGER; Schema: storage; Owner: -
--

CREATE TRIGGER update_objects_updated_at BEFORE UPDATE ON storage.objects FOR EACH ROW EXECUTE FUNCTION storage.update_updated_at_column();


--
-- Name: identities identities_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.identities
    ADD CONSTRAINT identities_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: mfa_amr_claims mfa_amr_claims_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_amr_claims
    ADD CONSTRAINT mfa_amr_claims_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: mfa_challenges mfa_challenges_auth_factor_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_challenges
    ADD CONSTRAINT mfa_challenges_auth_factor_id_fkey FOREIGN KEY (factor_id) REFERENCES auth.mfa_factors(id) ON DELETE CASCADE;


--
-- Name: mfa_factors mfa_factors_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.mfa_factors
    ADD CONSTRAINT mfa_factors_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_authorizations oauth_authorizations_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_authorizations
    ADD CONSTRAINT oauth_authorizations_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_client_id_fkey FOREIGN KEY (client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: oauth_consents oauth_consents_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.oauth_consents
    ADD CONSTRAINT oauth_consents_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: one_time_tokens one_time_tokens_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.one_time_tokens
    ADD CONSTRAINT one_time_tokens_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: refresh_tokens refresh_tokens_session_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.refresh_tokens
    ADD CONSTRAINT refresh_tokens_session_id_fkey FOREIGN KEY (session_id) REFERENCES auth.sessions(id) ON DELETE CASCADE;


--
-- Name: saml_providers saml_providers_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_providers
    ADD CONSTRAINT saml_providers_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_flow_state_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_flow_state_id_fkey FOREIGN KEY (flow_state_id) REFERENCES auth.flow_state(id) ON DELETE CASCADE;


--
-- Name: saml_relay_states saml_relay_states_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.saml_relay_states
    ADD CONSTRAINT saml_relay_states_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_oauth_client_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_oauth_client_id_fkey FOREIGN KEY (oauth_client_id) REFERENCES auth.oauth_clients(id) ON DELETE CASCADE;


--
-- Name: sessions sessions_user_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sessions
    ADD CONSTRAINT sessions_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: sso_domains sso_domains_sso_provider_id_fkey; Type: FK CONSTRAINT; Schema: auth; Owner: -
--

ALTER TABLE ONLY auth.sso_domains
    ADD CONSTRAINT sso_domains_sso_provider_id_fkey FOREIGN KEY (sso_provider_id) REFERENCES auth.sso_providers(id) ON DELETE CASCADE;


--
-- Name: activityreport activityreport_departmentid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.activityreport
    ADD CONSTRAINT activityreport_departmentid_fkey FOREIGN KEY (departmentid) REFERENCES public.market_management_department(departmentid);


--
-- Name: areas areas_provinceId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.areas
    ADD CONSTRAINT "areas_provinceId_fkey" FOREIGN KEY ("provinceId") REFERENCES public.provinces(id) ON DELETE SET NULL;


--
-- Name: areas areas_wardId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.areas
    ADD CONSTRAINT "areas_wardId_fkey" FOREIGN KEY ("wardId") REFERENCES public.wards(id) ON DELETE SET NULL;


--
-- Name: category_map_points category_map_points_category_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_map_points
    ADD CONSTRAINT category_map_points_category_id_fkey FOREIGN KEY (category_id) REFERENCES public.categories(id) ON DELETE CASCADE;


--
-- Name: category_map_points category_map_points_map_point_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.category_map_points
    ADD CONSTRAINT category_map_points_map_point_id_fkey FOREIGN KEY (map_point_id) REFERENCES public.map_points(_id) ON DELETE CASCADE;


--
-- Name: complaintTimeline complaintTimeline_complaintId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."complaintTimeline"
    ADD CONSTRAINT "complaintTimeline_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES public.complaints(id) ON DELETE CASCADE;


--
-- Name: complaintViolationMap complaintViolationMap_complaintId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."complaintViolationMap"
    ADD CONSTRAINT "complaintViolationMap_complaintId_fkey" FOREIGN KEY ("complaintId") REFERENCES public.complaints(id) ON DELETE CASCADE;


--
-- Name: complaintViolationMap complaintViolationMap_violationCategoryId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."complaintViolationMap"
    ADD CONSTRAINT "complaintViolationMap_violationCategoryId_fkey" FOREIGN KEY ("violationCategoryId") REFERENCES public."violationCategory"(id);


--
-- Name: complaints complaint_mapPointId_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT "complaint_mapPointId_fkey" FOREIGN KEY ("mapPointId") REFERENCES public.map_points(_id);


--
-- Name: complaints complaints_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.provinces(id);


--
-- Name: complaints complaints_ward_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT complaints_ward_id_fkey FOREIGN KEY (ward_id) REFERENCES public.wards(id);


--
-- Name: department_schedules department_schedules_department_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_schedules
    ADD CONSTRAINT department_schedules_department_id_fkey FOREIGN KEY (department_id) REFERENCES public.market_management_department(id) ON DELETE CASCADE;


--
-- Name: departmentleader departmentleader_departmentid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departmentleader
    ADD CONSTRAINT departmentleader_departmentid_fkey FOREIGN KEY (departmentid) REFERENCES public.market_management_department(departmentid);


--
-- Name: complaints fk_complaint_merchant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.complaints
    ADD CONSTRAINT fk_complaint_merchant FOREIGN KEY (merchant_id) REFERENCES public.merchants(_id) ON DELETE SET NULL;


--
-- Name: department_areas fk_department_areas_area; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_areas
    ADD CONSTRAINT fk_department_areas_area FOREIGN KEY (area_id) REFERENCES public.areas(id);


--
-- Name: department_areas fk_department_areas_department; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_areas
    ADD CONSTRAINT fk_department_areas_department FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: department_users fk_department_users_department; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_users
    ADD CONSTRAINT fk_department_users_department FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: department_users fk_department_users_user; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.department_users
    ADD CONSTRAINT fk_department_users_user FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: departments fk_departments_parent; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.departments
    ADD CONSTRAINT fk_departments_parent FOREIGN KEY (parent_id) REFERENCES public.departments(id);


--
-- Name: map_inspection_evidences fk_evidence_result; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inspection_evidences
    ADD CONSTRAINT fk_evidence_result FOREIGN KEY (checklist_result_id) REFERENCES public.map_inspection_checklist_results(_id) ON DELETE SET NULL;


--
-- Name: map_inspection_evidences fk_evidence_session; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inspection_evidences
    ADD CONSTRAINT fk_evidence_session FOREIGN KEY (session_id) REFERENCES public.map_inspection_sessions(_id) ON DELETE CASCADE;


--
-- Name: map_inspection_sessions fk_inspection_merchant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inspection_sessions
    ADD CONSTRAINT fk_inspection_merchant FOREIGN KEY (merchant_id) REFERENCES public.merchants(_id) ON DELETE SET NULL;


--
-- Name: map_group_detail fk_map_group_detail_parent; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_group_detail
    ADD CONSTRAINT fk_map_group_detail_parent FOREIGN KEY (map_group_id) REFERENCES public.map_groups(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: map_inspection_plans fk_map_groups_department; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inspection_plans
    ADD CONSTRAINT fk_map_groups_department FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;


--
-- Name: map_points fk_map_point_merchant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_points
    ADD CONSTRAINT fk_map_point_merchant FOREIGN KEY (merchant_id) REFERENCES public.merchants(_id) ON DELETE SET NULL;


--
-- Name: map_points fk_map_points_department; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_points
    ADD CONSTRAINT fk_map_points_department FOREIGN KEY (department_id) REFERENCES public.departments(id) ON DELETE SET NULL;


--
-- Name: merchant_histories fk_merchant_histories_merchant; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.merchant_histories
    ADD CONSTRAINT fk_merchant_histories_merchant FOREIGN KEY (merchant_id) REFERENCES public.merchants(_id) ON DELETE CASCADE;


--
-- Name: merchant_licenses fk_merchant_licenses_merchants; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.merchant_licenses
    ADD CONSTRAINT fk_merchant_licenses_merchants FOREIGN KEY (merchant_id) REFERENCES public.merchants(_id) ON DELETE CASCADE;


--
-- Name: merchants fk_merchants_department; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.merchants
    ADD CONSTRAINT fk_merchants_department FOREIGN KEY (department_id) REFERENCES public.departments(id);


--
-- Name: merchants fk_merchants_province; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.merchants
    ADD CONSTRAINT fk_merchants_province FOREIGN KEY (province_id) REFERENCES public.provinces(id) ON DELETE SET NULL;


--
-- Name: merchants fk_merchants_ward; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.merchants
    ADD CONSTRAINT fk_merchants_ward FOREIGN KEY (ward_id) REFERENCES public.wards(id) ON DELETE SET NULL;


--
-- Name: map_inspection_checklist_results fk_results_session; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inspection_checklist_results
    ADD CONSTRAINT fk_results_session FOREIGN KEY (session_id) REFERENCES public.map_inspection_sessions(_id) ON DELETE CASCADE;


--
-- Name: map_inspection_checklist_results fk_results_template; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inspection_checklist_results
    ADD CONSTRAINT fk_results_template FOREIGN KEY (template_id) REFERENCES public.map_inspection_checklist_templates(_id);


--
-- Name: map_session_inspectors fk_session; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_session_inspectors
    ADD CONSTRAINT fk_session FOREIGN KEY (session_id) REFERENCES public.map_inspection_sessions(_id) ON DELETE CASCADE;


--
-- Name: map_session_inspectors fk_session_inspectors_personnel; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_session_inspectors
    ADD CONSTRAINT fk_session_inspectors_personnel FOREIGN KEY (personnel_id) REFERENCES public.personnel(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: map_inspection_sessions fk_sessions_campaigns; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inspection_sessions
    ADD CONSTRAINT fk_sessions_campaigns FOREIGN KEY (campaign_id) REFERENCES public.map_inspection_campaigns(id) ON DELETE CASCADE;


--
-- Name: map_inspection_sessions fk_sessions_map_points; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inspection_sessions
    ADD CONSTRAINT fk_sessions_map_points FOREIGN KEY (map_point_id) REFERENCES public.map_points(_id) ON UPDATE CASCADE ON DELETE SET NULL;


--
-- Name: map_inspection_violation_reports fk_violation_session; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inspection_violation_reports
    ADD CONSTRAINT fk_violation_session FOREIGN KEY (session_id) REFERENCES public.map_inspection_sessions(_id) ON DELETE CASCADE;


--
-- Name: map_inspection_violation_reports map_inspection_violation_reports_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inspection_violation_reports
    ADD CONSTRAINT map_inspection_violation_reports_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.provinces(id) ON DELETE SET NULL;


--
-- Name: map_inspection_violation_reports map_inspection_violation_reports_ward_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_inspection_violation_reports
    ADD CONSTRAINT map_inspection_violation_reports_ward_id_fkey FOREIGN KEY (ward_id) REFERENCES public.wards(id) ON DELETE SET NULL;


--
-- Name: map_point_hours map_point_hours_map_point_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_point_hours
    ADD CONSTRAINT map_point_hours_map_point_id_fkey FOREIGN KEY (map_point_id) REFERENCES public.map_points(_id) ON DELETE CASCADE;


--
-- Name: map_point_hours map_point_hours_merchant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_point_hours
    ADD CONSTRAINT map_point_hours_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES public.merchants(_id);


--
-- Name: map_point_status map_point_status_map_point_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_point_status
    ADD CONSTRAINT map_point_status_map_point_id_fkey FOREIGN KEY (map_point_id) REFERENCES public.map_points(_id) ON DELETE CASCADE;


--
-- Name: map_point_status map_point_status_point_status_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.map_point_status
    ADD CONSTRAINT map_point_status_point_status_id_fkey FOREIGN KEY (point_status_id) REFERENCES public.point_status(id) ON DELETE CASCADE;


--
-- Name: market_management_officials market_management_officials_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.market_management_officials
    ADD CONSTRAINT market_management_officials_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: market_management_team marketmanagementteam_departmentid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.market_management_team
    ADD CONSTRAINT marketmanagementteam_departmentid_fkey FOREIGN KEY (departmentid) REFERENCES public.market_management_department(departmentid);


--
-- Name: merchant_photos merchant_photos_merchant_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.merchant_photos
    ADD CONSTRAINT merchant_photos_merchant_id_fkey FOREIGN KEY (merchant_id) REFERENCES public.merchants(_id);


--
-- Name: objecttypes objecttypes_topicid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.objecttypes
    ADD CONSTRAINT objecttypes_topicid_fkey FOREIGN KEY (topicid) REFERENCES public.topics(id);


--
-- Name: permissions permissions_module_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_module_id_fkey FOREIGN KEY (module_id) REFERENCES public.modules(id) ON DELETE CASCADE;


--
-- Name: personnel personnel_departmentid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personnel
    ADD CONSTRAINT personnel_departmentid_fkey FOREIGN KEY (departmentid) REFERENCES public.market_management_department(departmentid);


--
-- Name: personnel personnel_teamid_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.personnel
    ADD CONSTRAINT personnel_teamid_fkey FOREIGN KEY (teamid) REFERENCES public.market_management_team(teamid);


--
-- Name: review_media review_media_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_media
    ADD CONSTRAINT review_media_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(_id) ON DELETE CASCADE;


--
-- Name: review_quick_tag_maps review_quick_tag_maps_review_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_quick_tag_maps
    ADD CONSTRAINT review_quick_tag_maps_review_id_fkey FOREIGN KEY (review_id) REFERENCES public.reviews(_id) ON DELETE CASCADE;


--
-- Name: review_quick_tag_maps review_quick_tag_maps_tag_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.review_quick_tag_maps
    ADD CONSTRAINT review_quick_tag_maps_tag_id_fkey FOREIGN KEY (tag_id) REFERENCES public.review_quick_tags(_id) ON DELETE RESTRICT;


--
-- Name: role_permissions role_permissions_permission_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_permission_id_fkey FOREIGN KEY (permission_id) REFERENCES public.permissions(id) ON DELETE CASCADE;


--
-- Name: role_permissions role_permissions_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.role_permissions
    ADD CONSTRAINT role_permissions_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: savedArticles savedArticles_article_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."savedArticles"
    ADD CONSTRAINT "savedArticles_article_id_fkey" FOREIGN KEY (article_id) REFERENCES public.articles(id) ON DELETE CASCADE;


--
-- Name: savedArticles savedArticles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public."savedArticles"
    ADD CONSTRAINT "savedArticles_user_id_fkey" FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_role_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_role_id_fkey FOREIGN KEY (role_id) REFERENCES public.roles(id) ON DELETE CASCADE;


--
-- Name: user_roles user_roles_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_roles
    ADD CONSTRAINT user_roles_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: wards wards_province_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.wards
    ADD CONSTRAINT wards_province_id_fkey FOREIGN KEY (province_id) REFERENCES public.provinces(id) ON UPDATE CASCADE ON DELETE RESTRICT;


--
-- Name: objects objects_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.objects
    ADD CONSTRAINT "objects_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: prefixes prefixes_bucketId_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.prefixes
    ADD CONSTRAINT "prefixes_bucketId_fkey" FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads s3_multipart_uploads_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads
    ADD CONSTRAINT s3_multipart_uploads_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets(id);


--
-- Name: s3_multipart_uploads_parts s3_multipart_uploads_parts_upload_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.s3_multipart_uploads_parts
    ADD CONSTRAINT s3_multipart_uploads_parts_upload_id_fkey FOREIGN KEY (upload_id) REFERENCES storage.s3_multipart_uploads(id) ON DELETE CASCADE;


--
-- Name: vector_indexes vector_indexes_bucket_id_fkey; Type: FK CONSTRAINT; Schema: storage; Owner: -
--

ALTER TABLE ONLY storage.vector_indexes
    ADD CONSTRAINT vector_indexes_bucket_id_fkey FOREIGN KEY (bucket_id) REFERENCES storage.buckets_vectors(id);


--
-- Name: audit_log_entries; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.audit_log_entries ENABLE ROW LEVEL SECURITY;

--
-- Name: flow_state; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.flow_state ENABLE ROW LEVEL SECURITY;

--
-- Name: identities; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.identities ENABLE ROW LEVEL SECURITY;

--
-- Name: instances; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.instances ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_amr_claims; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_amr_claims ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_challenges; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_challenges ENABLE ROW LEVEL SECURITY;

--
-- Name: mfa_factors; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.mfa_factors ENABLE ROW LEVEL SECURITY;

--
-- Name: one_time_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.one_time_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: refresh_tokens; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.refresh_tokens ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: saml_relay_states; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.saml_relay_states ENABLE ROW LEVEL SECURITY;

--
-- Name: schema_migrations; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.schema_migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: sessions; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_domains; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_domains ENABLE ROW LEVEL SECURITY;

--
-- Name: sso_providers; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.sso_providers ENABLE ROW LEVEL SECURITY;

--
-- Name: users; Type: ROW SECURITY; Schema: auth; Owner: -
--

ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

--
-- Name: banks Allow public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access" ON public.banks FOR SELECT USING (true);


--
-- Name: category_map_points Allow public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access" ON public.category_map_points FOR SELECT USING (true);


--
-- Name: district_boundaries Allow public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access" ON public.district_boundaries FOR SELECT USING (true);


--
-- Name: map_legal_documents Allow public read access; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access" ON public.map_legal_documents FOR SELECT USING (true);


--
-- Name: map_inspection_campaigns Allow public read access for campaigns; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access for campaigns" ON public.map_inspection_campaigns FOR SELECT USING (true);


--
-- Name: map_inspection_plans Allow public read access for plans; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access for plans" ON public.map_inspection_plans FOR SELECT USING (true);


--
-- Name: map_inspection_reports Allow public read access for reports; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access for reports" ON public.map_inspection_reports FOR SELECT USING (true);


--
-- Name: map_inspection_sessions Allow public read access for sessions; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow public read access for sessions" ON public.map_inspection_sessions FOR SELECT USING (true);


--
-- Name: merchants Allow read merchants; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Allow read merchants" ON public.merchants FOR SELECT USING (true);


--
-- Name: users Cho phép tạo người dùng mới; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Cho phép tạo người dùng mới" ON public.users FOR INSERT WITH CHECK (true);


--
-- Name: map_point_hours Cho phép xem công khai; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Cho phép xem công khai" ON public.map_point_hours FOR SELECT USING (true);


--
-- Name: map_inspection_plans Enable insert for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable insert for all users" ON public.map_inspection_plans FOR INSERT WITH CHECK (true);


--
-- Name: map_inspection_sessions Enable insert for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable insert for all users" ON public.map_inspection_sessions FOR INSERT WITH CHECK (true);


--
-- Name: merchant_histories Enable insert for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable insert for all users" ON public.merchant_histories FOR INSERT WITH CHECK (true);


--
-- Name: map_groups Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.map_groups FOR SELECT USING (true);


--
-- Name: map_inspection_plans Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.map_inspection_plans FOR SELECT USING (true);


--
-- Name: map_inspection_sessions Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.map_inspection_sessions FOR SELECT USING (true);


--
-- Name: merchant_histories Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.merchant_histories FOR SELECT USING (true);


--
-- Name: permissions Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.permissions FOR SELECT USING (true);


--
-- Name: role_permissions Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.role_permissions FOR SELECT USING (true);


--
-- Name: roles Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.roles FOR SELECT USING (true);


--
-- Name: user_roles Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.user_roles FOR SELECT USING (true);


--
-- Name: users Enable read access for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable read access for all users" ON public.users FOR SELECT USING (true);


--
-- Name: map_inspection_plans Enable update for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable update for all users" ON public.map_inspection_plans FOR UPDATE USING (true);


--
-- Name: map_inspection_sessions Enable update for all users; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Enable update for all users" ON public.map_inspection_sessions FOR UPDATE USING (true);


--
-- Name: point_status Toàn quyền công khai cho bảng point_status; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Toàn quyền công khai cho bảng point_status" ON public.point_status USING (true) WITH CHECK (true);


--
-- Name: users Users can update their own profile; Type: POLICY; Schema: public; Owner: -
--

CREATE POLICY "Users can update their own profile" ON public.users FOR UPDATE USING ((auth.uid() = id)) WITH CHECK ((auth.uid() = id));


--
-- Name: category_map_points; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.category_map_points ENABLE ROW LEVEL SECURITY;

--
-- Name: district_boundaries; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.district_boundaries ENABLE ROW LEVEL SECURITY;

--
-- Name: kv_store_b36723fe; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.kv_store_b36723fe ENABLE ROW LEVEL SECURITY;

--
-- Name: kv_store_bb2eb709; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.kv_store_bb2eb709 ENABLE ROW LEVEL SECURITY;

--
-- Name: kv_store_bbddaf26; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.kv_store_bbddaf26 ENABLE ROW LEVEL SECURITY;

--
-- Name: kv_store_e994bb5d; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.kv_store_e994bb5d ENABLE ROW LEVEL SECURITY;

--
-- Name: map_inspection_campaigns; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.map_inspection_campaigns ENABLE ROW LEVEL SECURITY;

--
-- Name: map_inspection_plans; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.map_inspection_plans ENABLE ROW LEVEL SECURITY;

--
-- Name: map_inspection_reports; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.map_inspection_reports ENABLE ROW LEVEL SECURITY;

--
-- Name: map_inspection_sessions; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.map_inspection_sessions ENABLE ROW LEVEL SECURITY;

--
-- Name: map_legal_documents; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.map_legal_documents ENABLE ROW LEVEL SECURITY;

--
-- Name: market_management_officials; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.market_management_officials ENABLE ROW LEVEL SECURITY;

--
-- Name: merchant_histories; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.merchant_histories ENABLE ROW LEVEL SECURITY;

--
-- Name: review_media; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.review_media ENABLE ROW LEVEL SECURITY;

--
-- Name: review_quick_tag_maps; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.review_quick_tag_maps ENABLE ROW LEVEL SECURITY;

--
-- Name: review_quick_tags; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.review_quick_tags ENABLE ROW LEVEL SECURITY;

--
-- Name: risk_cases; Type: ROW SECURITY; Schema: public; Owner: -
--

ALTER TABLE public.risk_cases ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_analytics; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_analytics ENABLE ROW LEVEL SECURITY;

--
-- Name: buckets_vectors; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.buckets_vectors ENABLE ROW LEVEL SECURITY;

--
-- Name: migrations; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.migrations ENABLE ROW LEVEL SECURITY;

--
-- Name: objects; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

--
-- Name: prefixes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.prefixes ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads ENABLE ROW LEVEL SECURITY;

--
-- Name: s3_multipart_uploads_parts; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.s3_multipart_uploads_parts ENABLE ROW LEVEL SECURITY;

--
-- Name: vector_indexes; Type: ROW SECURITY; Schema: storage; Owner: -
--

ALTER TABLE storage.vector_indexes ENABLE ROW LEVEL SECURITY;

--
-- PostgreSQL database dump complete
--

\unrestrict UvUuSS1PC3soxGKobWlJEVl0hEX4JU3cjMoofaEAwO7PJeDpAip6oheamkh09d0

