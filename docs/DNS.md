# DNS (Cloudflare + Vercel)

All three products use **Cloudflare** nameservers (`ace.ns.cloudflare.com`, `holly.ns.cloudflare.com`) and **Vercel** for hosting.

Run an audit anytime:

```bash
test -n "$VERCEL_TOKEN" && echo set || echo not-set

# All products (RateLocal, ServeLocal, GreetQ) — needs VERCEL_TOKEN
node scripts/dns-audit.mjs
node scripts/dns-audit.mjs --fix

# GreetQ only — public DNS + optional Cloudflare zone; no token with --skip-vercel
cd voiceagent && node scripts/dns-audit.mjs --skip-vercel
cd voiceagent && node scripts/dns-audit.mjs --fix   # when VERCEL_TOKEN is set
```

**GreetQ script** (`voiceagent/scripts/dns-audit.mjs`) validates:
- Public DNS (`greetq.com` A → `76.76.21.21`, `www` CNAME → `cname.vercel-dns.com`)
- Cloudflare zone records when `CLOUDFLARE_API_TOKEN` is set (zone defaults to greetq.com)
- Vercel project domains when `VERCEL_TOKEN` is set (or `--skip-vercel` to skip)

**Cloud Agent note:** `VERCEL_TOKEN` must be named exactly that under **Cursor → Cloud Agents → Secrets**. It is injected only when a **new** agent run starts — use `--skip-vercel` if Vercel is already configured but the token is not in this VM.

## Vercel projects

| Product     | Vercel project | Domains |
| ----------- | -------------- | ------- |
| GreetQ      | `voiceagent`   | `greetq.com` (primary), `www.greetq.com` → apex, `intellivo.ca` → `greetq.com`, `www.intellivo.ca` → `greetq.com` |
| RateLocal   | `project`      | `ratelocal.ca`, `www.ratelocal.ca` → apex |
| ServeLocal  | `project-pqhe` | `servelocal.ca`, `www.servelocal.ca` → apex |

## Cloudflare records

Use **DNS only** (grey cloud) for apex and `www` unless you have a specific reason to proxy.

SSL/TLS mode: **Full (strict)**.

### greetq.com (live)

| Type  | Name | Content | Status |
| ----- | ---- | ------- | ------ |
| A     | `@`  | `76.76.21.21` | OK |
| CNAME | `www`| `cname.vercel-dns.com` | OK |

### intellivo.ca (legacy → GreetQ)

| Type  | Name | Content | Status |
| ----- | ---- | ------- | ------ |
| A     | `@`  | `76.76.21.21` | OK — Vercel redirects to `greetq.com` |
| CNAME | `www`| `cname.vercel-dns.com` | OK — Vercel redirects to `greetq.com` |

### ratelocal.ca

| Type  | Name | Content | Status |
| ----- | ---- | ------- | ------ |
| A     | `@`  | `216.198.79.1` | OK |
| CNAME | `www`| project-specific `*.vercel-dns-017.com` | verify via `node scripts/dns-audit.mjs` |

### servelocal.ca

| Type  | Name | Content | Status |
| ----- | ---- | ------- | ------ |
| A     | `@`  | `216.198.79.1` | OK |
| CNAME | `www`| project-specific `*.vercel-dns-017.com` | verify via `node scripts/dns-audit.mjs` |

## After DNS changes

1. Wait for propagation (usually minutes; up to 48h globally).
2. Re-run audits — misconfigured domains should flip to OK.
3. For GreetQ, confirm `NEXT_PUBLIC_APP_URL=https://greetq.com` in Vercel env (see `voiceagent/docs/GREETQ-DEPLOY.md`).
