-- Site suggestions from the floating feedback button
-- Run after servelocal.sql and premium.sql

create table if not exists site_suggestions (
  id uuid primary key default gen_random_uuid(),
  message text not null,
  email text,
  page_url text,
  status text not null default 'new' check (status in ('new', 'read', 'done')),
  created_at timestamptz not null default now()
);

create index if not exists site_suggestions_created_idx
  on site_suggestions (created_at desc);

alter table site_suggestions enable row level security;

create policy "Anyone can submit suggestion"
  on site_suggestions for insert with check (true);
