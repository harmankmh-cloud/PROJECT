-- Migration 003: homeowner onboarding + notification prefs (Wave 4)
-- Run after user-accounts.sql

alter table user_profiles add column if not exists onboarding_completed_at timestamptz;
alter table user_profiles add column if not exists onboarding_step int not null default 0;
alter table user_profiles add column if not exists notification_email boolean not null default true;
alter table user_profiles add column if not exists notification_sms boolean not null default false;
alter table user_profiles add column if not exists preferred_city_slug text;
