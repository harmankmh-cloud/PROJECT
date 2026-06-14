# ServeLocal email — one key setup

You only need to add **one** env var for app emails (job confirmations, pro alerts, saved searches).

## Do this (2 minutes)

### 1. Get your Resend key
1. Open https://resend.com/api-keys
2. **Create API Key** → copy it (`re_...`)

### 2. Paste it in Vercel
1. Open https://vercel.com → your **ServeLocal** project
2. **Settings** → **Environment Variables**
3. Add:

| Name | Value |
|------|--------|
| `RESEND_API_KEY` | paste your `re_...` key |

4. Environment: **Production** (and Preview if you want)
5. **Save** → **Deployments** → **Redeploy** latest

That’s it. `EMAIL_FROM` defaults to `ServeLocal <hello@servelocal.ca>`.

### 3. Verify domain (production)
In Resend → **Domains** → add `servelocal.ca` → add DNS records in Cloudflare → wait for **Verified**.

Until verified, use Resend logs to debug; production sends need a verified domain.

---

## Optional (not required to start)

| Variable | When you need it |
|----------|------------------|
| `EMAIL_FROM` | Custom sender, e.g. `ServeLocal <noreply@servelocal.ca>` |
| `CRON_SECRET` | Daily saved-search backup cron (alerts still fire when admin approves a pro without this) |

For `CRON_SECRET`: run `openssl rand -hex 32`, add to Vercel. Vercel cron sends it automatically.

---

## Supabase auth email (signup / password reset)

**Separate from above.** If RateLocal signup emails already work, you’re done — same Supabase project.

If not: Supabase → **Authentication** → **SMTP** → use `smtp.resend.com`, user `resend`, password = same `re_...` key.

Full steps: `SMTP_SETUP.md`

---

## Database (run once in Supabase SQL Editor)

```sql
-- paste contents of servelocal/supabase/saved-searches.sql
```

---

## Test

After redeploy, post a job while signed in → inbox should get “Your … job is posted”.

Check Resend → **Emails** → **Logs** if nothing arrives.
