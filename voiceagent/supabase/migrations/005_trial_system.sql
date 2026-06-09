-- Professional trial system (Retell-style credits + Stripe go-live trial)
-- Run in Supabase SQL Editor after prior migrations.

alter table va_organizations
  add column if not exists trial_minutes_remaining integer not null default 30,
  add column if not exists sandbox_test_calls_used integer not null default 0;

-- Expand plan enum: trial (pre-subscription), growth (mid-tier)
alter table va_organizations drop constraint if exists va_organizations_plan_check;
alter table va_organizations
  add constraint va_organizations_plan_check
  check (plan in ('trial', 'starter', 'growth', 'pro', 'enterprise'));

-- Existing orgs without a subscription stay on trial with a starter credit grant
update va_organizations
set
  plan = 'trial',
  trial_minutes_remaining = greatest(trial_minutes_remaining, 30)
where stripe_subscription_id is null
  and plan = 'starter';
