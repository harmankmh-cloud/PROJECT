-- VoiceAgent schema — run in Supabase SQL Editor
-- Multi-tenant enterprise voice AI platform

create extension if not exists "pgcrypto";
create extension if not exists "vector";

-- Organizations (tenants)
create table if not exists va_organizations (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  slug text not null unique,
  owner_id uuid not null references auth.users(id) on delete cascade,
  plan text not null default 'trial' check (plan in ('trial', 'starter', 'growth', 'pro', 'enterprise')),
  trial_minutes_remaining integer not null default 30,
  sandbox_test_calls_used integer not null default 0,
  stripe_customer_id text,
  stripe_subscription_id text,
  transfer_phone text,
  business_hours jsonb default '{"mon":{"open":"09:00","close":"17:00"},"tue":{"open":"09:00","close":"17:00"},"wed":{"open":"09:00","close":"17:00"},"thu":{"open":"09:00","close":"17:00"},"fri":{"open":"09:00","close":"17:00"}}'::jsonb,
  webhook_url text,
  webhook_secret text,
  data_region text not null default 'us' check (data_region in ('us', 'eu')),
  white_label jsonb default '{}'::jsonb,
  sso_config jsonb,
  hipaa_enabled boolean not null default false,
  recording_retention_days integer not null default 30,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists va_org_members (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references va_organizations(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  role text not null default 'viewer' check (role in ('admin', 'operator', 'viewer')),
  created_at timestamptz not null default now(),
  unique (org_id, user_id)
);

-- Voice agents
create table if not exists va_agents (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references va_organizations(id) on delete cascade,
  name text not null,
  system_prompt text not null default 'You are a helpful phone assistant for a local business. Be concise and friendly.',
  welcome_greeting text not null default 'Hello! How can I help you today?',
  voice text not null default 'Polly.Joanna',
  voice_provider text not null default 'telnyx' check (voice_provider in ('telnyx', 'elevenlabs', 'polly')),
  voice_id text not null default 'female',
  language text not null default 'en-US',
  llm_model text,
  temperature numeric not null default 0.2,
  max_tokens integer not null default 50,
  persona_template text not null default 'receptionist'
    check (persona_template in ('receptionist', 'scheduler', 'sales', 'salon', 'clinic', 'home_services', 'custom')),
  is_active boolean not null default true,
  escalation_phone text,
  knowledge_base_enabled boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Flow definitions (visual builder JSON)
create table if not exists va_flows (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references va_organizations(id) on delete cascade,
  agent_id uuid references va_agents(id) on delete set null,
  name text not null,
  nodes jsonb not null default '[]'::jsonb,
  edges jsonb not null default '[]'::jsonb,
  is_published boolean not null default false,
  version integer not null default 1,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Telnyx provisioned numbers (self-serve)
create table if not exists va_telnyx_numbers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references va_organizations(id) on delete cascade,
  phone_number text not null,
  telnyx_number_id text,
  telnyx_order_id text,
  status text not null default 'active' check (status in ('pending', 'active', 'released')),
  monthly_cost_cents integer default 0,
  created_at timestamptz not null default now(),
  unique (org_id, phone_number)
);

-- Phone numbers
create table if not exists va_phone_numbers (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references va_organizations(id) on delete cascade,
  agent_id uuid references va_agents(id) on delete set null,
  phone_number text not null unique,
  twilio_sid text,
  label text,
  created_at timestamptz not null default now()
);

-- Calls
create table if not exists va_calls (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references va_organizations(id) on delete cascade,
  agent_id uuid references va_agents(id) on delete set null,
  twilio_call_sid text unique,
  direction text not null default 'inbound' check (direction in ('inbound', 'outbound')),
  from_number text,
  to_number text,
  status text not null default 'initiated',
  duration_seconds integer default 0,
  cost_cents integer default 0,
  contained boolean,
  transferred boolean not null default false,
  transfer_reason text,
  handoff_payload jsonb,
  sentiment text,
  intent text,
  summary text,
  score integer,
  topics jsonb default '[]'::jsonb,
  action_items jsonb default '[]'::jsonb,
  is_sandbox boolean not null default false,
  started_at timestamptz,
  ended_at timestamptz,
  created_at timestamptz not null default now()
);

create table if not exists va_call_transcripts (
  id uuid primary key default gen_random_uuid(),
  call_id uuid not null references va_calls(id) on delete cascade,
  role text not null check (role in ('user', 'assistant', 'system')),
  content text not null,
  created_at timestamptz not null default now()
);

create table if not exists va_call_recordings (
  id uuid primary key default gen_random_uuid(),
  call_id uuid not null references va_calls(id) on delete cascade,
  storage_url text,
  retention_expires_at timestamptz,
  created_at timestamptz not null default now()
);

-- Contacts (caller memory)
create table if not exists va_contacts (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references va_organizations(id) on delete cascade,
  phone_number text not null,
  name text,
  email text,
  memory jsonb default '{}'::jsonb,
  last_call_at timestamptz,
  created_at timestamptz not null default now(),
  unique (org_id, phone_number)
);

-- Knowledge base (RAG)
create table if not exists va_knowledge_docs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references va_organizations(id) on delete cascade,
  agent_id uuid references va_agents(id) on delete cascade,
  title text not null,
  content text not null,
  source_url text,
  embedding vector(1536),
  created_at timestamptz not null default now()
);

-- Integrations
create table if not exists va_integrations (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references va_organizations(id) on delete cascade,
  provider text not null check (provider in ('hubspot', 'google_calendar', 'salesforce', 'zendesk', 'slack')),
  access_token text,
  refresh_token text,
  token_expires_at timestamptz,
  config jsonb default '{}'::jsonb,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  unique (org_id, provider)
);

-- Outbound campaigns (Phase 2)
create table if not exists va_campaigns (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references va_organizations(id) on delete cascade,
  agent_id uuid references va_agents(id) on delete set null,
  name text not null,
  status text not null default 'draft' check (status in ('draft', 'scheduled', 'running', 'paused', 'completed')),
  schedule_at timestamptz,
  contact_list jsonb not null default '[]'::jsonb,
  max_retries integer not null default 2,
  calling_hours jsonb,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- TCPA consent records
create table if not exists va_consent_records (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references va_organizations(id) on delete cascade,
  phone_number text not null,
  consent_type text not null check (consent_type in ('pewc', 'express', 'opt_out')),
  consent_text text not null,
  ip_address text,
  captured_at timestamptz not null default now(),
  expires_at timestamptz,
  campaign_id uuid references va_campaigns(id) on delete set null
);

-- Usage metering (Stripe)
create table if not exists va_usage_events (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references va_organizations(id) on delete cascade,
  call_id uuid references va_calls(id) on delete set null,
  event_type text not null default 'voice_minute',
  quantity numeric not null default 1,
  reported_to_stripe boolean not null default false,
  created_at timestamptz not null default now()
);

-- Audit logs (compliance)
create table if not exists va_audit_logs (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references va_organizations(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  action text not null,
  resource_type text not null,
  resource_id uuid,
  metadata jsonb default '{}'::jsonb,
  created_at timestamptz not null default now()
);

-- Omnichannel channels (Phase 3)
create table if not exists va_channels (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references va_organizations(id) on delete cascade,
  channel_type text not null check (channel_type in ('sms', 'whatsapp', 'web_chat')),
  config jsonb not null default '{}'::jsonb,
  is_active boolean not null default false,
  created_at timestamptz not null default now(),
  unique (org_id, channel_type)
);

-- API keys per tenant
create table if not exists va_api_keys (
  id uuid primary key default gen_random_uuid(),
  org_id uuid not null references va_organizations(id) on delete cascade,
  name text not null,
  key_hash text not null,
  key_prefix text not null,
  last_used_at timestamptz,
  created_at timestamptz not null default now()
);

-- RLS
alter table va_organizations enable row level security;
alter table va_org_members enable row level security;
alter table va_agents enable row level security;
alter table va_flows enable row level security;
alter table va_telnyx_numbers enable row level security;
alter table va_phone_numbers enable row level security;
alter table va_calls enable row level security;
alter table va_call_transcripts enable row level security;
alter table va_call_recordings enable row level security;
alter table va_contacts enable row level security;
alter table va_knowledge_docs enable row level security;
alter table va_integrations enable row level security;
alter table va_campaigns enable row level security;
alter table va_consent_records enable row level security;
alter table va_usage_events enable row level security;
alter table va_audit_logs enable row level security;
alter table va_channels enable row level security;
alter table va_api_keys enable row level security;

-- Helper: org access
create or replace function va_user_org_ids()
returns setof uuid
language sql
security definer
stable
as $$
  select id from va_organizations where owner_id = auth.uid()
  union
  select org_id from va_org_members where user_id = auth.uid();
$$;

create policy "Org owners manage organizations"
  on va_organizations for all
  using (owner_id = auth.uid())
  with check (owner_id = auth.uid());

create policy "Members read organizations"
  on va_organizations for select
  using (id in (select va_user_org_ids()));

create policy "Members manage org data"
  on va_org_members for all
  using (org_id in (select va_user_org_ids()));

create policy "Org scoped agents"
  on va_agents for all
  using (org_id in (select va_user_org_ids()))
  with check (org_id in (select va_user_org_ids()));

create policy "Org scoped flows"
  on va_flows for all
  using (org_id in (select va_user_org_ids()))
  with check (org_id in (select va_user_org_ids()));

create policy "Org scoped phone numbers"
  on va_phone_numbers for all
  using (org_id in (select va_user_org_ids()))
  with check (org_id in (select va_user_org_ids()));

create policy "Org members manage telnyx numbers"
  on va_telnyx_numbers for all
  using (org_id in (select va_user_org_ids()))
  with check (org_id in (select va_user_org_ids()));

create policy "Org scoped calls"
  on va_calls for all
  using (org_id in (select va_user_org_ids()))
  with check (org_id in (select va_user_org_ids()));

create policy "Org scoped transcripts"
  on va_call_transcripts for all
  using (
    exists (select 1 from va_calls c where c.id = call_id and c.org_id in (select va_user_org_ids()))
  );

create policy "Org scoped recordings"
  on va_call_recordings for all
  using (
    exists (select 1 from va_calls c where c.id = call_id and c.org_id in (select va_user_org_ids()))
  );

create policy "Org scoped contacts"
  on va_contacts for all
  using (org_id in (select va_user_org_ids()))
  with check (org_id in (select va_user_org_ids()));

create policy "Org scoped knowledge"
  on va_knowledge_docs for all
  using (org_id in (select va_user_org_ids()))
  with check (org_id in (select va_user_org_ids()));

create policy "Org scoped integrations"
  on va_integrations for all
  using (org_id in (select va_user_org_ids()))
  with check (org_id in (select va_user_org_ids()));

create policy "Org scoped campaigns"
  on va_campaigns for all
  using (org_id in (select va_user_org_ids()))
  with check (org_id in (select va_user_org_ids()));

create policy "Org scoped consent"
  on va_consent_records for all
  using (org_id in (select va_user_org_ids()))
  with check (org_id in (select va_user_org_ids()));

create policy "Org scoped usage"
  on va_usage_events for all
  using (org_id in (select va_user_org_ids()))
  with check (org_id in (select va_user_org_ids()));

create policy "Org scoped audit"
  on va_audit_logs for select
  using (org_id in (select va_user_org_ids()));

create policy "Org scoped channels"
  on va_channels for all
  using (org_id in (select va_user_org_ids()))
  with check (org_id in (select va_user_org_ids()));

create policy "Org scoped api keys"
  on va_api_keys for all
  using (org_id in (select va_user_org_ids()))
  with check (org_id in (select va_user_org_ids()));

-- Grants (required for service_role / API access)
grant usage on schema public to postgres, anon, authenticated, service_role;
grant all on all tables in schema public to postgres, service_role;
grant select, insert, update, delete on all tables in schema public to authenticated;
grant select on all tables in schema public to anon;
alter default privileges in schema public grant all on tables to postgres, service_role;
alter default privileges in schema public grant select, insert, update, delete on tables to authenticated;
alter default privileges in schema public grant select on tables to anon;

-- Indexes
create index if not exists idx_va_calls_org_created on va_calls(org_id, created_at desc);
create index if not exists idx_va_calls_twilio_sid on va_calls(twilio_call_sid);
create index if not exists idx_va_contacts_org_phone on va_contacts(org_id, phone_number);
create index if not exists idx_va_usage_org_unreported on va_usage_events(org_id) where reported_to_stripe = false;
