#!/usr/bin/env node
/**
 * Ensure ServeLocal Stripe Customer Portal configuration exists.
 *
 * Usage:
 *   STRIPE_SECRET_KEY=sk_live_... node scripts/stripe-portal-setup.mjs
 */
import Stripe from "stripe";

const APP_URL = (process.env.NEXT_PUBLIC_APP_URL || "https://www.servelocal.ca").replace(/\/$/, "");

async function main() {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) {
    console.error("Set STRIPE_SECRET_KEY first.");
    process.exit(1);
  }

  const stripe = new Stripe(key);
  const live = key.startsWith("sk_live_");
  console.log(`\n=== ServeLocal billing portal (${live ? "LIVE" : "TEST"}) ===\n`);

  const existing = await stripe.billingPortal.configurations.list({ limit: 10 });
  const active = existing.data.find((c) => c.active);
  if (active) {
    console.log(`✓ Active configuration already exists: ${active.id}`);
    return;
  }

  const config = await stripe.billingPortal.configurations.create({
    name: "ServeLocal default",
    default_return_url: `${APP_URL}/dashboard/pro`,
    business_profile: {
      headline: "Manage your ServeLocal plan",
      privacy_policy_url: `${APP_URL}/privacy`,
      terms_of_service_url: `${APP_URL}/terms`,
    },
    features: {
      customer_update: { enabled: true, allowed_updates: ["email"] },
      payment_method_update: { enabled: true },
      invoice_history: { enabled: true },
      subscription_cancel: {
        enabled: true,
        mode: "at_period_end",
        cancellation_reason: {
          enabled: true,
          options: ["too_expensive", "missing_features", "switched_service", "unused", "other"],
        },
      },
      subscription_update: { enabled: false },
    },
  });

  console.log(`✓ Created billing portal configuration: ${config.id}`);
}

main().catch((err) => {
  console.error(err.message || err);
  process.exit(1);
});
