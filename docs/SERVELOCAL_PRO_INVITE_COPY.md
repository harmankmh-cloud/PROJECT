# ServeLocal — Founding Pro invite copy (paste-ready)

**Strategy:** Personal invites to **trades pros who want job leads** — not bulk cold blast.  
**CTA:** https://www.servelocal.ca/signup/pro  
**Offer:** Founding Featured **$29/mo** (normally $49) — job alerts, top placement, verified badge.

Track invites in Activepieces table **ServeLocal Pro Invites** (`to_contact` → `invited` → `signed_up`).

## Activepieces webhook (manual pro invite)

Flow: **ServeLocal - Pro invite (manual webhook)** (`OeQLmAINM0OmaW1HrCt8s`) — copy the webhook URL from the trigger in Activepieces.

```bash
curl -X POST "$ACTIVEPIECES_SERVLOCAL_PRO_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -H "X-ServeLocal-Secret: servelocal-pro-invite-2026" \
  -d '{
    "first_name": "Alex",
    "company": "Valley Plumbing",
    "trade": "plumbing",
    "city": "Abbotsford",
    "email": "alex@example.com"
  }'
```

Returns formatted `subject`, `text`, and `to` — send via Gmail/Resend or paste manually. **Not** a bulk 100/day engine.

---

## Cold email (personal)

**Subject:** `{{company}} — founding Featured pro spot in {{city}}?`

```
Hi {{first_name}},

I'm Harman with ServeLocal — we're building the Fraser Valley trades marketplace where homeowners post jobs and verified pros get matched (no per-lead fees).

We're onboarding the first Featured pros in {{trade}} for {{city}}. Founding rate is $29/mo (locked for 6 months, then $49) and includes:
- Job alerts when homeowners post in your trade + city
- Top search placement + homepage featured spot
- Verified badge after we review your licence

Takes about 5 minutes to claim your profile:
https://www.servelocal.ca/signup/pro

Only doing a small founding cohort per trade so homeowners aren't stuck with empty results. If you're interested, reply YES or sign up at the link — I'll fast-track approval.

Harman
ServeLocal · servelocal.ca
```

---

## Facebook / trade group DM (short)

```
Hey — I'm launching ServeLocal in Abbotsford (homeowners post jobs, pros get matched). Looking for 5 founding Featured {{trade}} pros at $29/mo — job alerts, top placement, no per-lead fees. Quick signup: servelocal.ca/signup/pro — happy to answer questions.
```

---

## Follow-up (3 days later)

**Subject:** `Re: {{company}} — ServeLocal {{trade}} in {{city}}`

```
Hi {{first_name}},

Quick bump — still have a couple founding Featured spots for {{trade}} in {{city}} on ServeLocal.

If you want local job leads without HomeAdvisor-style per-lead charges, the signup is here:
https://www.servelocal.ca/signup/pro

No pressure — reply STOP if not relevant.

Harman
```

---

## When category is empty on the site

Use this when a homeowner searches and there are zero pros:

**Subject:** `We're listing {{trade}} pros in {{city}} — want in?`

```
Hi {{first_name}},

Homeowners are already searching for {{trade}} in {{city}} on ServeLocal, but we don't have enough verified pros live yet.

You'd be among the first Featured listings — $29/mo founding, job alerts, top placement. Sign up here and I'll prioritize your approval:
https://www.servelocal.ca/signup/pro

Harman
```

---

## Micro-campaign checklist (5–10 pros per trade)

1. Pick one trade + city (e.g. plumber + Abbotsford).
2. Yellow Pages / trade association → 5–10 names with email or FB.
3. Add rows to **ServeLocal Pro Invites** table (`to_contact`).
4. Send **personal** email or DM (max 10/day — not 100).
5. Mark `invited`; when they sign up, mark `signed_up` in admin.

---

## Do not

- Run the GreetQ/RateLocal 100/day scraper blast to ServeLocal pros.
- Email homeowners for supply — they come via SEO and job posts.
- Promise leads you can't fulfill — fill supply before pushing demand ads.
