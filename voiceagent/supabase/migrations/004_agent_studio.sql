-- Agent Studio: structured voice, model, and persona config

alter table va_agents
  add column if not exists voice_provider text not null default 'telnyx'
    check (voice_provider in ('telnyx', 'elevenlabs', 'polly')),
  add column if not exists voice_id text not null default 'female',
  add column if not exists llm_model text,
  add column if not exists temperature numeric not null default 0.2,
  add column if not exists max_tokens integer not null default 50,
  add column if not exists persona_template text not null default 'receptionist'
    check (persona_template in ('receptionist', 'scheduler', 'sales', 'salon', 'clinic', 'home_services', 'custom'));

-- Backfill voice_id from legacy voice column where possible
update va_agents
set voice_id = case
  when lower(voice) in ('female', 'male') then lower(voice)
  when voice ilike '%joanna%' then 'female'
  when voice ilike '%matthew%' then 'male'
  else 'female'
end
where voice_id = 'female' and voice is not null and voice <> 'female';

-- Sandbox / test calls
alter table va_calls
  add column if not exists is_sandbox boolean not null default false;

-- Telnyx number inventory (self-serve provisioning)
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

alter table va_telnyx_numbers enable row level security;

create policy "Org members manage telnyx numbers"
  on va_telnyx_numbers for all
  using (org_id in (select va_user_org_ids()));
