-- ServeLocal production seed — matches live service_providers schema (no premium columns).
-- Safe to re-run: on conflict (slug) do nothing.

insert into service_providers (
  slug,
  display_name,
  category_slug,
  city_slug,
  phone,
  email,
  whatsapp,
  bio,
  years_experience,
  licensed,
  status,
  featured
) values
  ('surrey-valley-plumbing', 'Valley Plumbing Co.', 'plumber', 'surrey', '604-555-0101', 'hello@valleyplumbing.example', '6045550101', 'Licensed residential and commercial plumbing across Surrey and Delta.', 12, true, 'approved', true),
  ('surrey-bright-spark-electric', 'Bright Spark Electric', 'electrician', 'surrey', '604-555-0102', null, '6045550102', 'Panel upgrades, EV charger installs, and lighting for Surrey homes.', 9, true, 'approved', false),
  ('langley-pipe-pros', 'Langley Pipe Pros', 'plumber', 'langley', '604-555-0201', null, '6045550201', 'Langley family plumber — drains, fixtures, and re-pipes.', 15, true, 'approved', true),
  ('langley-clean-team', 'Langley Clean Team', 'cleaner', 'langley', '604-555-0202', 'book@langleyclean.example', null, 'Recurring house cleaning and move-out deep cleans.', 4, false, 'approved', false),
  ('abbotsford-fraser-hvac', 'Fraser Valley HVAC', 'hvac', 'abbotsford', '604-555-0301', null, '6045550301', 'Furnace tune-ups, AC installs, and emergency no-heat calls.', 11, true, 'approved', true),
  ('abbotsford-paint-pros', 'Abbotsford Paint Pros', 'painter', 'abbotsford', '604-555-0302', null, null, 'Interior and exterior painting for Fraser Valley homes.', 10, false, 'approved', false),
  ('chilliwack-mountain-plumbing', 'Mountain Plumbing', 'plumber', 'chilliwack', '604-555-0401', null, '6045550401', 'Chilliwack plumber for wells and standard residential work.', 14, true, 'approved', false),
  ('burnaby-metro-plumbing', 'Metro Plumbing Burnaby', 'plumber', 'burnaby', '604-555-0701', null, '6045550701', 'Burnaby condos and houses — leaks, clogs, and water heaters.', 11, true, 'approved', true),
  ('vancouver-city-plumbing', 'City Plumbing Vancouver', 'plumber', 'vancouver', '604-555-0801', null, '6045550801', 'East Van and Kits plumbing — renos, emergencies, and strata work.', 20, true, 'approved', true),
  ('vancouver-power-line', 'Power Line Electric', 'electrician', 'vancouver', '604-555-0802', null, '6045550802', 'Vancouver electrician for EV chargers and panel upgrades.', 14, true, 'approved', true)
on conflict (slug) do nothing;
