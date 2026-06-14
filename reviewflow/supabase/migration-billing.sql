-- Billing & plans — run in Supabase SQL Editor

alter table businesses
  add column if not exists plan text not null default 'trial';

alter table businesses
  add column if not exists stripe_customer_id text;

alter table businesses
  add column if not exists stripe_subscription_id text;

alter table businesses
  add column if not exists subscription_status text default 'trialing';

alter table businesses
  add column if not exists setup_paid_at timestamptz;

create index if not exists feedback_events_business_created_idx
  on feedback_events (business_id, created_at desc);
