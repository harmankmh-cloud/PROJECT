-- TradeLocal Premium upgrade — run after tradelocal.sql

alter table service_providers add column if not exists listing_tier text not null default 'free'
  check (listing_tier in ('free', 'featured', 'premium'));
alter table service_providers add column if not exists verified boolean not null default false;
alter table service_providers add column if not exists insurance_verified boolean not null default false;
alter table service_providers add column if not exists license_number text;
alter table service_providers add column if not exists website text;
alter table service_providers add column if not exists portfolio_urls text[] default '{}';
alter table service_providers add column if not exists business_hours text;
alter table service_providers add column if not exists response_time text;
alter table service_providers add column if not exists jobs_completed int not null default 0;
alter table service_providers add column if not exists min_callout_fee text;
alter table service_providers add column if not exists emergency_available boolean not null default false;
alter table service_providers add column if not exists avg_rating numeric(3,2) not null default 0;
alter table service_providers add column if not exists review_count int not null default 0;
alter table service_providers add column if not exists requested_plan text default 'free';

create table if not exists provider_reviews (
  id uuid primary key default gen_random_uuid(),
  provider_id uuid not null references service_providers(id) on delete cascade,
  reviewer_name text not null,
  rating int not null check (rating >= 1 and rating <= 5),
  title text,
  body text not null,
  status text not null default 'pending'
    check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create index if not exists provider_reviews_provider_idx
  on provider_reviews (provider_id, status);

alter table provider_reviews enable row level security;

drop policy if exists "Public read approved reviews" on provider_reviews;
create policy "Public read approved reviews"
  on provider_reviews for select using (status = 'approved');

drop policy if exists "Anyone can submit review" on provider_reviews;
create policy "Anyone can submit review"
  on provider_reviews for insert with check (status = 'pending');
