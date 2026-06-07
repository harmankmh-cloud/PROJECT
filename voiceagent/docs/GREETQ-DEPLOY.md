# GreetQ domain deployment (greetq.com)

Code defaults to **https://greetq.com** via `src/lib/brand.ts`. After merging the rebrand PR, update hosting and third-party consoles.

## Vercel

1. **Project** → Settings → **Domains**
   - Add `greetq.com` and `www.greetq.com`
   - Set `greetq.com` as primary
   - Remove or keep `intellivo.ca` (redirects to greetq.com are in `vercel.json`)

2. **Environment variables** (Production + Preview):

   ```
   NEXT_PUBLIC_APP_URL=https://greetq.com
   NEXT_PUBLIC_APP_NAME=GreetQ
   ```

3. Redeploy from `main` after env update.

## Cloudflare (DNS)

If Cloudflare manages `greetq.com`:

| Type  | Name | Content              | Proxy        |
| ----- | ---- | -------------------- | ------------ |
| CNAME | `@`  | `cname.vercel-dns.com` | DNS only (*) |
| CNAME | `www`| `cname.vercel-dns.com` | DNS only (*) |

(*) Vercel recommends DNS-only (grey cloud) for apex, or use Cloudflare CNAME flattening per Vercel docs.

SSL/TLS mode: **Full (strict)**.

## Supabase Auth

Dashboard → Authentication → URL Configuration:

- **Site URL:** `https://greetq.com`
- **Redirect URLs:** `https://greetq.com/auth/callback`, `http://localhost:3002/auth/callback`

## Stripe

- Customer portal return URL uses `NEXT_PUBLIC_APP_URL`
- Webhook endpoint: `https://greetq.com/api/webhooks/stripe`
- Optional: rename products to "GreetQ Starter", etc. (`npm run stripe:setup` in `voiceagent/`)

## Telnyx / Twilio

- Inbound webhook: `https://greetq.com/api/telnyx/webhook`
- Twilio voice URL: `https://greetq.com/api/twilio/voice`
- Status callback: `https://greetq.com/api/twilio/status`

## HubSpot / Google OAuth

Update redirect URIs to use `greetq.com` host (see `voiceagent/.env.example`).

## Email (optional)

Set up `hello@greetq.com`, `sales@greetq.com`, `support@greetq.com` in your mail provider and update `src/lib/brand.ts` if addresses differ.
