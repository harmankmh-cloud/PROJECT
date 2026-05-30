# ReviewFlow

ReviewFlow helps local businesses get more honest Google reviews and turn good feedback into simple marketing content.

## What it includes

- Business signup/login (Supabase)
- Customer review page with QR code link
- Experience-based review helper:
  - Great / Good / Okay → public review draft
  - Not good → calm private feedback draft
- Custom prompt editor for each experience level
- Dashboard with stats, QR code, feedback inbox, and marketing helpers
- Business settings page (edit name, type, tone, Google review link)
- Dashboard navigation with mobile menu and logout
- AI tools for social captions and review replies (OpenRouter)

## Stack

- Next.js
- Supabase
- OpenRouter
- Stripe (later)
- Vercel

## Setup

### 1. Install

```bash
cd reviewflow
npm install
```

### 2. Create Supabase project

1. Go to https://supabase.com
2. Create a project
3. Open SQL Editor
4. Run `supabase/schema.sql`

### 3. Environment variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `OPENROUTER_API_KEY`
- `NEXT_PUBLIC_APP_URL`

### 4. Run locally

```bash
npm run dev
```

Open http://localhost:3000

## Main pages

| Page | URL |
|------|-----|
| Landing | `/` |
| Sign up | `/signup` |
| Login | `/login` |
| Dashboard | `/dashboard` |
| Settings | `/dashboard/settings` |
| Prompt editor | `/dashboard/prompts` |
| Customer review page | `/r/your-business-slug` |

## How the customer flow works

1. Customer scans QR code
2. Chooses experience level
3. Writes a few words
4. AI creates a draft
5. Customer copies draft or opens Google review
6. Bad experiences get private feedback helper first

## Pricing idea

- $99 setup
- $39/month starter

Stripe billing can be added in version 2.

## Deploy

Deploy the `reviewflow` folder to Vercel and add the same env vars in the Vercel dashboard.
