# GreetQ outreach pipeline (scrape 1000 → send 100/day)

## What went wrong (fixed)

The scraper was built but **never connected** to the daily send flow. Activepieces used a **hardcoded list of 10 businesses** and re-emailed them every day.

## Correct pipeline

```
discover URLs → scrape emails → import to Supabase → daily job sends 100 NEW pending leads → mark sent
```

| Step | Tool |
|------|------|
| 1. Find businesses | `npm run discover` (Nominatim + Yellow Pages) or add to `seeds/fraser-valley-curated.txt` |
| 2. Scrape emails | `node scrape-batch.mjs --input seeds/... --output leads-batch.csv` |
| 3. Import pool | `node import-leads.mjs --input leads-batch.csv --mark-sent sent-yesterday.txt` |
| 4. Daily send | Activepieces **11am weekdays** → `POST /api/make/outreach/daily` with `limit: 5` per batch (20 batches = 100/day) |

## Daily send rules

- **Max 100 emails per run** (20 Activepieces batches × 5 emails — avoids Vercel 504 timeouts)
- Only `status = pending` with a valid email
- After send → `status = sent` (never emailed again)
- **1.5s delay** between sends (spam-safe; each API batch capped at 5)
- Sequence: `morning_call` (configurable)

## Apply database migration (once)

Run on GreetQ Supabase:

```bash
# voiceagent/supabase/migrations/007_outreach_leads.sql
```

Or Supabase dashboard SQL editor.

## Scrape toward 1000

```bash
cd tools/greetq-lead-scraper
npm run discover          # OSM websites (Fraser Valley)
npm run scrape:batch      # batch scrape with delay
GREETQ_URL=https://greetq.com npm run import
```

Repeat scrape batches with `--offset 200 --limit 200` until pool ≥ 1000 pending emails.

## Activepieces flow

**Abbotsford - Send every 3 days 11am** now calls:

`POST https://greetq.com/api/make/outreach/daily` with `{ limit: 5, sequence: "morning_call" }` (Activepieces loops 20×)

No hardcoded lead list.

## Already-emailed (do not resend)

The 10 businesses emailed Jun 8–9 are in `sent-yesterday.txt` and marked `sent` in Activepieces.
