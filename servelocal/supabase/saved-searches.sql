-- ServeLocal saved searches + email alert tracking (run after user-accounts.sql)

create table if not exists saved_searches (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  email text not null,
  label text not null default 'My search',
  query text,
  city_slug text,
  category_slug text,
  licensed_only boolean not null default false,
  verified_only boolean not null default false,
  emergency_only boolean not null default false,
  alerts_enabled boolean not null default true,
  last_notified_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists saved_searches_user_idx on saved_searches (user_id);
create index if not exists saved_searches_alerts_idx on saved_searches (alerts_enabled) where alerts_enabled = true;

alter table saved_searches enable row level security;

drop policy if exists "Users read own saved searches" on saved_searches;
create policy "Users read own saved searches"
  on saved_searches for select
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Users insert own saved searches" on saved_searches;
create policy "Users insert own saved searches"
  on saved_searches for insert
  to authenticated
  with check (user_id = auth.uid());

drop policy if exists "Users delete own saved searches" on saved_searches;
create policy "Users delete own saved searches"
  on saved_searches for delete
  to authenticated
  using (user_id = auth.uid());

drop policy if exists "Users update own saved searches" on saved_searches;
create policy "Users update own saved searches"
  on saved_searches for update
  to authenticated
  using (user_id = auth.uid());

grant select, insert, update, delete on saved_searches to authenticated;

create table if not exists email_send_log (
  id uuid primary key default gen_random_uuid(),
  template text not null,
  recipient text not null,
  subject text not null,
  status text not null default 'sent',
  created_at timestamptz not null default now()
);

alter table email_send_log enable row level security;
