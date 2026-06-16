# Troubleshooting — common issues

## Auth

| Error | Cause | Fix |
|-------|-------|-----|
| `Unrecognized client_id` | Google OAuth misconfig | Supabase → Auth → Providers → Google; add redirect URI in Google Cloud |
| Login loop | Wrong Site URL | Supabase → Auth → URL Configuration → match production domain |
| 403 on admin | Email not in `ADMIN_EMAILS` | Add email in Vercel env, redeploy |

## Vercel

| Symptom | Fix |
|---------|-----|
| Env var won't save in UI | Use `vercel env add` CLI or Supabase ↔ Vercel integration |
| Build fails on Edge | Don't import `node:crypto` in middleware — use edge-safe auth |
| 504 on outreach | Activepieces already batches 5 emails; check function timeout |

## GreetQ voice

| Symptom | Fix |
|---------|-----|
| Demo call 503 | Set `DEMO_CALL_ENABLED=true`; ensure Twilio **or** Telnyx configured |
| No audio / WSS fail | Check `ORCHESTRATOR_WSS_URL`, Twilio signature URL includes query string |
| Outreach 401 | Set `ACTIVEPIECES_MARKETING_WEBHOOK_SECRET` on Vercel |

## RateLocal

| Symptom | Fix |
|---------|-----|
| AI review fails | `OPENROUTER_API_KEY` missing — fallbacks still work |
| Outreach 401 | Same marketing webhook secret as Activepieces header |
| Owner can't respond to reviews | Run migration `20260616120000_owners_read_reviews.sql` |

## ServeLocal

| Symptom | Fix |
|---------|-----|
| Pro can't see job PII | By design after migration 006 — leads via server API with tier masking |
| Premium checkout blocked | Premium is waitlist; Featured tier only |
| Wrong Supabase project | ServeLocal must use `avytxgfkncpacqewnrvz`, not RateLocal ref |

## Lead import (local scripts)

Set `GREETQ_OUTREACH_SECRET` / `RATELOCAL_OUTREACH_SECRET` — no hardcoded defaults.

Empty GreetQ queue = re-import leads, not a token failure.

## RAG index stale

```bash
pip install -r requirements-rag.txt
python -m project_rag index
```

**Last updated:** June 16, 2026
