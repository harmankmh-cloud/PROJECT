# Login incident — status (2026-06-16)

## Verdict

| Area | Status |
|------|--------|
| Auth code in `main` | **Fixed** — role routing, confirm `?as=`, reset password, choose-role sync |
| Production deploy | **Check Vercel** — `project-pqhe` must deploy latest `main` |
| Root causes (Jun 16 fix) | **DB vs metadata role mismatch**, **apex vs www cookies**, **missing `?as=` on recovery paths** |

## What was broken (why login felt "still broken")

1. **`resolveUserRole` preferred `user_metadata` over DB** — Pro in `user_profiles` with empty/wrong metadata → homeowner dashboard.
2. **Middleware used metadata-only role** for dashboard redirects — fought with layout guards; wrong bounces.
3. **`servelocal.ca` vs `www.servelocal.ca`** — confirm email on www, login on apex → "logged out" (different cookies).
4. **Resend confirmation / auth-code-error** dropped `?as=pro` — confirm → choose-role loop.
5. **Hash-token callback** used metadata-only `afterLoginPath()` — skipped DB routing.

## Fixes in PR `cursor/servelocal-auth-fix-28c7`

| Fix | File |
|-----|------|
| DB profile → listings → metadata role order | `src/lib/auth-routing.ts` |
| Sync metadata from DB on every after-login | `syncAuthRoleMetadata()` |
| Remove metadata-only dashboard redirects from middleware | `src/middleware.ts` |
| Preserve `?as=` from `/signup/pro`, `/login/pro` paths | `src/lib/auth/role-hint.ts`, middleware |
| Apex → www permanent redirect | `next.config.ts` |
| Resend confirm includes role hint | `AuthCodeErrorRecovery.tsx` |
| Hash callback → `/auth/after-login` (server resolves role) | `AuthCallbackCatch.tsx` |
| Login signup link preserves role | `LoginFormNew.tsx` |
| Choose-role / signup redirects include `?as=` | page routes |
| Metadata sync on profile API when drift | `api/user-profile/route.ts` |

## Test after deploy

1. **Pro login:** https://www.servelocal.ca/login?as=pro → `/dashboard/pro` (or `/onboarding` if no listing)
2. **Apex redirect:** https://servelocal.ca/login → 308 → www
3. **Logged out guard:** `/dashboard/pro` → `/login`
4. Run: `node servelocal/scripts/auth-e2e-smoke.mjs`

See `docs/AUTH_QA.md` for full checklist.
