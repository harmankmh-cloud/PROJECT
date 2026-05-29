-- ReviewFlow schema — run in Supabase SQL Editor

create extension if not exists "pgcrypto";

create table if not exists businesses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  name text not null,
  slug text not null unique,
  business_type text not null default 'general',
  google_review_url text,
  tone text not null default 'friendly',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists prompt_templates (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  experience_level text not null check (experience_level in ('great', 'good', 'okay', 'bad')),
  helper_label text not null,
  placeholder text not null,
  ai_instruction text not null,
  unique (business_id, experience_level)
);

create table if not exists feedback_events (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  experience_level text not null,
  customer_notes text,
  ai_draft text,
  is_private boolean not null default false,
  customer_name text,
  created_at timestamptz not null default now()
);

create table if not exists analytics_events (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  event_type text not null,
  created_at timestamptz not null default now()
);

alter table businesses enable row level security;
alter table prompt_templates enable row level security;
alter table feedback_events enable row level security;
alter table analytics_events enable row level security;

create policy "Owners manage own businesses"
  on businesses for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create policy "Owners manage own prompts"
  on prompt_templates for all
  using (
    exists (
      select 1 from businesses b
      where b.id = prompt_templates.business_id and b.user_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from businesses b
      where b.id = prompt_templates.business_id and b.user_id = auth.uid()
    )
  );

create policy "Owners read own feedback"
  on feedback_events for select
  using (
    exists (
      select 1 from businesses b
      where b.id = feedback_events.business_id and b.user_id = auth.uid()
    )
  );

create policy "Anyone can submit feedback"
  on feedback_events for insert
  with check (true);

create policy "Owners read own analytics"
  on analytics_events for select
  using (
    exists (
      select 1 from businesses b
      where b.id = analytics_events.business_id and b.user_id = auth.uid()
    )
  );

create policy "Anyone can log analytics"
  on analytics_events for insert
  with check (true);

create policy "Public read businesses by slug"
  on businesses for select
  using (true);

create policy "Public read prompts by business"
  on prompt_templates for select
  using (true);
