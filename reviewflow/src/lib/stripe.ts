import "server-only";

import Stripe from "stripe";
import { getStripeConfigStatus, isStripeConfigured } from "./stripe-config";

export { getStripeConfigStatus, isStripeConfigured };

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
