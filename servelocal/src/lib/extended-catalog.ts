import type { ServiceCategory } from "@/lib/types";

/** Additional service categories beyond the original 8 (audit: expand to 20+). */
export const EXTENDED_SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: "default-mover", slug: "mover", name: "Mover", icon: "📦", sort_order: 9 },
  { id: "default-pest", slug: "pest-control", name: "Pest control", icon: "🐜", sort_order: 10 },
  { id: "default-fence", slug: "fence-builder", name: "Fence builder", icon: "🪵", sort_order: 11 },
  { id: "default-deck", slug: "deck-builder", name: "Deck builder", icon: "🪚", sort_order: 12 },
  { id: "default-flooring", slug: "flooring", name: "Flooring", icon: "🪵", sort_order: 13 },
  { id: "default-drywall", slug: "drywall", name: "Drywall", icon: "🧱", sort_order: 14 },
  { id: "default-appliance", slug: "appliance-repair", name: "Appliance repair", icon: "🔌", sort_order: 15 },
  { id: "default-locksmith", slug: "locksmith", name: "Locksmith", icon: "🔑", sort_order: 16 },
  { id: "default-window", slug: "window-cleaner", name: "Window cleaning", icon: "🪟", sort_order: 17 },
  { id: "default-gutter", slug: "gutter-cleaning", name: "Gutter cleaning", icon: "🍂", sort_order: 18 },
  { id: "default-tree", slug: "tree-removal", name: "Tree removal", icon: "🌳", sort_order: 19 },
  { id: "default-garage", slug: "garage-door", name: "Garage door", icon: "🚗", sort_order: 20 },
  { id: "default-pool", slug: "pool-service", name: "Pool service", icon: "🏊", sort_order: 21 },
  { id: "default-septic", slug: "septic", name: "Septic service", icon: "🚽", sort_order: 22 },
  { id: "default-chimney", slug: "chimney-sweep", name: "Chimney sweep", icon: "🔥", sort_order: 23 },
];

export const EXTENDED_COST_GUIDES: Record<
  string,
  { low: number; high: number; unit: string; tips: string[]; commonJobs: { name: string; range: string }[] }
