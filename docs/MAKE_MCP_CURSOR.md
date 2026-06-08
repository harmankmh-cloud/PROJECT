# Connect Make.com to Cursor (MCP toolbox)

Use this when you want Cursor (or a cloud agent) to **run Make scenarios** — e.g. trigger GreetQ outreach after you add a lead.

This is **separate** from email/SMTP setup (see below).

---

## Part A — Create the Make MCP toolbox

1. Log in to [make.com](https://www.make.com)
2. Go to **MCP toolboxes** (Help: *Model Context Protocol → MCP toolboxes*)
3. **Create toolbox** → name it e.g. `GreetQ Marketing`
4. **Add tools** — attach scenarios you want callable from Cursor, for example:
   - **GreetQ outreach** — Google Sheets watch row → HTTP POST `https://greetq.com/api/make/outreach`
   - (Build this scenario first; see [MAKE_GREETQ_EMAIL.md](./MAKE_GREETQ_EMAIL.md))
5. Copy:
   - **MCP toolbox URL** (e.g. `https://eu2.make.com/mcp/server/...`)
   - **Toolbox key** (Bearer token)

Scenarios must finish within **40 seconds** or MCP times out.

---

## Part B — Add to Cursor (desktop)

1. Cursor → **Settings** (gear) → **Tools & Integrations** → **MCP**
2. **Add Custom MCP** (opens `mcp.json`)
3. Add (replace placeholders — **do not commit real keys to git**):

```json
{
  "mcpServers": {
    "make": {
      "url": "https://eu2.make.com/mcp/server/YOUR_SERVER_ID",
      "headers": {
        "Authorization": "Bearer YOUR_TOOLBOX_KEY"
      }
    }
  }
}
```

**Safer:** put the key in your OS env and reference it if your Cursor build supports it, or use Cursor’s secret storage — never paste keys in chat or commit them.

4. Save → restart Cursor → confirm **make** appears under MCP tools (green).

**OAuth / consent screen on connect?** URL or toolbox key is wrong — regenerate in Make and retry.

---

## Part C — What to tell the agent

Once connected, you can say:

> “Run the GreetQ outreach Make tool for Pacific Dental, Abbotsford, dental, email owner@example.com, preview only.”

The scenario should POST to `/api/make/outreach` with your `MAKE_WEBHOOK_SECRET` (set in **Vercel** on the greetq.com project).

---

## Email / SMTP — what goes where (not all Vercel)

| Purpose | Where to configure |
|--------|---------------------|
| **Signup & password reset** (Supabase Auth) | **Supabase** → Authentication → **SMTP** (Resend: `smtp.resend.com`, user `resend`, password = API key) |
| **Domain verified for `@ratelocal.ca` / `@greetq.com`** | **Resend** → Domains → DNS in Cloudflare |
| **GreetQ cold outreach** (Make → API) | **Vercel** (greetq.com): `RESEND_API_KEY`, `EMAIL_FROM`, `MAKE_WEBHOOK_SECRET` |

Supabase auth email is **not** an env var on Vercel. Only app-sent mail (GreetQ `/api/make/outreach`) uses Vercel `RESEND_API_KEY`.

### Supabase SMTP (all apps) — quick ref

| Field | Value |
|-------|--------|
| Host | `smtp.resend.com` |
| Port | `465` |
| Username | `resend` |
| Password | Resend API key `re_...` |
| Sender | `hello@ratelocal.ca` / `hello@greetq.com` (domain must be **Verified** in Resend) |

Then: Authentication → Providers → Email → **Confirm email ON**.

Full RateLocal steps: `reviewflow/SMTP_SETUP.md`

---

## Two ways to run GreetQ email marketing

| Approach | Best for |
|----------|----------|
| **Make scenario ON** (Sheet → HTTP) | Runs 24/7 without Cursor open |
| **Make MCP in Cursor** | You ask the agent to trigger a run ad hoc |

Both can call the same GreetQ API from PR #59.
