# Cursor tools setup (Figma + Datadog)

Figma and Datadog are **already configured in this project**. You only need to connect them once on your Mac.

---

## Easiest way (no command search needed)

### Step 1 — Quit and reopen Cursor

1. Press **Cmd + Q** (hold Command, tap Q) — this fully quits Cursor
2. Open **Cursor** again from your Applications folder or Dock
3. Open your **PROJECT** folder

That replaces “Reload Window” — you do **not** need to search for Developer commands.

### Step 2 — Connect Figma + Datadog (click only)

1. Click the **gear icon** ⚙ in Cursor (bottom-left or top-right)
2. Click **Tools & MCP** (or **MCP**)
3. Find **figma** → click **Connect** → sign in in the browser
4. Find **datadog** → click **Connect** → sign in in the browser

Done. No command palette needed.

---

## If you still want the command palette

Press **Cmd + Shift + P**, then try typing only:

- **reload** (pick anything that says “Reload Window”)
- **mcp** (pick “Cursor Settings: Tools & MCP”)

If nothing shows up, use **Cmd + Q** and reopen Cursor instead — that always works.

---

## Google review link (in RateLocal — not Cursor)

When you log into **ratelocal.ca/dashboard** without a Google link, a **popup appears automatically**. Paste your Google “Write a review” link and click **Save**.

You can also click **Fill in popup →** on the dashboard checklist anytime.

---

## Datadog on your live site (optional)

Add these in **Vercel → Settings → Environment Variables**, then Redeploy:

| Variable | Where to get it |
|----------|-----------------|
| `NEXT_PUBLIC_DATADOG_APPLICATION_ID` | Datadog → UX Monitoring → RUM → Create app |
| `NEXT_PUBLIC_DATADOG_CLIENT_TOKEN` | Same screen → Client Token |
| `NEXT_PUBLIC_DATADOG_SITE` | `datadoghq.com` |

---

## Quick test

- **Figma:** Ask in Cursor chat — *“List my Figma files”*
- **Datadog:** Ask — *“Show recent errors in Datadog”*
- **Google popup:** Go to [ratelocal.ca/dashboard](https://ratelocal.ca/dashboard) — popup should appear if Google link is missing
