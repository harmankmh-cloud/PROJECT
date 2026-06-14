-- ServeLocal: homeowner/tradie accounts (run after guest-access.sql)
-- Links job requests to logged-in users for /dashboard

alter table service_requests
  add column if not exists user_id uuid references auth.users(id) on delete set null;

create index if not exists service_requests_user_id_idx
  on service_requests (user_id)
  where user_id is not null;

create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'homeowner' check (role in ('homeowner', 'pro')),
  display_name text,
  phone text,
  created_at timestamptz not null default now()
);

alter table user_profiles enable row level security;

drop policy if exists "Users read own profile" on user_profiles;
create policy "Users read own profile"
  on user_profiles for select
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Users update own profile" on user_profiles;
create policy "Users update own profile"
  on user_profiles for update
  to authenticated
  using (auth.uid() = id);

drop policy if exists "Users insert own profile" on user_profiles;
create policy "Users insert own profile"
  on user_profiles for insert
  to authenticated
  with check (auth.uid() = id);

grant select, insert, update on user_profiles to authenticated;

-- Logged-in users can read their own job requests
drop policy if exists "Users read own requests" on service_requests;
create policy "Users read own requests"
  on service_requests for select
  to authenticated
  using (user_id = auth.uid());
