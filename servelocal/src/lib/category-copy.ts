const TRADE_SEO_PLURALS: Record<string, string> = {
  plumber: "Plumbers",
  electrician: "Electricians",
  handyman: "Handymen",
  cleaner: "House Cleaners",
  hvac: "HVAC Pros",
  roofer: "Roofers",
  painter: "Painters",
  landscaper: "Landscapers",
};

const TRADE_NOUNS: Record<string, string> = {
  plumber: "plumber",
  electrician: "electrician",
  handyman: "handyman",
  cleaner: "house cleaner",
  hvac: "HVAC pro",
  roofer: "roofer",
  painter: "painter",
  landscaper: "landscaper",
};

/** SEO headline label, e.g. "Landscapers" instead of "Landscapings". */
export function tradeSeoPlural(slug: string | undefined, displayName: string) {
  if (slug && TRADE_SEO_PLURALS[slug]) return TRADE_SEO_PLURALS[slug];
  return `${displayName} pros`;
}

/** Sentence noun, e.g. "landscaper" instead of "landscaping". */
export function tradeNoun(slug: string | undefined, displayName: string) {
  if (slug && TRADE_NOUNS[slug]) return TRADE_NOUNS[slug];
  return displayName.toLowerCase();
}
