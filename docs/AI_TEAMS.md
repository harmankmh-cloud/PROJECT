# AI Teams Automation

Three AI teams (Business Growth, Personal Brand, Job Finder) run automatically via **Activepieces** + **GreetQ OpenRouter**.

## How it works

```
Activepieces (schedule or webhook)
    → POST https://greetq.com/api/ai/team-run
    → OpenRouter generates output
    → Email delivered to your inbox (Resend)
```

You do **not** paste master + role prompts manually anymore. Send `team` + `role` + optional `context`.

## Teams & roles

| Team | When | Roles (`role` value) |
|------|------|----------------------|
| **growth** | Monday 8am PT (scheduled) | `strategist`, `content`, `researcher`, `outreach`, `seo` |
| **brand** | Sunday 6pm PT (scheduled) | `planner`, `video`, `caption`, `linkedin`, `analyst` |
| **jobs** | On demand | `researcher`, `resume`, `cover`, `ats`, `tracker` |

Roles also accept numbers `1`–`5` (matches your Perplexity cheat sheet).

## On-demand webhook

**URL:** copy from Activepieces flow `AI Team - On Demand` trigger

**Header:** `X-GreetQ-Secret: greetq-ai-team-2026`

**Example — growth strategist for RateLocal:**

```json
{
  "team": "growth",
  "role": "strategist",
  "product": "RateLocal",
  "context": "Focus Abbotsford dentists and clinics this week",
  "deliver_to": "harmankmh@gmail.com"
}
```

**Example — job cover letter:**

```json
{
  "team": "jobs",
  "role": "cover",
  "context": "JOB POSTING:\n[paste here]\n\nRESUME:\n[paste here]"
}
```

## Cursor skills

In Cursor, type `@` and pick:

- `business-growth-team` — Team 1
- `personal-brand-team` — Team 2
- `job-finder-team` — Team 3

Same prompts as Perplexity; use when you want interactive editing in the IDE.

## Env (GreetQ / Vercel)

```bash
OPENROUTER_API_KEY=          # required
RESEND_API_KEY=              # required for email delivery
AI_TEAM_WEBHOOK_SECRET=greetq-ai-team-2026  # optional override
```

## Scheduled automations

| Flow | Schedule | Default run |
|------|----------|-------------|
| AI Team - Monday Growth | Mon 8:00 America/Vancouver | `growth` / `strategist` / Intellivio |
| AI Team - Sunday Brand | Sun 18:00 America/Vancouver | `brand` / `planner` |
| AI Team - On Demand | Webhook | any team/role you POST |

Change defaults by editing the HTTP body in each Activepieces flow.
