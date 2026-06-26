delete from service_providers
where owner_user_id is null
  and (phone like '604-555-%' or email like '%.example');