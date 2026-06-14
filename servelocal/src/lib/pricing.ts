import { FOUNDING_PRO } from "@/lib/tradie-program";

/** ServeLocal pro listing prices — Stripe featured should match foundingMonthlyUsd during launch. */
export const SERVELOCAL_PRICING = {
  starter: {
    monthlyUsd: 0,
    label: "Free forever",
  },
  featured: {
    foundingMonthlyUsd: 29,
    regularMonthlyUsd: 49,
    foundingLabel: FOUNDING_PRO.featuredPrice,
    regularLabel: FOUNDING_PRO.featuredRegular,
    duration: FOUNDING_PRO.duration,
    spotsPerCity: FOUNDING_PRO.spotsPerCity,
  },
  premium: {
    monthlyUsd: 99,
    /** Early stage: sell Featured + free Starter; Premium is waitlist-only in UI. */
    waitlistOnly: true,
  },
  competitors: {
    thumbtackLead: "$25–75 per shared lead",
    homeStars: "$299+/mo",
  },
} as const;

export function featuredPriceLabel(): string {
  return SERVELOCAL_PRICING.featured.foundingLabel;
}
