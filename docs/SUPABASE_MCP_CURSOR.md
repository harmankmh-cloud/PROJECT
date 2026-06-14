# Connect Supabase MCP in Cursor (Option A)

Project ref: **`otnddwopphhxstteqizw`** (shared RateLocal + ServeLocal)

Once connected, the agent can run SQL, check auth config, read logs, and apply fixes **without** you running scripts manually.

---

## Fastest path (recommended)

1. Open Supabase dashboard MCP connect page for your project:  
   https://supabase.com/dashboard/project/otnddwopphhxstteqizw?showConnect=true&tab=mcp

2. Click **Add to Cursor** (or copy the config shown there).

3. In **Cursor Desktop** → **Settings** → **Tools & MCP** → find **Supabase**.

4. Click **Connect** or **Needs authentication** under the server name.

5. Browser opens → log in to Supabase → pick the org that owns this project → **Authorize**.

6. Back in Cursor, Supabase should show **green** with ~29 tools enabled.

7. **Start a new agent chat** (or restart Cursor if tools don’t appear).

---

## Manual config (already in repo)

This repo includes Supabase in `.cursor/mcp.json`:

```json
"supabase": {
  "url": "https://mcp.supabase.com/mcp?project_ref=otnddwopphhxstteqizw"
}
```

**Important:** include `project_ref` in the URL. Without it, Cursor’s OAuth handshake can fail or open an incomplete authorize URL.

If it’s missing in your Cursor UI, paste the block above via **Settings → MCP → Add custom MCP**.

---

## Error: `client_id: Required, response_type: Required, redirect_uri: Required`

This JSON means the browser hit Supabase’s OAuth authorize endpoint **without query parameters** — not a wrong password.

Common causes:

1. **Bare URL opened** — e.g. `https://api.supabase.com/v1/oauth/authorize` with no `?client_id=...&response_type=...&redirect_uri=...`
2. **Stale MCP session** — Cursor cached a broken OAuth attempt
3. **Missing `project_ref`** in the MCP URL (fixed in this repo’s `.cursor/mcp.json`)

### Fix (try in order)

1. **Reload Cursor** after pulling the updated `.cursor/mcp.json` (must include `project_ref=otnddwopphhxstteqizw`).

2. **Disconnect and reconnect:**
   - Settings → Tools & MCP → Supabase → **Disconnect** (or remove server)
   - Add again using the dashboard link above, or paste the config from this doc
   - Click **Connect** once — wait for the full OAuth URL

3. **Use the full URL from logs** (not a truncated one):
   - **View → Output** → dropdown → **MCP: Supabase** (or **Cursor MCP**)
   - Click **Connect** again
   - Copy the URL that starts with:  
     `https://api.supabase.com/v1/oauth/authorize?client_id=...&response_type=code&redirect_uri=...`
   - Paste into **Chrome/Safari** (not the embedded Cursor browser)
   - Complete login → approve

4. Click the **“Needs authentication”** text under Supabase (not only the Connect button).

---

## Option B — PAT header (when OAuth keeps failing)

Cursor supports custom headers on HTTP MCP servers. Use a **Personal Access Token** instead of OAuth:

1. Create a token: https://supabase.com/dashboard/account/tokens  
   Name it e.g. `Cursor MCP` (never commit the token).

2. Replace the Supabase block in `.cursor/mcp.json` (or add via Settings):

```json
"supabase": {
  "url": "https://mcp.supabase.com/mcp?project_ref=otnddwopphhxstteqizw",
  "headers": {
    "Authorization": "Bearer sbp_YOUR_TOKEN_HERE"
  }
}
```

3. Save → restart Cursor → Supabase should show green without a browser OAuth step.

Optional: add `&read_only=true` to the URL if you only want read-only SQL.

---

## Option C — npx stdio server (alternative)

From [Supabase docs](https://supabase.com/docs/guides/ai-tools/mcp):

```json
"supabase": {
  "command": "npx",
  "args": [
    "-y",
    "@supabase/mcp-server-supabase@latest",
    "--project-ref=otnddwopphhxstteqizw"
  ],
  "env": {
    "SUPABASE_ACCESS_TOKEN": "sbp_YOUR_TOKEN_HERE"
  }
}
```

Use this if the HTTP + OAuth path is unreliable in your Cursor version.

---

## If OAuth fails (“authorization request does not exist”)

Same as above — use the full authorize URL from **View → Output → MCP: Supabase**, or switch to **Option B (PAT)**.

---

## Verify it worked

In a **new** chat, ask the agent:

> List Supabase MCP tools / run SQL: `select email, email_confirmed_at, last_sign_in_at from auth.users order by created_at desc limit 5`

If Supabase is connected, you’ll get real rows — not “needsAuth”.

---

## Cloud agents

Cloud agents use **your** Cursor MCP auth. After you connect Supabase in Cursor Desktop on your account, **new cloud agent runs** should see Supabase as ready.

If a cloud run still says `needsAuth`:

- Re-authorize in Desktop Settings → MCP (or use PAT in `.cursor/mcp.json`)
- Start a **fresh** cloud agent task (don’t resume an old one)

---

## What the agent will do after connect

1. Run `006_auth_db_hardening.sql` checks / apply missing pieces  
2. Enable leaked password protection + percentage DB conn via Management API  
3. Verify auth redirect URLs for ServeLocal  
4. Inspect `user_repeated_signup` / verify errors in auth logs  
5. Confirm RLS vs grants for any remaining 403s  

No merge PRs — direct Supabase + code fixes.
