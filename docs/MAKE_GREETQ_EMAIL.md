# GreetQ email outreach via Make.com (2 modules)

GreetQ writes the cold email (AI) and sends via **Resend or Brevo** (your choice). **Make / Activepieces only moves data** — no OpenAI or email modules needed there.

## Email provider (pick one — both have free tiers)

| Provider | Free tier | Best for |
|----------|-----------|----------|
| **Resend** | 3,000 emails/month, 1 domain | You already have an account — verify `greetq.com` once |
| **Brevo** | ~300 emails/day | Extra headroom if you outgrow Resend |

Set **only one** API key in Vercel. Optional: `EMAIL_PROVIDER=resend` or `EMAIL_PROVIDER=brevo` to force which one wins if both are set.

**Zero-cost fallback:** use `"send": false` (or Activepieces `mode: "draft"`) and copy the AI draft into Gmail manually — no API key needed.

### Brevo setup (alternative to Resend)

1. Sign up at [brevo.com](https://www.brevo.com) (free).
2. **SMTP & API** → create API key.
3. **Senders** → add and verify `hello@greetq.com` (DNS records, same idea as Resend).
4. In Vercel: `BREVO_API_KEY=...`, `EMAIL_PROVIDER=brevo`, remove or leave `RESEND_API_KEY` empty.

## One-time setup (10 min)

### 1. Vercel env (greetq.com project)

| Variable | Value |
|----------|--------|
| `MAKE_WEBHOOK_SECRET` | Long random string (e.g. `openssl rand -hex 32`) |
| `RESEND_API_KEY` **or** `BREVO_API_KEY` | From [resend.com](https://resend.com) or [brevo.com](https://www.brevo.com) |
| `EMAIL_PROVIDER` | Optional: `resend` or `brevo` |
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
