-- Industry features: call intelligence columns + org webhooks
-- Run in Supabase SQL Editor after schema.sql

alter table va_calls
  add column if not exists score integer,
  add column if not exists topics jsonb default '[]'::jsonb,
  add column if not exists action_items jsonb default '[]'::jsonb;

alter table va_organizations
  add column if not exists webhook_url text,
  add column if not exists webhook_secret text;

create index if not exists idx_va_calls_org_score on va_calls(org_id, score) where score is not null;
