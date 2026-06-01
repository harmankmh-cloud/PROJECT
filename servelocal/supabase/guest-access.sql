-- ServeLocal: guest access (no login required)
-- Run after servelocal.sql, premium.sql, and suggestions.sql

grant usage on schema public to anon, authenticated;

grant select on service_categories to anon, authenticated;
grant select on service_providers to anon, authenticated;
grant insert on service_providers to anon, authenticated;
grant select on provider_reviews to anon, authenticated;
grant insert on provider_reviews to anon, authenticated;
grant insert on service_requests to anon, authenticated;
grant insert on site_suggestions to anon, authenticated;

-- Re-assert policies so anon is never blocked on public actions
drop policy if exists "Public read categories" on service_categories;
create policy "Public read categories"
  on service_categories for select
  to anon, authenticated
  using (true);

drop policy if exists "Public read approved providers" on service_providers;
create policy "Public read approved providers"
  on service_providers for select
  to anon, authenticated
  using (status = 'approved');

drop policy if exists "Public apply as provider" on service_providers;
create policy "Public apply as provider"
  on service_providers for insert
  to anon, authenticated
  with check (status = 'pending');

drop policy if exists "Anyone can post service request" on service_requests;
create policy "Anyone can post service request"
  on service_requests for insert
  to anon, authenticated
  with check (true);

drop policy if exists "Public read approved reviews" on provider_reviews;
create policy "Public read approved reviews"
  on provider_reviews for select
  to anon, authenticated
  using (status = 'approved');

drop policy if exists "Anyone can submit review" on provider_reviews;
create policy "Anyone can submit review"
  on provider_reviews for insert
  to anon, authenticated
  with check (status = 'pending');

drop policy if exists "Anyone can submit suggestion" on site_suggestions;
create policy "Anyone can submit suggestion"
  on site_suggestions for insert
  to anon, authenticated
  with check (true);
