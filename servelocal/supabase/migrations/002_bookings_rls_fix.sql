-- Migration 002: tighten bookings RLS (Wave 1 security hotfix)
-- Apply on existing projects that already ran bookings.sql with the permissive policy.

drop policy if exists "Users read own bookings" on bookings;
create policy "Users read own bookings"
  on bookings for select
  using (auth.uid() = user_id);
