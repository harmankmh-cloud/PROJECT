import "server-only";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe";

export type PlanKey = "starter" | "growth" | "pro" | "enterprise";

const PLAN_HINTS: Record<PlanKey, { patterns: RegExp[]; amountCents: number }> = {
  starter: { patterns: [/starter/i, /voiceagent starter/i], amountCents: 7900 },
  growth: { patterns: [/growth/i, /voiceagent growth/i], amountCents: 19900 },
  pro: { patterns: [/pro/i, /voiceagent pro/i], amountCents: 39900 },
  enterprise: {
    patterns: [/enterprise/i, /voiceagent enterprise/i],
    amountCents: 150000,
  },
};

const LOOKUP_KEYS: Record<PlanKey, string> = {
  starter: "voiceagent_starter_monthly",
  growth: "voiceagent_growth_monthly",
  pro: "voiceagent_pro_monthly",
  enterprise: "voiceagent_enterprise_monthly",
};

export type ResolvedStripePrices = Record<PlanKey, string>;

function fromEnv(): Partial<ResolvedStripePrices> {
  return {
    starter: process.env.STRIPE_PRICE_STARTER_MONTHLY || undefined,
    growth: process.env.STRIPE_PRICE_GROWTH_MONTHLY || undefined,
    pro: process.env.STRIPE_PRICE_PRO_MONTHLY || undefined,
    enterprise: process.env.STRIPE_PRICE_ENTERPRISE_MONTHLY || undefined,
  };
}

function matchPlan(
  productName: string,
  amountCents: number | null | undefined
): PlanKey | null {
  for (const [plan, hint] of Object.entries(PLAN_HINTS) as Array<
    [PlanKey, (typeof PLAN_HINTS)[PlanKey]]
  >) {
    if (hint.patterns.some((p) => p.test(productName))) return plan;
    if (amountCents === hint.amountCents) return plan;
  }
  return null;
}

/** Resolve monthly price IDs from env or Stripe product catalog. */
export async function resolveStripePriceIds(): Promise<ResolvedStripePrices> {
  const env = fromEnv();
  const resolved: Partial<ResolvedStripePrices> = { ...env };

  const missing = (["starter", "growth", "pro", "enterprise"] as PlanKey[]).filter(
    (p) => !resolved[p]?.startsWith("price_")
  );

  if (!missing.length) {
    return resolved as ResolvedStripePrices;
  }

  const stripe = getStripe();
  if (!stripe) {
    return {
      starter: env.starter || "",
      growth: env.growth || "",
      pro: env.pro || "",
      enterprise: env.enterprise || "",
    };
  }

  // Try lookup_key first (if prices were created with our keys).
  for (const plan of missing) {
    try {
      const prices = await stripe.prices.list({
        lookup_keys: [LOOKUP_KEYS[plan]],
        active: true,
        limit: 1,
      });
      const id = prices.data[0]?.id;
      if (id) resolved[plan] = id;
    } catch {
      // lookup_keys may be unsupported on older API versions — fall through.
    }
  }

  const stillMissing = (["starter", "pro", "enterprise"] as PlanKey[]).filter(
    (p) => !resolved[p]?.startsWith("price_")
  );

  if (!stillMissing.length) {
    return resolved as ResolvedStripePrices;
  }

  const prices = await stripe.prices.list({
    active: true,
    type: "recurring",
    limit: 100,
    expand: ["data.product"],
  });

  for (const price of prices.data) {
    if (price.type !== "recurring" || price.recurring?.interval !== "month") continue;

    const product = price.product as Stripe.Product | string;
    const productName =
      typeof product === "string" ? "" : product.name || product.metadata?.plan || "";

    const plan = matchPlan(productName, price.unit_amount);
    if (!plan || resolved[plan]?.startsWith("price_")) continue;

    resolved[plan] = price.id;
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
