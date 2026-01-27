-- APPROVED SQL (do not run from app; apply via Supabase SQL editor).

ALTER TABLE public.departments
ADD COLUMN IF NOT EXISTS short_name varchar;

ALTER TABLE public.departments
ADD COLUMN IF NOT EXISTS type varchar;

ALTER TABLE public.departments
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;

ALTER TABLE public.departments
ADD COLUMN IF NOT EXISTS order_index integer;
