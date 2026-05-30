export type StripeConfigStatus = {
  secretKey: boolean;
  setupPrice: boolean;
  monthlyPrice: boolean;
  webhookSecret: boolean;
  serviceRole: boolean;
  ready: boolean;
  webhookReady: boolean;
  missing: string[];
};

export function getStripeConfigStatus(): StripeConfigStatus {
  const secretKey = !!process.env.STRIPE_SECRET_KEY;
  const setupPrice = !!process.env.STRIPE_PRICE_SETUP;
  const monthlyPrice = !!process.env.STRIPE_PRICE_MONTHLY;
  const webhookSecret = !!process.env.STRIPE_WEBHOOK_SECRET;
  const serviceRole = !!process.env.SUPABASE_SERVICE_ROLE_KEY;

  const missing: string[] = [];
  if (!secretKey) missing.push("STRIPE_SECRET_KEY");
  if (!setupPrice) missing.push("STRIPE_PRICE_SETUP");
  if (!monthlyPrice) missing.push("STRIPE_PRICE_MONTHLY");
  if (!webhookSecret) missing.push("STRIPE_WEBHOOK_SECRET");
  if (!serviceRole) missing.push("SUPABASE_SERVICE_ROLE_KEY");

  const ready = secretKey && setupPrice && monthlyPrice;
  const webhookReady = ready && webhookSecret && serviceRole;

  return {
    secretKey,
    setupPrice,
    monthlyPrice,
    webhookSecret,
    serviceRole,
    ready,
    webhookReady,
    missing,
  };
}

export function isStripeConfigured(): boolean {
  return getStripeConfigStatus().ready;
}
