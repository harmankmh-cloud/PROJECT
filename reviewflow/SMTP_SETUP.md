# Email (SMTP) setup — easy signups for RateLocal

Supabase sends signup, confirm, and password-reset emails. **Free Supabase email** hits rate limits fast. **Custom SMTP** (we recommend **Resend**) fixes that so owners can sign up reliably.

**You configure this in Supabase + Resend — not in Vercel env vars.**

---

## Two modes (pick one)

| Mode | Confirm email | Best for |
|------|----------------|----------|
| **A — Instant signup (no email)** | OFF | Testing, demos, very few signups |
| **B — Email confirm (recommended live)** | ON + SMTP | Real customers, fewer fake accounts |

---

## Mode B — Resend + Supabase (recommended)

### Step 1 — Resend account (free)

1. Open https://resend.com/signup  
2. Sign up (free tier: thousands of emails/month)  
3. Go to **API Keys** → **Create API Key** → copy it (starts with `re_`)

### Step 2 — Sender email

**Quick test (no domain yet):**

- Use Resend’s test sender: `onboarding@resend.dev`  
- Only sends to **your own email** until you verify a domain.

**Production (ratelocal.ca):**

1. Resend → **Domains** → **Add Domain** → `ratelocal.ca`  
2. Add the DNS records Resend shows in **Cloudflare** (same place you did Google Search Console)  
3. Wait until Resend shows **Verified**  
4. Use sender: `hello@ratelocal.ca` or `noreply@ratelocal.ca`

### Step 3 — Supabase custom SMTP

1. Open https://supabase.com/dashboard → your **RateLocal** project  
2. **Project Settings** (gear) → **Authentication**  
3. Scroll to **SMTP Settings** → turn **Enable Custom SMTP** ON  
4. Fill in:

| Field | Value |
|-------|--------|
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | Your Resend API key (`re_...`) |
| Sender email | `hello@ratelocal.ca` (or `onboarding@resend.dev` for testing) |
| Sender name | `RateLocal` |

5. **Save**

### Step 4 — Turn on confirm email

1. Supabase → **Authentication** → **Providers** → **Email**  
2. Turn **Confirm email** **ON**  
3. Save  

New users get one email → tap link → land on dashboard (already wired in the app).

### Step 5 — Redirect URLs (check once)

Supabase → **Authentication** → **URL Configuration** → **Redirect URLs** must include:

```
https://ratelocal.ca/auth/callback
https://ratelocal.ca/**
https://project-amber-omega-94.vercel.app/auth/callback
http://localhost:3000/auth/callback
```

### Step 6 — Test

1. Open https://ratelocal.ca/signup in a **private/incognito** window  
2. Use a **real email** you can open (not the same as admin if testing limits)  
3. Sign up → check inbox (and spam) for **Confirm your email**  
4. Tap link → should land on **dashboard**

---

## Mode A — Instant signup (no SMTP yet)

1. Supabase → **Authentication** → **Providers** → **Email**  
2. Turn **Confirm email** **OFF**  
3. Save  

Users go straight to dashboard after signup (no email). Good for testing; less protection against fake emails.

---

## “Error sending confirmation email”

This almost always means **Resend rejected the sender**, not that your app is broken.

### Fix A — Verify your domain (for real customers)

1. Open https://resend.com/domains  
2. Add **ratelocal.ca**  
3. Copy the DNS records into **Cloudflare** (same as Google Search Console)  
4. Wait until Resend shows **Verified** (can take a few minutes to 48 hours)  
5. Supabase SMTP sender must be `hello@ratelocal.ca` (or another address on that domain)  
6. Save SMTP again and test signup  

### Fix B — Quick test (only your email)

Until the domain is verified:

1. Resend → use sender **`onboarding@resend.dev`** in Supabase SMTP  
2. Sign up using **only the same email you used for your Resend account**  
3. Other emails will fail until Fix A is done  

### Fix C — Signups work today (no email)

1. Supabase → **Authentication** → **Providers** → **Email**  
2. Turn **Confirm email** **OFF**  
3. Save  

Users go straight to the dashboard — no confirm email needed.

### Also check

- Resend → **Emails** / **Logs** — see the real error (domain not verified, invalid API key, etc.)  
- Supabase SMTP **Password** = full Resend API key (`re_...`)  
- Supabase SMTP **Username** = `resend` (not `reviewflow`)  

---

## If you see “email rate limit exceeded”

- **Short term:** Confirm email **OFF** (Mode A)  
- **Proper fix:** Resend SMTP (Mode B)  
- Do **not** click signup many times in a row — each click can send an email  

---

## Password reset

Works automatically once SMTP is set. User taps **Forgot password?** on login → email → link → set new password.

---

## Links

| Service | URL |
|---------|-----|
| Resend dashboard | https://resend.com/emails |
| Supabase Auth | https://supabase.com/dashboard/project/_/auth/providers |
| Supabase SMTP | https://supabase.com/dashboard/project/_/settings/auth |
| Live signup page | https://ratelocal.ca/signup |

Replace `_` in Supabase URLs with your project ID from the dashboard URL bar.
