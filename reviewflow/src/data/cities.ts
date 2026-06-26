/**
 * BC cities served by RateLocal.
 * Each entry powers a dedicated city landing page at /reviews/[city-slug].
 */
export type CityData = {
  /** URL slug — must match the folder name */
  slug: string;
  name: string;
  region: string;
  population: string;
  /** Industry verticals most common in this city */
  topIndustries: string[];
  /** 1–2 sentence local flavour for the hero */
  localFlavour: string;
  /** 3 industry-specific stat/pain-points shown on the page */
  stats: { label: string; value: string }[];
  /** Canonical Google My Business phrase for SEO */
  gmbPhrase: string;
};

export const CITIES: CityData[] = [
  {
    slug: "langley",
    name: "Langley",
    region: "Fraser Valley, BC",
    population: "140,000+",
    topIndustries: ["Auto detailing", "Salons", "Restaurants", "Contractors", "Real Estate"],
    localFlavour:
      "Langley's mix of suburban townships and fast-growing commercial strips means customers are searching on Google before they ever walk in your door.",
    stats: [
      { value: "89%", label: "of Langley shoppers check Google reviews first" },
      { value: "4.5★", label: "average rating needed to win over local customers" },
      { value: "3×", label: "more clicks for businesses with 50+ recent reviews" },
    ],
    gmbPhrase: "Google reviews Langley BC",
  },
  {
    slug: "surrey",
    name: "Surrey",
    region: "Metro Vancouver, BC",
    population: "568,000+",
    topIndustries: ["Restaurants", "Dental Clinics", "Auto Shops", "Salons", "Gyms"],
    localFlavour:
      "Surrey is BC's fastest-growing city — new residents search online for trusted local businesses before they've even unpacked.",
    stats: [
      { value: "73%", label: "of Surrey diners check reviews before choosing a restaurant" },
      { value: "2×", label: "more new patients for dental clinics with 4.5★+" },
      { value: "40%", label: "more bookings for salons ranked in the top 3 on Google Maps" },
    ],
    gmbPhrase: "Google reviews Surrey BC",
  },
  {
    slug: "abbotsford",
    name: "Abbotsford",
    region: "Fraser Valley, BC",
    population: "180,000+",
    topIndustries: ["Agricultural Services", "Restaurants", "Auto Shops", "Contractors", "Health"],
    localFlavour:
      "Abbotsford blends a tight-knit agricultural community with a growing urban core — word of mouth here starts online.",
    stats: [
      { value: "1st", label: "thing customers see when they Google your business" },
      { value: "76%", label: "of Abbotsford consumers trust businesses with verified reviews" },
      { value: "10 min", label: "average RateLocal setup time for Abbotsford shops" },
    ],
    gmbPhrase: "Google reviews Abbotsford BC",
  },
  {
    slug: "chilliwack",
    name: "Chilliwack",
    region: "Fraser Valley, BC",
    population: "100,000+",
    topIndustries: ["Contractors", "Restaurants", "Auto Shops", "Retail", "Health"],
    localFlavour:
      "Chilliwack's small-town feel means your reputation spreads fast — make sure what spreads is 5 stars.",
    stats: [
      { value: "92%", label: "of Chilliwack customers say reviews influence their purchase" },
      { value: "5×", label: "more leads for contractors with 20+ Google reviews" },
      { value: "$0", label: "setup fee — free to start collecting reviews today" },
    ],
    gmbPhrase: "Google reviews Chilliwack BC",
  },
  {
    slug: "vancouver",
    name: "Vancouver",
    region: "Metro Vancouver, BC",
    population: "675,000+",
    topIndustries: ["Restaurants", "Salons", "Real Estate", "Health & Wellness", "Gyms"],
    localFlavour:
      "Vancouver's competitive restaurant and services market means a single star difference on Google Maps can shift thousands of dollars in monthly revenue.",
    stats: [
      { value: "#1", label: "factor for local SEO ranking in Vancouver is review volume" },
      { value: "84%", label: "of Vancouver consumers won't visit a business below 4 stars" },
      { value: "12×", label: "more review velocity with AI-assisted prompts vs asking verbally" },
    ],
    gmbPhrase: "Google reviews Vancouver BC",
  },
];

export function getCityBySlug(slug: string): CityData | undefined {
  return CITIES.find((c) => c.slug === slug);
}
