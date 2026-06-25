-- VibeAgencies Database Schema
-- PostgreSQL with Row Level Security (RLS) for multi-tenancy

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Core Platform Tables

-- Profiles (extends auth.users)
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Agencies
CREATE TYPE agency_status AS ENUM ('generating', 'active', 'suspended');

CREATE TABLE agencies (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  owner_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  niche TEXT NOT NULL,
  branding JSONB DEFAULT '{}'::jsonb,
  website_config JSONB DEFAULT '{}'::jsonb,
  status agency_status NOT NULL DEFAULT 'generating',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Agency Team (Agents)
CREATE TYPE agent_role AS ENUM ('CEO', 'LEAD_GEN', 'WRITER', 'SEO', 'CUSTOM');

CREATE TABLE agents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  role agent_role NOT NULL,
  system_prompt TEXT NOT NULL,
  avatar_url TEXT,
  memory_id TEXT -- reference to vector DB namespace
);

-- 3. CRM & Sales

-- Clients (Prospects and Paying Clients)
CREATE TYPE client_status AS ENUM ('prospect', 'lead', 'client', 'inactive');

CREATE TABLE clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  business_name TEXT NOT NULL,
  contact_name TEXT,
  email TEXT,
  website TEXT,
  status client_status NOT NULL DEFAULT 'prospect',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Audits
CREATE TYPE audit_type AS ENUM ('SEO', 'AI_VISIBILITY', 'GOOGLE_MAPS', 'WEBSITE');

CREATE TABLE audits (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  audit_type audit_type NOT NULL,
  data JSONB DEFAULT '{}'::jsonb,
  report_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Fulfillment & Operations
CREATE TYPE project_status AS ENUM ('onboarding', 'active', 'completed');

CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  agency_id UUID NOT NULL REFERENCES agencies(id) ON DELETE CASCADE,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  status project_status NOT NULL DEFAULT 'onboarding',
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE TYPE task_status AS ENUM ('todo', 'in_progress', 'review', 'done');

CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
  assigned_agent_id UUID REFERENCES agents(id),
  title TEXT NOT NULL,
  description TEXT,
  status task_status NOT NULL DEFAULT 'todo',
  result TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Marketplace & Templates
CREATE TABLE agency_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  niche TEXT NOT NULL,
  default_agents JSONB NOT NULL DEFAULT '[]'::jsonb,
  default_services JSONB NOT NULL DEFAULT '[]'::jsonb
);

CREATE TABLE agent_templates (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  role TEXT NOT NULL,
  capability_description TEXT NOT NULL,
  system_prompt TEXT NOT NULL
);

-- 6. Indexes
CREATE INDEX idx_agencies_owner_id ON agencies(owner_id);
CREATE INDEX idx_agencies_slug ON agencies(slug);
CREATE INDEX idx_agents_agency_id ON agents(agency_id);
CREATE INDEX idx_clients_agency_id ON clients(agency_id);
CREATE INDEX idx_audits_agency_id ON audits(agency_id);
CREATE INDEX idx_audits_client_id ON audits(client_id);
CREATE INDEX idx_projects_agency_id ON projects(agency_id);
CREATE INDEX idx_tasks_project_id ON tasks(project_id);

-- 7. Row Level Security (RLS)

-- Profiles: users can read/update their own profile
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

-- Agencies: users can view/manage their own agencies
ALTER TABLE agencies ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view own agencies" ON agencies
  FOR SELECT USING (auth.uid() = owner_id);
CREATE POLICY "Users can insert own agencies" ON agencies
  FOR INSERT WITH CHECK (auth.uid() = owner_id);
CREATE POLICY "Users can update own agencies" ON agencies
  FOR UPDATE USING (auth.uid() = owner_id);
CREATE POLICY "Users can delete own agencies" ON agencies
  FOR DELETE USING (auth.uid() = owner_id);

-- Agents: users can view/manage agents in their agencies
ALTER TABLE agents ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view agents" ON agents
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM agencies WHERE agencies.id = agents.agency_id AND agencies.owner_id = auth.uid())
  );
CREATE POLICY "Users can insert agents" ON agents
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM agencies WHERE agencies.id = agents.agency_id AND agencies.owner_id = auth.uid())
  );
CREATE POLICY "Users can update agents" ON agents
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM agencies WHERE agencies.id = agents.agency_id AND agencies.owner_id = auth.uid())
  );

-- Clients: users can view/manage clients in their agencies
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view clients" ON clients
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM agencies WHERE agencies.id = clients.agency_id AND agencies.owner_id = auth.uid())
  );
CREATE POLICY "Users can insert clients" ON clients
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM agencies WHERE agencies.id = clients.agency_id AND agencies.owner_id = auth.uid())
  );
CREATE POLICY "Users can update clients" ON clients
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM agencies WHERE agencies.id = clients.agency_id AND agencies.owner_id = auth.uid())
  );

-- Audits: users can view/manage audits in their agencies
ALTER TABLE audits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view audits" ON audits
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM agencies WHERE agencies.id = audits.agency_id AND agencies.owner_id = auth.uid())
  );
CREATE POLICY "Users can insert audits" ON audits
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM agencies WHERE agencies.id = audits.agency_id AND agencies.owner_id = auth.uid())
  );
CREATE POLICY "Users can update audits" ON audits
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM agencies WHERE agencies.id = audits.agency_id AND agencies.owner_id = auth.uid())
  );

-- Projects: users can view/manage projects in their agencies
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view projects" ON projects
  FOR SELECT USING (
    EXISTS (SELECT 1 FROM agencies WHERE agencies.id = projects.agency_id AND agencies.owner_id = auth.uid())
  );
CREATE POLICY "Users can insert projects" ON projects
  FOR INSERT WITH CHECK (
    EXISTS (SELECT 1 FROM agencies WHERE agencies.id = projects.agency_id AND agencies.owner_id = auth.uid())
  );
CREATE POLICY "Users can update projects" ON projects
  FOR UPDATE USING (
    EXISTS (SELECT 1 FROM agencies WHERE agencies.id = projects.agency_id AND agencies.owner_id = auth.uid())
  );

-- Tasks: users can view/manage tasks via projects in their agencies
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view tasks" ON tasks
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM projects 
      JOIN agencies ON agencies.id = projects.agency_id
      WHERE projects.id = tasks.project_id AND agencies.owner_id = auth.uid()
    )
  );
CREATE POLICY "Users can insert tasks" ON tasks
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM projects 
      JOIN agencies ON agencies.id = projects.agency_id
      WHERE projects.id = tasks.project_id AND agencies.owner_id = auth.uid()
    )
  );
CREATE POLICY "Users can update tasks" ON tasks
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM projects 
      JOIN agencies ON agencies.id = projects.agency_id
      WHERE projects.id = tasks.project_id AND agencies.owner_id = auth.uid()
    )
  );

-- Templates: public read access for the marketplace (no RLS needed, they're reference data)
ALTER TABLE agency_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view agency templates" ON agency_templates
  FOR SELECT USING (true);

ALTER TABLE agent_templates ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Anyone can view agent templates" ON agent_templates
  FOR SELECT USING (true);

-- 8. Triggers

-- Auto-create profile on user signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, full_name, avatar_url)
  VALUES (NEW.id, NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'avatar_url');
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION handle_new_user();

-- Auto-update updated_at on agencies
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_agencies_updated_at
  BEFORE UPDATE ON agencies
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();