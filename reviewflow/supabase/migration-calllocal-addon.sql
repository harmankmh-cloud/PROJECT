-- CallLocal $10/mo add-on entitlement — run in Supabase SQL Editor

alter table businesses
  add column if not exists calllocal_subscribed boolean not null default false;
