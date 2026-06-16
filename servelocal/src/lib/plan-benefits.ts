import type { ListingTier, ServiceProvider } from "@/lib/types";
import { isFeaturedTier } from "@/lib/schemas/db/normalize";

export type PlanBenefit = {
  id: string;
  label: string;
  /** Shown on marketing + pro dashboard */
  starter: boolean | "partial";
  featured: boolean;
  premium: boolean;
};

/** What each tier actually delivers in code today — keep in sync with product. */
export const PLAN_BENEFITS: PlanBenefit[] = [
  {
    id: "listing",
    label: "Public profile with phone & WhatsApp",
    starter: true,
    featured: true,
    premium: true,
  },
  {
    id: "directory",
    label: "Listed in city + category pages",
    starter: true,
    featured: true,
    premium: true,
  },
  {
    id: "lead_preview",
    label: "Job lead previews in dashboard",
    starter: true,
    featured: true,
    premium: true,
  },
  {
    id: "lead_contact",
    label: "Full homeowner phone & email on leads",
    starter: false,
    featured: true,
    premium: true,
  },
  {
    id: "lead_email",
    label: "Priority job alert emails",
    starter: "partial",
    featured: true,
    premium: true,
  },
  {
    id: "placement",
    label: "Top placement in search results",
    starter: false,
    featured: true,
    premium: true,
  },
  {
    id: "homepage",
    label: "Homepage featured carousel",
    starter: false,
    featured: true,
    premium: true,
  },
  {
    id: "portfolio",
    label: "Portfolio photos on profile",
    starter: false,
    featured: true,
    premium: true,
  },
  {
    id: "verified",
    label: "Verified badge (team review after license check)",
    starter: false,
    featured: true,
    premium: true,
  },
];

export function portfolioLimitForTier(tier?: ListingTier | null) {
  if (tier === "premium") return 10;
  if (tier === "featured") return 3;
  return 0;
}

export function benefitActiveForProvider(
  benefitId: string,
  provider: Pick<ServiceProvider, "listing_tier" | "featured" | "verified">
) {
  const tier = provider.listing_tier ?? "free";
  const paid = isFeaturedTier(tier) || provider.featured;

  switch (benefitId) {
    case "listing":
    case "directory":
    case "lead_preview":
      return true;
    case "lead_contact":
    case "placement":
    case "homepage":
    case "portfolio":
      return paid;
    case "lead_email":
      return paid ? true : "partial";
    case "verified":
      return Boolean(provider.verified);
    default:
      return false;
  }
}

export function benefitsForTier(tier: ListingTier) {
  return PLAN_BENEFITS.filter((b) => {
    const val = b[tier === "free" ? "starter" : tier];
    return val === true || val === "partial";
  });
}

export function lockedBenefitsForTier(tier: ListingTier) {
  if (tier !== "free") return [];
  return PLAN_BENEFITS.filter((b) => b.starter !== true);
}
