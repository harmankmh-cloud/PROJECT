/** Live Stripe monthly price for RateLocal Pro (CAD $39/mo). */
export const DEFAULT_LIVE_STRIPE_PRICE_MONTHLY = "price_1TfmkXDwgNgi4Q9Vl48M1TSE";

/** Test-mode monthly price (matches sk_test_... keys). */
export const DEFAULT_TEST_STRIPE_PRICE_MONTHLY = "price_1Tfmt8L7y7NO9O2ktEDaa8ND";

export function defaultStripePriceMonthly(): string {
  const key = process.env.STRIPE_SECRET_KEY || "";
  return key.startsWith("sk_live_")
    ? DEFAULT_LIVE_STRIPE_PRICE_MONTHLY
    : DEFAULT_TEST_STRIPE_PRICE_MONTHLY;
}
