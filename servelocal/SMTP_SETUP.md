# Email (SMTP) — same Resend setup as RateLocal

ServeLocal uses the **same Supabase project** as RateLocal. Email auth is configured **once** in Supabase with **Resend SMTP** — not in Vercel env vars.

**Important:** ServeLocal visitors (customers & tradies) **do not sign up**. They browse, call pros, post jobs, and apply to get listed **without any login**. Only **you** sign in at `/login` for `/admin`.

So the Supabase “2–4 emails per hour” limit mainly affected **RateLocal signup**. Fix it the same way you already did (or should do) for RateLocal.

---

## If you already set up Resend for RateLocal

You’re done for ServeLocal too — SMTP is per Supabase **project**, not per app.

Check once:

1. Supabase → **Project Settings** → **Authentication** → **SMTP Settings**
2. **Enable Custom SMTP** = ON
3. Host `smtp.resend.com`, port `465`, user `resend`, password = your `re_...` API key
4. Sender = `hello@ratelocal.ca` (or verified domain on Resend)

Add ServeLocal redirect URLs (Supabase → **Authentication** → **URL Configuration**):

```
https://www.servelocal.ca/auth/confirm
https://servelocal.ca/auth/confirm
http://localhost:3001/auth/confirm
https://www.servelocal.ca/auth/callback
https://servelocal.ca/auth/callback
http://localhost:3001/auth/callback
```

**Site URL** should match your canonical domain (usually `https://www.servelocal.ca`). If confirm links land on the homepage with `?code=` in the URL, add the redirect URLs above — the app forwards those tokens to `/auth/confirm` automatically.

---

## Full step-by-step (Resend + Supabase)

Use the **same guide as RateLocal**:

→ **`reviewflow/SMTP_SETUP.md`** in this repo (Resend account, domain verify, Supabase SMTP, confirm email on/off)

| Mode | Confirm email | Use for |
|------|----------------|---------|
| **A — Instant** | OFF | Testing, no emails sent |
| **B — Live** | ON + Resend SMTP | RateLocal signups, password reset |

---

## ServeLocal vs RateLocal

| | RateLocal | ServeLocal |
|---|-----------|------------|
| Customer signup | Yes (`/signup`) | **No** — no account needed |
| Tradie listing | Via business dashboard | Form at `/join` — no login |
| Admin login | `/login` | `/login` (admin only) |
| Email rate limit risk | Signup confirm emails | Admin password reset only |

---

## “Email rate limit exceeded”

Same fixes as RateLocal:

1. **Short term:** Supabase → Email provider → **Confirm email OFF**
2. **Proper fix:** **Resend SMTP** (see `reviewflow/SMTP_SETUP.md`)
3. Don’t hammer signup/login buttons — each try can send an email

---

## Links

| Service | URL |
|---------|-----|
| Resend | https://resend.com/emails |
| Resend domains | https://resend.com/domains |
| Supabase SMTP | Project Settings → Authentication → SMTP |
| RateLocal full guide | `reviewflow/SMTP_SETUP.md` |
