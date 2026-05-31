import "server-only";

import type Stripe from "stripe";

export type StripePriceValidation = {
  ok: boolean;
  errors: string[];
};

export async function validateCheckoutPrices(
  stripe: Stripe,
  setupPriceId: string,
  monthlyPriceId: string
): Promise<StripePriceValidation> {
  const errors: string[] = [];

  try {
    const [setup, monthly] = await Promise.all([
      stripe.prices.retrieve(setupPriceId),
      stripe.prices.retrieve(monthlyPriceId),
    ]);

    if (setup.type !== "one_time") {
      errors.push(
        "STRIPE_PRICE_SETUP must be a one-time price ($99 setup). In Stripe → Product catalog → open Setup → price must say One time, not Recurring."
      );
    }

    if (monthly.type !== "recurring") {
      errors.push(
        "STRIPE_PRICE_MONTHLY must be a recurring monthly price ($39/mo). In Stripe → Product catalog → open Pro → price must say Recurring → Monthly."
      );
    }

    if (!setup.active) {
      errors.push("STRIPE_PRICE_SETUP is inactive in Stripe. Open the price and set it to Active.");
    }

    if (!monthly.active) {
      errors.push("STRIPE_PRICE_MONTHLY is inactive in Stripe. Open the price and set it to Active.");
    }
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not read Stripe prices";
    if (message.includes("No such price")) {
      errors.push(
        "Stripe price ID not found. Check STRIPE_PRICE_SETUP and STRIPE_PRICE_MONTHLY in Vercel env vars match your Stripe account (test vs live keys must match)."
      );
    } else {
      errors.push(message);
    }
  }

  return { ok: errors.length === 0, errors };
}
