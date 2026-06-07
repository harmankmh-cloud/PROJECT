# ServeLocal Stripe setup

Products and prices live in your Stripe account (CAD, live mode).

| Plan | Product | Price ID | Amount |
|------|---------|----------|--------|
| Featured Pro (Founding) | ServeLocal Featured Pro | `price_1TfqEmDwgNgi4Q9VQFBboTBH` | $29 CAD/mo |
| Premium Elite | ServeLocal Premium Elite | `price_1TfqEmDwgNgi4Q9VLf3Vyrn6` | $99 CAD/mo |

## Vercel env (`project-pqhe`)

```
STRIPE_SECRET_KEY=sk_live_...        # same key as RateLocal
STRIPE_PRICE_FEATURED=price_1TfqEmDwgNgi4Q9VQFBboTBH
STRIPE_PRICE_PREMIUM=price_1TfqEmDwgNgi4Q9VLf3Vyrn6
STRIPE_WEBHOOK_SECRET=whsec_...      # from Stripe webhook endpoint
```

Webhook URL: `https://www.servelocal.ca/api/stripe/webhook`

Events: `checkout.session.completed`, `customer.subscription.updated`, `customer.subscription.deleted`

When a pro pays, their listing tier updates automatically (`featured` or `premium`).

## Test flow

1. Apply at `/join` with email → sign up same email
2. Admin approves listing
3. Pro dashboard → **Upgrade — $29/mo**
4. Stripe Checkout → pay with test/live card
5. Webhook fires → listing becomes Featured

## Billing portal

Paid pros can cancel or update payment at **Manage billing** on `/dashboard/pro`.  
Uses Stripe Customer Portal (same Stripe account). Enable at:  
https://dashboard.stripe.com/settings/billing/portal

## Upgrade emails

On successful checkout, the pro gets a confirmation email and `ADMIN_EMAILS` get a revenue alert.
