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
  "url": "https://mcp.supabase.com/mcp"
}
```

If it’s missing in your Cursor UI, paste the block above via **Settings → MCP → Add custom MCP**.

---

## If OAuth fails (“authorization request does not exist”)

Common Cursor bug. Try this:

1. **View → Output** → dropdown → **MCP: Supabase** (or **Cursor MCP**).

2. Click **Connect** again in Settings → MCP.

3. Copy the URL from logs that starts with:  
   `https://api.supabase.com/v1/oauth/authorize?...`

4. Paste that URL into **Chrome/Safari** (not the embedded Cursor browser).

5. Complete login → approve → wait for Cursor to show green.

Alternative: click the **“Needs authentication”** text under Supabase (not only the Connect button).

---

## Verify it worked

In a **new** chat, ask the agent:

> List Supabase MCP tools / run SQL: `select email, email_confirmed_at, last_sign_in_at from auth.users order by created_at desc limit 5`

If Supabase is connected, you’ll get real rows — not “needsAuth”.

---

## Cloud agents

Cloud agents use **your** Cursor MCP auth. After you connect Supabase in Cursor Desktop on your account, **new cloud agent runs** should see Supabase as ready.

If a cloud run still says `needsAuth`:

- Re-authorize in Desktop Settings → MCP
- Start a **fresh** cloud agent task (don’t resume an old one)

---

## What the agent will do after connect

1. Run `006_auth_db_hardening.sql` checks / apply missing pieces  
2. Enable leaked password protection + percentage DB conn via Management API  
3. Verify auth redirect URLs for ServeLocal  
4. Inspect `user_repeated_signup` / verify errors in auth logs  
5. Confirm RLS vs grants for any remaining 403s  

No merge PRs — direct Supabase + code fixes.
