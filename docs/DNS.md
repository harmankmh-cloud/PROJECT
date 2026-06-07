# DNS (Cloudflare + Vercel)

All three products use **Cloudflare** nameservers (`ace.ns.cloudflare.com`, `holly.ns.cloudflare.com`) and **Vercel** for hosting.

Run an audit anytime:

```bash
test -n "$VERCEL_TOKEN" && echo set || echo not-set

# All products (RateLocal, ServeLocal, GreetQ) — needs VERCEL_TOKEN
VERCEL_TOKEN=... node scripts/dns-audit.mjs
VERCEL_TOKEN=... node scripts/dns-audit.mjs --fix

# GreetQ only — public DNS + optional Cloudflare zone; no token needed with --skip-vercel
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

## Cloudflare records to add or fix

Use **DNS only** (grey cloud) for apex and `www` unless you have a specific reason to proxy.

SSL/TLS mode: **Full (strict)**.

### greetq.com (action required)

No DNS records exist yet. Add in Cloudflare for zone `greetq.com`:

| Type  | Name | Content |
| ----- | ---- | ------- |
| A     | `@`  | `216.150.1.1` |
| A     | `@`  | `216.150.16.1` |
| CNAME | `www`| `e6e937ce5d27f994.vercel-dns-017.com` |

Fallback if the project-specific CNAME is unavailable: `cname.vercel-dns.com`.

### intellivo.ca (legacy → GreetQ)

| Type  | Name | Content | Status |
| ----- | ---- | ------- | ------ |
| A     | `@`  | `76.76.21.21` | OK — Vercel redirects to `greetq.com` |
| CNAME | `www`| `cname.vercel-dns.com` | **Add** — Vercel redirects to `greetq.com` |

### ratelocal.ca

| Type  | Name | Content | Status |
| ----- | ---- | ------- | ------ |
| A     | `@`  | `216.198.79.1` | OK |
| CNAME | `www`| `0bc33a526d82afa6.vercel-dns-017.com` | **Add** — Vercel redirects to apex |

### servelocal.ca

| Type  | Name | Content | Status |
| ----- | ---- | ------- | ------ |
| A     | `@`  | `216.198.79.1` | OK |
| CNAME | `www`| `988a7d41f27e911d.vercel-dns-017.com` | OK |

## After DNS changes

1. Wait for propagation (usually minutes; up to 48h globally).
2. Re-run `node scripts/dns-audit.mjs` — misconfigured domains should flip to OK.
3. For GreetQ, confirm `NEXT_PUBLIC_APP_URL=https://greetq.com` in Vercel env (see `voiceagent/docs/GREETQ-DEPLOY.md`).

## Vercel API (optional)

With `VERCEL_TOKEN`, domains and redirects can be managed via API (already applied for GreetQ):

- Add domain to team: `POST /v5/domains`
- Attach to project: `POST /v10/projects/{id}/domains`
- Set redirect: `PATCH /v9/projects/{id}/domains/{name}` with `redirect` + `redirectStatusCode: 308`
