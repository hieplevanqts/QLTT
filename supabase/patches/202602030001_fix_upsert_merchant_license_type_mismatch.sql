-- =====================================================
-- FIX: PGRST203 - Quá nhiều function overloads
-- Sửa lỗi: "Could not choose the best candidate function"
-- =====================================================
-- Nguyên nhân: 6 function overloads khác nhau
-- Giải pháp: Drop ALL, tạo 1 function duy nhất với ALL parameters
-- =====================================================

-- ⚠️ CHẠY SQL NÀY TRONG SUPABASE DASHBOARD > SQL EDITOR

-- =====================================================
-- BƯỚC 1: Drop TẤT CẢ 6 overloads hiện có
-- (Bỏ qua lỗi nếu không tồn tại)
-- =====================================================

-- Overload 1: (text, uuid, text, text, date, date, text, text, text, text, text, text, smallint, smallint)
DROP FUNCTION IF EXISTS public.upsert_merchant_license(text, uuid, text, text, date, date, text, text, text, text, text, text, smallint, smallint);

-- Overload 2: + (p_holder_name, p_nationality, p_permanent_address, p_place_of_origin, p_sex)
DROP FUNCTION IF EXISTS public.upsert_merchant_license(text, uuid, text, text, date, date, text, text, text, text, text, text, smallint, smallint, text, text, text, text, text);

-- Overload 3: + (p_business_field, p_activity_scope, p_inspection_result, p_rent_price_monthly, p_rent_start_date, p_rent_end_date, p_property_address, p_lessor_name, p_lessee_name)
DROP FUNCTION IF EXISTS public.upsert_merchant_license(text, uuid, text, text, date, date, text, text, text, text, text, smallint, smallint, text, text, text, text, text, text, bigint, date, date, text, text, text);

-- Overload 4: + p_deleted_at
DROP FUNCTION IF EXISTS public.upsert_merchant_license(text, uuid, text, text, date, date, text, text, text, text, text, smallint, smallint, text, text, text, text, text, text, bigint, date, date, text, text, text, timestamp with time zone);

-- Overload 5: (p_merchant_id, p_license_type, p_id => uuid, ...)
DROP FUNCTION IF EXISTS public.upsert_merchant_license(uuid, uuid, text, text, date, date, text, text, text, text, text, smallint, smallint, text, text, text, text, text, text, bigint, date, date, text, text, text, timestamp with time zone);

-- Overload 6: (p_id => uuid, p_merchant_id => uuid, ...)
DROP FUNCTION IF EXISTS public.upsert_merchant_license(uuid, uuid, text, text, date, date, text, text, text, text, text, smallint, smallint, text, text, text, text, text, text, text, text, bigint, date, date, text, text, text);

-- =====================================================
-- BƯỚC 2: Tạo 1 FUNCTION DUY NHẤT với ALL parameters
-- Sử dụng DEFAULT NULL để tương thích với tất cả calls
-- =====================================================
CREATE OR REPLACE FUNCTION public.upsert_merchant_license(
  -- Core identifiers - ALWAYS TEXT để match cột _id TEXT trong bảng
  p_id TEXT DEFAULT NULL,
  p_merchant_id UUID DEFAULT NULL,
  
  -- License basics - REQUIRED
  p_license_type TEXT DEFAULT NULL,
  p_license_number TEXT DEFAULT NULL,
  p_issued_date DATE DEFAULT NULL,
  p_expiry_date DATE DEFAULT NULL,
  p_status TEXT DEFAULT 'active',
  
  -- Issuer info
  p_issued_by TEXT DEFAULT NULL,
  p_issued_by_name TEXT DEFAULT NULL,
  
  -- Files
  p_file_url TEXT DEFAULT NULL,
  p_file_url_2 TEXT DEFAULT NULL,
  
  -- Status flags
  p_approval_status SMALLINT DEFAULT NULL,
  p_validity_status SMALLINT DEFAULT NULL,
  
  -- Notes
  p_notes TEXT DEFAULT NULL,
  
  -- CCCD/CMND Fields (Identity Card)
  p_holder_name TEXT DEFAULT NULL,
  p_permanent_address TEXT DEFAULT NULL,
  p_nationality TEXT DEFAULT NULL,
  p_place_of_origin TEXT DEFAULT NULL,
  p_sex TEXT DEFAULT NULL,
  
  -- Business License Fields
  p_business_field TEXT DEFAULT NULL,
  p_activity_scope TEXT DEFAULT NULL,
  p_inspection_result TEXT DEFAULT NULL,
  p_owner_name TEXT DEFAULT NULL,
  p_business_name TEXT DEFAULT NULL,
  
  -- Rental Contract Fields
  p_lessor_name TEXT DEFAULT NULL,
  p_lessee_name TEXT DEFAULT NULL,
  p_rent_price_monthly BIGINT DEFAULT NULL,
  p_rent_start_date DATE DEFAULT NULL,
  p_rent_end_date DATE DEFAULT NULL,
  p_property_address TEXT DEFAULT NULL,
  
  -- Soft delete
  p_deleted_at TIMESTAMPTZ DEFAULT NULL
)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_license_id TEXT;
  v_result JSONB;
