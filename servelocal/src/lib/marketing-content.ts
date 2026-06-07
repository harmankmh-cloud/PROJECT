import { EXTENDED_COST_GUIDES } from "@/lib/extended-catalog";

export const COMPANY = {
  email: "hello@servelocal.ca",
  address: "Fraser Valley, British Columbia, Canada",
} as const;

export const POPULAR_SEARCHES = [
  { label: "Plumber in Surrey", href: "/search?q=plumber+surrey" },
  { label: "Electrician Langley", href: "/search?q=electrician+langley" },
  { label: "House cleaning", href: "/search?q=cleaner" },
  { label: "HVAC repair", href: "/search?q=hvac" },
  { label: "Handyman Abbotsford", href: "/search?q=handyman+abbotsford" },
  { label: "Roofer Chilliwack", href: "/search?q=roofer+chilliwack" },
] as const;

export const WHY_SERVELOCAL = [
  {
    title: "No per-lead fees",
    body: "Homeowners post jobs free. Pros pay one flat monthly rate — not $25–75 every time someone clicks call.",
  },
  {
    title: "BC-focused directory",
    body: "Fraser Valley and Metro Vancouver cities only — local pros, local pricing guides, local reviews.",
  },
  {
    title: "Call direct",
    body: "Tap phone or WhatsApp on a pro profile. Agree scope and price with the tradie you choose — no middleman.",
  },
] as const;

/** Extended copy for cost guide SEO pages (300+ words total per guide). */
export const GUIDE_EXTENDED: Record<
  string,
  {
    intro: string;
    factors: string[];
    timeline: string;
    hiring: string[];
    faqs: { q: string; a: string }[];
  }
> = {
  plumber: {
    intro:
      "Plumbing rates in the Fraser Valley and Metro Vancouver vary by job type, urgency, and whether the work needs a permit. Most licensed plumbers charge a service call or trip fee plus labour. Emergency and after-hours calls typically cost more than scheduled weekday visits.",
    factors: [
      "Emergency vs scheduled appointment",
      "Permit requirements for water heater or repiping work",
      "Accessibility (crawl spaces, multi-unit buildings)",
      "Materials supplied by homeowner vs pro",
    ],
    timeline: "Simple repairs often same-day; water heater installs usually 1–2 days with scheduling.",
    hiring: [
      "Confirm BC licence number and ask for proof of liability insurance",
      "Get a written quote for jobs over $500",
      "Ask if dispatch fee applies before the truck rolls",
    ],
    faqs: [
      { q: "Do I need a licensed plumber in BC?", a: "Yes for most regulated plumbing work. Verify licence status before hiring." },
      { q: "Why do quotes vary so much?", a: "Scope, access, materials, and warranty terms differ. Compare written quotes, not phone estimates." },
    ],
  },
  electrician: {
    intro:
      "Electricians in BC charge by the hour or by project for panel upgrades, EV chargers, and commercial work. Licensed work should include permit pull where required. Rates are higher in Metro Vancouver than some Fraser Valley towns but travel fees apply either way.",
    factors: ["Panel age and amperage", "Permit and inspection fees", "Conduit runs and wall access", "EV charger hardware vs install-only"],
    timeline: "Outlet or fixture swaps: half day. Panel upgrades: 1–3 days plus inspection scheduling.",
    hiring: [
      "Verify BC electrical licence",
      "Confirm permit responsibility in writing",
      "Ask about warranty on labour vs parts",
    ],
    faqs: [
      { q: "Can a handyman change an outlet?", a: "Regulated electrical work requires a licensed electrician in BC." },
      { q: "EV charger install cost?", a: "Often $800–$2,500 depending on panel capacity and wire run length." },
    ],
  },
  handyman: {
    intro:
      "Handymen are ideal for small repairs, assembly, and patch work — but know when you need a ticketed trade. Hourly rates are lower than plumbers or electricians, but large projects should still be quoted in writing.",
    factors: ["Skill mix (drywall vs carpentry vs general)", "Materials included or not", "Minimum visit charges"],
    timeline: "Most handyman visits are 2–4 hours; larger projects quoted separately.",
    hiring: [
      "Clarify whether work needs a licensed trade",
      "Set a not-to-exceed hourly cap for open-ended jobs",
      "Check references for similar work",
    ],
    faqs: [
      { q: "Handyman vs contractor?", a: "Handymen suit small jobs; structural or permitted work needs the right licence." },
      { q: "Do handymen carry insurance?", a: "Ask for proof — not all general handymen carry liability coverage." },
    ],
  },
  cleaner: {
    intro:
      "House cleaning in BC is usually priced per hour or flat rate by home size. Deep cleans, move-out cleans, and carpet steaming add cost. Many teams bring supplies; confirm what's included.",
    factors: ["Home size and condition", "Deep vs maintenance clean", "Pets and extra bathrooms", "Frequency discounts for recurring service"],
    timeline: "Standard cleans: 2–4 hours. Move-out cleans may need a full day.",
    hiring: ["Ask about bonded/insured teams", "Clarify products used if you have allergies", "Do a walkthrough for first visit"],
    faqs: [
      { q: "Tip cleaners in BC?", a: "Optional but appreciated for recurring teams — not required." },
      { q: "Move-out clean cost?", a: "Often $250–$450 depending on size and appliances." },
    ],
  },
  hvac: {
    intro:
      "HVAC pricing covers furnace tune-ups, AC installs, and emergency no-heat calls. Fall tune-ups are cheaper than winter emergencies. Replacement systems are quoted by tonnage, efficiency rating, and ductwork condition.",
    factors: ["Equipment brand and efficiency (SEER/AFUE)", "Duct modifications", "Emergency vs scheduled", "Thermostat upgrades"],
    timeline: "Tune-ups: 1–2 hours. Full AC or furnace replacement: 1–2 days.",
    hiring: [
      "Use licensed gas fitters for furnace work",
      "Compare warranty on parts and labour",
      "Get load calculation for new AC sizing",
    ],
    faqs: [
      { q: "Best time for furnace tune-up?", a: "Early fall before heating season — lower rates and easier scheduling." },
      { q: "AC install range?", a: "Often $4,000–$8,000+ for residential systems in BC." },
    ],
  },
  roofer: {
    intro:
      "Roofing is almost always project-priced, not hourly. Leak repairs, shingle replacement, and full re-roofs depend on pitch, layers, and ventilation. Get at least three written quotes for re-roof projects.",
    factors: ["Roof pitch and accessibility", "Number of existing shingle layers", "Flashing and chimney work", "Warranty length on labour"],
    timeline: "Leak repairs: same day to 1 week. Re-roofs: several days depending on size and weather.",
    hiring: [
      "Verify WSBC clearance and liability insurance",
      "Compare material brands and warranty terms",
      "Check references for similar roof types",
    ],
    faqs: [
      { q: "Roof leak repair cost?", a: "Often $350–$1,200 depending on source and access." },
      { q: "Re-shingle a small home?", a: "Commonly $8,000–$15,000+ in Fraser Valley — get multiple quotes." },
    ],
  },
  painter: {
    intro:
      "Painters quote by room, floor area, or hourly for touch-ups. Prep work (patching, sanding, primer) drives much of the cost. Exterior work depends on height, siding type, and weather windows.",
    factors: ["Prep level required", "Ceiling height and trim detail", "Interior vs exterior", "Premium vs standard paint"],
    timeline: "Single room: 1–2 days. Whole home interior: 1–2 weeks.",
    hiring: ["Confirm prep is included in quote", "Ask about furniture moving", "Verify liability for multi-storey exterior"],
    faqs: [
      { q: "Paint included in quote?", a: "Clarify — some painters charge materials separately." },
      { q: "Best season for exterior?", a: "Dry stretches in late spring through early fall in BC." },
    ],
  },
  landscaper: {
    intro:
      "Landscaping spans lawn maintenance, hedge trimming, and hardscape installs. Hourly rates apply to maintenance; patios and retaining walls are project-quoted. Book early for spring in the Fraser Valley.",
    factors: ["Yard size and slope", "Material choice for hardscape", "Irrigation or drainage needs", "Seasonal demand"],
    timeline: "Lawn mow: under an hour. Patio installs: days to weeks.",
    hiring: ["Confirm haul-away fees for green waste", "Get drainage plan for hardscape", "Check references for similar yards"],
    faqs: [
      { q: "Lawn mow frequency?", a: "Weekly in growing season is typical for Fraser Valley lawns." },
      { q: "Patio cost range?", a: "Often $3,000–$12,000+ depending on size and materials." },
    ],
  },
};

