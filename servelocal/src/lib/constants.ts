import type { ServiceCategory } from "@/lib/types";

export const SERVE_LOCAL = {
  name: "ServeLocal",
  tagline: "Local services, served direct",
  region: "British Columbia",
} as const;

export const TRADE_CITIES = [
  { slug: "surrey", name: "Surrey", region: "Fraser Valley / Metro" },
  { slug: "langley", name: "Langley", region: "Fraser Valley" },
  { slug: "abbotsford", name: "Abbotsford", region: "Fraser Valley" },
  { slug: "chilliwack", name: "Chilliwack", region: "Fraser Valley" },
  { slug: "mission", name: "Mission", region: "Fraser Valley" },
  { slug: "delta", name: "Delta", region: "Metro Vancouver" },
  { slug: "burnaby", name: "Burnaby", region: "Metro Vancouver" },
  { slug: "vancouver", name: "Vancouver", region: "Metro Vancouver" },
] as const;

export type CitySlug = (typeof TRADE_CITIES)[number]["slug"];

export function cityName(slug: string) {
  return TRADE_CITIES.find((c) => c.slug === slug)?.name || slug;
}

/** Built-in categories — used when DB is empty or unavailable so guide/city links never 404. */
export const DEFAULT_SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: "default-plumber", slug: "plumber", name: "Plumber", icon: "🔧", sort_order: 1 },
  { id: "default-electrician", slug: "electrician", name: "Electrician", icon: "⚡", sort_order: 2 },
  { id: "default-handyman", slug: "handyman", name: "Handyman", icon: "🛠", sort_order: 3 },
  { id: "default-cleaner", slug: "cleaner", name: "House cleaning", icon: "🧹", sort_order: 4 },
  { id: "default-hvac", slug: "hvac", name: "HVAC / furnace", icon: "❄", sort_order: 5 },
  { id: "default-roofer", slug: "roofer", name: "Roofer", icon: "🏠", sort_order: 6 },
  { id: "default-painter", slug: "painter", name: "Painter", icon: "🎨", sort_order: 7 },
  { id: "default-landscaper", slug: "landscaper", name: "Landscaping", icon: "🌿", sort_order: 8 },
];

export function isValidCitySlug(slug: string | undefined): slug is CitySlug {
  return Boolean(slug && TRADE_CITIES.some((c) => c.slug === slug));
}

export const HOW_IT_WORKS = [
  {
    step: "1",
    title: "Describe your job",
    body: "Post what you need — plumbing, electrical, cleaning — in your city. Takes under 2 minutes.",
  },
  {
    step: "2",
    title: "Browse verified local pros",
    body: "See ratings, licenses, response times, and real reviews from BC homeowners.",
  },
  {
    step: "3",
    title: "Call direct — no middleman",
    body: "Tap to call or WhatsApp. Agree price and scope directly with the pro you choose.",
  },
] as const;

export const LISTING_PLANS = [
  {
    id: "free" as const,
    name: "Starter",
    priceLabel: "Free",
    setupLabel: "$0",
    monthlyLabel: "Free forever",
    highlight: false,
    features: [
      "Basic listing in one city",
      "Phone & WhatsApp on profile",
      "Manual admin approval",
      "Standard search placement",
    ],
  },
  {
    id: "featured" as const,
    name: "Featured Pro",
    priceLabel: "$49/mo",
    setupLabel: "$99 setup",
    monthlyLabel: "$49/month",
    highlight: true,
    features: [
      "Homepage & category featured spots",
      "Verified badge review by our team",
      "Priority in search results",
      "Response time & jobs completed stats",
      "Up to 3 portfolio photos",
    ],
  },
  {
    id: "premium" as const,
    name: "Premium Elite",
    priceLabel: "$99/mo",
    setupLabel: "$149 setup",
    monthlyLabel: "$99/month",
    highlight: false,
    features: [
      "Top placement in your category",
      "Verified + insurance badge",
      "Emergency/24-7 badge option",
      "Unlimited portfolio photos",
      "Cost guide featured pro slot",
      "Monthly performance report",
    ],
  },
] as const;

