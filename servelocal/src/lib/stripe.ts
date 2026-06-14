import Stripe from "stripe";

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY?.trim());
}

export function getStripe() {
  const key = process.env.STRIPE_SECRET_KEY?.trim();
  if (!key) return null;
  return new Stripe(key);
}

export function stripePriceForPlan(plan: "featured" | "premium") {
  if (plan === "featured") return process.env.STRIPE_PRICE_FEATURED?.trim() || "";
  return process.env.STRIPE_PRICE_PREMIUM?.trim() || "";
}
