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
    pro: process.env.STRIPE_PRICE_PRO_MONTHLY || "",
    enterprise: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || "",
    voiceMinutes: process.env.STRIPE_METER_VOICE_MINUTES || "",
  };
}

export async function reportVoiceMinutes(
  stripeCustomerId: string,
  minutes: number
) {
  const stripe = getStripe();
  const meterEventName = process.env.STRIPE_METER_EVENT_NAME || "voice_minutes";

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
