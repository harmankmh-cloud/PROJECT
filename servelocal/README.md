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

1. Open your Supabase project SQL Editor
2. Run `supabase/servelocal.sql`
3. Run `supabase/premium.sql` for reviews, verified badges, and paid tiers

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
