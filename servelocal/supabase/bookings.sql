-- ServeLocal bookings (escrow-style job bookings)
-- Run after servelocal.sql and user-accounts.sql

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
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists bookings_provider_idx on bookings (provider_id);
create index if not exists bookings_user_idx on bookings (user_id) where user_id is not null;

alter table bookings enable row level security;

create policy "Users read own bookings"
  on bookings for select
  using (auth.uid() = user_id or auth.uid() is not null);

create policy "Anyone can create booking"
  on bookings for insert
  with check (true);
