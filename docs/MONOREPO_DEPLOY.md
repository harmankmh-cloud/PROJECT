# Monorepo deploy & env matrix

| App | Folder | Vercel project | Production URL | Supabase ref |
|-----|--------|----------------|----------------|--------------|
| **GreetQ** | `voiceagent/` | `voiceagent` | https://greetq.com | `lrihhjjxmxixppmrzvva` |
| **RateLocal** | `reviewflow/` | `project` | https://ratelocal.ca | `otnddwopphhxstteqizw` |
| **ServeLocal** | `servelocal/` | `project-pqhe` | https://www.servelocal.ca | `avytxgfkncpacqewnrvz` |

Vercel team: `harmankmh-1059s-projects`

## Required env vars (each Vercel project)

| Variable | GreetQ | RateLocal | ServeLocal |
|----------|--------|-----------|------------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Yes | Yes |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Yes | Yes |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Yes | Yes |
| `NEXT_PUBLIC_APP_URL` | Yes | Yes | Yes |

`NEXT_PUBLIC_*` Supabase vars are safe in the browser. **Never** prefix `SUPABASE_SERVICE_ROLE_KEY` with `NEXT_PUBLIC_`.

## GreetQ-only

| Variable | Purpose |
|----------|---------|
| `ACTIVEPIECES_MARKETING_WEBHOOK_SECRET` | Outreach daily webhook (`X-GreetQ-Secret`) — **required in prod** |
| `AI_TEAM_WEBHOOK_SECRET` | `/api/ai/team-run` |
| `ORCHESTRATOR_API_KEY` | Orchestrator → app callbacks |
| `ORCHESTRATOR_WSS_URL` | Railway WebSocket URL (`wss://…/ws`) |
| `TWILIO_AUTH_TOKEN` | Twilio webhook + WSS signature validation |
| `TELNYX_API_KEY` | Primary telephony (Telnyx) |
| `DEMO_CALL_ENABLED` | Set `true` to allow public demo calls in production |
| `OPENROUTER_API_KEY` | Relay LLM |
| `OPENAI_API_KEY` | Realtime pilot (`TWILIO_VOICE_MODE=realtime`) |

Orchestrator runs on **Railway** (`voiceagent/orchestrator/`). Health: `GET /health`.

## RateLocal-only

| Variable | Purpose |
|----------|---------|
| `ACTIVEPIECES_MARKETING_WEBHOOK_SECRET` | Outreach (`X-RateLocal-Secret`) — **required in prod** |
| `ACTIVEPIECES_WEBHOOK_SECRET` | Review notification webhooks |
| `OPENROUTER_API_KEY` | AI review generation |
| Stripe keys | Billing |

## ServeLocal-only

| Variable | Purpose |
|----------|---------|
| `ADMIN_EMAILS` | Admin dashboard access |
| `CRON_SECRET` | Vercel cron for `/api/cron/search-alerts` |
| Stripe price IDs | Featured tier checkout (Premium is waitlist) |

## Outreach (Activepieces)

Weekdays Pacific: GreetQ **11:00**, RateLocal **14:00**.

- GreetQ: `POST https://greetq.com/api/make/outreach/daily` — header `X-GreetQ-Secret: <ACTIVEPIECES_MARKETING_WEBHOOK_SECRET>`
- RateLocal: `POST https://ratelocal.ca/api/make/outreach/daily` — header `X-RateLocal-Secret: <ACTIVEPIECES_MARKETING_WEBHOOK_SECRET>`

Lead import (local): set `GREETQ_OUTREACH_SECRET` / `RATELOCAL_OUTREACH_SECRET` to the same values — no defaults in scripts.

## Verify production

Hit live APIs after deploy; do not assume broken if Vercel env UI glitches. Use `vercel env add` or Supabase ↔ Vercel integration as fallback.
