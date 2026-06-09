# GreetQ Lead Agent (auto-discover + scrape)

**You don't paste URLs.** Tell the agent a city and sector — it finds businesses and scrapes emails.

## One command

```bash
cd tools/greetq-lead-agent
npm run campaign          # all 10 sectors, Abbotsford, ~50 sites each
npm run emails            # same, print emails only
```

## Examples

```bash
# One sector
node run.mjs --sector dental_medical --city Abbotsford --limit 30 --emails-only

# All sectors, lighter run
node run.mjs --all-sectors --city Chilliwack --per-sector 20

# Full 1000-email hunt (run across cities over a few days)
node run.mjs --campaign --city Abbotsford --per-sector 50
node run.mjs --campaign --city Chilliwack --per-sector 50
node run.mjs --campaign --city Langley --per-sector 50
```

## How it works

1. **Discover** — DuckDuckGo search + OpenStreetMap (no API keys)
2. **Dedupe** — skips domains already scraped (`seen-domains.json`)
3. **Scrape** — contact pages, mailto, Cloudflare decode
4. **Output** — `output/emails-only.txt` + dated CSV

## Sectors (your priority list)

| Key | Sector |
| --- | ------ |
| `dental_medical` | Dental & Medical |
| `law` | Law Firms |
| `hvac_trades` | HVAC / Plumbers / Electricians |
| `property_mgmt` | Property Management |
| `auto` | Auto Repair |
| `salon_spa` | Salons & Spas |
| `restaurants` | Restaurants |
| `accounting` | Accountants |
| `physio_chiro` | Physio & Chiro |
| `real_estate` | Real Estate |

## 1000-email campaign (autonomous)

| Day | Agent does |
| --- | ---------- |
| 1 | `--campaign --city Abbotsford` → ~200–300 emails |
| 2 | `--campaign --city Chilliwack` |
| 3 | `--campaign --city Langley` |
| 4 | `--campaign --city Surrey` |
| 5+ | Send 100/day from `emails-only.txt` pool |

Re-run agent every **10 days on a new city** — not the same URLs.

## vs manual scraper

| Tool | You provide | Agent provides |
| ---- | ----------- | -------------- |
| `greetq-lead-scraper` | URLs | — |
| **`greetq-lead-agent`** | **city + sector** | **URLs + emails** |

Use the agent by default. Use manual scraper only when you already have a URL list.
