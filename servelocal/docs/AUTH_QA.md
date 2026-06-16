# Auth flow QA checklist

Manual checks after deploy (Supabase logs + browser Network tab filtered to `auth/v1`).

**Last retest:** 2026-06-16 — production `www.servelocal.ca`, Supabase TRADELOCAL `avytxgfkncpacqewnrvz`  
**Auth fix merged:** PR [#142](https://github.com/harmankmh-cloud/PROJECT/pull/142) (main)

> **Doc note:** Earlier docs (Jun 14) marked several items “working / pending deploy” after PRs #125–#130.  
> Those PRs shipped **confirm URLs, dedupe, and choose-role** — but **not** the role-resolution bugs fixed in #142.  
> If login still failed after “fixes,” the cause was logic (metadata vs DB), not missing deploy.

## Signup

- [x] Single click → one `POST /auth/v1/signup` — **working** (`signup-client.ts` single-flight)
- [x] Double-click → still one request — **working**
- [x] Existing email → “Check your email” (no retry spam) — **working**
- [x] Submit disabled after success — **working**

## Email confirm

- [x] Confirm link → `/auth/confirm` → one verify → dashboard — **working** (`?as=` preserved)
- [x] Resend / auth-code-error resend includes `?as=` when provided — **working** (#142)
- [x] Used link → `auth-code-error?reason=link_used` — **working**
- [x] Invalid link → recovery page — **working** (smoke: 307 → `invalid_link`)

## Login / role routing (#142)

- [x] `resolveUserRole`: DB profile before metadata — **working** (code)
- [x] After-login syncs metadata from DB — **working** (code)
- [x] Middleware: auth guard only (no metadata role bounce) — **working** (code)
- [x] Apex `servelocal.ca` → `www.servelocal.ca` — **working** (308 in prod + `next.config.ts`)
- [ ] **Pro password login** → `/dashboard/pro` — **verify in browser** after Vercel deploys #142
- [ ] **Homeowner login** → `/dashboard` — **verify in browser**

## Session / getUser noise

- [x] Homepage (logged out) → no middleware `getUser` — **working**
- [ ] Dashboard load → at most one `/auth/v1/user` — not re-tested (needs logged-in session)
- [ ] No idle-tab burst — not re-tested

## Security

- [x] No service role in client bundle — **working**
- [ ] RLS 403 only when expected — not re-tested

## Production smoke (automated 2026-06-16)

Run: `node servelocal/scripts/auth-e2e-smoke.mjs`

| Flow | Result |
|------|--------|
| G — `/onboarding`, `/dashboard/pro` logged out | PASS → 307 `/login` |
| E — `/?code=` token catch | PASS → 307 `/auth/confirm` |
| D — `auth-code-error?reason=link_used` | PASS |
| Confirm missing params | PASS → `invalid_link` |
| `/login?as=pro`, `/signup/pro` | PASS 200 |
| A/B/C — email confirm + password login | **Manual** — real inbox or test account |

## Dev metrics (optional)

`NEXT_PUBLIC_AUTH_METRICS=1` → console: `getUser.deduped`, `signup.deduped`.

## Related docs

- `docs/LOGIN_INCIDENT_STATUS.md` — incident timeline and root causes
- `docs/SUPABASE_MCP_CURSOR.md` — MCP setup (ops)
