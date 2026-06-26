-- CallLocal (missed-call SMS) — run in Supabase SQL Editor after schema.sql

-- CallLocal is a paid $10/mo add-on. `businesses.calllocal_subscribed` is kept
-- in sync from the Stripe webhook and gates live call routing.
alter table businesses
  add column if not exists calllocal_subscribed boolean not null default false;

create table if not exists calllocal_settings (
  business_id uuid primary key references businesses(id) on delete cascade,
  enabled boolean not null default false,
  twilio_phone_e164 text unique,
  ring_phone_e164 text,
  sms_template text not null default 'Sorry we missed your call at {business_name}! Reply to this text with what you need, or visit: {link}',
  notify_owner_on_missed boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists call_events (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  call_sid text,
  caller_e164 text not null,
  status text not null check (status in ('ringing', 'answered', 'missed', 'failed')),
  sms_sent_to_caller boolean not null default false,
  sms_sent_to_owner boolean not null default false,
  created_at timestamptz not null default now()
);

create index if not exists call_events_business_created_idx
  on call_events (business_id, created_at desc);

create table if not exists calllocal_sms_log (
  id uuid primary key default gen_random_uuid(),
  business_id uuid not null references businesses(id) on delete cascade,
  direction text not null check (direction in ('inbound', 'outbound')),
  from_e164 text not null,
  to_e164 text not null,
  body text not null,
  message_sid text,
  created_at timestamptz not null default now()
);

alter table calllocal_settings enable row level security;
alter table call_events enable row level security;
alter table calllocal_sms_log enable row level security;

create policy "Owners manage own calllocal settings"
  on calllocal_settings for all
  using (
    exists (select 1 from businesses b where b.id = calllocal_settings.business_id and b.user_id = auth.uid())
  )
  with check (
    exists (select 1 from businesses b where b.id = calllocal_settings.business_id and b.user_id = auth.uid())
  );

create policy "Owners read own call events"
  on call_events for select
  using (
    exists (select 1 from businesses b where b.id = call_events.business_id and b.user_id = auth.uid())
  );

create policy "Owners read own sms log"
  on calllocal_sms_log for select
  using (
    exists (select 1 from businesses b where b.id = calllocal_sms_log.business_id and b.user_id = auth.uid())
  );
