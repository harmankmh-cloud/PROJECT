# Security checklist

## Secrets

- [ ] No API keys in git — use `.env.example` templates only
- [ ] `SUPABASE_SERVICE_ROLE_KEY` never in client bundles or `NEXT_PUBLIC_*`
- [ ] Webhook routes fail closed when secrets unset (no hardcoded defaults)
- [ ] Import scripts require explicit outreach secrets

## Supabase RLS

- [ ] All user tables have RLS enabled
- [ ] Owners scoped via `businesses.user_id = auth.uid()`
- [ ] Public inserts validated (listed business, valid slug)
- [ ] ServeLocal job leads: no direct pro PII via RLS (server-side fetch)

## API hardening (audit remediation)

| App | Control |
|-----|---------|
| GreetQ | Internal routes auth in middleware; Twilio signature includes query string |
| GreetQ | Demo calls require `DEMO_CALL_ENABLED` in production |
| RateLocal | AI review endpoint rate-limited (20/hr/IP) |
| RateLocal | Business delete cancels Stripe subscription first |
| ServeLocal | Job requests rate-limited (5/hr/IP) |
| ServeLocal | Premium checkout blocked (waitlist) |

## Stripe

- [ ] Webhook signatures verified on all events
- [ ] Test mode keys only in preview/dev

## Compliance (Canada)

- PIPEDA/CASL positioning for GreetQ and RateLocal outreach
- No review incentives — Google-safe collection only
- Lead CSVs in `.gitignore`; no PII committed

## Production verify

After deploy, confirm outreach returns **401** without secret (not 500 or open).

**Last updated:** June 16, 2026