BEGIN
  -- Validate required fields
  IF p_merchant_id IS NULL THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'p_merchant_id is required',
      'error_code', 'VALIDATION_ERROR'
    );
  END IF;
  
  IF p_license_type IS NULL OR p_license_type = '' THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', 'p_license_type is required',
      'error_code', 'VALIDATION_ERROR'
    );
  END IF;
  
  -- Generate new ID if inserting
  IF p_id IS NULL OR p_id = '' THEN
    v_license_id := gen_random_uuid()::TEXT;
  ELSE
    v_license_id := p_id;
  END IF;
  
  -- UPSERT: Insert or update
  INSERT INTO merchant_licenses (
    _id,
    merchant_id,
    license_type,
    license_number,
    issued_date,
    expiry_date,
    status,
    issued_by,
    issued_by_name,
    file_url,
    file_url_2,
    approval_status,
    validity_status,
    notes,
    holder_name,
    permanent_address,
    nationality,
    place_of_origin,
    sex,
    business_field,
    activity_scope,
    inspection_result,
    owner_name,
    business_name,
    lessor_name,
    lessee_name,
    rent_price_monthly,
    rent_start_date,
    rent_end_date,
    property_address,
    deleted_at,
    created_at,
    updated_at
  ) VALUES (
    v_license_id,
    p_merchant_id,
    p_license_type,
    p_license_number,
    p_issued_date,
    p_expiry_date,
    COALESCE(p_status, 'active'),
    COALESCE(p_issued_by, ''),
    p_issued_by_name,
    p_file_url,
    p_file_url_2,
    p_approval_status,
    p_validity_status,
    p_notes,
    p_holder_name,
    p_permanent_address,
    p_nationality,
    p_place_of_origin,
    p_sex,
    p_business_field,
    p_activity_scope,
    p_inspection_result,
    p_owner_name,
    p_business_name,
    p_lessor_name,
    p_lessee_name,
    p_rent_price_monthly,
    p_rent_start_date,
    p_rent_end_date,
    p_property_address,
    p_deleted_at,
    NOW(),
    NOW()
  )
  ON CONFLICT (_id) DO UPDATE SET
    license_type = COALESCE(EXCLUDED.license_type, merchant_licenses.license_type),
    license_number = COALESCE(EXCLUDED.license_number, merchant_licenses.license_number),
    issued_date = COALESCE(EXCLUDED.issued_date, merchant_licenses.issued_date),
    expiry_date = COALESCE(EXCLUDED.expiry_date, merchant_licenses.expiry_date),
    status = COALESCE(EXCLUDED.status, merchant_licenses.status),
    issued_by = COALESCE(EXCLUDED.issued_by, merchant_licenses.issued_by),
    issued_by_name = COALESCE(EXCLUDED.issued_by_name, merchant_licenses.issued_by_name),
    file_url = COALESCE(EXCLUDED.file_url, merchant_licenses.file_url),
    file_url_2 = COALESCE(EXCLUDED.file_url_2, merchant_licenses.file_url_2),
    approval_status = COALESCE(EXCLUDED.approval_status, merchant_licenses.approval_status),
    validity_status = COALESCE(EXCLUDED.validity_status, merchant_licenses.validity_status),
    notes = COALESCE(EXCLUDED.notes, merchant_licenses.notes),
    holder_name = COALESCE(EXCLUDED.holder_name, merchant_licenses.holder_name),
    permanent_address = COALESCE(EXCLUDED.permanent_address, merchant_licenses.permanent_address),
    nationality = COALESCE(EXCLUDED.nationality, merchant_licenses.nationality),
    place_of_origin = COALESCE(EXCLUDED.place_of_origin, merchant_licenses.place_of_origin),
    sex = COALESCE(EXCLUDED.sex, merchant_licenses.sex),
    business_field = COALESCE(EXCLUDED.business_field, merchant_licenses.business_field),
    activity_scope = COALESCE(EXCLUDED.activity_scope, merchant_licenses.activity_scope),
    inspection_result = COALESCE(EXCLUDED.inspection_result, merchant_licenses.inspection_result),
    owner_name = COALESCE(EXCLUDED.owner_name, merchant_licenses.owner_name),
    business_name = COALESCE(EXCLUDED.business_name, merchant_licenses.business_name),
    lessor_name = COALESCE(EXCLUDED.lessor_name, merchant_licenses.lessor_name),
    lessee_name = COALESCE(EXCLUDED.lessee_name, merchant_licenses.lessee_name),
    rent_price_monthly = COALESCE(EXCLUDED.rent_price_monthly, merchant_licenses.rent_price_monthly),
    rent_start_date = COALESCE(EXCLUDED.rent_start_date, merchant_licenses.rent_start_date),
    rent_end_date = COALESCE(EXCLUDED.rent_end_date, merchant_licenses.rent_end_date),
    property_address = COALESCE(EXCLUDED.property_address, merchant_licenses.property_address),
    deleted_at = COALESCE(EXCLUDED.deleted_at, merchant_licenses.deleted_at),
    updated_at = NOW()
  RETURNING ROW_TO_JSON(merchant_licenses.*) INTO v_result;
  
  RETURN jsonb_build_object(
    'success', true,
    'data', v_result,
    'action', CASE WHEN v_result->>'created_at' = v_result->>'updated_at' THEN 'inserted' ELSE 'updated' END
  );

EXCEPTION
  WHEN OTHERS THEN
    RETURN jsonb_build_object(
      'success', false,
      'error', SQLERRM,
      'error_code', SQLSTATE
    );
END;
$$;

-- Grant permissions to authenticated and service_role users
GRANT EXECUTE ON FUNCTION public.upsert_merchant_license TO authenticated;
GRANT EXECUTE ON FUNCTION public.upsert_merchant_license TO service_role;

-- =====================================================
-- KIỂM TRA
-- =====================================================
-- Verify chỉ có 1 function duy nhất:
SELECT COUNT(*) as function_count
FROM pg_proc p
JOIN pg_namespace n ON p.pronamespace = n.oid
WHERE n.nspname = 'public' AND p.proname = 'upsert_merchant_license';
