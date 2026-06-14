# Auth flow QA checklist

Manual checks after deploy (Supabase logs + browser Network tab filtered to `auth/v1`).

## Signup

- [ ] Single click on **Create account** → exactly **one** `POST /auth/v1/signup` (no burst)
- [ ] Double-click / rapid clicks → still **one** signup request (`signup.deduped` in dev console if metrics on)
- [ ] Existing email → UI shows **“Check your email”** / already registered copy (no retry spam)
- [ ] Submit button stays disabled after success

## Email confirm

- [ ] Fresh confirmation link → lands on `/auth/confirm` → **one** verify/exchange → redirect to dashboard or after-login
- [ ] Same link opened again → `/auth/auth-code-error?reason=link_used` with resend UI (no repeated `/verify` from client)
- [ ] Expired/invalid link → recovery page, not silent homepage

## Session / getUser noise

- [ ] Homepage load (logged out) → **no** `/auth/v1/user` from middleware
- [ ] Dashboard page load → at most **one** `/auth/v1/user` per navigation (RSC dedupe via `getServerAuthUser`)
- [ ] No burst of `/auth/v1/user` on idle tab (client uses `getSession` + 5s TTL cache)

## Security

- [ ] No service role key in browser bundle or client components
- [ ] API 403s on `service_requests` / `bookings` only when RLS expects denial (wrong user), not missing grants

## Dev metrics (optional)

Set `NEXT_PUBLIC_AUTH_METRICS=1` and watch console for `getUser.deduped`, `signup.deduped` counters via `getAuthMetrics()` in devtools.
