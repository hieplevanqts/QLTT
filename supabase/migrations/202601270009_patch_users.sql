-- Users table alignment + indexes for IAM user management.
-- Do not run from app; apply via Supabase SQL editor after confirmation.

-- 1) Add missing columns to public.users (idempotent).
ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS "lastLoginAt" timestamptz;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS locked_at timestamptz;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS locked_by uuid;

ALTER TABLE public.users
  ADD COLUMN IF NOT EXISTS note text;

-- 2) Add missing columns to public.user_roles (idempotent).
ALTER TABLE public.user_roles
  ADD COLUMN IF NOT EXISTS is_primary boolean DEFAULT false;

ALTER TABLE public.user_roles
  ADD COLUMN IF NOT EXISTS assigned_at timestamptz DEFAULT now();

ALTER TABLE public.user_roles
  ADD COLUMN IF NOT EXISTS assigned_by uuid;

UPDATE public.user_roles
SET is_primary = false
WHERE is_primary IS NULL;

-- 3) Indexes (idempotent).
CREATE INDEX IF NOT EXISTS idx_users_status ON public.users (status);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON public.users (created_at);
CREATE INDEX IF NOT EXISTS idx_users_username_lower ON public.users (lower(username));
CREATE INDEX IF NOT EXISTS idx_users_email_lower ON public.users (lower(email));
CREATE INDEX IF NOT EXISTS idx_users_full_name_lower ON public.users (lower(full_name));

CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles (role_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles (user_id);

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1
    FROM pg_constraint
    WHERE conname = 'user_roles_user_id_role_id_key'
      AND conrelid = 'public.user_roles'::regclass
  ) THEN
    ALTER TABLE public.user_roles
      ADD CONSTRAINT user_roles_user_id_role_id_key UNIQUE (user_id, role_id);
  END IF;
END $$;
