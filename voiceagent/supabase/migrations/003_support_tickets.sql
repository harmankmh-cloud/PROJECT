-- Support tickets (public + logged-in help form)
create table if not exists va_support_tickets (
  id uuid primary key default gen_random_uuid(),
  org_id uuid references va_organizations(id) on delete set null,
  user_id uuid references auth.users(id) on delete set null,
  email text not null,
  org_name text,
  category text not null default 'help',
  message text not null,
  created_at timestamptz not null default now()
);

grant all on va_support_tickets to postgres, service_role;
grant insert, select on va_support_tickets to authenticated;
