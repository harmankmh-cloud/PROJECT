#!/usr/bin/env node
/**
 * RateLocal Stripe setup helper — push-button.
 *
 * Creates (or finds) the $39/mo recurring price and the production webhook,
 * then prints the exact env vars to paste into Vercel.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_live_... node scripts/stripe-setup.mjs
 *
 * Setup fee is waived by default. To also create a one-time setup price, run:
 *   STRIPE_SECRET_KEY=sk_live_... SETUP_FEE_CENTS=9900 node scripts/stripe-setup.mjs
 */
import Stripe from "stripe";

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://ratelocal.ca").replace(/\/$/, "");
const WEBHOOK_URL = `${APP_URL}/api/stripe/webhook`;

const MONTHLY_CENTS = Number(process.env.MONTHLY_CENTS || 3900);
const MONTHLY_LOOKUP = "ratelocal_monthly";
const SETUP_FEE_CENTS = Number(process.env.SETUP_FEE_CENTS || 0);
const SETUP_LOOKUP = "ratelocal_setup";

const EVENTS = [
  "checkout.session.completed",
  "customer.subscription.updated",
  "customer.subscription.deleted",
];

async function findOrCreateRecurringPrice(stripe, { name, lookup, amount }) {
  // Prefer lookup_key.
  try {
    const byLookup = await stripe.prices.list({ lookup_keys: [lookup], active: true, limit: 1 });
    if (byLookup.data[0]) return byLookup.data[0];
  } catch {
    // older API — ignore
  }
  // Match an existing active monthly price by amount.
  const existing = await stripe.prices.list({ active: true, type: "recurring", limit: 100, expand: ["data.product"] });
  const match = existing.data.find(
    (p) => p.recurring?.interval === "month" && p.unit_amount === amount
  );
  if (match) return match;

  const product = await stripe.products.create({ name });
  return stripe.prices.create({
    product: product.id,
    unit_amount: amount,
    currency: "cad",
    recurring: { interval: "month" },
    lookup_key: lookup,
  });
}

async function findOrCreateOneTimePrice(stripe, { name, lookup, amount }) {
  try {
    const byLookup = await stripe.prices.list({ lookup_keys: [lookup], active: true, limit: 1 });
    if (byLookup.data[0]) return byLookup.data[0];
  } catch {
    // ignore
  }
  const existing = await stripe.prices.list({ active: true, type: "one_time", limit: 100 });
  const match = existing.data.find((p) => p.unit_amount === amount);
  if (match) return match;

  const product = await stripe.products.create({ name });
  return stripe.prices.create({
    product: product.id,
    unit_amount: amount,
    currency: "cad",
    lookup_key: lookup,
  });
}

async function main() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error("Set STRIPE_SECRET_KEY first.");
    process.exit(1);
  }
  const stripe = new Stripe(key);
  const live = key.startsWith("sk_live_");

  console.log(`\n=== RateLocal Stripe setup (${live ? "LIVE" : "TEST"} mode) ===\n`);

  const monthly = await findOrCreateRecurringPrice(stripe, {
    name: "RateLocal Pro",
    lookup: MONTHLY_LOOKUP,
    amount: MONTHLY_CENTS,
  });
  console.log(`Monthly ($${(MONTHLY_CENTS / 100).toFixed(2)}/mo): ${monthly.id}`);

  let setup = null;
  if (SETUP_FEE_CENTS > 0) {
    setup = await findOrCreateOneTimePrice(stripe, {
      name: "RateLocal Setup",
      lookup: SETUP_LOOKUP,
      amount: SETUP_FEE_CENTS,
    });
    console.log(`Setup ($${(SETUP_FEE_CENTS / 100).toFixed(2)} one-time): ${setup.id}`);
  } else {
    console.log("Setup fee: waived (skipping setup price)");
  }

  const existing = await stripe.webhookEndpoints.list({ limit: 20 });
  let endpoint = existing.data.find((e) => e.url === WEBHOOK_URL);
  if (!endpoint) {
    endpoint = await stripe.webhookEndpoints.create({
      url: WEBHOOK_URL,
      enabled_events: EVENTS,
      description: "RateLocal billing",
    });
    console.log(`\n✓ Created webhook: ${WEBHOOK_URL}`);
  } else {
    await stripe.webhookEndpoints.update(endpoint.id, { enabled_events: EVENTS, disabled: false });
    console.log(`\n✓ Webhook already exists: ${WEBHOOK_URL}`);
  }

  console.log("\n=== Add to Vercel env (then redeploy) ===\n");
  console.log(`STRIPE_SECRET_KEY=${key.slice(0, 12)}...`);
  console.log(`STRIPE_PRICE_MONTHLY=${monthly.id}`);
  if (setup) console.log(`STRIPE_PRICE_SETUP=${setup.id}`);
  if (endpoint.secret) console.log(`STRIPE_WEBHOOK_SECRET=${endpoint.secret}`);
  console.log("");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
