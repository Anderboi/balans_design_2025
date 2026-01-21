ALTER TABLE materials ADD COLUMN IF NOT EXISTS custom_specifications JSONB DEFAULT '[]'::jsonb;
