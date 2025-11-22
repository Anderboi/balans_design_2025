-- =====================================================
-- Функция для создания проекта с автоматическим добавлением владельца
-- =====================================================

CREATE OR REPLACE FUNCTION create_project_with_owner(
  p_name TEXT,
  p_address TEXT,
  p_area NUMERIC,
  p_client_id UUID,
  p_stage TEXT,
  p_residents TEXT,
  p_demolition_info TEXT,
  p_construction_info TEXT
)
RETURNS json
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_project_id UUID;
  v_user_id UUID;
  v_result json;
BEGIN
  -- Получить текущего пользователя
  v_user_id := auth.uid();
  
  IF v_user_id IS NULL THEN
    RAISE EXCEPTION 'User not authenticated';
  END IF;

  -- Создать проект
  INSERT INTO projects (name, address, area, client_id, stage, residents, demolition_info, construction_info)
  VALUES (p_name, p_address, p_area, p_client_id, p_stage, p_residents, p_demolition_info, p_construction_info)
  RETURNING id INTO v_project_id;

  -- Добавить создателя как владельца
  INSERT INTO project_members (project_id, user_id, role)
  VALUES (v_project_id, v_user_id, 'owner');

  -- Вернуть созданный проект
  SELECT json_build_object(
    'id', id,
    'name', name,
    'address', address,
    'area', area,
    'client_id', client_id,
    'stage', stage,
    'residents', residents,
    'demolition_info', demolition_info,
    'construction_info', construction_info,
    'created_at', created_at,
    'updated_at', updated_at
  ) INTO v_result
  FROM projects
  WHERE id = v_project_id;

  RETURN v_result;
END;
$$;

-- =====================================================
-- Helper функция для проверки роли пользователя в проекте (избегает рекурсии RLS)
-- =====================================================

CREATE OR REPLACE FUNCTION get_user_project_role(p_project_id UUID, p_user_id UUID)
RETURNS TEXT
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_role TEXT;
BEGIN
  SELECT role INTO v_role
  FROM project_members
  WHERE project_id = p_project_id AND user_id = p_user_id;
  
  RETURN v_role;
END;
$$;

-- =====================================================
-- RLS политики для project_members
-- =====================================================

-- Удалить существующие политики если они есть
DROP POLICY IF EXISTS "project_owners_can_manage_members" ON project_members;
DROP POLICY IF EXISTS "project_members_can_view_members" ON project_members;

-- Включить RLS если ещё не включено
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;

-- Владельцы проекта могут управлять участниками (INSERT, UPDATE, DELETE)
CREATE POLICY "project_owners_can_manage_members" ON project_members
FOR ALL
USING (
  get_user_project_role(project_id, auth.uid()) = 'owner'
)
WITH CHECK (
  get_user_project_role(project_id, auth.uid()) = 'owner'
);

-- Участники проекта могут видеть других участников
CREATE POLICY "project_members_can_view_members" ON project_members
FOR SELECT
USING (
  get_user_project_role(project_id, auth.uid()) IS NOT NULL
);

