# Environment variables — complete reference

`NEXT_PUBLIC_*` Supabase vars are **safe in the browser**. Never prefix `SUPABASE_SERVICE_ROLE_KEY` with `NEXT_PUBLIC_`.

## Shared (all Next.js apps)

| Variable | Required | Notes |
|----------|----------|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | Yes | Project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Yes | Client-side auth |
| `SUPABASE_SERVICE_ROLE_KEY` | Yes | Server-only; bypasses RLS |
| `NEXT_PUBLIC_APP_URL` | Yes | Production canonical URL |
| `ADMIN_EMAILS` | ServeLocal, GreetQ | Comma-separated platform admins |

## GreetQ (`voiceagent/.env.example`)

| Variable | Purpose |
|----------|---------|
| `ACTIVEPIECES_MARKETING_WEBHOOK_SECRET` | Outreach daily |
| `AI_TEAM_WEBHOOK_SECRET` | AI team webhook |
| `TELNYX_*` / Twilio vars | Telephony |
| `ORCHESTRATOR_WSS_URL` | Railway WebSocket |
| `ORCHESTRATOR_API_KEY` | Orchestrator callbacks |
| `OPENROUTER_API_KEY` | Relay LLM |
| `OPENAI_API_KEY` | Realtime pilot |
| `DEMO_CALL_ENABLED` | `true` for public demo in prod |
| `DEMO_AGENT_ID` | UUID of demo agent |
| `STRIPE_*` | Billing |

## RateLocal (`reviewflow/.env.local` template)

| Variable | Purpose |
|----------|---------|
| `OPENROUTER_API_KEY` | AI review + owner response drafts |
| `ACTIVEPIECES_MARKETING_WEBHOOK_SECRET` | Cold email outreach |
| `ACTIVEPIECES_WEBHOOK_SECRET` | Review notifications |
| `STRIPE_SECRET_KEY`, price IDs | $39/mo Pro billing |

## ServeLocal (`servelocal/.env.local.template`)

| Variable | Purpose |
|----------|---------|
| `RESEND_API_KEY` | Transactional email |
| `CRON_SECRET` | Saved-search alert cron |
| `STRIPE_*` | Featured $29/mo tier |

## Local-only (import scripts)

| Variable | Purpose |
|----------|---------|
| `GREETQ_OUTREACH_SECRET` | Lead import to GreetQ |
| `RATELOCAL_OUTREACH_SECRET` | Lead import to RateLocal |

## Pull from Vercel

```bash
cd voiceagent && vercel env pull
cd reviewflow && vercel env pull
cd servelocal && vercel env pull
```

**Last updated:** June 16, 2026
