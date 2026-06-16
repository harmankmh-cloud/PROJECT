# Database — schemas, migrations, troubleshooting

Each product uses a **separate Supabase project**. Never mix RateLocal/GreetQ data with ServeLocal.

| App | Project ref | Schema folder |
|-----|-------------|---------------|
| GreetQ | `lrihhjjxmxixppmrzvva` | `voiceagent/supabase/` |
| RateLocal | `otnddwopphhxstteqizw` | `reviewflow/supabase/` |
| ServeLocal | `avytxgfkncpacqewnrvz` | `servelocal/supabase/` |

## RateLocal (reviewflow)

**Fresh project:** run `reviewflow/supabase/schema.sql` in Supabase SQL Editor.

**Existing project:** apply migrations in timestamp order under `reviewflow/supabase/migrations/`.

| Migration | Purpose |
|-----------|---------|
| `20260609120000_public_profiles_and_reviews.sql` | Public profiles, reviews, owner responses |
| `20260614120000_tighten_public_inserts.sql` | Tighter RLS on feedback/review inserts |
| `20260616120000_owners_read_reviews.sql` | Owners can read reviews on their business |

## GreetQ (voiceagent)

Run `voiceagent/supabase/schema.sql`, then migrations in `voiceagent/supabase/migrations/`.

GreetQ can share a Supabase project with RateLocal or use its own.

## ServeLocal (servelocal)

**Must be a separate project.** Run in order:

1. `servelocal.sql` → `premium.sql` → `suggestions.sql` → `guest-access.sql`
2. `user-accounts.sql` → `bookings.sql` → `complete-features.sql`
3. `supabase/migrations/004_schema_baseline.sql` through latest

| Migration | Purpose |
|-----------|---------|
| `006_remove_pro_job_pii_rls.sql` | Job leads fetched server-side; no direct pro PII via RLS |

## Troubleshooting

| Symptom | Fix |
|---------|-----|
| `relation does not exist` | Run base schema before migrations |
| RLS blocks owner reads | Confirm policies; use service role only server-side |
| Migration already applied | Supabase tracks versions — skip or use `IF NOT EXISTS` |
| Pooler timeouts on scripts | Use `POSTGRES_URL` (port 6543) not direct 5432 |

## Verify after migrate

```bash
# RateLocal — list tables via Supabase dashboard or MCP list_tables
# ServeLocal — confirm service_requests RLS matches 006 migration
```

**Last updated:** June 16, 2026
