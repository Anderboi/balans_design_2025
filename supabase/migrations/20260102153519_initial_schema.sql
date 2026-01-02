-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Profiles (Team members)
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  username TEXT,
  full_name TEXT,
  avatar_url TEXT,
  email TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. Projects
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  address TEXT,
  area NUMERIC,
  stage TEXT,
  client_id UUID,
  residents TEXT,
  demolition_info TEXT,
  construction_info TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. Project Members (Access control)
CREATE TABLE IF NOT EXISTS project_members (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT NOT NULL, -- 'owner', 'designer', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE (project_id, user_id)
);

-- 4. Rooms
CREATE TABLE IF NOT EXISTS rooms (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  area NUMERIC,
  preferred_finishes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. Tasks
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL,
  priority TEXT,
  due_date TIMESTAMP WITH TIME ZONE,
  assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. Task Participants (Observers)
CREATE TABLE IF NOT EXISTS task_participants (
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  user_id UUID REFERENCES profiles(id) ON DELETE CASCADE,
  role TEXT DEFAULT 'observer',
  PRIMARY KEY (task_id, user_id)
);

-- 7. Task Comments
CREATE TABLE IF NOT EXISTS task_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  task_id UUID REFERENCES tasks(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  user_id UUID REFERENCES profiles(id) ON DELETE SET NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 8. Materials & Specifications
CREATE TABLE IF NOT EXISTS materials (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  manufacturer TEXT,
  supplier TEXT,
  price NUMERIC,
  unit TEXT,
  description TEXT,
  size TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS specifications (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID REFERENCES projects(id) ON DELETE CASCADE,
  material_id UUID REFERENCES materials(id) ON DELETE SET NULL,
  room_id UUID REFERENCES rooms(id) ON DELETE SET NULL,
  quantity NUMERIC NOT NULL,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 9. Companies & Contacts
CREATE TABLE IF NOT EXISTS companies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  website TEXT,
  email TEXT,
  phone TEXT,
  address TEXT,
  tags TEXT[],
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS contacts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  company_id UUID REFERENCES companies(id) ON DELETE SET NULL,
  position TEXT,
  phone TEXT,
  email TEXT,
  address TEXT,
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Relationships
ALTER TABLE projects DROP CONSTRAINT IF EXISTS fk_client;
ALTER TABLE projects ADD CONSTRAINT fk_client FOREIGN KEY (client_id) REFERENCES contacts(id) ON DELETE SET NULL;

-- Functions
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
  v_user_id := auth.uid();
  
  INSERT INTO projects (name, address, area, client_id, stage, residents, demolition_info, construction_info)
  VALUES (p_name, p_address, p_area, p_client_id, p_stage, p_residents, p_demolition_info, p_construction_info)
  RETURNING id INTO v_project_id;

  IF v_user_id IS NOT NULL THEN
    INSERT INTO project_members (project_id, user_id, role)
    VALUES (v_project_id, v_user_id, 'owner');
  END IF;

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

-- RLS
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_members ENABLE ROW LEVEL SECURITY;
ALTER TABLE rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE task_comments ENABLE ROW LEVEL SECURITY;
ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
ALTER TABLE specifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE companies ENABLE ROW LEVEL SECURITY;
ALTER TABLE contacts ENABLE ROW LEVEL SECURITY;
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public profiles are viewable by everyone" ON profiles FOR SELECT USING (true);
CREATE POLICY "Public materials are viewable by everyone" ON materials FOR SELECT USING (true);
CREATE POLICY "Public companies are viewable by everyone" ON companies FOR SELECT USING (true);
CREATE POLICY "Public contacts are viewable by everyone" ON contacts FOR SELECT USING (true);

-- Indices
CREATE INDEX IF NOT EXISTS idx_tasks_project_id ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_assigned_to ON tasks(assigned_to);
CREATE INDEX IF NOT EXISTS idx_project_members_user_id ON project_members(user_id);
CREATE INDEX IF NOT EXISTS idx_project_members_project_id ON project_members(project_id);
