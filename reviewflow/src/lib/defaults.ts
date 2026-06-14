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
  { id: "car-wash", label: "Car wash", emoji: "🚗" },
  { id: "barber", label: "Barber / salon", emoji: "✂️" },
  { id: "restaurant", label: "Restaurant", emoji: "🍽️" },
  { id: "dental", label: "Dental / medical", emoji: "🦷" },
  { id: "gym", label: "Gym / fitness", emoji: "💪" },
  { id: "cleaning", label: "Cleaning", emoji: "🧹" },
  { id: "retail", label: "Retail shop", emoji: "🛍️" },
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
