-- Public business profiles and Yelp-style reviews

alter table businesses
  add column if not exists description text,
  add column if not exists cover_photo_url text,
  add column if not exists logo_url text,
  add column if not exists address text,
  add column if not exists city text,
  add column if not exists province text default 'BC',
  add column if not exists postal_code text,
  add column if not exists lat double precision,
  add column if not exists lng double precision,
  add column if not exists phone text,
  add column if not exists website text,
  add column if not exists hours jsonb,
  add column if not exists price_range smallint check (price_range between 1 and 4),
  add column if not exists amenities text[],
  add column if not exists is_claimed boolean not null default false,
  add column if not exists is_listed boolean not null default true,
  add column if not exists avg_rating numeric(2,1),
  add column if not exists review_count integer not null default 0,
  add column if not exists ai_summary text,
  add column if not exists ai_summary_tags text[],
  add column if not exists ai_summary_updated_at timestamptz;

create table if not exists business_photos (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists reviews (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  user_id uuid references auth.users(id) on delete set null,
  author_name text not null,
  author_avatar_url text,
  star_rating integer not null check (star_rating between 1 and 5),
  body text not null,
  sub_ratings jsonb,
  helpful_count integer not null default 0,
  is_verified_visit boolean not null default false,
  is_public boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists review_photos (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references reviews(id) on delete cascade,
  url text not null,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create table if not exists review_responses (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null unique references reviews(id) on delete cascade,
  business_id uuid not null references businesses(id) on delete cascade,
  body text not null,
  created_at timestamptz not null default now()
);

create table if not exists review_helpful_votes (
  id uuid primary key default gen_random_uuid(),
  review_id uuid not null references reviews(id) on delete cascade,
  user_id uuid not null references auth.users(id) on delete cascade,
  created_at timestamptz not null default now(),
  unique (review_id, user_id)
);

create index if not exists idx_businesses_city on businesses(city);
create index if not exists idx_businesses_listed_rating on businesses(is_listed, avg_rating desc);
create index if not exists idx_reviews_business on reviews(business_id, created_at desc);
create index if not exists idx_reviews_public on reviews(business_id) where is_public = true;

alter table business_photos enable row level security;
alter table reviews enable row level security;
alter table review_photos enable row level security;
alter table review_responses enable row level security;
alter table review_helpful_votes enable row level security;

create policy "Public read business photos"
  on business_photos for select using (true);

create policy "Owners manage business photos"
  on business_photos for all
  using (
    exists (
      select 1 from businesses b
      where b.id = business_photos.business_id and b.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from businesses b
      where b.id = business_photos.business_id and b.user_id = auth.uid()
    )
  );

create policy "Public read public reviews"
  on reviews for select using (is_public = true);

create policy "Authenticated users insert reviews"
  on reviews for insert with check (true);

create policy "Public read review photos"
  on review_photos for select
  using (
    exists (
      select 1 from reviews r
      where r.id = review_photos.review_id and r.is_public = true
    )
  );

create policy "Public read review responses"
  on review_responses for select using (true);

create policy "Owners manage review responses"
  on review_responses for all
  using (
    exists (
      select 1 from businesses b
      where b.id = review_responses.business_id and b.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from businesses b
      where b.id = review_responses.business_id and b.user_id = auth.uid()
    )
  );

create policy "Users manage own helpful votes"
  on review_helpful_votes for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create or replace function update_business_rating_stats()
returns trigger as $$
begin
  update businesses
  set
    avg_rating = (
      select round(avg(star_rating)::numeric, 1)
      from reviews
      where business_id = coalesce(new.business_id, old.business_id)
        and is_public = true
    ),
    review_count = (
      select count(*)::integer
      from reviews
      where business_id = coalesce(new.business_id, old.business_id)
        and is_public = true
    ),
    updated_at = now()
  where id = coalesce(new.business_id, old.business_id);
  return coalesce(new, old);
end;
$$ language plpgsql security definer;

drop trigger if exists trg_update_business_rating on reviews;
create trigger trg_update_business_rating
  after insert or update or delete on reviews
  for each row execute function update_business_rating_stats();
