import Stripe from "stripe";
import { PRICING } from "./plans";

export function isStripeConfigured(): boolean {
  return !!(
    process.env.STRIPE_SECRET_KEY &&
    (process.env.STRIPE_PRICE_MONTHLY || process.env.STRIPE_PRICE_SETUP)
  );
}

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function stripePriceIds() {
  return {
    setup: process.env.STRIPE_PRICE_SETUP || "",
    monthly: process.env.STRIPE_PRICE_MONTHLY || "",
  };
}

/** Human-readable pricing for UI when Stripe Price IDs are not set yet */
export function pricingLabel() {
  return `$${PRICING.setupUsd} setup + $${PRICING.monthlyUsd}/mo`;
}
