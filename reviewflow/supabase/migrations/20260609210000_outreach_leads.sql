-- RateLocal cold outreach lead pool (scraper → daily batch send, never repeat)
create table if not exists rl_outreach_leads (
  id uuid primary key default gen_random_uuid(),
  business_name text not null,
  email text,
  city text not null default 'Abbotsford',
  vertical text not null default 'other',
  website text,
  status text not null default 'pending'
    check (status in ('pending', 'sent', 'no_email', 'preview_sent', 'followup_1', 'followup_2', 'bounced', 'unsubscribed')),
  notes text,
  last_sequence text,
  sent_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create unique index if not exists idx_rl_outreach_leads_email
  on rl_outreach_leads (lower(email))
  where email is not null and email <> '';

create index if not exists idx_rl_outreach_leads_pending
  on rl_outreach_leads (created_at)
  where status = 'pending' and email is not null and email <> '';

alter table rl_outreach_leads enable row level security;
