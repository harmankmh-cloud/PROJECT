/**
 * Single source for RateLocal marketing prices.
 * Stripe checkout always uses PRICING.monthlyUsd from lib/plans.ts ($39/mo today).
 */
import { PRICING as BILLING } from "@/lib/plans";

export const RATELOCAL_PRO_MONTHLY = BILLING.monthlyUsd;

/** Yearly total when paying annually (2 months free vs monthly). */
export const RATELOCAL_PRO_ANNUAL_TOTAL = RATELOCAL_PRO_MONTHLY * 10;

/** Rounded per-month equivalent for annual display. */
export const RATELOCAL_PRO_ANNUAL_PER_MONTH = Math.round(RATELOCAL_PRO_ANNUAL_TOTAL / 12);

export const RATELOCAL_COMPETITORS = {
  niceJob: 75,
  podium: 399,
} as const;

export const RATELOCAL_CHECKOUT_NOTE =
  `Checkout bills $${RATELOCAL_PRO_MONTHLY}/mo via Stripe — no setup fee.`;

export function proDisplayPrice(annual: boolean): number {
  return annual ? RATELOCAL_PRO_ANNUAL_PER_MONTH : RATELOCAL_PRO_MONTHLY;
}

export function proPriceSuffix(annual: boolean, tierKey: string): string {
  if (tierKey !== "pro") return tierKey === "free" ? "" : "/mo";
  if (annual) return "/mo equiv.";
  return "/mo";
}

export function proAnnualFootnote(annual: boolean, tierKey: string): string | null {
  if (!annual || tierKey !== "pro") return null;
  return `Billed $${RATELOCAL_PRO_ANNUAL_TOTAL}/year — save $${RATELOCAL_PRO_MONTHLY * 12 - RATELOCAL_PRO_ANNUAL_TOTAL} vs monthly. Contact us to switch to annual billing.`;
}
