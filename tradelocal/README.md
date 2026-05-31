# TradeLocal

**TradeLocal** is a standalone directory app for finding local trades in BC (Fraser Valley & Metro Vancouver). Customers browse listings and call pros directly — no middleman.

This is a **separate app** from RateLocal (`reviewflow/`). Deploy it on its own domain (e.g. `tradelocal.ca`).

## Quick start

```bash
cd tradelocal
cp .env.local.template .env.local
# Edit .env.local with your Supabase keys and admin email
npm install
npm run dev
```

Open [http://localhost:3001](http://localhost:3001).

## Database setup

1. Open your Supabase project SQL Editor
2. Run the SQL in `supabase/tradelocal.sql`
3. You can use the **same Supabase project** as RateLocal — the tables are separate

## Admin

1. Set `ADMIN_EMAILS=you@yourbusiness.com` in `.env.local`
2. Create a Supabase auth user with that email (or use an existing account)
3. Sign in at `/login` → manage listings at `/admin`

## Deploy on Vercel

1. Add a new Vercel project from this repo
2. Set **Root Directory** to `tradelocal`
3. Add environment variables from `.env.local.template`
4. Point your domain (e.g. `tradelocal.ca`) to this project

## Routes

| Path | Purpose |
|------|---------|
| `/` | Homepage — browse cities & services |
| `/join` | Tradie application form |
| `/request` | Customer job request form |
| `/{city}` | Listings by city |
| `/{city}/{category}` | Listings by city + trade |
| `/pro/{slug}` | Pro profile with call/WhatsApp |
| `/admin` | Approve listings, view requests |
| `/login` | Admin sign-in |

## Environment variables

| Variable | Required | Description |
|----------|----------|-------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-side DB access |
| `NEXT_PUBLIC_APP_URL` | Yes | Public URL of this app |
| `ADMIN_EMAILS` | Yes | Comma-separated admin emails |
