# CallLocal setup (missed-call SMS)

CallLocal lives inside RateLocal: **Dashboard → CallLocal** (`/dashboard/calls`).

When a customer calls your Twilio number and you don't answer within ~22 seconds, they get an **automatic SMS** (and you can get a text too).

CallLocal is a paid **$10/mo add-on**. Customers subscribe themselves from
**Dashboard → CallLocal** (it's added to their existing plan via Stripe). Live
call routing only happens once a business has an active CallLocal subscription
(`businesses.calllocal_subscribed`).

---

## 0. Stripe add-on price

1. In **Stripe → Product catalog**, create a recurring **$10/mo (CAD)** price for CallLocal.
2. Copy its **Price ID** (`price_…`) into `STRIPE_PRICE_CALLLOCAL` (Vercel env + `.env.local`).
3. If `STRIPE_PRICE_CALLLOCAL` is blank, the add-on cannot be purchased.

---

## 1. Run SQL in Supabase

Open **Supabase → SQL Editor** and run:

`supabase/calllocal.sql`

(For an existing database, also run `supabase/migration-calllocal-addon.sql` to add the `calllocal_subscribed` column.)

---

## 2. Twilio account

1. Sign up at [twilio.com](https://www.twilio.com)
2. Buy a **Canadian local number** (Voice + SMS)
3. Copy **Account SID** and **Auth Token**

---

## 3. Vercel environment variables

Add to **Vercel → project → Environment Variables**:

| Variable | Example |
|----------|---------|
| `TWILIO_ACCOUNT_SID` | `ACxxxxxxxx` |
| `TWILIO_AUTH_TOKEN` | your secret token |

(Redeploy after saving.)

---

## 4. Point Twilio webhooks to RateLocal

For **each business phone number** in Twilio:

| Setting | URL |
|---------|-----|
| **Voice → A call comes in** | `https://ratelocal.ca/api/twilio/voice/incoming` (POST) |
| **Messaging → A message comes in** | `https://ratelocal.ca/api/twilio/sms/incoming` (POST) |

Use your real domain (or Vercel preview URL while testing).

---

## 5. Enable a business

### Admin (you)

1. **Admin → All businesses → Manage**
2. Scroll to **CallLocal (admin)**
3. Enter **Twilio number** (+1…) and **owner cell** to ring
4. Check **Enabled** → Save

### Owner

1. **Dashboard → CallLocal**
2. Confirm cell number and SMS message
3. Turn on **missed-call SMS**
4. **Forward shop phone** to the CallLocal Twilio number (or give customers that number)

---

## 6. SMS template placeholders

| Placeholder | Replaced with |
|-------------|----------------|
| `{business_name}` | Shop name |
| `{link}` | RateLocal review page URL |
| `{caller_phone}` | Caller's number |

---

## 7. Costs (rough)

| Item | Cost |
|------|------|
| Twilio CA number | ~$1–2 CAD/mo |
| Outbound SMS | ~$0.01–0.02 each |
| Voice minutes | Small while testing |

Charge shops **$79–99/mo** so you cover Twilio + profit.

---

## 8. Canada (CASL)

Missed-call SMS to someone who **just called you** is usually treated as **transactional** — still include a way to opt out if you add marketing later.

---

## Phase 2 (not built yet)

- AI voice answering (Vapi / Retell)
- Stripe billing for CallLocal-only plan
- Auto-buy Twilio numbers from admin
