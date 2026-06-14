#!/usr/bin/env node
/**
 * GreetQ Stripe setup helper — base plans, billing meter, overage price, webhooks.
 * Usage: STRIPE_SECRET_KEY=sk_test_... node scripts/stripe-setup.mjs
 */
import Stripe from "stripe";

const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://greetq.com";
const WEBHOOK_URL = `${APP_URL.replace(/\/$/, "")}/api/webhooks/stripe`;
const LEGACY_WEBHOOK_URLS = [
  "https://voiceagent-indol.vercel.app/api/webhooks/stripe",
];

const PLANS = [
  { key: "starter", name: "GreetQ Starter", amount: 7900, lookup: "voiceagent_starter_monthly" },
  { key: "growth", name: "GreetQ Growth", amount: 19900, lookup: "voiceagent_growth_monthly" },
  { key: "pro", name: "GreetQ Pro", amount: 39900, lookup: "voiceagent_pro_monthly" },
  { key: "enterprise", name: "GreetQ Enterprise", amount: 150000, lookup: "voiceagent_enterprise_monthly" },
];

const METER_EVENT_NAME = process.env.STRIPE_METER_EVENT_NAME || "voice_minutes";
const OVERAGE_LOOKUP = "greetq_voice_overage_metered";

const EVENTS = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.created",
  "invoice.paid",
  "invoice.payment_failed",
];

async function ensureMeter(stripe) {
  const existing = await stripe.billing.meters.list({ limit: 20 });
  let meter = existing.data.find((m) => m.event_name === METER_EVENT_NAME);

  if (!meter) {
    meter = await stripe.billing.meters.create({
      display_name: "GreetQ voice minutes",
      event_name: METER_EVENT_NAME,
      default_aggregation: { formula: "sum" },
      customer_mapping: {
        type: "by_id",
        event_payload_key: "stripe_customer_id",
      },
      value_settings: { event_payload_key: "value" },
    });
    console.log(`\n✓ Created billing meter: ${meter.event_name} (${meter.id})`);
  } else {
    console.log(`\n✓ Billing meter exists: ${meter.event_name} (${meter.id})`);
  }

  console.log(`  → STRIPE_METER_EVENT_NAME=${METER_EVENT_NAME}`);
  return meter;
}

async function ensureOveragePrice(stripe, meter) {
  try {
    const byLookup = await stripe.prices.list({
      lookup_keys: [OVERAGE_LOOKUP],
      active: true,
      limit: 1,
    });
    if (byLookup.data[0]?.id) {
      console.log(`\n✓ Overage metered price: ${byLookup.data[0].id}`);
      console.log(`  → STRIPE_METER_VOICE_MINUTES=${byLookup.data[0].id}`);
      return byLookup.data[0].id;
    }
  } catch {
    // lookup_keys may fail on older API versions
  }

  const product = await stripe.products.create({
    name: "GreetQ Voice Overage",
    metadata: { type: "voice_overage" },
  });

  const price = await stripe.prices.create({
    product: product.id,
    currency: "usd",
    billing_scheme: "per_unit",
    recurring: {
      interval: "month",
      usage_type: "metered",
      meter: meter.id,
    },
    unit_amount: 25,
    lookup_key: OVERAGE_LOOKUP,
    transfer_lookup_key: true,
    metadata: { note: "Default $0.25/min — tier per plan is enforced in app before reporting" },
  });

  console.log(`\n✓ Created overage metered price: ${price.id} ($0.25/unit default)`);
  console.log(`  → STRIPE_METER_VOICE_MINUTES=${price.id}`);
  return price.id;
}

async function main() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error("Set STRIPE_SECRET_KEY first.");
    process.exit(1);
  }

  const stripe = new Stripe(key);
  const found = {};

  const prices = await stripe.prices.list({ active: true, type: "recurring", limit: 100, expand: ["data.product"] });

  for (const price of prices.data) {
    if (price.recurring?.interval !== "month") continue;
    if (price.recurring?.usage_type === "metered") continue;
    const product = price.product;
    const name = typeof product === "object" ? product.name : "";
    for (const plan of PLANS) {
      if (found[plan.key]) continue;
      if (name.toLowerCase().includes(plan.key) || price.unit_amount === plan.amount) {
        found[plan.key] = price.id;
      }
    }
  }

  console.log("\n=== GreetQ Stripe base prices ===\n");
  for (const plan of PLANS) {
    const id = found[plan.key];
    console.log(`${plan.key}: ${id || "NOT FOUND — create product in Stripe Dashboard"}`);
    if (id) {
      console.log(`  → STRIPE_PRICE_${plan.key.toUpperCase()}_MONTHLY=${id}`);
    }
  }

  const meter = await ensureMeter(stripe);
  await ensureOveragePrice(stripe, meter);

  const existing = await stripe.webhookEndpoints.list({ limit: 20 });
  let endpoint = existing.data.find((e) => e.url === WEBHOOK_URL);

  for (const legacyUrl of LEGACY_WEBHOOK_URLS) {
    const legacy = existing.data.find((e) => e.url === legacyUrl && e.status !== "disabled");
    if (legacy) {
      await stripe.webhookEndpoints.update(legacy.id, { disabled: true });
      console.log(`\n✓ Disabled legacy webhook: ${legacyUrl}`);
    }
  }

  if (!endpoint) {
    endpoint = await stripe.webhookEndpoints.create({
      url: WEBHOOK_URL,
      enabled_events: EVENTS,
      description: "GreetQ billing",
    });
    console.log(`\n✓ Created webhook: ${WEBHOOK_URL}`);
  } else {
    await stripe.webhookEndpoints.update(endpoint.id, {
      enabled_events: EVENTS,
      disabled: false,
      description: "GreetQ billing",
    });
    console.log(`\n✓ Webhook already exists: ${WEBHOOK_URL}`);
  }

  console.log("\n=== Add to Vercel env ===\n");
  console.log(`STRIPE_SECRET_KEY=${key.slice(0, 12)}...`);
  console.log(`STRIPE_WEBHOOK_SECRET=${endpoint.secret}`);
  console.log(`STRIPE_METER_EVENT_NAME=${METER_EVENT_NAME}`);
  for (const plan of PLANS) {
    if (found[plan.key]) {
      console.log(`STRIPE_PRICE_${plan.key.toUpperCase()}_MONTHLY=${found[plan.key]}`);
    }
  }
  console.log("\nThen redeploy Vercel (or wait for auto-deploy).");
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
