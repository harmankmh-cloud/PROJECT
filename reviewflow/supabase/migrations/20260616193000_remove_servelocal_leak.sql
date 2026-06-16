-- ServeLocal tables were mistakenly created on RateLocal (otnddwopphhxstteqizw).
-- ServeLocal production uses TRADELOCAL (avytxgfkncpacqewnrvz). Safe to drop here.

drop table if exists public.bookings cascade;
drop table if exists public.service_requests cascade;
drop table if exists public.service_providers cascade;
drop table if exists public.service_categories cascade;
drop table if exists public.user_profiles cascade;
