-- Department location + scoping constraints
-- Run in Supabase SQL editor as admin.

-- 1) Location fields for map pin
ALTER TABLE departments
  ADD COLUMN IF NOT EXISTS latitude double precision,
  ADD COLUMN IF NOT EXISTS longitude double precision;

-- 2) Unique identifiers (ensure no duplicates before applying)
CREATE UNIQUE INDEX IF NOT EXISTS departments_address_unique
  ON departments (address)
  WHERE address IS NOT NULL;

CREATE UNIQUE INDEX IF NOT EXISTS departments_code_unique
  ON departments (code)
  WHERE code IS NOT NULL;

-- 3) Auto-derive level from code length
CREATE OR REPLACE FUNCTION set_department_level_from_code()
RETURNS trigger
LANGUAGE plpgsql
AS $$
DECLARE
  code_len integer;
BEGIN
  IF NEW.code IS NULL THEN
    RETURN NEW;
  END IF;

  code_len := length(trim(NEW.code));
  IF code_len >= 2 AND code_len % 2 = 0 THEN
    NEW.level := code_len / 2;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_departments_set_level ON departments;
CREATE TRIGGER trg_departments_set_level
BEFORE INSERT OR UPDATE OF code
ON departments
FOR EACH ROW
EXECUTE FUNCTION set_department_level_from_code();

-- 4) Level constraints (QT=2 -> 1, QT01=4 -> 2, QT0102=6 -> 3, QT010203=8 -> 4)
ALTER TABLE departments DROP CONSTRAINT IF EXISTS departments_level_check;
ALTER TABLE departments ADD CONSTRAINT departments_level_check
  CHECK (level >= 1 AND level <= 4);

ALTER TABLE departments DROP CONSTRAINT IF EXISTS departments_code_level_check;
ALTER TABLE departments ADD CONSTRAINT departments_code_level_check
  CHECK (
    code IS NULL
    OR (
      length(code) IN (2, 4, 6, 8)
      AND level = length(code) / 2
    )
  );

-- 5) Enforce single department per user for roles except user/shop
CREATE OR REPLACE FUNCTION enforce_single_department_for_roles()
RETURNS trigger
LANGUAGE plpgsql
AS $$
BEGIN
  IF EXISTS (
    SELECT 1
    FROM user_roles ur
    JOIN roles r ON r.id = ur.role_id
    WHERE ur.user_id = NEW.user_id
      AND lower(r.code) NOT IN ('user', 'shop')
  ) THEN
    IF EXISTS (
      SELECT 1
      FROM department_users du
      WHERE du.user_id = NEW.user_id
        AND du.id IS DISTINCT FROM NEW.id
    ) THEN
      RAISE EXCEPTION 'User % can only belong to one department for current role', NEW.user_id;
    END IF;
  END IF;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS trg_department_users_single_department ON department_users;
CREATE TRIGGER trg_department_users_single_department
BEFORE INSERT OR UPDATE ON department_users
FOR EACH ROW
EXECUTE FUNCTION enforce_single_department_for_roles();
