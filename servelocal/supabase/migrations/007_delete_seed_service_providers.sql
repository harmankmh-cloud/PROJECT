-- Remove unclaimed seed/test rows that have no real owner.
-- Matches providers seeded with placeholder 604-555-* phones or *.example emails
-- that were never claimed by a real user account.
delete from service_providers
where owner_user_id is null
  and (phone like '604-555-%' or email like '%.example');
