# Cursor tools setup (Figma + Datadog)

These tools are **pre-configured in this repo**. After you pull the latest code, you only need to **connect** them once in Cursor on your Mac.

---

## Step 1 — Pull latest code

In Terminal (or let Cursor sync Git):

```bash
git pull origin main
```

---

## Step 2 — Reload Cursor

1. Press **Cmd + Shift + P**
2. Type **Developer: Reload Window**
3. Press **Enter**

---

## Step 3 — Connect Figma + Datadog in Cursor

1. Press **Cmd + Shift + P**
2. Run **Cursor Settings: Tools & MCP**
3. You should see **figma** and **datadog** listed (from this project’s config)
4. Click **Connect** / **Authenticate** on each one
5. Sign in when the browser opens

**Figma:** needs a free [figma.com](https://figma.com) account  
**Datadog:** needs a free trial at [datadoghq.com](https://www.datadoghq.com) (US site → `datadoghq.com`)

---

## Step 4 — Datadog on your live site (ratelocal.ca)

The app is already wired for Datadog monitoring. Add these in **Vercel → Settings → Environment Variables**:

| Variable | Where to get it |
|----------|-----------------|
| `NEXT_PUBLIC_DATADOG_APPLICATION_ID` | Datadog → UX Monitoring → RUM Applications → Create app → Application ID |
| `NEXT_PUBLIC_DATADOG_CLIENT_TOKEN` | Same screen → Client Token |
| `NEXT_PUBLIC_DATADOG_SITE` | `datadoghq.com` (US/Canada) or `datadoghq.eu` (Europe) |

Then **Redeploy** on Vercel.

After that, errors and page visits from ratelocal.ca show up in Datadog, and I can help you search them in chat once Datadog MCP is connected.

---

## Quick test

**Figma connected?** Ask in Cursor chat: *“List my Figma files”*

**Datadog connected?** Ask: *“Show recent errors in Datadog”*

**Site sending data?** Datadog → UX Monitoring → Sessions (after Vercel env vars + redeploy)

---

## Still not working?

1. Make sure you opened the **PROJECT** folder in Cursor (not just a single file)
2. Reload window again (**Cmd + Shift + P** → Reload Window)
3. Reply with a screenshot of **Tools & MCP** showing figma and datadog status
