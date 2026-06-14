# GreetQ lead scraper

Lightweight email finder for **GreetQ cold outreach**. No external repo clone — runs in this monorepo with Node 18+.

## Quick start (Cursor prompt)

```
cd tools/greetq-lead-scraper
npm run scrape:abbotsford
```

Or paste URLs:

```
cd tools/greetq-lead-scraper
node scrape.mjs --input my-urls.txt --output leads.csv
```

## Input format (`urls.txt`)

One business per line:

```
Business Name|https://website.com|vertical
Clayburn Dental|https://clayburndental.com|dental
https://another-site.ca
```

Verticals: `dental`, `clinic`, `insurance`, `property_mgmt`, `home_services`, `legal`, `other`

## Output (`leads.csv`)

| Column | Example |
| ------ | ------- |
| business_name | Clayburn Dental |
| email | info@clayburndental.ca |
| city | Abbotsford |
| vertical | dental |
| website | https://clayburndental.com |
| status | pending or no_email |
| notes | scrape details |

Import into **Activepieces → Abbotsford Outreach Leads**, or POST rows to `https://greetq.com/api/make/outreach`.

## Why not MailGrab?

MailGrab is Python 3.9 + heavy install. This tool:

- Matches your **Node/TypeScript** stack
- Outputs **GreetQ-shaped CSV** (not raw `_emails.txt`)
- Filters junk (noreply, Wix, off-domain emails)
- Decodes **Cloudflare email protection**
- Follows `/contact`, `/about`, `/team` on the same domain

For JS-heavy sites that block fetch, add Playwright later — most local business contact pages work with plain HTTP.

## Product focus

**Start with GreetQ** — Abbotsford / Fraser Valley local businesses (dental, clinics, insurance, property mgmt). ServeLocal and RateLocal can reuse the same CSV format with different vertical lists.
