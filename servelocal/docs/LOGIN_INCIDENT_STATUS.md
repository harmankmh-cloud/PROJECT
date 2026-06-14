# Login incident — snapshot vs fixes (2026-06)

## Auth users (healthy)

| Email | State | Action |
|-------|--------|--------|
| harmanamazon666@gmail.com | Confirmed, **no** `last_sign_in_at` | Email verify succeeded; **must sign in at `/login`** with password (confirm link does not keep you logged in if token expired) |
| harmannonu13@gmail.com | Confirmed + signed in | OK |
| harmankmh@gmail.com | Confirmed + signed in | OK |

## Log issues → fix status

| Log pattern | Root cause | Fix |
|-------------|------------|-----|
| `POST /signup` + `user_repeated_signup` | Double submit / existing email | **PR #125**: submit guard + per-email single-flight + lock UI |
| `GET /verify` 403 one-time token not found | Link reused/expired | **PR #125**: single server verify; fail → `/auth/auth-code-error` |
| `GET /user` burst | Middleware + RSC + client re-fetch | **PR #125**: skip getUser on `/`; React `cache()`; client TTL dedupe |
| Leaked password protection off | Supabase Auth setting | Run `node servelocal/scripts/harden-supabase-auth.mjs` |
| Fixed auth DB pool (10) | `GOTRUE_DB_*` secrets | Same harden script → `GOTRUE_DB_CONN_PERCENTAGE` |
| Deprecated JWT group env vars | Legacy secrets | Same harden script deletes them |

## REST 403 (Postgres)

Grants are correct per latest check. Remaining 403s are **expected RLS** or **wrong client**:

| Table | Anon GET | Authenticated GET | Notes |
|-------|----------|-------------------|--------|
| service_categories | OK | OK | Public read policy |
| service_providers | OK (approved) | OK | Public read approved |
| provider_reviews | OK (approved) | OK public; pro needs owner policy | Run `006_auth_db_hardening.sql` for pro pending reviews |
| service_requests | **403** (by design) | OK with JWT + SELECT grant | Dashboard uses cookie client |
| site_suggestions | **403** SELECT (by design) | Admin/service role only | Public INSERT only |
| bookings | **403** anon | OK authenticated | Run `006` if SELECT grant missing |

App uses `createDbClient()` (service role → anon) for marketing; `createUserDbClient()` for own rows. Service role in Vercel masks grant gaps — test with anon key in REST explorer to validate RLS.

## Deploy checklist

1. Merge **PR #125** (app auth stability)
2. Supabase SQL: run `supabase/006_auth_db_hardening.sql` if not applied
3. `SUPABASE_ACCESS_TOKEN=sbp_... node servelocal/scripts/harden-supabase-auth.mjs`
4. Retest: signup once → confirm once → `/login` if no session → dashboard

See `docs/AUTH_QA.md` for manual network-tab checks.
