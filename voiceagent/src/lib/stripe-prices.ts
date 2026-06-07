import "server-only";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";
import { PLANS, type PlanKey } from "@/lib/plans";

export type { PlanKey };

/**
 * Stripe price IDs by mode (created via Stripe MCP + scripts/stripe-setup.mjs).
 * Used when env vars are unset — lets checkout work after linking Stripe.
 */
export const DEFAULT_STRIPE_PRICES = {
  test: {
    starter: "price_1TZ051L7y7NO9O2k7XP3QSvw",
    growth: "price_1TZ05DL7y7NO9O2kr6QtbCcU",
    pro: "price_1Tfmk9DwgNgi4Q9V6Z4YF51C",
    enterprise: "price_1Tfmk9DwgNgi4Q9V81XVvQ0n",
  },
  live: {
    starter: "price_1Tfmk8DwgNgi4Q9Vq0L2V9jF",
    growth: "price_1TfmkDDwgNgi4Q9VGyRNRset",
    pro: "price_1Tfmk9DwgNgi4Q9V6Z4YF51C",
    enterprise: "price_1Tfmk9DwgNgi4Q9V81XVvQ0n",
  },
} as const;

function defaultPricesForKey(): Record<PlanKey, string> {
  const key = process.env.STRIPE_SECRET_KEY || "";
  return key.startsWith("sk_live_") ? DEFAULT_STRIPE_PRICES.live : DEFAULT_STRIPE_PRICES.test;
}

const PLAN_HINTS: Record<PlanKey, { patterns: RegExp[]; amountCents: number }> = {
  starter: { patterns: [/starter/i, /voiceagent starter/i, /intellivo starter/i], amountCents: PLANS.starter.monthlyPrice * 100 },
  growth: { patterns: [/growth/i, /voiceagent growth/i, /intellivo growth/i], amountCents: PLANS.growth.monthlyPrice * 100 },
  pro: { patterns: [/pro/i, /voiceagent pro/i, /intellivo pro/i], amountCents: PLANS.pro.monthlyPrice * 100 },
  enterprise: {
    patterns: [/enterprise/i, /voiceagent enterprise/i, /intellivo enterprise/i],
    amountCents: PLANS.enterprise.monthlyPrice * 100,
  },
};

const LOOKUP_KEYS: Record<PlanKey, string> = {
  starter: "voiceagent_starter_monthly",
  growth: "voiceagent_growth_monthly",
  pro: "voiceagent_pro_monthly",
  enterprise: "voiceagent_enterprise_monthly",
};

export type ResolvedStripePrices = Record<PlanKey, string>;

const ALL_PLANS: PlanKey[] = ["starter", "growth", "pro", "enterprise"];

function fromEnv(): Partial<ResolvedStripePrices> {
  return {
    starter: process.env.STRIPE_PRICE_STARTER_MONTHLY || undefined,
    growth: process.env.STRIPE_PRICE_GROWTH_MONTHLY || undefined,
    pro: process.env.STRIPE_PRICE_PRO_MONTHLY || undefined,
    enterprise: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || undefined,
  };
}

function isValidPriceId(value: string | undefined): value is string {
  return !!value && value.startsWith("price_");
}

function matchPlan(productName: string, amountCents: number | null | undefined): PlanKey | null {
  for (const [plan, hint] of Object.entries(PLAN_HINTS) as Array<[PlanKey, (typeof PLAN_HINTS)[PlanKey]]>) {
    if (amountCents === hint.amountCents) return plan;
  }
  for (const [plan, hint] of Object.entries(PLAN_HINTS) as Array<[PlanKey, (typeof PLAN_HINTS)[PlanKey]]>) {
    if (hint.patterns.some((p) => p.test(productName))) return plan;
  }
  return null;
}

/** Resolve monthly price IDs from env, Stripe catalog, or baked-in live defaults. */
export async function resolveStripePriceIds(): Promise<ResolvedStripePrices> {
  const env = fromEnv();
  const resolved: Partial<ResolvedStripePrices> = { ...env };

  const missing = ALL_PLANS.filter((p) => !isValidPriceId(resolved[p]));

  if (!missing.length) {
    return resolved as ResolvedStripePrices;
  }

  const stripe = getStripe();
  if (stripe) {
    for (const plan of missing) {
      try {
        const prices = await stripe.prices.list({
          lookup_keys: [LOOKUP_KEYS[plan]],
          active: true,
          limit: 1,
        });
        const id = prices.data[0]?.id;
        if (isValidPriceId(id)) resolved[plan] = id;
      } catch {
        // lookup_keys may be unsupported on older API versions — fall through.
      }
    }

    const stillMissing = ALL_PLANS.filter((p) => !isValidPriceId(resolved[p]));

    if (stillMissing.length) {
      const prices = await stripe.prices.list({
        active: true,
        type: "recurring",
        limit: 100,
        expand: ["data.product"],
      });

      // Prefer exact amount matches before name-only matches.
      const byAmount = new Map<PlanKey, string>();
      const byName = new Map<PlanKey, string>();

      for (const price of prices.data) {
        if (price.type !== "recurring" || price.recurring?.interval !== "month") continue;

        const product = price.product as Stripe.Product | string;
        const productName =
          typeof product === "string" ? "" : product.name || product.metadata?.plan || "";

        const plan = matchPlan(productName, price.unit_amount);
        if (!plan || !stillMissing.includes(plan)) continue;

        if (price.unit_amount === PLAN_HINTS[plan].amountCents) {
          byAmount.set(plan, price.id);
        } else if (!byName.has(plan)) {
          byName.set(plan, price.id);
        }
      }

      for (const plan of stillMissing) {
        const id = byAmount.get(plan) || byName.get(plan);
        if (isValidPriceId(id)) resolved[plan] = id;
      }
    }
  }

  const defaults = defaultPricesForKey();
  for (const plan of ALL_PLANS) {
    if (!isValidPriceId(resolved[plan]) && isValidPriceId(defaults[plan])) {
      resolved[plan] = defaults[plan];
    }
  }

  return {
    starter: resolved.starter || "",
    growth: resolved.growth || "",
    pro: resolved.pro || "",
    enterprise: resolved.enterprise || "",
  };
}

export function planFromResolvedPrices(
  priceId: string | undefined | null,
  prices: ResolvedStripePrices
): PlanKey {
  if (!priceId) return "starter";
  if (priceId === prices.enterprise) return "enterprise";
  if (priceId === prices.pro) return "pro";
  if (priceId === prices.growth) return "growth";
  if (priceId === prices.starter) return "starter";
  return "starter";
}
