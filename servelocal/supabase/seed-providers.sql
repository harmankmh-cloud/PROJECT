-- ServeLocal seed listings — run after servelocal.sql + premium.sql
-- Adds approved sample pros across BC cities for pre-launch directory testing.
-- Replace phone numbers and business names with real pros before marketing.

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
  featured,
  listing_tier,
  verified,
  insurance_verified,
  emergency_available,
  response_time,
  avg_rating,
  review_count
) values
  -- Surrey
  ('surrey-valley-plumbing', 'Valley Plumbing Co.', 'plumber', 'surrey', '604-555-0101', 'hello@valleyplumbing.example', '6045550101', 'Licensed residential and commercial plumbing across Surrey and Delta. Drain cleaning, water heaters, and emergency calls.', 12, true, 'approved', true, 'featured', true, true, true, 'Within 2 hours', 4.8, 14),
  ('surrey-bright-spark-electric', 'Bright Spark Electric', 'electrician', 'surrey', '604-555-0102', null, '6045550102', 'Panel upgrades, EV charger installs, and lighting for Surrey homes.', 9, true, 'approved', false, 'free', true, false, false, 'Same day', 4.6, 8),
  ('surrey-home-fix-handyman', 'Surrey Home Fix', 'handyman', 'surrey', '604-555-0103', null, null, 'Drywall, shelving, minor repairs, and punch-list work.', 6, false, 'approved', false, 'free', false, false, false, null, 4.4, 5),
  -- Langley
  ('langley-pipe-pros', 'Langley Pipe Pros', 'plumber', 'langley', '604-555-0201', null, '6045550201', 'Langley family plumber — drains, fixtures, and re-pipes.', 15, true, 'approved', true, 'premium', true, true, true, 'Within 1 hour', 4.9, 22),
  ('langley-clean-team', 'Langley Clean Team', 'cleaner', 'langley', '604-555-0202', 'book@langleyclean.example', null, 'Recurring house cleaning and move-out deep cleans.', 4, false, 'approved', false, 'free', false, false, false, null, 4.7, 11),
  ('langley-roof-right', 'Roof Right Langley', 'roofer', 'langley', '604-555-0203', null, '6045550203', 'Shingle repairs, leak diagnostics, and full re-roofs.', 18, true, 'approved', false, 'featured', true, true, false, 'Within 24 hours', 4.5, 9),
  -- Abbotsford
  ('abbotsford-fraser-hvac', 'Fraser Valley HVAC', 'hvac', 'abbotsford', '604-555-0301', null, '6045550301', 'Furnace tune-ups, AC installs, and emergency no-heat calls.', 11, true, 'approved', true, 'featured', true, true, true, 'Within 3 hours', 4.8, 16),
  ('abbotsford-paint-pros', 'Abbotsford Paint Pros', 'painter', 'abbotsford', '604-555-0302', null, null, 'Interior and exterior painting for Fraser Valley homes.', 10, false, 'approved', false, 'free', false, false, false, null, 4.3, 6),
  ('abbotsford-yard-care', 'Abbotsford Yard Care', 'landscaper', 'abbotsford', '604-555-0303', null, '6045550303', 'Lawn maintenance, hedge trimming, and seasonal cleanups.', 7, false, 'approved', false, 'free', false, false, false, null, 4.6, 7),
  -- Chilliwack
  ('chilliwack-mountain-plumbing', 'Mountain Plumbing', 'plumber', 'chilliwack', '604-555-0401', null, '6045550401', 'Chilliwack plumber for wells, septic-adjacent work, and standard residential.', 14, true, 'approved', false, 'free', true, false, true, 'Within 4 hours', 4.7, 10),
  ('chilliwack-electric-solutions', 'Chilliwack Electric Solutions', 'electrician', 'chilliwack', '604-555-0402', null, null, 'Farm and residential electrical — panels, barn wiring, and outlets.', 13, true, 'approved', false, 'featured', true, true, false, 'Same day', 4.8, 12),
  -- Mission
  ('mission-handyman-hub', 'Mission Handyman Hub', 'handyman', 'mission', '604-555-0501', null, null, 'Small jobs, fence repair, and deck maintenance in Mission.', 5, false, 'approved', false, 'free', false, false, false, null, 4.2, 4),
  ('mission-valley-roofing', 'Mission Valley Roofing', 'roofer', 'mission', '604-555-0502', null, '6045550502', 'Roof inspections, moss treatment, and shingle replacement.', 16, true, 'approved', false, 'free', true, true, false, null, 4.6, 8),
  -- Delta
  ('delta-shore-plumbing', 'Delta Shore Plumbing', 'plumber', 'delta', '604-555-0601', null, '6045550601', 'Ladner and Tsawwassen plumbing — fixtures, drains, and renos.', 8, true, 'approved', false, 'free', true, false, true, 'Within 2 hours', 4.5, 7),
  ('delta-spark-electrical', 'Delta Spark Electrical', 'electrician', 'delta', '604-555-0602', null, null, 'Residential electrical upgrades across Delta.', 10, true, 'approved', true, 'premium', true, true, false, 'Within 4 hours', 4.9, 15),
  -- Burnaby
  ('burnaby-metro-plumbing', 'Metro Plumbing Burnaby', 'plumber', 'burnaby', '604-555-0701', null, '6045550701', 'Burnaby condos and houses — leaks, clogs, and water heaters.', 11, true, 'approved', true, 'featured', true, true, true, 'Within 1 hour', 4.8, 19),
  ('burnaby-fresh-clean', 'Burnaby Fresh Clean', 'cleaner', 'burnaby', '604-555-0702', 'info@burnabyfresh.example', null, 'Eco-friendly house cleaning for Burnaby and Metrotown area.', 3, false, 'approved', false, 'free', false, false, false, null, 4.6, 9),
  ('burnaby-hvac-experts', 'Burnaby HVAC Experts', 'hvac', 'burnaby', '604-555-0703', null, '6045550703', 'Heat pumps, furnaces, and ductless mini-splits.', 12, true, 'approved', false, 'featured', true, true, true, 'Within 3 hours', 4.7, 13),
  -- Vancouver
  ('vancouver-city-plumbing', 'City Plumbing Vancouver', 'plumber', 'vancouver', '604-555-0801', null, '6045550801', 'East Van and Kits plumbing — renos, emergencies, and strata work.', 20, true, 'approved', true, 'premium', true, true, true, 'Within 1 hour', 4.9, 28),
  ('vancouver-power-line', 'Power Line Electric', 'electrician', 'vancouver', '604-555-0802', null, '6045550802', 'Vancouver electrician for EV chargers, knob-and-tube assessments, and panels.', 14, true, 'approved', true, 'featured', true, true, false, 'Same day', 4.8, 21),
  ('vancouver-paint-studio', 'Vancouver Paint Studio', 'painter', 'vancouver', '604-555-0803', null, null, 'Condo and heritage home painting across Vancouver.', 9, false, 'approved', false, 'free', false, false, false, null, 4.4, 6),
  ('vancouver-green-scapes', 'Vancouver Green Scapes', 'landscaper', 'vancouver', '604-555-0804', null, '6045550804', 'Urban gardens, lawn care, and small hardscape projects.', 8, false, 'approved', false, 'free', false, false, false, null, 4.5, 5)
on conflict (slug) do nothing;
