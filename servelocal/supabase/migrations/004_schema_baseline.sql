-- ServeLocal migration 004: schema baseline (idempotent)
-- Run in Supabase SQL Editor after bootstrap-homeowner-dashboard.sql

alter table service_requests
  add column if not exists user_id uuid references auth.users(id) on delete set null;

alter table service_requests
  add column if not exists urgency text check (urgency in ('asap', 'this_week', 'this_month', 'flexible'));

alter table service_requests
  add column if not exists budget_min int,
  add column if not exists budget_max int;

alter table service_providers
  add column if not exists owner_user_id uuid references auth.users(id) on delete set null;

create table if not exists user_profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role text not null default 'homeowner' check (role in ('homeowner', 'pro')),
  display_name text,
  phone text,
  created_at timestamptz not null default now()
);

alter table user_profiles add column if not exists onboarding_completed_at timestamptz;
alter table user_profiles add column if not exists onboarding_step int;
alter table user_profiles add column if not exists notification_email boolean default true;
alter table user_profiles add column if not exists notification_sms boolean default false;
alter table user_profiles add column if not exists preferred_city_slug text;

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

-- Strict bookings RLS (replace permissive policy if present)
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
