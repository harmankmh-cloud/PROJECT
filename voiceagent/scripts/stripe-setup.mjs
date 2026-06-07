#!/usr/bin/env node
/**
 * VoiceAgent Stripe setup helper.
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

const EVENTS = [
  "checkout.session.completed",
  "customer.subscription.created",
  "customer.subscription.updated",
  "customer.subscription.deleted",
  "invoice.created",
];

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
    const product = price.product;
    const name = typeof product === "object" ? product.name : "";
    for (const plan of PLANS) {
      if (found[plan.key]) continue;
      if (name.toLowerCase().includes(plan.key) || price.unit_amount === plan.amount) {
        found[plan.key] = price.id;
      }
    }
  }

  console.log("\n=== VoiceAgent Stripe prices ===\n");
  for (const plan of PLANS) {
    const id = found[plan.key];
    console.log(`${plan.key}: ${id || "NOT FOUND — create product in Stripe Dashboard"}`);
    if (id) {
      console.log(`  → STRIPE_PRICE_${plan.key.toUpperCase()}_MONTHLY=${id}`);
    }
  }

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
