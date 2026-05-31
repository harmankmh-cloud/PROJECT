# Cursor tools setup (Figma + Datadog + Graphify)

Figma and Datadog need a one-time connect on your Mac. **Graphify is already done** in this repo — it helps the AI use less memory and fewer tokens.

---

## Graphify (less tokens — already in the repo)

Graphify turns your codebase into a compact **map** so the AI reads that instead of every file.

**Already set up for you — no install needed:**
- Code map is in `graphify-out/` (committed to GitHub)
- Cursor rule in `.cursor/rules/graphify.mdc`

After `git pull`, Cursor uses the map automatically. **You can skip all Graphify install steps.**

### Optional: refresh the map on your Mac

Only if you changed lots of code and want to rebuild locally.

**If `pip install graphifyy` fails** (common on Python 3.14+), ignore it — the repo already has the map.

Working install (needs Python 3.10–3.13):

```bash
python3 --version   # must NOT be 3.14+
pip install graphifyy
graphify update .
```

Or use Homebrew Python 3.12:

```bash
brew install python@3.12
/opt/homebrew/opt/python@3.12/bin/python3.12 -m pip install graphifyy
/opt/homebrew/opt/python@3.12/bin/python3.12 -m graphify update .
```

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
