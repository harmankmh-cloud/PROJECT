# Connect Supabase MCP in Cursor (Option A)

**ServeLocal** project ref: **`avytxgfkncpacqewnrvz`**  
(RateLocal uses a separate project: `otnddwopphhxstteqizw`)

Once connected, the agent can run SQL, check auth config, read logs, and apply fixes **without** you running scripts manually.

---

## Fastest path (recommended)

1. Open Supabase dashboard MCP connect page:  
   https://supabase.com/dashboard/project/avytxgfkncpacqewnrvz?showConnect=true&tab=mcp

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
  "url": "https://mcp.supabase.com/mcp?project_ref=avytxgfkncpacqewnrvz"
}
```

**Important:** use the `project_ref` from **your** Supabase dashboard MCP tab. Without it, OAuth can fail.

---

## Agent skills (optional, installed in repo)

```bash
npx skills add supabase/agent-skills
```

Adds:

- `.agents/skills/supabase` — Supabase workflows (auth, RLS, MCP, migrations)
- `.agents/skills/supabase-postgres-best-practices` — Postgres tuning

Symlinked into `.cursor/skills/` for Cursor. Re-run the command above to update.

---

## Error: `client_id: Required, response_type: Required, redirect_uri: Required`

This JSON means the browser hit Supabase’s OAuth authorize endpoint **without query parameters**.

### Fix (try in order)

1. **Reload Cursor** after pulling `.cursor/mcp.json` (must include `project_ref=avytxgfkncpacqewnrvz`).

2. **Disconnect and reconnect** in Settings → Tools & MCP.

3. **View → Output → MCP: Supabase** → copy the **full** authorize URL (with `client_id`, `response_type`, `redirect_uri`) → open in Chrome/Safari.

---

## Option B — PAT header (when OAuth keeps failing)

1. Create a token: https://supabase.com/dashboard/account/tokens

2. In `.cursor/mcp.json`:

```json
"supabase": {
  "url": "https://mcp.supabase.com/mcp?project_ref=avytxgfkncpacqewnrvz",
  "headers": {
    "Authorization": "Bearer sbp_YOUR_TOKEN_HERE"
  }
}
```

3. Save → restart Cursor.

---

## Verify it worked

In a **new** chat:

> Run SQL: `select email, email_confirmed_at, last_sign_in_at from auth.users order by created_at desc limit 5`

You should get real rows — not “needsAuth”.

---

## Cloud agents

After Supabase is green in **Cursor Desktop**, start a **fresh** cloud agent task so it inherits your MCP auth.
