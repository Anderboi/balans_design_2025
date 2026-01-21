ALTER TABLE materials ADD COLUMN IF NOT EXISTS attachments JSONB DEFAULT '[]'::jsonb;
