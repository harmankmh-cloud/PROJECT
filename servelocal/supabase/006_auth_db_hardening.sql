-- Auth + API hardening (run once in Supabase SQL Editor)
-- Complements guest-access.sql and user-accounts.sql

-- Authenticated dashboard reads (RLS policies exist; grant was missing in older setups)
grant select on service_requests to authenticated;
grant select on bookings to authenticated;

-- Contact click counter: server-side increment without service role
grant update (contact_clicks, updated_at) on service_providers to anon, authenticated;

drop policy if exists "Public increment contact clicks on approved providers" on service_providers;
create policy "Public increment contact clicks on approved providers"
  on service_providers for update
  to anon, authenticated
  using (status = 'approved')
  with check (status = 'approved');

-- Pro dashboard: read pending + approved reviews on own listing
drop policy if exists "Owner read reviews on own listing" on provider_reviews;
create policy "Owner read reviews on own listing"
  on provider_reviews for select
  to authenticated
  using (
    exists (
      select 1 from service_providers sp
      where sp.id = provider_reviews.provider_id
        and sp.owner_user_id = auth.uid()
    )
  );
