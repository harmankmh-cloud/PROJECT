# Compare page audit — website copy vs competitive reality

Audit date: June 16, 2026. Goal: honest claims only; name competitors where it helps conversion.

## RateLocal

| Location | Issue | Status |
|----------|-------|--------|
| `content/copy.ts` LANDING.stats | Was "2M reviews / 150k businesses" | **Fixed** → real BC numbers |
| `PricingPageContent.tsx` | "Join 150,000+ businesses" | **Fixed** → "$39/mo for BC businesses" |
| `MARKETING.hero.trustBadges` | "Used by 6+ BC Businesses" | **Keep** — honest |
| `PricingPageContent` Enterprise tier | $149, white-label, API | **Flag** — not shipped; consider "Contact us" only or remove features list |
| `PricingPageContent` Pro features | "Competitor tracking" | **Fixed** → analytics + AI responses (actually shipped) |
| Discover / directory pages | Aspirational Yelp scale | **OK** if framed as "growing BC directory" not national leader |

### Competitors to mention on site (safe)

| Competitor | Where | Angle |
|------------|-------|-------|
| Podium | Pricing page, outreach | "$39 vs $400" — strongest wedge |
| NiceJob | Pricing comparison (optional) | Mid-tier price compare |
| Birdeye | Blog only | Enterprise price anchor |

### Do NOT claim

- "150,000+ businesses" until true
- Multi-platform review inbox (Yelp, Facebook)
- Payments / full comms hub

## GreetQ

| Location | Issue | Action |
|----------|-------|--------|
| Marketing pages | Enterprise / SOC2 language | Only claim what's live (SSO scaffold ≠ SOC2) |
| Integrations list | Zapier | Mark "coming soon" until live |
| vs Smith.ai | Not on site today | Add optional `/compare` or battlecard PDF for sales |

### Competitors to mention (sales, optional web)

- Smith.ai — price + human backup angle
- Ruby — legacy expensive receptionist
- Goodcall / Synthflow — cheaper AI entry

### Do NOT claim

- "5,000+ customers"
- G2 scores without profile
- HIPAA-ready without legal review

## ServeLocal

| Location | Issue | Action |
|----------|-------|--------|
| `site-content.ts` | References "national platforms" generically | **OK** — factual contrast |
| Homepage geography | "Canada-wide" if present | **Tighten** to "Fraser Valley & BC cities we serve" |
| Premium tier | Checkout open | **Correct** — waitlist only (already blocked in code) |

### Competitors to mention

- HomeStars — density honest compare
- Thumbtack — pay-per-lead vs flat fee

### Do NOT claim

- National marketplace scale
- Jobbr-level escrow/disputes
- Thousands of pros per city

## Cross-product

| Claim | Verdict |
|-------|---------|
| "Canada-first PIPEDA/CASL" | **Keep** — real differentiator for GreetQ + RateLocal |
| Bundle RateLocal + GreetQ | **Keep** in outreach — unique vs siloed US tools |
| ServeLocal as third leg | Soft-sell until density exists |

## Recommended next copy changes (optional)

1. Add RateLocal pricing footnote: "Typical Podium contract $250+/mo — source: public pricing pages"
2. GreetQ homepage: one line "Built in BC for Canadian businesses"
3. ServeLocal hero: list 12 cities explicitly instead of "Canada-wide"

## Files changed in this pass

- `reviewflow/src/content/copy.ts`
- `reviewflow/src/components/landing/PricingPageContent.tsx`

**Last updated:** June 16, 2026
