# Deployment — production checklist

See also [MONOREPO_DEPLOY.md](./MONOREPO_DEPLOY.md) for the env matrix.

## Pre-deploy

- [ ] All migrations applied in each Supabase project
- [ ] Env vars set in Vercel (or `vercel env add` if UI fails)
- [ ] Stripe webhooks point to production URLs
- [ ] Google OAuth redirect: `https://<project-ref>.supabase.co/auth/v1/callback`

## Vercel projects

| App | Folder | Domain |
|-----|--------|--------|
| GreetQ | `voiceagent/` | greetq.com |
| RateLocal | `reviewflow/` | ratelocal.ca |
| ServeLocal | `servelocal/` | www.servelocal.ca |
| Route Max | `route-max/` | route-max.vercel.app |

Team: `harmankmh-1059s-projects`

## GreetQ orchestrator (Railway)

1. Deploy `voiceagent/orchestrator/` separately from Next.js
2. Set `ORCHESTRATOR_WSS_URL` on Vercel (`wss://…/ws`)
3. Set `ORCHESTRATOR_API_KEY` on both Vercel and Railway
4. Health check: `GET /health`

## Required secrets (production)

### All three apps
- `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY`
- `NEXT_PUBLIC_APP_URL`

### GreetQ outreach + demo
- `ACTIVEPIECES_MARKETING_WEBHOOK_SECRET` — outreach daily (401 without it)
- `AI_TEAM_WEBHOOK_SECRET` — if using `/api/ai/team-run`
- `DEMO_CALL_ENABLED=true` — public demo calls in prod
- Twilio **or** Telnyx telephony vars

### RateLocal outreach
- `ACTIVEPIECES_MARKETING_WEBHOOK_SECRET` — header `X-RateLocal-Secret`
- `OPENROUTER_API_KEY` — AI review drafts

## Post-deploy verification

```bash
# Outreach fails closed without secret (expect 401)
curl -s -o /dev/null -w "%{http_code}" -X POST https://greetq.com/api/make/outreach/daily
curl -s -o /dev/null -w "%{http_code}" -X POST https://ratelocal.ca/api/make/outreach/daily

# Sites load
curl -s -o /dev/null -w "%{http_code}" https://greetq.com
curl -s -o /dev/null -w "%{http_code}" https://ratelocal.ca
curl -s -o /dev/null -w "%{http_code}" https://www.servelocal.ca
```

## Activepieces schedule (Pacific, weekdays)

| App | Time | Endpoint |
|-----|------|----------|
| GreetQ | 11:00 | `POST https://greetq.com/api/make/outreach/daily` |
| RateLocal | 14:00 | `POST https://ratelocal.ca/api/make/outreach/daily` |

Batching: 20 × 5 emails per run.

## CI

GitHub Actions runs lint + build for GreetQ, RateLocal, ServeLocal, and orchestrator on PRs.

**Last updated:** June 16, 2026
