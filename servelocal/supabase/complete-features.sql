-- ServeLocal complete features migration
-- Run after: servelocal.sql, user-accounts.sql, premium.sql, bookings.sql

-- Bookings stripe session
alter table bookings add column if not exists stripe_session_id text;
alter table bookings add column if not exists stripe_payment_intent_id text;

-- Saved provider bookmarks
create table if not exists saved_providers (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  provider_id uuid not null references service_providers(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (user_id, provider_id)
);

create index if not exists saved_providers_user_idx on saved_providers (user_id);

alter table saved_providers enable row level security;

create policy "Users manage own saved providers"
  on saved_providers for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Messaging
create table if not exists message_threads (
  id uuid primary key default gen_random_uuid(),
  homeowner_user_id uuid not null references auth.users(id) on delete cascade,
  provider_id uuid not null references service_providers(id) on delete cascade,
  subject text,
  last_message_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  unique (homeowner_user_id, provider_id)
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  thread_id uuid not null references message_threads(id) on delete cascade,
  sender_user_id uuid references auth.users(id) on delete set null,
  sender_role text not null check (sender_role in ('homeowner', 'pro', 'system')),
  body text not null,
  read_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists messages_thread_idx on messages (thread_id, created_at);

alter table message_threads enable row level security;
alter table messages enable row level security;

create policy "Thread participants read threads"
  on message_threads for select
  using (
    auth.uid() = homeowner_user_id
    or exists (
      select 1 from service_providers sp
      where sp.id = provider_id and sp.owner_user_id = auth.uid()
    )
  );

create policy "Homeowners create threads"
  on message_threads for insert
  with check (auth.uid() = homeowner_user_id);

create policy "Thread participants read messages"
  on messages for select
  using (
    exists (
      select 1 from message_threads t
      join service_providers sp on sp.id = t.provider_id
      where t.id = thread_id
        and (t.homeowner_user_id = auth.uid() or sp.owner_user_id = auth.uid())
    )
  );

create policy "Thread participants send messages"
  on messages for insert
  with check (
    exists (
      select 1 from message_threads t
      join service_providers sp on sp.id = t.provider_id
      where t.id = thread_id
        and (t.homeowner_user_id = auth.uid() or sp.owner_user_id = auth.uid())
    )
  );

-- Pro Q&A
create table if not exists pro_qa (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references service_providers(id) on delete cascade,
  asker_name text not null,
  asker_email text,
  question text not null,
  answer text,
  answered_at timestamptz,
  status text not null default 'pending' check (status in ('pending', 'answered', 'hidden')),
  created_at timestamptz not null default now()
);

create index if not exists pro_qa_provider_idx on pro_qa (provider_id, created_at desc);

alter table pro_qa enable row level security;

create policy "Public read answered qa"
  on pro_qa for select
  using (status = 'answered' or status = 'pending');

create policy "Anyone can ask questions"
  on pro_qa for insert
  with check (true);

-- Review helpful votes
create table if not exists review_helpful (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references provider_reviews(id) on delete cascade,
  voter_fingerprint text not null,
  created_at timestamptz not null default now(),
  unique (review_id, voter_fingerprint)
);

alter table review_helpful enable row level security;
create policy "Public read helpful counts" on review_helpful for select using (true);
create policy "Anyone can vote helpful" on review_helpful for insert with check (true);

-- Pro review responses
alter table provider_reviews add column if not exists pro_response text;
alter table provider_reviews add column if not exists pro_response_at timestamptz;

-- Availability slots
create table if not exists availability_slots (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references service_providers(id) on delete cascade,
  starts_at timestamptz not null,
  ends_at timestamptz not null,
  is_booked boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists availability_provider_idx on availability_slots (provider_id, starts_at);

alter table availability_slots enable row level security;
create policy "Public read availability" on availability_slots for select using (true);

grant select, insert, delete on saved_providers to authenticated;
grant select, insert on message_threads to authenticated;
grant select, insert on messages to authenticated;
grant select, insert on pro_qa to anon, authenticated;
grant select, insert on review_helpful to anon, authenticated;
grant select on availability_slots to anon, authenticated;
