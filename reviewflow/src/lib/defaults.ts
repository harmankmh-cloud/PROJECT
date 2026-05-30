import type { ExperienceLevel } from "./types";

export type DefaultPrompt = {
  experience_level: ExperienceLevel;
  helper_label: string;
  placeholder: string;
  ai_instruction: string;
};

export const DEFAULT_PROMPTS: DefaultPrompt[] = [
  {
    experience_level: "great",
    helper_label: "Write my review",
    placeholder: "What stood out? Fast service, friendly staff, spotless place…",
    ai_instruction:
      "Rewrite the customer notes into a clear, honest, natural Google review. Keep it positive but realistic. Do not invent details that were not mentioned. 2-4 sentences.",
  },
  {
    experience_level: "good",
    helper_label: "Polish my review",
    placeholder: "What went well during your visit?",
    ai_instruction:
      "Rewrite the customer notes into a fair, honest Google review. Mostly positive but natural. Do not invent details. 2-4 sentences.",
  },
  {
    experience_level: "okay",
    helper_label: "Help me explain",
    placeholder: "What was fine, and what could be better?",
    ai_instruction:
      "Rewrite the customer notes into a balanced, honest review. Mention positives and areas to improve without being harsh. Do not invent details. 2-4 sentences.",
  },
  {
    experience_level: "bad",
    helper_label: "Send private feedback",
    placeholder: "What went wrong? Be honest — this stays between you and the owner.",
    ai_instruction:
      "Rewrite the customer notes into calm private feedback for the business owner. Be honest but not aggressive. Do not escalate tone. Ask for follow-up politely. Do not create a public review draft.",
  },
];

export const EXPERIENCE_OPTIONS: {
  level: ExperienceLevel;
  label: string;
  emoji: string;
  subtitle: string;
  color: string;
}[] = [
  {
    level: "great",
    label: "Loved it",
    emoji: "🤩",
    subtitle: "Exceeded expectations",
    color: "border-amber-300 bg-amber-50 ring-amber-400",
  },
  {
    level: "good",
    label: "Good visit",
    emoji: "😊",
    subtitle: "Happy overall",
    color: "border-emerald-300 bg-emerald-50 ring-emerald-400",
  },
  {
    level: "okay",
    label: "It was okay",
    emoji: "😐",
    subtitle: "Mixed experience",
    color: "border-stone-300 bg-stone-50 ring-stone-400",
  },
  {
    level: "bad",
    label: "Not great",
    emoji: "😕",
    subtitle: "Something went wrong",
    color: "border-rose-300 bg-rose-50 ring-rose-400",
  },
];

export const INDUSTRY_OPTIONS = [
  { id: "car-wash", label: "Car wash", emoji: "🚗" },
  { id: "barber", label: "Barber / salon", emoji: "✂️" },
  { id: "restaurant", label: "Restaurant", emoji: "🍽️" },
  { id: "dental", label: "Dental / medical", emoji: "🦷" },
  { id: "gym", label: "Gym / fitness", emoji: "💪" },
  { id: "cleaning", label: "Cleaning", emoji: "🧹" },
  { id: "retail", label: "Retail shop", emoji: "🛍️" },
  { id: "other", label: "Other local business", emoji: "📍" },
] as const;

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}
