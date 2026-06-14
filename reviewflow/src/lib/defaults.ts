import type { ExperienceLevel, StarRating } from "./types";
import type { PromptTemplate } from "./types";

export type DefaultPrompt = {
  experience_level: ExperienceLevel;
  helper_label: string;
  placeholder: string;
  ai_instruction: string;
};

export const DEFAULT_PROMPTS: DefaultPrompt[] = [
  {
    experience_level: "great",
    helper_label: "Write my 5-star review",
    placeholder: "What made it amazing? Service, staff, quality…",
    ai_instruction:
      "Write an enthusiastic but honest 5-star Google review. 2-4 sentences. Only use facts from the customer notes.",
  },
  {
    experience_level: "good",
    helper_label: "Write my 4-star review",
    placeholder: "What did you enjoy about your visit?",
    ai_instruction:
      "Write a positive, natural 4-star Google review. Mention one small area to improve if noted. 2-4 sentences. Only use facts from the notes.",
  },
  {
    experience_level: "okay",
    helper_label: "Write my 3-star review",
    placeholder: "What was okay and what could be better?",
    ai_instruction:
      "Write a balanced, honest 3-star Google review. Mention positives and improvements fairly. 2-4 sentences. Only use facts from the notes.",
  },
  {
    experience_level: "bad",
    helper_label: "Write my honest review",
    placeholder: "What went wrong? Be specific so the business can improve.",
    ai_instruction:
      "Write an honest, calm 1-2 star Google review. Be direct but not rude. No insults. 2-4 sentences. Only use facts from the notes.",
  },
];

export const STAR_OPTIONS: {
  stars: StarRating;
  label: string;
  subtitle: string;
}[] = [
  { stars: 5, label: "Excellent", subtitle: "5 stars" },
  { stars: 4, label: "Good", subtitle: "4 stars" },
  { stars: 3, label: "Average", subtitle: "3 stars" },
  { stars: 2, label: "Below average", subtitle: "2 stars" },
  { stars: 1, label: "Poor", subtitle: "1 star" },
];

export const POSITIVE_NOTE_CHIPS = [
  "Great service",
  "Friendly staff",
  "Fast & efficient",
  "Clean place",
  "Good value",
];

export const NEGATIVE_NOTE_CHIPS = [
  "Long wait",
  "Poor communication",
  "Quality issue",
  "Rude staff",
  "Overpriced",
];

export const NEUTRAL_NOTE_CHIPS = ["It was fine", "Could improve", "Mixed experience"];

export const INDUSTRY_OPTIONS = [
  { id: "barber", label: "Barber / hair salon", emoji: "✂️" },
  { id: "nail-spa", label: "Nail salon / spa", emoji: "💅" },
  { id: "restaurant", label: "Restaurant", emoji: "🍽️" },
  { id: "cafe", label: "Coffee shop / cafe", emoji: "☕" },
  { id: "fast-food", label: "Fast food / pizza", emoji: "🍕" },
  { id: "bar", label: "Bar / pub", emoji: "🍺" },
  { id: "bakery", label: "Bakery / dessert", emoji: "🧁" },
  { id: "car-wash", label: "Car wash", emoji: "🚗" },
  { id: "auto-repair", label: "Auto repair / mechanic", emoji: "🔧" },
  { id: "auto-detailing", label: "Auto detailing", emoji: "✨" },
  { id: "tire-oil", label: "Tire / oil change", emoji: "🛞" },
  { id: "dental", label: "Dental office", emoji: "🦷" },
  { id: "medical", label: "Medical / clinic", emoji: "🏥" },
  { id: "chiro-physio", label: "Chiro / physio", emoji: "🩺" },
  { id: "vet", label: "Vet / pet care", emoji: "🐾" },
  { id: "groomer", label: "Pet groomer", emoji: "🐕" },
  { id: "gym", label: "Gym / fitness", emoji: "💪" },
  { id: "yoga-pilates", label: "Yoga / pilates", emoji: "🧘" },
  { id: "cleaning", label: "Cleaning service", emoji: "🧹" },
  { id: "landscaping", label: "Landscaping / lawn", emoji: "🌿" },
  { id: "plumber", label: "Plumber / HVAC", emoji: "🔩" },
  { id: "electrician", label: "Electrician", emoji: "⚡" },
  { id: "contractor", label: "Contractor / handyman", emoji: "🔨" },
  { id: "roofing", label: "Roofing", emoji: "🏠" },
  { id: "pest", label: "Pest control", emoji: "🐜" },
  { id: "moving", label: "Moving company", emoji: "📦" },
  { id: "retail", label: "Retail shop", emoji: "🛍️" },
  { id: "grocery", label: "Grocery / convenience", emoji: "🛒" },
  { id: "florist", label: "Florist", emoji: "💐" },
  { id: "dry-cleaner", label: "Dry cleaner", emoji: "👔" },
  { id: "hotel", label: "Hotel / lodging", emoji: "🏨" },
  { id: "real-estate", label: "Real estate", emoji: "🏡" },
  { id: "legal", label: "Legal services", emoji: "⚖️" },
  { id: "accounting", label: "Accounting / tax", emoji: "📊" },
  { id: "insurance", label: "Insurance agency", emoji: "🛡️" },
  { id: "daycare", label: "Daycare / tutoring", emoji: "📚" },
  { id: "photography", label: "Photography / video", emoji: "📷" },
  { id: "tattoo", label: "Tattoo / piercing", emoji: "🎨" },
  { id: "other", label: "Other", emoji: "📍" },
] as const;

const PROMPT_ORDER: ExperienceLevel[] = ["great", "good", "okay", "bad"];

export function sortPrompts<T extends { experience_level: ExperienceLevel }>(prompts: T[]): T[] {
  return [...prompts].sort(
    (a, b) => PROMPT_ORDER.indexOf(a.experience_level) - PROMPT_ORDER.indexOf(b.experience_level)
  );
}

export function starToExperienceLevel(stars: StarRating): ExperienceLevel {
  if (stars === 5) return "great";
  if (stars === 4) return "good";
  if (stars === 3) return "okay";
  return "bad";
}

export function starsLabel(stars: number): string {
  return "★".repeat(stars) + "☆".repeat(5 - stars);
}

export function noteChipsForStars(stars: StarRating): string[] {
  if (stars >= 4) return POSITIVE_NOTE_CHIPS;
  if (stars === 3) return [...NEUTRAL_NOTE_CHIPS, ...POSITIVE_NOTE_CHIPS.slice(0, 2)];
  return NEGATIVE_NOTE_CHIPS;
}

export function getPromptForStars(stars: StarRating, prompts: PromptTemplate[]): PromptTemplate | undefined {
  return prompts.find((p) => p.experience_level === starToExperienceLevel(stars));
}

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}
