-- ServeLocal migration 006: remove direct pro PII access via RLS
-- Job leads are fetched server-side with admin client + tier masking.

drop policy if exists "Pros read matching job leads" on service_requests;
