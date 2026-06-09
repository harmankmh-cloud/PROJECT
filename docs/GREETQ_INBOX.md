# GreetQ inbox (hello@greetq.com)

Inbound email for **greetq.com** is handled by **Cloudflare Email Routing** and forwards to your personal Gmail.

## Live setup

| Address | Forwards to | Status |
| ------- | ----------- | ------ |
| `hello@greetq.com` | `harmankmh@gmail.com` | Active |
| `sales@greetq.com` | `harmankmh@gmail.com` | Active |
| `support@greetq.com` | `harmankmh@gmail.com` | Active |

**Outbound** cold outreach still sends via **Brevo** from `hello@greetq.com`. Replies to those emails land in your Gmail inbox (check spam the first time).

## Where to read mail

There is no in-app inbox in GreetQ. Open **Gmail → harmankmh@gmail.com** and search:

```
from:@greetq.com OR to:hello@greetq.com
```

Forwarded mail usually shows the original sender in the **From** field (e.g. `owner@dentist.com`), with the **To** line showing `hello@greetq.com`.

## DNS (Cloudflare)

Email routing adds these records automatically when enabled:

| Type | Name | Content |
| ---- | ---- | ------- |
| MX | `@` | `route1.mx.cloudflare.net` (prio 24) |
| MX | `@` | `route2.mx.cloudflare.net` (prio 67) |
| MX | `@` | `route3.mx.cloudflare.net` (prio 34) |
| TXT | `@` | `v=spf1 include:_spf.mx.cloudflare.net include:spf.brevo.com ~all` |
| TXT | `cf2024-1._domainkey` | Cloudflare DKIM (auto) |

Brevo sender verification (`brevo-code:…`) and Brevo DKIM (`mail._domainkey`, `brevo1._domainkey`) stay in place for outbound.

## Re-provision or audit

```bash
# Requires Cloudflare MCP or CLOUDFLARE_API_TOKEN with Email Routing + DNS edit
cd voiceagent && node scripts/greetq-email-routing.mjs
cd voiceagent && node scripts/greetq-email-routing.mjs --status
```

Or in Cloudflare dashboard: **greetq.com → Email → Routing rules**.

## Test inbound

1. From any email account, send a message to `hello@greetq.com`.
2. Within ~1 minute it should appear in `harmankmh@gmail.com`.
3. Reply from Gmail — the recipient sees your Gmail address unless you configure “Send mail as” for `hello@greetq.com` in Gmail settings.

## Optional: reply as hello@greetq.com from Gmail

Gmail → Settings → Accounts → “Send mail as” → add `hello@greetq.com`. Gmail will send a verification code to that address (which forwards to you).
