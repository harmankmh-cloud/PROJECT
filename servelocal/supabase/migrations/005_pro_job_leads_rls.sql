-- ServeLocal migration 005: pro job leads RLS + verify bookings policy
-- Run after 004_schema_baseline.sql

-- Pros read open job requests matching their approved listing city + category
drop policy if exists "Pros read matching job leads" on service_requests;
create policy "Pros read matching job leads"
  on service_requests for select
  to authenticated
  using (
    exists (
      select 1 from service_providers sp
      where sp.owner_user_id = auth.uid()
        and sp.status = 'approved'
        and sp.category_slug = service_requests.category_slug
        and sp.city_slug = service_requests.city_slug
    )
  );

-- Verify strict bookings read policy (safe to re-run)
drop policy if exists "Users read own bookings" on bookings;
create policy "Users read own bookings"
  on bookings for select
  to authenticated
  using (auth.uid() = user_id);

-- Run in SQL Editor to confirm live policy:
-- select policyname, qual from pg_policies where tablename = 'bookings';
