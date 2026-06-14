# Platform admin access (all apps)

You get **full platform admin** on each site when your email is in **`ADMIN_EMAILS`** in that app’s Vercel environment (comma-separated). Same email can be on all three.

| App | Admin URL | What you control today |
|-----|-----------|-------------------------|
| **RateLocal** | https://ratelocal.ca/admin | Businesses, reviews, revenue, messages, **Users (invite)**, settings |
| **ServeLocal** | https://www.servelocal.ca/admin | Listings, jobs, reviews, **Users (invite)**, settings |
| **GreetQ** | https://greetq.com/admin | Orgs, stats, **Users (invite)**, outreach email |

## One-time Vercel setup (each deployment)

For **each** Vercel project that hosts an app, set:

```
ADMIN_EMAILS=harmankmh@gmail.com
SUPABASE_SERVICE_ROLE_KEY=...   # required for Users page + invites
```

Optional legacy alias: `ADMIN_EMAIL=you@example.com` (single email).

After saving env vars, **redeploy** that project.

## How to sign in

1. Go to the site’s `/login` (or `/signup` on RateLocal).
2. Use the email listed in `ADMIN_EMAILS`.
3. You are redirected to `/admin` automatically after login (RateLocal, ServeLocal, GreetQ).

If you land on the normal dashboard instead, your email is **not** in that app’s `ADMIN_EMAILS` for that deployment.

## Invite users manually (new)

Each app now has **Admin → Users**:

- **Send invite** — Supabase invite email (they set password / confirm)
- **View all accounts** — email, confirmed status, linked business/listing/org

### RateLocal workflow

1. `/admin/users` → invite `owner@shop.com`
2. `/admin/businesses` → add business with that owner email

### ServeLocal workflow

1. `/admin/users` → invite tradie
2. They apply for listing → you approve on `/admin`

### GreetQ workflow

1. `/admin/users` → invite customer
2. They complete org setup on first login

## Requires SMTP

Invite emails use **Supabase Auth** (same Resend SMTP you configured). If invites fail, verify domain in Resend and Supabase custom SMTP.

## Not the same as customer dashboard

- **Platform admin** (`/admin`) — you, `ADMIN_EMAILS`
- **Customer dashboard** (`/dashboard`) — paying business owners

You can use both: admin sidebar links to “Business dashboard” / “My account” where applicable.
