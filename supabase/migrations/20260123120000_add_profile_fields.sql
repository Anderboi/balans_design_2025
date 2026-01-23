ALTER TABLE profiles
ADD COLUMN IF NOT EXISTS company text,
ADD COLUMN IF NOT EXISTS first_name text,
ADD COLUMN IF NOT EXISTS last_name text,
ADD COLUMN IF NOT EXISTS email text;
