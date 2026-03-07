-- Drop existing policies
DROP POLICY IF EXISTS "Enable full access for authenticated users on task_checklists" ON task_checklists;
DROP POLICY IF EXISTS "Enable full access for authenticated users on task_checklist_items" ON task_checklist_items;

-- Create generic policies for local development/testing that allow anonymous and authenticated access
CREATE POLICY "Enable full access for all users on task_checklists" 
  ON task_checklists
  FOR ALL
  USING (true)
  WITH CHECK (true);

CREATE POLICY "Enable full access for all users on task_checklist_items" 
  ON task_checklist_items
  FOR ALL
  USING (true)
  WITH CHECK (true);
