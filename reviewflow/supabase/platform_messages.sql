-- Run once in Supabase → SQL Editor (after main schema.sql)

create table if not exists platform_messages (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  name text,
  business_name text,
  category text not null default 'help' check (category in ('help', 'suggestion', 'bug', 'billing', 'other')),
  message text not null,
  status text not null default 'new' check (status in ('new', 'read')),
  created_at timestamptz not null default now()
);

create index if not exists platform_messages_created_at_idx on platform_messages (created_at desc);
create index if not exists platform_messages_status_idx on platform_messages (status);

alter table platform_messages enable row level security;

-- No public policies — inserts go through API with service role
