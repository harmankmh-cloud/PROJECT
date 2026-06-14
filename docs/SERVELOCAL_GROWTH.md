# ServeLocal growth — different strategy (not cold email blast)

ServeLocal is a **two-sided marketplace**: homeowners post jobs, **pros** get matched. Cold-emailing random businesses does not work the same way as GreetQ or RateLocal.

## Do NOT copy the GreetQ/RateLocal playbook

| Product | Buyer | Outreach model |
|---------|--------|----------------|
| **GreetQ** | Any local business with a phone | Scrape → 100 cold emails/day → AI phone pitch |
| **RateLocal** | Businesses that want more Google reviews | Scrape → 100 cold emails/day → claim listing / Pro trial |
| **ServeLocal** | **Licensed trades pros** who want job leads | **Recruit pros** + **SEO for homeowners** — not 1000 generic cold emails |

## ServeLocal supply side (pros)

Goal: pros **apply or claim a listing** — they opt in because they want leads.

1. **Founding Featured ($29/mo)** — first cohort in Fraser Valley trades (plumbing, HVAC, electrical, roofing).
2. **Direct outreach to pros** (not homeowners):
   - Facebook / local trade groups
   - Abbotsford & Fraser Valley contractor directories
   - Referrals from one booked pro to another
   - Short personal DMs: "We're listing 10 founding Featured pros in [trade] — want a profile?"
3. **Admin workflow** — `/admin` approve `pending` providers, set Featured.
4. **No duplicate email carpet-bomb** — one personal touch per pro; track in CRM or Activepieces table, not `rl_outreach_leads`.

## ServeLocal demand side (homeowners)

Goal: job requests without spamming businesses.

1. **SEO** — city + category pages (`/abbotsford/plumber`, etc.)
2. **Saved search alerts** (existing product feature)
3. **Local content** — "cost to hire a plumber in Abbotsford" style pages
4. **Partnerships** — property managers, realtors (refer homeowners, not cold email lists)

## When a pro "needs to start"

If there are **zero pros** in a category/city:

- Show empty state CTA (already in app): homeowner can still post; pro sees **Join as Featured Pro**.
- Run a **micro-campaign** for that trade only (5–10 named pros from Yellow Pages / trade assoc.) — invite to claim, not bulk scrape blast.
- Consider **founding guarantee**: "First 5 pros in [category] — $29/mo locked" in outreach copy.

## Automation (Activepieces)

Use separate flows from GreetQ/RateLocal:

- **Pro invite sequence** — manual trigger or small list, not 100/day from scraper
- **Homeowner** — saved-search / request confirmation emails only (transactional)

## Summary

- **GreetQ + RateLocal**: scrape 1000 emails → 100 unique sends/day → Supabase lead pool.
- **ServeLocal**: find **pros who want leads** or get **homeowners searching** — supply-first, founding pricing, admin approval — **not** the same cold-email engine.
