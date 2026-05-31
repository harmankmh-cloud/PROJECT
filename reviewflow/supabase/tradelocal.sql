-- TradeLocal — local service directory (IndiaMART-style contacts for BC)
-- Run in Supabase SQL Editor after schema.sql

create table if not exists service_categories (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  name text not null,
  icon text not null default '🔧',
  sort_order int not null default 0
);

create table if not exists service_providers (
  id uuid primary key default gen_random_uuid(),
  slug text not null unique,
  display_name text not null,
  category_slug text not null references service_categories(slug),
  city_slug text not null,
  phone text not null,
  email text,
  whatsapp text,
  bio text,
  years_experience int,
  licensed boolean not null default false,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected', 'paused')),
  featured boolean not null default false,
  contact_clicks int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists service_providers_city_category_idx
  on service_providers (city_slug, category_slug)
  where status = 'approved';

create table if not exists service_requests (
  id uuid primary key default gen_random_uuid(),
  category_slug text not null,
  city_slug text not null,
  customer_name text not null,
  customer_phone text not null,
  customer_email text,
  description text not null,
  status text not null default 'open' check (status in ('open', 'closed')),
  created_at timestamptz not null default now()
);

create index if not exists service_requests_created_idx
  on service_requests (created_at desc);

-- Seed categories
insert into service_categories (slug, name, icon, sort_order) values
  ('plumber', 'Plumber', '🔧', 1),
  ('electrician', 'Electrician', '⚡', 2),
  ('handyman', 'Handyman', '🛠', 3),
  ('cleaner', 'House cleaning', '🧹', 4),
  ('hvac', 'HVAC / furnace', '❄', 5),
  ('roofer', 'Roofer', '🏠', 6),
  ('painter', 'Painter', '🎨', 7),
  ('landscaper', 'Landscaping', '🌿', 8)
on conflict (slug) do nothing;

alter table service_categories enable row level security;
alter table service_providers enable row level security;
alter table service_requests enable row level security;

create policy "Public read categories"
  on service_categories for select using (true);

create policy "Public read approved providers"
  on service_providers for select
  using (status = 'approved');

create policy "Public apply as provider"
  on service_providers for insert
  with check (status = 'pending');

create policy "Anyone can post service request"
  on service_requests for insert with check (true);