export const COST_GUIDES: Record<
  string,
  { low: number; high: number; unit: string; tips: string[]; commonJobs: { name: string; range: string }[] }
> = {
  plumber: {
    low: 120,
    high: 350,
    unit: "per hour",
    tips: ["Always ask if dispatch/trip fee is separate", "Get a written quote for jobs over $500"],
    commonJobs: [
      { name: "Clogged drain", range: "$150–$350" },
      { name: "Water heater install", range: "$1,800–$3,500" },
      { name: "Leaking tap repair", range: "$120–$250" },
    ],
  },
  electrician: {
    low: 100,
    high: 300,
    unit: "per hour",
    tips: ["Licensed BC electricians should provide licence number", "Panel upgrades need permits — factor that in"],
    commonJobs: [
      { name: "Outlet replacement", range: "$120–$200" },
      { name: "Light fixture install", range: "$150–$350" },
      { name: "EV charger install", range: "$800–$2,500" },
    ],
  },
  handyman: {
    low: 60,
    high: 120,
    unit: "per hour",
    tips: ["Handyman vs licensed trade — know when you need a ticketed pro"],
    commonJobs: [
      { name: "Furniture assembly", range: "$80–$200" },
      { name: "Drywall patch", range: "$150–$400" },
      { name: "Door adjustment", range: "$100–$250" },
    ],
  },
  cleaner: {
    low: 35,
    high: 55,
    unit: "per hour",
    tips: ["Deep cleans cost more than maintenance cleans", "Ask if supplies are included"],
    commonJobs: [
      { name: "2-bed home clean", range: "$140–$220" },
      { name: "Move-out clean", range: "$250–$450" },
      { name: "Carpet steam (per room)", range: "$40–$80" },
    ],
  },
  hvac: {
    low: 120,
    high: 280,
    unit: "per hour",
    tips: ["Fall furnace tune-ups are cheaper than winter emergency calls"],
    commonJobs: [
      { name: "Furnace tune-up", range: "$150–$250" },
      { name: "AC install", range: "$4,000–$8,000" },
      { name: "Thermostat install", range: "$150–$350" },
    ],
  },
  roofer: {
    low: 0,
    high: 0,
    unit: "project quote",
    tips: ["Get 3 quotes for re-roofs", "Ask about warranty on labour and materials"],
    commonJobs: [
      { name: "Roof leak repair", range: "$350–$1,200" },
      { name: "Asphalt re-shingle (small home)", range: "$8,000–$15,000" },
      { name: "Gutter clean", range: "$150–$300" },
    ],
  },
  painter: {
    low: 45,
    high: 85,
    unit: "per hour",
    tips: ["Price per room vs whole house — clarify prep work included"],
    commonJobs: [
      { name: "Single room", range: "$350–$800" },
      { name: "Whole home interior", range: "$3,500–$8,000" },
      { name: "Exterior trim", range: "$1,500–$4,000" },
    ],
  },
  landscaper: {
    low: 50,
    high: 100,
    unit: "per hour",
    tips: ["Spring and fall are peak — book early in Fraser Valley"],
    commonJobs: [
      { name: "Lawn mow (avg yard)", range: "$45–$80" },
      { name: "Hedge trim", range: "$120–$300" },
      { name: "Patio install", range: "$3,000–$12,000" },
    ],
  },
};

export const TRUST_BADGES = [
  { icon: "✓", label: "Verified pros", desc: "We check licence claims before the verified badge goes live" },
  { icon: "★", label: "Real reviews", desc: "Homeowner ratings moderated by our team" },
  { icon: "⚡", label: "Fast response", desc: "See typical response times on each profile" },
  { icon: "📞", label: "Direct contact", desc: "No lead fees for customers — call the pro you pick" },
] as const;
