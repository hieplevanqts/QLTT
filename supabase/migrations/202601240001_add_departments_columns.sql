ALTER TABLE public.departments
ADD COLUMN IF NOT EXISTS short_name varchar;

ALTER TABLE public.departments
ADD COLUMN IF NOT EXISTS type varchar;

ALTER TABLE public.departments
ADD COLUMN IF NOT EXISTS is_active boolean DEFAULT true;
