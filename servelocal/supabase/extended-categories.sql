-- ServeLocal extended categories (run after servelocal.sql)
-- Adds 15 service categories for 23 total directory + guide pages.

insert into service_categories (slug, name, icon, sort_order) values
  ('mover', 'Mover', '📦', 9),
  ('pest-control', 'Pest control', '🐜', 10),
  ('fence-builder', 'Fence builder', '🪵', 11),
  ('deck-builder', 'Deck builder', '🪚', 12),
  ('flooring', 'Flooring', '🪵', 13),
  ('drywall', 'Drywall', '🧱', 14),
  ('appliance-repair', 'Appliance repair', '🔌', 15),
  ('locksmith', 'Locksmith', '🔑', 16),
  ('window-cleaner', 'Window cleaning', '🪟', 17),
  ('gutter-cleaning', 'Gutter cleaning', '🍂', 18),
  ('tree-removal', 'Tree removal', '🌳', 19),
  ('garage-door', 'Garage door', '🚗', 20),
  ('pool-service', 'Pool service', '🏊', 21),
  ('septic', 'Septic service', '🚽', 22),
  ('chimney-sweep', 'Chimney sweep', '🔥', 23)
on conflict (slug) do nothing;
