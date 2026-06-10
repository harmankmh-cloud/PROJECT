# RateLocal outreach pipeline (scrape 1000 → send 100/day)

Same mechanics as GreetQ — **different product copy** (Google reviews, not phone AI).

## Pipeline

```
discover URLs → scrape emails → import to Supabase → daily job sends 100 NEW pending leads → mark sent
```

| Step | Tool |
|------|------|
| 1. Find businesses | `cd tools/ratelocal-lead-scraper && npm run discover` |
| 2. Scrape emails | `npm run scrape:batch` |
| 3. Import pool | `RATELOCAL_URL=https://ratelocal.ca npm run import` |
| 4. Daily send | Activepieces → `POST https://ratelocal.ca/api/make/outreach/daily` with `limit: 100` |

## Daily send rules

- Max **100 emails per run**
- Only `status = pending` with a valid email
- After send → `status = sent` (never emailed again)
- **45s delay** between sends
- Default sequence: `initial` (Google reviews angle)

## Database (once)

Run `reviewflow/supabase/migrations/20260609210000_outreach_leads.sql` on the **reviewflow** Supabase project.

## Activepieces example

```json
POST https://ratelocal.ca/api/make/outreach/daily
Headers: X-RateLocal-Secret: ratelocal-marketing-webhook-2026
Body: { "limit": 100, "sequence": "initial", "delay_ms": 45000 }
```

## Env (Vercel / RateLocal)

- `RESEND_API_KEY` or `BREVO_API_KEY`
- `EMAIL_FROM` (optional)
- `ACTIVEPIECES_MARKETING_WEBHOOK_SECRET` (optional override)
- `SUPABASE_SERVICE_ROLE_KEY` (already required)

## GreetQ vs RateLocal

| | GreetQ | RateLocal |
|---|--------|-----------|
| Table | `va_outreach_leads` | `rl_outreach_leads` |
| Secret header | `X-GreetQ-Secret` | `X-RateLocal-Secret` |
| Message | AI phone / missed calls | Google reviews / claim listing |
| CTA | greetq.com sandbox | ratelocal.ca/claim-business |

Scraper lives in `tools/ratelocal-lead-scraper/` (same scripts as GreetQ); import posts to RateLocal's API only.
