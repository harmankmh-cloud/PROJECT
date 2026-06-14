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

-- Service-role API only — explicit deny for PostgREST clients (satisfies RLS linter)
create policy "Deny anon access to platform_messages"
  on platform_messages for all to anon
  using (false) with check (false);

create policy "Deny authenticated access to platform_messages"
  on platform_messages for all to authenticated
  using (false) with check (false);
