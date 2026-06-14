# Stripe setup for ReviewFlow

Pricing: **$39/month — no setup fee** (annual: $390/yr, 2 months free)

> The one-time setup fee is waived by default (`SETUP_FEE_ENABLED` in
> `src/lib/plans.ts`). You only need the monthly price below. To re-enable a
> setup fee, set `setupCents` > 0 in `plans.ts` and add `STRIPE_PRICE_SETUP`.

## 1. Create Stripe account

1. Go to https://dashboard.stripe.com/register
2. Keep **Test mode** ON (top-right toggle) while testing on your Mac

## 2. Create the monthly price

**Product catalog → Add product**

| Product | Price | Billing |
|---------|-------|---------|
| ReviewFlow Pro | $39 | Recurring → Monthly |

Copy the **Price ID** (`price_...`) into `STRIPE_PRICE_MONTHLY`.

## 3. Add keys to `.env.local`

```bash
cd ~/PROJECT/reviewflow
cp env.local.template .env.local
open -e .env.local
```

Paste:

```bash
STRIPE_SECRET_KEY=sk_test_...
STRIPE_PRICE_MONTHLY=price_...
# STRIPE_PRICE_SETUP=price_...   # only needed if you re-enable a setup fee
```

Get secret key: Stripe Dashboard → Developers → API keys

## 4. Webhook (activates Pro plan after payment)

**Terminal 1** — keep app running:

```bash
npm run smooth
```

**Terminal 2** — forward webhooks:

```bash
npm run stripe:webhook
```

Copy the `whsec_...` line into `.env.local`:

```bash
STRIPE_WEBHOOK_SECRET=whsec_...
```

Restart the app.

## 5. Enable Customer Portal

Stripe Dashboard → Settings → Billing → Customer portal → **Activate**

## 6. Check config

```bash
npm run stripe:check
```

## 7. Test payment

1. Log in as a business owner (not admin)
2. Go to **My plan** → `/dashboard/billing`
3. Click **Upgrade**
4. Test card: `4242 4242 4242 4242`, any future date, any CVC

After payment, plan should show **Pro** with **500 reviews/month**.

## Live deploy (Vercel + ratelocal.ca)

1. Vercel → Project → Settings → Environment Variables — add all Stripe keys
2. Use **live** keys (`sk_live_...`) and **live** price IDs when ready for real cards
3. Stripe Dashboard → Developers → Webhooks → Add endpoint:
   - URL: `https://ratelocal.ca/api/stripe/webhook`
   - Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`
4. Copy signing secret → Vercel `STRIPE_WEBHOOK_SECRET` → Redeploy
5. Stripe Dashboard → Settings → Billing → Customer portal → **Activate**
6. Test mode card (Test mode only): `4242 4242 4242 4242`
