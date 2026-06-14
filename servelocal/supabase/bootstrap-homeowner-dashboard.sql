-- ServeLocal: bootstrap SQL for homeowner dashboard (idempotent)
-- Paste into Supabase Dashboard → SQL Editor → Run
--
-- If you get "relation service_requests does not exist":
--   1. Run supabase/servelocal.sql first
--   2. Run supabase/premium.sql and supabase/suggestions.sql (optional but recommended)
--   3. Run supabase/guest-access.sql
--   4. Re-run this file
--
-- Correct order from README:
--   servelocal.sql → premium.sql → suggestions.sql → guest-access.sql
--   → THIS FILE (user_profiles + bookings + extras)

-- ---------------------------------------------------------------------------
-- A. User accounts (/dashboard, signup profiles)
-- ---------------------------------------------------------------------------

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

drop policy if exists "Users read own requests" on service_requests;
create policy "Users read own requests"
  on service_requests for select
  to authenticated
  using (user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- B. Pro dashboard link (needed before messaging / pro features)
-- ---------------------------------------------------------------------------

alter table service_providers
  add column if not exists owner_user_id uuid references auth.users(id) on delete set null;

create index if not exists service_providers_owner_user_idx
  on service_providers (owner_user_id)
  where owner_user_id is not null;

drop policy if exists "Owner read own provider" on service_providers;
create policy "Owner read own provider"
  on service_providers for select
  to authenticated
  using (owner_user_id = auth.uid());

-- ---------------------------------------------------------------------------
-- C. Bookings (quotes, payments)
-- ---------------------------------------------------------------------------

create table if not exists bookings (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references service_providers(id) on delete cascade,
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  service_description text not null,
  scheduled_at timestamptz,
  status text not null default 'pending'
    check (status in ('pending', 'confirmed', 'in_progress', 'completed', 'cancelled')),
  base_amount_cents int not null default 0,
  addons_cents int not null default 0,
  platform_fee_cents int not null default 0,
  tax_cents int not null default 0,
  total_cents int not null default 0,
  payment_status text not null default 'held'
    check (payment_status in ('held', 'released', 'refunded', 'failed')),
  user_id uuid references auth.users(id) on delete set null,
  stripe_session_id text,
  stripe_payment_intent_id text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table bookings add column if not exists stripe_session_id text;
alter table bookings add column if not exists stripe_payment_intent_id text;

create index if not exists bookings_provider_idx on bookings (provider_id);
create index if not exists bookings_user_idx on bookings (user_id) where user_id is not null;

alter table bookings enable row level security;

drop policy if exists "Users read own bookings" on bookings;
create policy "Users read own bookings"
  on bookings for select
  to authenticated
  using (auth.uid() = user_id);

drop policy if exists "Anyone can create booking" on bookings;
create policy "Anyone can create booking"
  on bookings for insert
  with check (true);

grant select, insert on bookings to authenticated;
grant insert on bookings to anon;

-- ---------------------------------------------------------------------------
-- D. Verify (should return rows — empty result means something failed)
-- ---------------------------------------------------------------------------

select 'user_profiles' as table_name, count(*) as rows from user_profiles
union all
select 'bookings', count(*) from bookings
union all
select 'service_requests', count(*) from service_requests;
