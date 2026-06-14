-- Marketing lead capture (hero email signup)
create table if not exists va_marketing_leads (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  business_name text,
  source text not null default 'hero',
  created_at timestamptz not null default now()
);

create unique index if not exists idx_va_marketing_leads_email on va_marketing_leads (email);

alter table va_marketing_leads enable row level security;
