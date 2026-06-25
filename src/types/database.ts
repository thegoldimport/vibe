// Database type definitions for VibeAgencies
// Based on SCHEMA.md - PostgreSQL multi-tenant schema

export interface Profile {
  id: string; // uuid, references auth.users
  full_name: string | null;
  avatar_url: string | null;
  created_at: string;
}

export interface Agency {
  id: string; // uuid
  owner_id: string; // FK -> profiles.id
  name: string;
  slug: string; // unique
  niche: string;
  branding: Record<string, any> | null; // jsonb (logo, colors, voice)
  website_config: Record<string, any> | null; // jsonb (deployed site settings)
  status: AgencyStatus;
  created_at?: string;
  updated_at?: string;
}

export type AgencyStatus = 'generating' | 'active' | 'suspended';

export interface AgencyAgent {
  id: string; // uuid
  agency_id: string; // FK -> agencies.id
  name: string;
  role: AgentRole;
  system_prompt: string;
  avatar_url: string | null;
  memory_id: string | null; // reference to vector DB namespace
}

export type AgentRole = 'CEO' | 'LEAD_GEN' | 'WRITER' | 'SEO' | 'CUSTOM';

export interface Client {
  id: string; // uuid
  agency_id: string; // FK -> agencies.id
  business_name: string;
  contact_name: string | null;
  email: string | null;
  website: string | null;
  status: ClientStatus;
  created_at?: string;
}

export type ClientStatus = 'prospect' | 'lead' | 'client' | 'inactive';

export interface Audit {
  id: string; // uuid
  agency_id: string; // FK -> agencies.id
  client_id: string; // FK -> clients.id
  audit_type: AuditType;
  data: Record<string, any> | null; // jsonb (raw analysis results)
  report_url: string | null; // link to generated artifact
  created_at: string;
}

export type AuditType = 'SEO' | 'AI_VISIBILITY' | 'GOOGLE_MAPS' | 'WEBSITE';

export interface Project {
  id: string; // uuid
  agency_id: string; // FK -> agencies.id
  client_id: string; // FK -> clients.id
  title: string;
  status: ProjectStatus;
  created_at?: string;
}

export type ProjectStatus = 'onboarding' | 'active' | 'completed';

export interface Task {
  id: string; // uuid
  project_id: string; // FK -> projects.id
  assigned_agent_id: string; // FK -> agents.id
  title: string;
  description: string;
  status: TaskStatus;
  result: string | null; // output from agent
  created_at: string;
}

export type TaskStatus = 'todo' | 'in_progress' | 'review' | 'done';

export interface AgencyTemplate {
  id: string; // uuid
  niche: string;
  default_agents: Record<string, any>; // jsonb (roles/prompts)
  default_services: Record<string, any>; // jsonb
}

export interface AgentTemplate {
  id: string; // uuid
  role: string;
  capability_description: string;
  system_prompt: string;
}

// API request types
export interface CreateAgencyRequest {
  name: string;
  niche: string;
  answers?: Record<string, string>[];
}

export interface CreateClientRequest {
  business_name: string;
  contact_name?: string;
  email?: string;
  website?: string;
}

export interface CreateAuditRequest {
  client_id: string;
  audit_type: AuditType;
  website_url?: string;
}