# Login incident — status

**Updated:** 2026-06-16  
**Fix merged:** PR [#142](https://github.com/harmankmh-cloud/PROJECT/pull/142) → `main`

## Verdict

| Area | Status |
|------|--------|
| Auth logic on `main` | **Fixed** (#142 — role resolution, www redirect, `?as=` on all paths) |
| Prior PRs (#125–#130, #126) | **Partial** — dedupe, confirm URLs, choose-role shipped; **role bugs remained** |
| Production smoke (automated) | **Pass** — `node servelocal/scripts/auth-e2e-smoke.mjs` (2026-06-16) |
| Pro password login (browser) | **Verify after Vercel deploy** — use `/login?as=pro` |

## Why docs said “fixed” but login still broke

Between Jun 14–16, `LOGIN_INCIDENT_STATUS.md` and `AUTH_QA.md` listed items as **“working”** or **“fixed (pending deploy)”** after PRs #125–#130. Those PRs correctly added:

- Signup single-flight / dedupe  
- Email confirm with `?as=` on **signup** links  
- Choose-role + metadata sync on first assignment  
- Middleware `?as=` on logged-in `/login`  

They did **not** fix:

| Bug | Symptom |
|-----|---------|
| `resolveUserRole` preferred **metadata over DB** | Pro in DB → homeowner dashboard |
| Middleware **metadata-only** dashboard redirects | Fought DB-aware layouts; random bounces |
| **apex vs www** cookies | Confirmed on www, signed in on apex → “logged out” |
| Resend / error recovery **dropped `?as=`** | Confirm → choose-role loop |
| Hash-token callback used metadata-only path | Skipped DB routing |

**Lesson:** Mark auth items **“code merged”** vs **“verified in prod browser”** separately. Do not mark “working” until role routing is tested on www with a real pro account.

## Fixes in PR #142 (merged)

| Fix | File |
|-----|------|
| DB profile → listings → metadata role order | `src/lib/auth-routing.ts` |
| Sync metadata from DB on after-login | `syncAuthRoleMetadata()` |
| Middleware auth-only (no role bounce) | `src/middleware.ts` |
| Role hint from `/signup/pro`, `/login/pro` | `src/lib/auth/role-hint.ts` |
| Apex → www redirect | `next.config.ts` |
| Resend confirm + auth-code-error `?as=` | `AuthCodeErrorRecovery.tsx` |
| Hash callback → `/auth/after-login` | `AuthCallbackCatch.tsx` |
| Login → signup link keeps role | `LoginFormNew.tsx` |
| Profile API syncs metadata when drift | `api/user-profile/route.ts` |

## Verify after Vercel deploy (`project-pqhe`)

1. https://www.servelocal.ca/login?as=pro — pro account → `/dashboard/pro` or `/onboarding`  
2. https://servelocal.ca/login — 308 → www  
3. `node servelocal/scripts/auth-e2e-smoke.mjs` — all PASS  
4. One fresh email confirm click with `?as=pro` in link  

See `docs/AUTH_QA.md` for full checklist.

## Supabase (TRADELOCAL `avytxgfkncpacqewnrvz`)

- `site_url`: `https://www.servelocal.ca`  
- Redirect allowlist: confirm, callback, after-login (www + apex + localhost:3001)  
- Harden script: `node servelocal/scripts/harden-supabase-auth.mjs` (needs `SUPABASE_ACCESS_TOKEN`)

## Test accounts (from prior retest)

| Email | Expected role | Notes |
|-------|---------------|-------|
| harmanamazon666@gmail.com | pro | Should land `/dashboard/pro` after #142 deploy |
| harmannonu13@gmail.com | homeowner | OK |
| harmankmh@gmail.com | — | OK |
