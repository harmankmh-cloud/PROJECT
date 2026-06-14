# Login incident — retest status (2026-06-14)

## Verdict

| Area | Status | Evidence |
|------|--------|----------|
| TRADELOCAL DB + listing | **Working** | `harmanamazon666@gmail.com`: confirmed, `role=pro`, `last_sign_in_at` set, listing `harman-plumbing-12170162` approved |
| Supabase auth config | **Working** | `site_url=https://www.servelocal.ca`, redirect allowlist includes confirm/callback/after-login (www + non-www) |
| Vercel env | **Working** | `NEXT_PUBLIC_APP_URL` present (sitemap canonical `https://www.servelocal.ca`); Supabase keys configured on `project-pqhe` |
| Email confirm → pro routing | **Fixed (pending deploy)** | `emailRedirectTo` and `/auth/confirm` now pass `?as=pro\|homeowner` to `resolvePostLoginPath` |
| Password reset | **Fixed (pending deploy)** | `/reset-password` page; reset email → confirm → `/reset-password` |
| Choose-role metadata | **Fixed (pending deploy)** | `/api/user-profile` syncs `role` into auth `user_metadata` on first assignment |
| Logged-out route guards | **Working** | `/onboarding`, `/dashboard/pro` → 307 `/login` |
| Homepage token catch | **Working** | `/?code=` → 307 `/auth/confirm` |
| Pro password login (live session) | **Not re-tested** | Account has signed in before; needs browser test at `/login?as=pro` |

## Auth users (TRADELOCAL)

| Email | State | Notes |
|-------|--------|-------|
| harmanamazon666@gmail.com | Confirmed, signed in 2026-06-14, `role=pro`, approved listing | Should land on `/dashboard/pro` after password login |
| harmannonu13@gmail.com | Confirmed + signed in, `role=homeowner` | OK |
| harmankmh@gmail.com | Confirmed + signed in | OK |

## Fixes in this retest (PR branch `cursor/deep-audit-auth-fixes-92d4`)

1. **`authConfirmUrl()`** — accepts `{ as, next }` for email and reset links
2. **`signup-client.ts`** — `emailRedirectTo` includes `?as=pro|homeowner`
3. **`/auth/confirm`** — reads `as` query param → `resolvePostLoginPath(user, { next, as })`
4. **`LoginFormNew`** — reset/resend links include role hint
5. **`/reset-password`** — new page for recovery flow
6. **`/api/user-profile`** — syncs role to auth metadata on choose-role
7. **`/login` + middleware** — preserve `?as=` when redirecting logged-in users to after-login

## Prior fixes (already deployed)

| Item | PR / action |
|------|-------------|
| Pro signup → onboarding/dashboard not homepage | PR #130 |
| Signup dedupe, confirm recovery, getUser throttle | PR #125 |
| TRADELOCAL project mapping | PR #131 |
| Auth redirect allowlist + 10 approved providers | Supabase harden + seed |

## What still needs you

One **fresh pro confirm link click** (or throwaway test inbox) to fully close flow **C** — automated smoke cannot open real email links.

After deploy: sign in at **https://www.servelocal.ca/login?as=pro** with `harmanamazon666@gmail.com` — expect **/dashboard/pro**.

## REST 403 (Postgres)

Grants correct per prior check. Anon 403 on `service_requests` / `bookings` is expected RLS.

See `docs/AUTH_QA.md` for checklist and `node servelocal/scripts/auth-e2e-smoke.mjs` for post-deploy smoke.
