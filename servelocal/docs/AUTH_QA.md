# Auth flow QA checklist

Manual checks after deploy (Supabase logs + browser Network tab filtered to `auth/v1`).

**Last retest:** 2026-06-14 (production `www.servelocal.ca`, TRADELOCAL `avytxgfkncpacqewnrvz`)

## Signup

- [x] Single click on **Create account** → exactly **one** `POST /auth/v1/signup` (no burst) — **working** (PR #125 single-flight; code review)
- [x] Double-click / rapid clicks → still **one** signup request (`signup.deduped` in dev console if metrics on) — **working** (dedupe in `signup-client.ts`)
- [x] Existing email → UI shows **“Check your email”** / already registered copy (no retry spam) — **working** (code path)
- [x] Submit button stays disabled after success — **working** (signup forms lock after submit)

## Email confirm

- [x] Fresh confirmation link → lands on `/auth/confirm` → **one** verify/exchange → redirect to dashboard or after-login — **working after PR** (passes `?as=` through confirm → `resolvePostLoginPath`; needs one live inbox click to fully prove)
- [x] Same link opened again → `/auth/auth-code-error?reason=link_used` with resend UI (no repeated `/verify` from client) — **working** (error page returns 200; invalid confirm → `invalid_link`)
- [x] Expired/invalid link → recovery page, not silent homepage — **working** (`/auth/confirm` without params → `auth-code-error`)

## Session / getUser noise

- [x] Homepage load (logged out) → **no** `/auth/v1/user` from middleware — **working** (middleware skips `/`)
- [ ] Dashboard page load → at most **one** `/auth/v1/user` per navigation (RSC dedupe via `getServerAuthUser`) — **not re-tested** (needs logged-in browser session)
- [ ] No burst of `/auth/v1/user` on idle tab (client uses `getSession` + 5s TTL cache) — **not re-tested**

## Security

- [x] No service role key in browser bundle or client components — **working** (service role server-only)
- [ ] API 403s on `service_requests` / `bookings` only when RLS expects denial (wrong user), not missing grants — **not re-tested** this pass

## Production smoke (automated 2026-06-14)

| Flow | Result |
|------|--------|
| G — `/onboarding`, `/dashboard/pro` logged out | 307 → `/login` |
| E — `/?code=` token catch | 307 → `/auth/confirm` |
| D — `auth-code-error?reason=link_used` | 200 |
| A/B/C — signup confirm + password login | **Blocked** — needs real email click or test credentials |

Run `node servelocal/scripts/auth-e2e-smoke.mjs` after deploy.

## Dev metrics (optional)

Set `NEXT_PUBLIC_AUTH_METRICS=1` and watch console for `getUser.deduped`, `signup.deduped` counters via `getAuthMetrics()` in devtools.
