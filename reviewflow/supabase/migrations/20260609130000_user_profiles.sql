-- Consumer profiles for reviewer badges and public user pages

create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  avatar_url text,
  city text,
  tier text not null default 'newbie' check (tier in ('newbie', 'contributor', 'expert', 'elite')),
  review_count integer not null default 0,
  photo_count integer not null default 0,
  helpful_received integer not null default 0,
  helpful_given integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table profiles enable row level security;

create policy "Public read profiles"
  on profiles for select using (true);

create policy "Users update own profile"
  on profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

create policy "Users insert own profile"
  on profiles for insert
  with check (auth.uid() = id);

-- Link reviews.user_id to profiles
create index if not exists idx_profiles_tier on profiles(tier);
