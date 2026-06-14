-- RLS hardening: support tickets + explicit service-role-only lead tables

alter table va_support_tickets enable row level security;

create policy "Users insert own support tickets"
  on va_support_tickets for insert
  to authenticated
  with check (user_id = auth.uid() or user_id is null);

create policy "Users read own support tickets"
  on va_support_tickets for select
  to authenticated
  using (
    user_id = auth.uid()
    or (org_id is not null and org_id in (select va_user_org_ids()))
  );

-- Marketing/outreach pools: service role only (API routes use admin client)
create policy "Service role manages marketing leads"
  on va_marketing_leads for all
  to service_role
  using (true)
  with check (true);

create policy "Service role manages outreach leads"
  on va_outreach_leads for all
  to service_role
  using (true)
  with check (true);
