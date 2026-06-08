# GreetQ email outreach via Make.com (2 modules)

GreetQ writes the cold email (AI) and sends via Resend. **Make only moves data** — no OpenAI or Resend modules needed in Make.

## One-time setup (10 min)

### 1. Vercel env (greetq.com project)

| Variable | Value |
|----------|--------|
| `MAKE_WEBHOOK_SECRET` | Long random string (e.g. `openssl rand -hex 32`) |
| `RESEND_API_KEY` | From [resend.com](https://resend.com) |
| `EMAIL_FROM` | `Harman from GreetQ <hello@greetq.com>` |
| `OPENROUTER_API_KEY` | Optional — better copy; templates work without it |

Redeploy after saving.

### 2. Google Sheet — `GreetQ Leads`

| business_name | email | city | vertical | contact_name | send |
|---------------|-------|------|----------|--------------|------|
| Pacific Dental | owner@example.com | Abbotsford | dental | | FALSE |

Set `send` to **TRUE** when you want Make to actually email them.

### 3. Make scenario (2 modules)

**Module 1 — Google Sheets: Watch New Rows**

- Spreadsheet: your `GreetQ Leads` sheet

**Module 2 — HTTP: Make a request**

- **URL:** `https://greetq.com/api/make/outreach`
- **Method:** POST
- **Headers:**
  - `Authorization` → `Bearer YOUR_MAKE_WEBHOOK_SECRET`
  - `Content-Type` → `application/json`
- **Body type:** Raw / JSON:

```json
{
  "business_name": "{{1.business_name}}",
  "email": "{{1.email}}",
  "city": "{{1.city}}",
  "vertical": "{{1.vertical}}",
  "contact_name": "{{1.contact_name}}",
  "send": {{1.send}}
}
```

For `send`, map the column as boolean, or use `"send": true` only on rows you approve.

**Optional — preview to yourself first:**

```json
{
  "business_name": "{{1.business_name}}",
  "email": "{{1.email}}",
  "city": "{{1.city}}",
  "vertical": "{{1.vertical}}",
  "send": true,
  "preview_to": "harmankmh@gmail.com"
}
```

**Module 3 (optional) — Google Sheets: Update Row**

- Write returned `subject` and `body` back to the sheet

Turn scenario **ON**. Add a row → email goes out.

## Test without Make

```bash
curl -s -X POST https://greetq.com/api/make/outreach \
  -H "Authorization: Bearer YOUR_MAKE_WEBHOOK_SECRET" \
  -H "Content-Type: application/json" \
  -d '{
    "business_name": "Test Dental",
    "email": "you@gmail.com",
    "city": "Abbotsford",
    "vertical": "dental",
    "send": false
  }'
```

Returns `{ "subject", "body" }`. Set `"send": true` to send.

## Follow-ups

Run the same HTTP call with `"sequence": "followup_1"` or `"followup_2"` on a schedule (Make **Schedule** → search rows sent 3 days ago → HTTP).

## Verticals that work well

`dental`, `hvac`, `plumbing`, `salon`, `spa`, `clinic`, `legal`, `home_services`
