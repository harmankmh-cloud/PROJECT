import { SETUP_FEE_ENABLED } from "@/lib/plans";
import { DEFAULT_LIVE_STRIPE_PRICE_MONTHLY, defaultStripePriceMonthly } from "@/lib/stripe-defaults";

export type StripeConfigStatus = {
  secretKey: boolean;
  setupPrice: boolean;
  monthlyPrice: boolean;
  setupPriceValid: boolean;
  monthlyPriceValid: boolean;
  webhookSecret: boolean;
  serviceRole: boolean;
  ready: boolean;
  webhookReady: boolean;
  missing: string[];
  invalid: string[];
};

function isPriceId(value: string | undefined): boolean {
  return !!value && value.startsWith("price_");
}

export function validateStripePriceEnv(name: string, value: string | undefined): string | null {
  if (!value) return `${name} is missing`;
  if (value.startsWith("prod_")) {
    return `${name} must be a Price ID (price_...), not a Product ID (prod_...). In Stripe, open the product → click the price → copy Price ID.`;
  }
  if (!value.startsWith("price_")) {
    return `${name} must start with price_`;
  }
  return null;
}

export function getStripeConfigStatus(): StripeConfigStatus {
  const secretKey = !!process.env.STRIPE_SECRET_KEY;
  const setupRaw = process.env.STRIPE_PRICE_SETUP;
  const monthlyRaw = process.env.STRIPE_PRICE_MONTHLY || defaultStripePriceMonthly();
  const setupPrice = !!setupRaw;
  const monthlyPrice = !!monthlyRaw;
  const setupPriceValid = isPriceId(setupRaw);
  const monthlyPriceValid = isPriceId(monthlyRaw);
  const webhookSecret = !!process.env.STRIPE_WEBHOOK_SECRET;
  const serviceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  const missing: string[] = [];
  const invalid: string[] = [];
  if (!secretKey) missing.push("STRIPE_SECRET_KEY");
  if (SETUP_FEE_ENABLED && !setupPrice) missing.push("STRIPE_PRICE_SETUP");
  if (!monthlyPrice) missing.push("STRIPE_PRICE_MONTHLY");
  if (!webhookSecret) missing.push("STRIPE_WEBHOOK_SECRET");
  if (!serviceRole) missing.push("SUPABASE_SERVICE_ROLE_KEY");

  // Only validate the setup price when a setup fee is actually charged.
  if (SETUP_FEE_ENABLED) {
    const setupErr = validateStripePriceEnv("STRIPE_PRICE_SETUP", setupRaw);
    if (setupErr) invalid.push(setupErr);
  }
  const monthlyErr = validateStripePriceEnv("STRIPE_PRICE_MONTHLY", monthlyRaw);
  if (monthlyErr) invalid.push(monthlyErr);

  const ready =
    secretKey && monthlyPriceValid && (SETUP_FEE_ENABLED ? setupPriceValid : true);
  const webhookReady = ready && webhookSecret && serviceRole;

  return {
    secretKey,
    setupPrice,
    monthlyPrice,
    setupPriceValid,
    monthlyPriceValid,
    webhookSecret,
    serviceRole,
    ready,
    webhookReady,
    missing,
    invalid,
  };
}

export function isStripeConfigured(): boolean {
  return getStripeConfigStatus().ready;
}
