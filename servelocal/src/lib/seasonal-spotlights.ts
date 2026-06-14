export type SeasonalSpotlight = {
  slug: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  gradient: string;
  emoji: string;
};

const SPOTLIGHTS: Record<string, SeasonalSpotlight[]> = {
  winter: [
    {
      slug: "snow-removal",
      title: "Snow Removal",
      description: "Keep your driveway clear this winter. Book vetted pros who show up when it matters.",
      cta: "Find snow removal pros",
      href: "/surrey/snow-removal",
      gradient: "from-sky-600 to-blue-800",
      emoji: "❄️",
    },
    {
      slug: "hvac",
      title: "Furnace & Heating",
      description: "Don't wait for a cold snap. Schedule furnace tune-ups and heating repairs now.",
      cta: "Book HVAC pros",
      href: "/surrey/hvac",
      gradient: "from-amber-500 to-orange-700",
      emoji: "🔥",
    },
    {
      slug: "plumber",
      title: "Frozen Pipe Prevention",
      description: "Protect your pipes before they burst. Local plumbers ready for emergency calls.",
      cta: "Find plumbers",
      href: "/surrey/plumber",
      gradient: "from-cyan-500 to-teal-700",
      emoji: "🔧",
    },
  ],
  spring: [
    {
      slug: "landscaper",
      title: "Spring Landscaping",
      description: "Refresh your yard after winter. Lawn care, garden beds, and outdoor cleanup.",
      cta: "Find landscapers",
      href: "/surrey/landscaper",
      gradient: "from-green-500 to-emerald-700",
      emoji: "🌿",
    },
    {
      slug: "painter",
      title: "Exterior Painting",
      description: "Perfect season for curb appeal. Get quotes from top-rated painters near you.",
      cta: "Find painters",
      href: "/surrey/painter",
      gradient: "from-amber-400 to-rose-500",
      emoji: "🎨",
    },
    {
      slug: "cleaner",
      title: "Spring Deep Clean",
      description: "Start fresh with a professional deep clean. Book in minutes.",
      cta: "Find cleaners",
      href: "/surrey/cleaner",
      gradient: "from-sky-400 to-indigo-600",
      emoji: "✨",
    },
  ],
  summer: [
    {
      slug: "hvac-ac",
      title: "AC Repair & Install",
      description: "Beat the heat. Fast AC service from verified HVAC pros across Canada.",
      cta: "Book AC repair",
      href: "/surrey/hvac",
      gradient: "from-cyan-400 to-blue-600",
      emoji: "❄️",
    },
    {
      slug: "landscaper",
      title: "Lawn & Garden Care",
      description: "Weekly mowing, irrigation, and garden maintenance from local experts.",
      cta: "Find landscapers",
      href: "/surrey/landscaper",
      gradient: "from-lime-500 to-green-700",
      emoji: "🌻",
    },
    {
      slug: "painter",
      title: "Deck & Fence Staining",
      description: "Protect outdoor wood before winter. Pros who do it right the first time.",
      cta: "Find painters",
      href: "/surrey/painter",
      gradient: "from-amber-500 to-yellow-600",
      emoji: "🪵",
    },
  ],
  fall: [
    {
      slug: "roofer",
      title: "Roof Inspection",
      description: "Check for damage before winter storms. Free quotes from certified roofers.",
      cta: "Find roofers",
      href: "/surrey/roofer",
      gradient: "from-slate-600 to-stone-800",
      emoji: "🏠",
    },
    {
      slug: "gutter",
      title: "Gutter Cleaning",
      description: "Clear leaves before they clog. Prevent water damage with local pros.",
      cta: "Book gutter cleaning",
      href: "/surrey/handyman",
      gradient: "from-amber-600 to-orange-800",
      emoji: "🍂",
    },
    {
      slug: "hvac",
      title: "Furnace Tune-Up",
      description: "Get ahead of heating season. Annual maintenance from trusted HVAC pros.",
      cta: "Book furnace service",
      href: "/surrey/hvac",
      gradient: "from-red-500 to-orange-700",
      emoji: "🔥",
    },
  ],
};

function getSeason(month: number): keyof typeof SPOTLIGHTS {
  if (month === 11 || month === 0 || month === 1) return "winter";
  if (month >= 2 && month <= 4) return "spring";
  if (month >= 5 && month <= 7) return "summer";
  return "fall";
}

export function getSeasonalSpotlights(date = new Date()): SeasonalSpotlight[] {
  return SPOTLIGHTS[getSeason(date.getMonth())];
}
