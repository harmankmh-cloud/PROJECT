-- Optional: one business per account (run in Supabase SQL Editor)

create unique index if not exists businesses_user_id_unique on businesses (user_id);
