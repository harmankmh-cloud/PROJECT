# Email (SMTP) — ServeLocal Supabase (TRADELOCAL)

ServeLocal uses its **own** Supabase project: **`avytxgfkncpacqewnrvz`** (TRADELOCAL).

RateLocal uses **`otnddwopphhxstteqizw`** — a **different** project. Do not share auth or Site URL between them.

Email auth is configured in **Supabase → Authentication → SMTP** (Resend), not in Vercel env vars for signup confirm.

---

## Resend SMTP (ServeLocal project)

1. [Resend](https://resend.com) → verify `servelocal.ca` (or use a subdomain)
2. Supabase → project **TRADELOCAL** (`avytxgfkncpacqewnrvz`) → **Authentication** → **SMTP Settings**
3. Enable Custom SMTP: host `smtp.resend.com`, port `465`, user `resend`, password = `re_...` API key
4. Sender e.g. `ServeLocal <hello@servelocal.ca>`

Redirect URLs (Authentication → URL Configuration):

```
https://www.servelocal.ca/auth/confirm
https://servelocal.ca/auth/confirm
https://www.servelocal.ca/auth/callback
https://servelocal.ca/auth/callback
https://www.servelocal.ca/auth/after-login
https://servelocal.ca/auth/after-login
http://localhost:3001/auth/confirm
http://localhost:3001/auth/callback
http://localhost:3001/auth/after-login
```

**Site URL:** `https://www.servelocal.ca`

Full Resend walkthrough (same SMTP vendor): **`reviewflow/SMTP_SETUP.md`** — use the **TRADELOCAL** dashboard, not RateLocal’s.

---

## RateLocal vs ServeLocal

| | RateLocal | ServeLocal |
|---|-----------|------------|
| Supabase ref | `otnddwopphhxstteqizw` | `avytxgfkncpacqewnrvz` |
| Site URL | `https://ratelocal.ca` | `https://www.servelocal.ca` |
| Customer signup | Yes | Yes (`/signup`, `/signup/pro`) |
| SMTP | Resend on RateLocal project | Resend on TRADELOCAL project |

Split details: **`docs/SERVELOCAL_SUPABASE_SPLIT.md`**

---

## “Email rate limit exceeded”

1. Short term: Supabase → Confirm email **OFF** (dev only)
2. Proper fix: **Resend SMTP** on the **TRADELOCAL** project
3. Do not spam signup/login — each attempt can send mail
