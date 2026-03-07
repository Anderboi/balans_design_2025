-- Migration: Add tags and start_date to tasks, and restrict checklist RLS

-- 1. Add columns to tasks table
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS tags TEXT[] DEFAULT '{}';
ALTER TABLE tasks ADD COLUMN IF NOT EXISTS start_date TIMESTAMP WITH TIME ZONE;

-- 2. Restrict RLS for checklists to authenticated users only (as per user request)
DROP POLICY IF EXISTS "Enable full access for all users on task_checklists" ON task_checklists;
DROP POLICY IF EXISTS "Enable full access for all users on task_checklist_items" ON task_checklist_items;

CREATE POLICY "Enable access for authenticated users only on task_checklists" 
  ON task_checklists
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable access for authenticated users only on task_checklist_items" 
  ON task_checklist_items
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);
