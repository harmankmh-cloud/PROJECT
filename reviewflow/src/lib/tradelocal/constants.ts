export const TRADE_LOCAL = {
  name: "TradeLocal",
  tagline: "Find trusted local trades in BC",
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
