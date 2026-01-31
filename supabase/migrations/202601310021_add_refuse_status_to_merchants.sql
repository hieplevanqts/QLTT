-- Add 'refuse' status to merchants table valid statuses
-- Migration: 202601310021_add_refuse_status_to_merchants
-- Date: 2026-01-31
-- Description: Add 'refuse' as a valid status for merchants (store operations)

-- Drop existing constraint
ALTER TABLE public.merchants
DROP CONSTRAINT IF EXISTS merchants_status_check;

-- Add new constraint with 'refuse' status included
ALTER TABLE public.merchants
ADD CONSTRAINT merchants_status_check
CHECK (status IN ('active', 'pending', 'suspended', 'rejected', 'refuse'));

-- Create index for status filtering if not exists
CREATE INDEX IF NOT EXISTS idx_merchants_status ON public.merchants(status);
