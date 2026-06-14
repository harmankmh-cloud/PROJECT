/** Launch program — scarcity + value props for tradie signup. */

export const FOUNDING_PRO = {
  label: "Founding Pro",
  spotsPerCity: 5,
  featuredPrice: "$29/mo",
  featuredRegular: "$49/mo",
  duration: "first 6 months",
  badge: "Founding Pro",
} as const;

export const TRADIE_VALUE_PROPS = [
  {
    icon: "📬",
    title: "Job alerts to your inbox",
    body: "When a homeowner posts a job in your city and trade, matching pros get an email with the details — call direct, no middleman.",
  },
  {
    icon: "📞",
    title: "Your phone on your profile",
    body: "Customers tap to call or WhatsApp you. We never sell the same lead to five competitors.",
  },
  {
    icon: "★",
    title: "Reviews that stay on you",
    body: "Build a public reputation on ServeLocal — moderated reviews homeowners trust.",
  },
  {
    icon: "📍",
    title: "Local SEO for BC",
    body: "Show up on Surrey plumber, Langley electrician, and 20+ category pages — plus BC cost guides.",
  },
] as const;

export const TRADIE_COMPARISON = [
  { name: "Thumbtack / Angi", cost: "$25–75 per lead", note: "Shared with 4–5 pros — pay even if you lose the job" },
  { name: "HomeStars Pro", cost: "$299+/mo + lead fees", note: "National platform, heavy sales calls" },
  { name: "ServeLocal Founding Pro", cost: "$29/mo flat", note: "Your listing, your phone, job alerts included" },
] as const;

export const HOW_OTHERS_START = [
  "Free listings until there are enough pros in one city (Airbnb, Yelp early days)",
  "Founding member pricing for the first 20–50 pros (scarcity + loyalty)",
  "Email job alerts so tradies feel value before paying (proves the pipeline)",
  "Upgrade for top placement — not for access to the lead (keeps trust)",
] as const;
