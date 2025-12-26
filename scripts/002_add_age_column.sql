-- Add age column to recent_bypasses table
ALTER TABLE public.recent_bypasses ADD COLUMN IF NOT EXISTS age INTEGER DEFAULT 2014;

-- Create index for age column
CREATE INDEX IF NOT EXISTS idx_recent_bypasses_age ON public.recent_bypasses(age);
