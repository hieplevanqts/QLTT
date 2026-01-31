-- Create or replace RPC function: update_merchant_status
-- Handles updating merchant status with validation
-- This function supports statuses: active, pending, suspended, rejected, refuse

CREATE OR REPLACE FUNCTION public.update_merchant_status(
  p_merchant_id uuid,
  p_status text
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_result json;
  v_valid_statuses text[] := ARRAY['active', 'pending', 'suspended', 'rejected', 'refuse'];
BEGIN
  -- Validate status
  IF NOT p_status = ANY(v_valid_statuses) THEN
    RAISE EXCEPTION 'Invalid status: %', p_status;
  END IF;

  -- Update merchant status
  UPDATE public.merchants
  SET 
    status = p_status,
    updated_at = NOW()
  WHERE _id = p_merchant_id;

  -- Return result
  SELECT json_build_object(
    'success', true,
    'merchant_id', p_merchant_id,
    'new_status', p_status,
    'timestamp', NOW()::text
  ) INTO v_result;

  RETURN v_result;
EXCEPTION WHEN OTHERS THEN
  RETURN json_build_object(
    'success', false,
    'error', SQLERRM,
    'merchant_id', p_merchant_id
  );
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION public.update_merchant_status(uuid, text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.update_merchant_status(uuid, text) TO anon;
