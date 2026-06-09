# GreetQ — 1,000 email campaign plan

**Goal:** 1,000 verified emails → **100/day** for 10 days → **10 sectors × 10 emails/day**.

## The math

| Step | Number | Notes |
| ---- | ------ | ----- |
| Emails you want | **1,000** | Send pool |
| Scrape hit rate (realistic) | **~50%** | Dental/medical/law often use contact forms |
| URLs you need to paste | **~2,000** | 200 per sector × 10 sectors |
| Daily send | **100** | Safe under Brevo free (~300/day) |
| Campaign length | **10 days** | 100 × 10 = 1,000 |
| Time to scrape 2,000 URLs | **~2–3 hours** | Tool runs ~3–5 sec/site |

**Rule:** Scrape **2× your email target** so you still hit 1,000 after forms-only sites drop out.

## Daily send schedule (recommended)

Rotate **10 emails per sector** every morning. Same sectors as your priority list:

| Day | Dental/Medical | Law | HVAC/Trades | Property Mgmt | Auto | Salon/Spa | Restaurant | Accounting | Physio/Chiro | Real Estate | **Total** |
| --- | -------------- | --- | ----------- | ------------- | ---- | --------- | ---------- | ---------- | ------------ | ----------- | --------- |
| 1 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | **100** |
| 2 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | **100** |
| … | … | … | … | … | … | … | … | … | … | … | … |
| 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | 10 | **100** |

**Why 10 per category:** Balanced test — you learn which sector replies fastest before scaling one vertical.

**Send time:** 11:00 AM Vancouver (matches your Activepieces flow). Space ~45–60 sec apart = ~100 in ~75 min.

## Scrape workflow (when you paste URLs)

### 1. Drop URLs into category files

```
tools/greetq-lead-scraper/campaign/
  01-dental-medical.txt    ← target 200 lines
  02-law-firms.txt
  03-hvac-trades.txt
  04-property-mgmt.txt
  05-auto-repair.txt
  06-salon-spa.txt
  07-restaurants.txt
  08-accounting.txt
  09-physio-chiro.txt
  10-real-estate.txt
```

Format per line: `Business Name|https://website.com|vertical`

### 2. Run bulk scrape

```bash
cd tools/greetq-lead-scraper
node scrape-bulk.mjs
```

Outputs:
- `output/all-leads.csv` — full data
- `output/emails-only.txt` — one email per line (your send pool)
- `output/by-category/` — per-sector CSVs

### 3. Import & send

- Rows with email → Activepieces **GreetQ Outreach** table (or next batch table)
- `no_email` rows → phone list / skip

## Re-scrape: every 10 days — but **new** URLs, not the same ones

| ❌ Don't | ✅ Do |
| -------- | ----- |
| Re-scrape sites you already emailed | Scrape **next 200/category** in new cities |
| Expect more emails from form-only sites | Expand: Chilliwack → Langley → Surrey → Vancouver |
| Send same 1,000 twice | Follow-up sequence (`followup_1` at day 4, `followup_2` at day 8) |

**10-day cycle:**

| Days | Action |
| ---- | ------ |
| **1–3** | You paste ~2,000 URLs → we scrape → ~1,000 emails |
| **4–13** | Send 100/day (10 per sector) |
| **14** | Scrape **batch 2** — new businesses, new cities |
| **15–24** | Send batch 2 at 100/day |
| Ongoing | Follow-ups to non-responders from batch 1 |

## Sector priority → scrape order

Paste URLs in this order if you're building lists gradually:

1. 🥇 Dental & Medical — `01-dental-medical.txt`
2. 🥈 Law — `02-law-firms.txt`
3. 🥉 HVAC / Plumbers / Electricians — `03-hvac-trades.txt`
4. Property Management — `04-property-mgmt.txt`
5. Auto Repair — `05-auto-repair.txt`
6. Salons & Spas — `06-salon-spa.txt`
7. Restaurants — `07-restaurants.txt`
8. Accountants — `08-accounting.txt`
9. Physio & Chiro — `09-physio-chiro.txt`
10. Real Estate — `10-real-estate.txt`

## Brevo / deliverability guardrails

- **100/day** — conservative; good for domain reputation
- **Max ~150/day** on free tier if replies stay healthy
- Stop if bounce rate > 5%
- Only send to scraped **role emails** (info@, contact@, admin@) on the business domain

## What to paste me

Per sector, Google Maps export or list like:

```
Blossom Dental|https://blossomdental.ca|dental
Gateway Healthcare|https://gatewayhealth.ca|clinic
```

I'll scrape all of it and return **emails only** + update your outreach table.