> = {
  mover: {
    low: 100,
    high: 200,
    unit: "per hour (2 movers)",
    tips: ["Book mid-week for better rates", "Clarify stairs, elevator, and packing fees"],
    commonJobs: [
      { name: "1-bed local move", range: "$600–$1,200" },
      { name: "3-bed local move", range: "$1,200–$2,500" },
      { name: "Piano move", range: "$300–$800" },
    ],
  },
  "pest-control": {
    low: 150,
    high: 400,
    unit: "per visit",
    tips: ["Ask about warranty on ant/wasp treatments", "Structural pest may need inspection first"],
    commonJobs: [
      { name: "Ant treatment", range: "$150–$300" },
      { name: "Wasp nest removal", range: "$200–$450" },
      { name: "Rodent exclusion", range: "$400–$900" },
    ],
  },
  "fence-builder": {
    low: 0,
    high: 0,
    unit: "project quote",
    tips: ["Check property line survey for shared fences", "Compare cedar vs vinyl lifespan"],
    commonJobs: [
      { name: "6' cedar fence (per ft)", range: "$45–$75/ft" },
      { name: "Gate install", range: "$400–$900" },
      { name: "Fence repair panel", range: "$150–$400" },
    ],
  },
  "deck-builder": {
    low: 0,
    high: 0,
    unit: "project quote",
    tips: ["Permits often required for elevated decks in BC", "Composite costs more upfront, less maintenance"],
    commonJobs: [
      { name: "Small ground-level deck", range: "$5,000–$12,000" },
      { name: "Composite re-deck", range: "$8,000–$18,000" },
      { name: "Railing replace", range: "$1,500–$4,000" },
    ],
  },
  flooring: {
    low: 4,
    high: 12,
    unit: "per sq ft installed",
    tips: ["Subfloor prep is often extra", "Get moisture readings for basement installs"],
    commonJobs: [
      { name: "LVP install", range: "$4–$8/sq ft" },
      { name: "Hardwood refinish", range: "$3–$6/sq ft" },
      { name: "Tile bathroom", range: "$1,500–$4,500" },
    ],
  },
  drywall: {
    low: 55,
    high: 95,
    unit: "per hour",
    tips: ["Texture matching adds cost", "Large holes need patch + paint coordination"],
    commonJobs: [
      { name: "Small hole patch", range: "$150–$350" },
      { name: "Full room skim", range: "$800–$2,000" },
      { name: "Basement finish (per sq ft)", range: "$8–$15/sq ft" },
    ],
  },
  "appliance-repair": {
    low: 120,
    high: 250,
    unit: "service call + parts",
    tips: ["Diagnostic fee often applies to repair", "Compare repair vs replace for older units"],
    commonJobs: [
      { name: "Fridge not cooling", range: "$200–$450" },
      { name: "Washer pump replace", range: "$250–$500" },
      { name: "Oven element", range: "$180–$350" },
    ],
  },
  locksmith: {
    low: 80,
    high: 200,
    unit: "per visit",
    tips: ["After-hours lockouts cost more", "Rekey is cheaper than full lock replace"],
    commonJobs: [
      { name: "House lockout", range: "$80–$150" },
      { name: "Rekey 3 locks", range: "$120–$220" },
      { name: "Smart lock install", range: "$150–$350" },
    ],
  },
  "window-cleaner": {
    low: 10,
    high: 18,
    unit: "per window pane",
    tips: ["Interior + exterior doubles price", "Third-storey work needs proper equipment"],
    commonJobs: [
      { name: "Average home (exterior)", range: "$150–$300" },
      { name: "In + out full home", range: "$250–$450" },
      { name: "Gutter + windows bundle", range: "$300–$550" },
    ],
  },
  "gutter-cleaning": {
    low: 150,
    high: 350,
    unit: "per visit",
    tips: ["Book fall after leaf drop in Fraser Valley", "Ask if downspout flush is included"],
    commonJobs: [
      { name: "Single-storey home", range: "$150–$250" },
      { name: "Two-storey home", range: "$200–$350" },
      { name: "Gutter guard install", range: "$8–$15/ft" },
    ],
  },
  "tree-removal": {
    low: 0,
    high: 0,
    unit: "project quote",
    tips: ["Proximity to structures drives price", "Stump grinding is usually extra"],
    commonJobs: [
      { name: "Small tree removal", range: "$400–$900" },
      { name: "Large tree (near house)", range: "$1,500–$4,000" },
      { name: "Stump grind", range: "$150–$400" },
    ],
  },
  "garage-door": {
    low: 150,
    high: 350,
    unit: "service call",
    tips: ["Springs are high-tension — use a pro", "Insulated doors help BC garages"],
    commonJobs: [
      { name: "Spring replacement", range: "$250–$450" },
      { name: "Opener install", range: "$350–$600" },
      { name: "New door installed", range: "$1,200–$3,500" },
    ],
  },
  "pool-service": {
    low: 120,
    high: 250,
    unit: "per month (maintenance)",
    tips: ["Seasonal openings/closings are separate", "Leak detection is specialized"],
    commonJobs: [
      { name: "Weekly maintenance", range: "$120–$200/mo" },
      { name: "Open/close season", range: "$350–$600" },
      { name: "Pump replacement", range: "$800–$1,500" },
    ],
  },
  septic: {
    low: 300,
    high: 600,
    unit: "pump-out",
    tips: ["Fraser Valley rural properties — know tank location", "Inspection before buying property"],
    commonJobs: [
      { name: "Standard pump-out", range: "$300–$500" },
      { name: "Field inspection", range: "$400–$800" },
      { name: "Tank replace", range: "$5,000–$15,000" },
    ],
  },
  "chimney-sweep": {
    low: 150,
    high: 350,
    unit: "per sweep",
    tips: ["WETT certification matters for insurance", "Creosote buildup is a fire risk"],
    commonJobs: [
      { name: "Standard sweep", range: "$150–$250" },
      { name: "Inspection + sweep", range: "$200–$350" },
      { name: "Cap install", range: "$150–$300" },
    ],
  },
};

/** Sub-filters shown on category and search pages. */
export const SERVICE_SUBCATEGORIES: Record<string, { slug: string; label: string }[]> = {
  plumber: [
    { slug: "drain-cleaning", label: "Drain cleaning" },
    { slug: "water-heater", label: "Water heater" },
    { slug: "pipe-repair", label: "Pipe repair" },
    { slug: "emergency", label: "Emergency" },
  ],
  electrician: [
    { slug: "panel-upgrade", label: "Panel upgrade" },
    { slug: "wiring", label: "Wiring" },
    { slug: "lighting", label: "Lighting" },
    { slug: "ev-charger", label: "EV charger" },
  ],
  roofer: [
    { slug: "roof-repair", label: "Roof repair" },
    { slug: "new-roof", label: "New roof" },
    { slug: "gutter", label: "Gutters" },
    { slug: "siding", label: "Siding" },
  ],
  hvac: [
    { slug: "furnace", label: "Furnace" },
    { slug: "ac-install", label: "AC install" },
    { slug: "heat-pump", label: "Heat pump" },
    { slug: "emergency", label: "No heat emergency" },
  ],
  handyman: [
    { slug: "drywall", label: "Drywall patch" },
    { slug: "assembly", label: "Assembly" },
    { slug: "doors", label: "Doors & trim" },
  ],
  cleaner: [
    { slug: "deep-clean", label: "Deep clean" },
    { slug: "move-out", label: "Move-out" },
    { slug: "recurring", label: "Recurring" },
  ],
  mover: [
    { slug: "local", label: "Local move" },
    { slug: "long-distance", label: "Long distance" },
    { slug: "packing", label: "Packing" },
  ],
  "pest-control": [
    { slug: "ants", label: "Ants" },
    { slug: "rodents", label: "Rodents" },
    { slug: "wasps", label: "Wasps" },
  ],
};
