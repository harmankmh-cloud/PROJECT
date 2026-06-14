import "server-only";
import Stripe from "stripe";

export function getStripe(): Stripe | null {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) return null;
  return new Stripe(key);
}

export function isStripeConfigured() {
  return Boolean(process.env.STRIPE_SECRET_KEY);
}

export function stripePriceIds() {
  return {
    starter: process.env.STRIPE_PRICE_STARTER_MONTHLY || "",
    growth: process.env.STRIPE_PRICE_GROWTH_MONTHLY || "",
    pro: process.env.STRIPE_PRICE_PRO_MONTHLY || "",
    enterprise: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || "",
    voiceMinutes: process.env.STRIPE_METER_VOICE_MINUTES || "",
  };
}

export function planFromStripePriceId(
  priceId: string | undefined | null
): "starter" | "growth" | "pro" | "enterprise" {
  const prices = stripePriceIds();
  if (!priceId) return "starter";
  if (priceId === prices.enterprise) return "enterprise";
  if (priceId === prices.pro) return "pro";
  if (priceId === prices.growth) return "growth";
  if (priceId === prices.starter) return "starter";
  return "starter";
}

export function stripeMeterEventName() {
  return (
    process.env.STRIPE_METER_EVENT_NAME ||
    process.env.STRIPE_METER_VOICE_MINUTES ||
    "voice_minutes"
  );
}

export async function reportVoiceMinutes(
  stripeCustomerId: string,
  minutes: number
) {
  const stripe = getStripe();
  const meterEventName = stripeMeterEventName();

  if (!stripe) return { ok: false };

  try {
    await stripe.billing.meterEvents.create({
      event_name: meterEventName,
      payload: {
        stripe_customer_id: stripeCustomerId,
        value: String(minutes),
      },
    });
    return { ok: true };
  } catch {
    return { ok: false };
  }
}
