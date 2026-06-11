-- Billing enhancements: subscription lifecycle, Stripe period sync, spending caps

alter table va_organizations
  add column if not exists subscription_status text
    check (subscription_status is null or subscription_status in (
      'trialing', 'active', 'past_due', 'unpaid', 'canceled', 'incomplete', 'incomplete_expired', 'paused'
    )),
  add column if not exists billing_period_start timestamptz,
  add column if not exists billing_period_end timestamptz,
  add column if not exists access_until timestamptz,
  add column if not exists spending_limit_cents integer,
  add column if not exists overage_blocked boolean not null default false;

create index if not exists idx_va_usage_call_dedupe
  on va_usage_events (call_id)
  where call_id is not null and event_type = 'voice_minute';

create index if not exists idx_va_calls_active_org
  on va_calls (org_id)
  where ended_at is null and is_sandbox = false;
