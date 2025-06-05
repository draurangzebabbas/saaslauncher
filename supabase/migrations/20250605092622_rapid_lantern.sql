/*
  # Initial Schema for SaaS Launcher

  1. New Tables
    - `users` - User profiles with preferences
    - `projects` - SaaS projects with phases tracking
    - `milestones` - Major milestones within each phase
    - `tasks` - Individual tasks for each milestone
    - `invites` - Collaboration invites
    - `notifications` - User notifications
    - `events` - Admin analytics events
    - `project_team_members` - Project collaborators
  
  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Users Table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  name text,
  avatar_url text,
  plan_tier text NOT NULL DEFAULT 'Free',
  timezone text NOT NULL DEFAULT 'Asia/Karachi',
  language text NOT NULL DEFAULT 'en',
  auth_method text NOT NULL DEFAULT 'email_password',
  created_at timestamptz NOT NULL DEFAULT now(),
  last_active timestamptz NOT NULL DEFAULT now(),
  notify_due_soon boolean NOT NULL DEFAULT true,
  notify_stuck boolean NOT NULL DEFAULT true,
  notify_collab_update boolean NOT NULL DEFAULT true,
  notify_promotions boolean NOT NULL DEFAULT false
);

-- Projects Table
CREATE TABLE IF NOT EXISTS projects (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  name text NOT NULL,
  description text,
  primary_keyword text NOT NULL,
  project_type text NOT NULL DEFAULT 'Blank',
  owner_id uuid NOT NULL REFERENCES users(id),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  use_community boolean NOT NULL DEFAULT false,
  community_choice text NOT NULL DEFAULT 'None',
  community_url text,
  phase1_complete numeric NOT NULL DEFAULT 0,
  phase2_complete numeric NOT NULL DEFAULT 0,
  phase3_complete numeric NOT NULL DEFAULT 0,
  overall_complete numeric GENERATED ALWAYS AS (
    (phase1_complete + phase2_complete + phase3_complete) / 3
  ) STORED,
  archived boolean NOT NULL DEFAULT false
);

-- Milestones Table
CREATE TABLE IF NOT EXISTS milestones (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  phase text NOT NULL,
  name text NOT NULL,
  order_index integer NOT NULL,
  completion_pct numeric NOT NULL DEFAULT 0
);

-- Tasks Table
CREATE TABLE IF NOT EXISTS tasks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  milestone_id uuid NOT NULL REFERENCES milestones(id) ON DELETE CASCADE,
  phase text NOT NULL,
  name text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'Not Started',
  notes text,
  due_date date,
  external_link text,
  external_logo text,
  order_index integer NOT NULL,
  due_soon_notified boolean NOT NULL DEFAULT false,
  stuck_notified boolean NOT NULL DEFAULT false,
  modified_by uuid REFERENCES users(id),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Invites Table
CREATE TABLE IF NOT EXISTS invites (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  inviter_id uuid NOT NULL REFERENCES users(id),
  invitee_email text NOT NULL,
  role text NOT NULL DEFAULT 'Viewer',
  status text NOT NULL DEFAULT 'Pending',
  token text UNIQUE NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Notifications Table
CREATE TABLE IF NOT EXISTS notifications (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  project_id uuid REFERENCES projects(id) ON DELETE CASCADE,
  task_id uuid REFERENCES tasks(id) ON DELETE CASCADE,
  type text NOT NULL,
  message text NOT NULL,
  read boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

-- Events Table (Admin Analytics)
CREATE TABLE IF NOT EXISTS events (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES users(id) ON DELETE SET NULL,
  project_id uuid REFERENCES projects(id) ON DELETE SET NULL,
  event_name text NOT NULL,
  details text,
  timestamp timestamptz NOT NULL DEFAULT now()
);

-- Project Team Members Table
CREATE TABLE IF NOT EXISTS project_team_members (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id uuid NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  user_id uuid NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  role text NOT NULL DEFAULT 'Viewer',
  created_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE(project_id, user_id)
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE milestones ENABLE ROW LEVEL SECURITY;
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE invites ENABLE ROW LEVEL SECURITY;
ALTER TABLE notifications ENABLE ROW LEVEL SECURITY;
ALTER TABLE events ENABLE ROW LEVEL SECURITY;
ALTER TABLE project_team_members ENABLE ROW LEVEL SECURITY;

-- User Policies
CREATE POLICY "Users can view their own data" 
  ON users FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Users can update their own data" 
  ON users FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- Project Policies
CREATE POLICY "Users can view their own projects" 
  ON projects FOR SELECT 
  TO authenticated 
  USING (
    owner_id = auth.uid() OR 
    EXISTS (
      SELECT 1 FROM project_team_members 
      WHERE project_id = id AND user_id = auth.uid()
    )
  );

CREATE POLICY "Users can create their own projects" 
  ON projects FOR INSERT 
  TO authenticated 
  WITH CHECK (owner_id = auth.uid());

CREATE POLICY "Owners can update their projects" 
  ON projects FOR UPDATE 
  TO authenticated 
  USING (owner_id = auth.uid());

CREATE POLICY "Owners can delete their projects" 
  ON projects FOR DELETE 
  TO authenticated 
  USING (owner_id = auth.uid());

-- Milestone Policies
CREATE POLICY "Users can view milestones of their projects" 
  ON milestones FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_id AND (
        projects.owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM project_team_members 
          WHERE project_team_members.project_id = projects.id 
          AND project_team_members.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Owners can create milestones" 
  ON milestones FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_id 
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners and editors can update milestones" 
  ON milestones FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_id AND (
        projects.owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM project_team_members 
          WHERE project_team_members.project_id = projects.id 
          AND project_team_members.user_id = auth.uid()
          AND project_team_members.role = 'Editor'
        )
      )
    )
  );

-- Task Policies
CREATE POLICY "Users can view tasks of their projects" 
  ON tasks FOR SELECT 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_id AND (
        projects.owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM project_team_members 
          WHERE project_team_members.project_id = projects.id 
          AND project_team_members.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Owners can create tasks" 
  ON tasks FOR INSERT 
  TO authenticated 
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_id 
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Owners and editors can update tasks" 
  ON tasks FOR UPDATE 
  TO authenticated 
  USING (
    EXISTS (
      SELECT 1 FROM projects 
      WHERE projects.id = project_id AND (
        projects.owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM project_team_members 
          WHERE project_team_members.project_id = projects.id 
          AND project_team_members.user_id = auth.uid()
          AND project_team_members.role = 'Editor'
        )
      )
    )
  );

-- Invite Policies
CREATE POLICY "Users can view invites for their projects"
  ON invites FOR SELECT
  TO authenticated
  USING (
    inviter_id = auth.uid() OR
    invitee_email = (SELECT email FROM users WHERE id = auth.uid())
  );

CREATE POLICY "Users can create invites for their projects"
  ON invites FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_id
      AND projects.owner_id = auth.uid()
    )
  );

CREATE POLICY "Users can update invites they created"
  ON invites FOR UPDATE
  TO authenticated
  USING (
    inviter_id = auth.uid() OR
    invitee_email = (SELECT email FROM users WHERE id = auth.uid())
  );

-- Notification Policies
CREATE POLICY "Users can view their own notifications"
  ON notifications FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Users can update their own notifications"
  ON notifications FOR UPDATE
  TO authenticated
  USING (user_id = auth.uid());

-- Team Member Policies
CREATE POLICY "Users can view team members for their projects"
  ON project_team_members FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_id AND (
        projects.owner_id = auth.uid() OR
        EXISTS (
          SELECT 1 FROM project_team_members
          WHERE project_team_members.project_id = projects.id
          AND project_team_members.user_id = auth.uid()
        )
      )
    )
  );

CREATE POLICY "Owners can manage team members"
  ON project_team_members FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM projects
      WHERE projects.id = project_id
      AND projects.owner_id = auth.uid()
    )
  );

-- Create trigger to update project.updated_at whenever a task is updated
CREATE OR REPLACE FUNCTION update_project_timestamp()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE projects 
  SET updated_at = now()
  WHERE id = NEW.project_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_project_timestamp_on_task_update
AFTER UPDATE ON tasks
FOR EACH ROW
EXECUTE FUNCTION update_project_timestamp();