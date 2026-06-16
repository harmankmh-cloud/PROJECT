# ServeLocal

**ServeLocal** is a standalone directory app for finding local trades in BC (Fraser Valley & Metro Vancouver). Customers browse listings and call pros directly — no middleman.

This is a **separate app** from RateLocal (`reviewflow/`). Deploy it on its own domain (e.g. `servelocal.ca`).

## Quick start

```bash
cd servelocal
cp .env.local.template .env.local
# Edit .env.local with your Supabase keys and admin email
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Database setup

**Supabase project:** ServeLocal uses its **own** project (`avytxgfkncpacqewnrvz` / TradeLocal) — not the RateLocal or GreetQ database.

1. Open your ServeLocal Supabase project SQL Editor
2. Run `supabase/servelocal.sql`
3. Run `supabase/premium.sql` for reviews, verified badges, and paid tiers
4. Run `supabase/suggestions.sql` for the feedback button
5. Run `supabase/guest-access.sql` for database permissions (public browse/post without login)
6. Run `supabase/user-accounts.sql` so logged-in users can track job requests on `/dashboard`
7. Run `supabase/bookings.sql` for escrow-style bookings
8. Run `supabase/complete-features.sql` for messaging, saved pros, Q&A, review helpful votes, availability
9. Optional legacy scripts: `pro-dashboard.sql`, `saved-searches.sql`, `extended-categories.sql`
10. Apply numbered migrations in `supabase/migrations/` (002+ for RLS fix and onboarding columns)

**Shortcut (steps 6–7):** if `user_profiles` or `bookings` is missing, run `supabase/bootstrap-homeowner-dashboard.sql` once (after steps 1–5). It is idempotent.

**Security migrations (after bootstrap):** run `supabase/migrations/004_schema_baseline.sql`, `005_pro_job_leads_rls.sql`, then `006_remove_pro_job_pii_rls.sql`. Verify bookings RLS with:

```sql
select policyname, qual from pg_policies where tablename = 'bookings';
-- qual must be (auth.uid() = user_id)
```

## Email / auth (separate Supabase from RateLocal)

ServeLocal uses Supabase project **`avytxgfkncpacqewnrvz`** (TRADELOCAL) — **not** RateLocal’s database.

- Configure **Resend SMTP** on the TRADELOCAL project (see **`SMTP_SETUP.md`**).
- Homeowners & pros sign up at `/signup` or `/signup/pro` (guests can still post jobs without login).
- Admin uses `/login`; admins go to `/admin` via `ADMIN_EMAILS`.

Ops map: **`docs/SERVELOCAL_SUPABASE_SPLIT.md`**

Add redirect URLs in Supabase for ServeLocal:

```
https://www.servelocal.ca/auth/confirm
https://servelocal.ca/auth/confirm
http://localhost:3001/auth/confirm
https://www.servelocal.ca/auth/callback
https://servelocal.ca/auth/callback
http://localhost:3001/auth/callback
```

## Premium features

- **Search** — `/search?q=plumber+surrey`
- **Reviews** — customers leave reviews; you approve in `/admin`
- **Verified & insured badges** — toggle in admin
- **Paid tiers** — Free / Featured ($49/mo) / Premium ($99/mo) on `/pricing`
- **Cost guides** — BC price ranges at `/guides`
- **Job matching** — after posting a request, customers see matching pros to call
- **Filters** — licensed, verified, 24/7, sort by rating on category pages

## Routes

| Path | Purpose |
|------|---------|
| `/` | Premium homepage |
| `/search` | Search pros |
| `/pricing` | Pro plans |
| `/guides` | Cost guides |
| `/join` | Tradie application with plan picker |
| `/request` | Get quotes + matching pros |
| `/{city}` | Listings by city |
| `/{city}/{category}` | Filtered listings |
| `/pro/{slug}` | Full profile + reviews |
| `/admin` | Approve, verify, tiers, reviews |

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-side DB access |
| `NEXT_PUBLIC_APP_URL` | Yes | Public URL of this app |
| `ADMIN_EMAILS` | Yes | Comma-separated admin emails |
