ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS notifications_new_tasks boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS notifications_comments boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS notifications_project_statuses boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS notifications_file_uploads boolean DEFAULT true,
ADD COLUMN IF NOT EXISTS notifications_marketing boolean DEFAULT false;