function genericGuide(name: string) {
  return {
    intro: `${name} pricing in BC varies by scope, access, and materials. Fraser Valley and Metro Vancouver rates differ slightly — always get 2–3 written quotes for projects over $500.`,
    factors: ["Job size and complexity", "Materials supplied by pro vs homeowner", "Emergency or after-hours timing", "Permits or inspections if required"],
    timeline: "Small jobs often same-week; larger projects need scheduling and may depend on weather.",
    hiring: ["Confirm licence or certification where regulated", "Ask for proof of liability insurance", "Get scope and warranty in writing"],
    faqs: [
      { q: `How much does ${name.toLowerCase()} cost in BC?`, a: "See the typical ranges on this page — your quote depends on access, materials, and job size." },
      { q: "Should I get multiple quotes?", a: "Yes for any project over a few hundred dollars. Compare written quotes, not phone estimates." },
    ],
  };
}

const EXTENDED_GUIDE_EXTENDED = Object.fromEntries(
  Object.entries(EXTENDED_COST_GUIDES).map(([slug, _guide]) => {
    const label = slug.replace(/-/g, " ");
    const name = label.charAt(0).toUpperCase() + label.slice(1);
    return [slug, genericGuide(name)];
  })
);

export function getGuideExtended(slug: string) {
  return GUIDE_EXTENDED[slug] || EXTENDED_GUIDE_EXTENDED[slug];
}

export function guidePricePreview(slug: string, guide?: { low: number; high: number; unit: string; commonJobs?: { range: string }[] }) {
  if (!guide) return null;
  if (guide.low > 0) return `$${guide.low}–$${guide.high} ${guide.unit}`;
  const firstJob = guide.commonJobs?.[0];
  return firstJob ? `${firstJob.range} typical project` : "Project quotes";
}
