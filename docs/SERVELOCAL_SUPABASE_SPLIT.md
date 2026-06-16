# ServeLocal ↔ RateLocal Supabase split

**Completed:** 2026-06-16  
**Why:** Both apps were on one Supabase project (`otnddwopphhxstteqizw`). That caused auth Site URL conflicts, empty/wrong Vercel env, and zero `user_profiles` rows for ServeLocal logins.

## One project per app (production)

| App | Supabase ref | Dashboard |
|-----|--------------|-----------|
| **RateLocal** | `otnddwopphhxstteqizw` | [reviewflow project](https://supabase.com/dashboard/project/otnddwopphhxstteqizw) |
| **ServeLocal** | `avytxgfkncpacqewnrvz` (TRADELOCAL) | [TRADELOCAL project](https://supabase.com/dashboard/project/avytxgfkncpacqewnrvz) |
| **GreetQ** | `lrihhjjxmxixppmrzvva` | separate |

## What was fixed

| Step | Status |
|------|--------|
| ServeLocal Vercel (`project-pqhe`) env → TRADELOCAL URL + keys | **Done** |
| Production redeploy | **Done** (`dpl_DLb2AfsVspAxaHK6GBxW6vBw4Up3`) |
| RateLocal auth Site URL → `https://ratelocal.ca` | **Done** |
| RateLocal redirect allowlist → RateLocal only | **Done** |
| TRADELOCAL auth Site URL → `https://www.servelocal.ca` | **Done** |
| TRADELOCAL redirect allowlist → ServeLocal only | **Done** |
| Removed ServeLocal tables from RateLocal DB | **Done** (migration `remove_servelocal_tables_from_ratelocal`) |
| TRADELOCAL migration 006 (job PII RLS) | **Done** |

## TRADELOCAL already had

- 11 service providers (incl. test listing)
- 2 `user_profiles` with roles (pro + homeowner)
- 3 auth users: `harmankmh@gmail.com`, `harmannonu13@gmail.com`, `harmanamazon666@gmail.com`

**Important:** User IDs on TRADELOCAL are **not** the same as on the old shared RateLocal auth. Same email = different account per project. Use ServeLocal signup/password reset on TRADELOCAL if login fails.

## Verify

```bash
# Smoke (redirects)
node servelocal/scripts/auth-e2e-smoke.mjs

# Browser — pro account on TRADELOCAL
open "https://www.servelocal.ca/login?as=pro"
```

## Resend SMTP

Configure **separately** per Supabase project (same Resend account is fine):

- RateLocal: sender `hello@ratelocal.ca` on `otnddwopphhxstteqizw`
- ServeLocal: sender `hello@servelocal.ca` (or verified domain) on `avytxgfkncpacqewnrvz`

See `servelocal/SMTP_SETUP.md` and `reviewflow/SMTP_SETUP.md`.

## Scripts

```bash
# Auth hardening — always TRADELOCAL for ServeLocal
SUPABASE_ACCESS_TOKEN=sbp_... node servelocal/scripts/harden-supabase-auth.mjs

# RateLocal auth only (do not set ServeLocal site_url here)
SUPABASE_PROJECT_REF=otnddwopphhxstteqizw SUPABASE_SITE_URL=https://ratelocal.ca \
  SUPABASE_ACCESS_TOKEN=sbp_... node servelocal/scripts/harden-supabase-auth.mjs
```

## Do not

- Run ServeLocal SQL on RateLocal (`otnddwopphhxstteqizw`)
- Point `project-pqhe` Vercel env at RateLocal ref
- Share one Supabase Site URL between ratelocal.ca and servelocal.ca
