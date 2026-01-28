-- Add object_info column to project_briefs table
ALTER TABLE project_briefs
ADD COLUMN object_info jsonb DEFAULT '{}'::jsonb;

-- Add comment to describe the column
COMMENT ON COLUMN project_briefs.object_info IS 'Stores object information including location, elevator equipment, technical conditions, responsible person, and documentation';
