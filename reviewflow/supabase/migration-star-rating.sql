-- Run this in Supabase SQL Editor if you already ran the original schema.sql

alter table feedback_events
  add column if not exists star_rating integer check (star_rating between 1 and 5);

-- Backfill star ratings from old experience levels (optional)
update feedback_events set star_rating = 5 where star_rating is null and experience_level = 'great';
update feedback_events set star_rating = 4 where star_rating is null and experience_level = 'good';
update feedback_events set star_rating = 3 where star_rating is null and experience_level = 'okay';
update feedback_events set star_rating = 2 where star_rating is null and experience_level = 'bad';
