export const TRUST_ITEMS = [
  "Free for homeowners",
  "No commission on jobs",
  "Verified BC contractors",
  "Fraser Valley focused",
] as const;

export const POPULAR_CATEGORIES = [
  { slug: "plumber", label: "Plumbing" },
  { slug: "hvac", label: "HVAC" },
  { slug: "electrician", label: "Electrical" },
  { slug: "landscaper", label: "Landscaping" },
  { slug: "painter", label: "Painting" },
  { slug: "cleaner", label: "Cleaning" },
  { slug: "roofer", label: "Roofing" },
  { slug: "moving", label: "Moving" },
] as const;

export const BC_CITY_CHIPS = [
  { slug: "abbotsford", name: "Abbotsford" },
  { slug: "chilliwack", name: "Chilliwack" },
  { slug: "surrey", name: "Surrey" },
  { slug: "langley", name: "Langley" },
  { slug: "kelowna", name: "Kelowna" },
  { slug: "burnaby", name: "Burnaby" },
  { slug: "richmond", name: "Richmond" },
  { slug: "coquitlam", name: "Coquitlam" },
  { slug: "maple-ridge", name: "Maple Ridge" },
] as const;

export const HOMEOWNER_STEPS = [
  { step: "1", title: "Post your job", body: "Free, takes about 2 minutes. Describe what you need and where." },
  { step: "2", title: "Get contacted by verified pros", body: "Local tradespeople in your area reach out directly." },
  { step: "3", title: "Choose your pro — no platform fee", body: "Agree price and scope directly. We never take a cut." },
] as const;

export const CONTRACTOR_STEPS = [
  { step: "1", title: "Create your free profile", body: "List your trade, city, and services in minutes." },
  { step: "2", title: "Browse job leads in your area", body: "See homeowner requests matching your trade and cities." },
  { step: "3", title: "Contact homeowners directly", body: "Upgrade for priority leads and full contact details." },
] as const;

export const COST_ESTIMATES = [
  { slug: "plumber", label: "Plumbing repair", range: "$150–$400" },
  { slug: "hvac", label: "HVAC service", range: "$200–$600" },
  { slug: "electrician", label: "Electrical outlet", range: "$120–$350" },
  { slug: "painter", label: "Interior painting (room)", range: "$300–$800" },
  { slug: "landscaper", label: "Lawn maintenance", range: "$80–$200" },
  { slug: "roofer", label: "Roof inspection", range: "$200–$500" },
] as const;

export const TESTIMONIALS = [
  {
    name: "Sarah M.",
    city: "Abbotsford",
    trade: "Plumber",
    quote: "Found a licensed plumber in under an hour. Called direct — no lead fees, no runaround.",
    rating: 5,
  },
  {
    name: "James T.",
    city: "Surrey",
    trade: "Electrician",
    quote: "Posted my panel upgrade job and got three solid quotes the same day.",
    rating: 5,
  },
  {
    name: "Priya K.",
    city: "Chilliwack",
    trade: "HVAC",
    quote: "Finally a BC directory that feels local. Verified badges gave me confidence.",
    rating: 5,
  },
  {
    name: "Mike R.",
    city: "Langley",
    trade: "Landscaper",
    quote: "Hired a landscaper through ServeLocal — straightforward and trustworthy.",
    rating: 4,
  },
] as const;

export const HERO_PROS = [
  { name: "Dave's Plumbing", trade: "Plumber", city: "Abbotsford", rating: 4.9, reviews: 47, available: true },
  { name: "Valley Electric", trade: "Electrician", city: "Chilliwack", rating: 4.8, reviews: 32, available: true },
  { name: "Coast HVAC", trade: "HVAC", city: "Surrey", rating: 5.0, reviews: 18, available: false },
] as const;
