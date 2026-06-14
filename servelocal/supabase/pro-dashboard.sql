-- ServeLocal pro dashboard + richer job requests (run after user-accounts.sql)

alter table service_providers
  add column if not exists owner_user_id uuid references auth.users(id) on delete set null;

create index if not exists service_providers_owner_user_idx
  on service_providers (owner_user_id)
  where owner_user_id is not null;

alter table service_requests
  add column if not exists urgency text check (urgency in ('asap', 'this_week', 'this_month', 'flexible')),
  add column if not exists budget_min int,
  add column if not exists budget_max int;

-- Pros can read their own listing when linked
drop policy if exists "Owner read own provider" on service_providers;
create policy "Owner read own provider"
  on service_providers for select
  to authenticated
  using (owner_user_id = auth.uid());

create table if not exists newsletter_subscribers (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  created_at timestamptz not null default now()
);

alter table newsletter_subscribers enable row level security;

create policy "Anyone can subscribe"
  on newsletter_subscribers for insert
  with check (true);

create table if not exists contact_messages (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  subject text,
  message text not null,
  created_at timestamptz not null default now()
);

alter table contact_messages enable row level security;

create policy "Anyone can send contact message"
  on contact_messages for insert
  with check (true);
