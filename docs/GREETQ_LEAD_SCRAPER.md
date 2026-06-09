# GreetQ lead email scraper

Find emails on local business websites for cold outreach.

## Tool location

`tools/greetq-lead-scraper/` — Node CLI, no extra dependencies.

## Cursor one-liner

```
cd tools/greetq-lead-scraper && npm run scrape:abbotsford
```

Reads `abbotsford-no-email.txt` (10 leads missing emails) and writes `leads.csv`.

## Workflow

1. **Scrape** — `node scrape.mjs --input urls.txt --output leads.csv`
2. **Review** — open `leads.csv`, fix any wrong picks manually
3. **Import** — update **Activepieces → Abbotsford Outreach Leads** or add new rows
4. **Send** — existing flow `Abbotsford - Send every 3 days 11am` + `POST /api/make/outreach`

## Compared to external repos

| Repo | Fit for GreetQ |
| ---- | -------------- |
| MailGrab | Works, but Python 3.9 + separate clone |
| AdrianTomin/email-scraper | Python, generic output |
| web-scraping-tools/email-scraper | TypeScript + Playwright — use if sites block this tool |

This in-repo scraper is the default: zero install, CSV matches your outreach table.

## Target product

**GreetQ first** — Fraser Valley businesses that miss calls (dental, clinics, insurance, strata PM, HVAC/electrical). Your Activepieces table already has 20 Abbotsford leads; 10 still need emails from their websites.
