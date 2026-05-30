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
    helper_label: "Improve my review",
    placeholder: "What did you like? Example: fast service, friendly staff, clean place",
    ai_instruction:
      "Rewrite the customer notes into a clear, honest, natural Google review. Keep it positive but realistic. Do not invent details that were not mentioned. 2-4 sentences.",
  },
  {
    experience_level: "good",
    helper_label: "Make my review sound better",
    placeholder: "What went well? Example: good service, helpful team",
    ai_instruction:
      "Rewrite the customer notes into a fair, honest Google review. Mostly positive but natural. Do not invent details. 2-4 sentences.",
  },
  {
    experience_level: "okay",
    helper_label: "Make my feedback clear",
    placeholder: "What was okay and what could improve?",
    ai_instruction:
      "Rewrite the customer notes into a balanced, honest review. Mention positives and areas to improve without being harsh. Do not invent details. 2-4 sentences.",
  },
  {
    experience_level: "bad",
    helper_label: "Help me explain the issue privately",
    placeholder: "What went wrong? Example: long wait, poor communication",
    ai_instruction:
      "Rewrite the customer notes into calm private feedback for the business owner. Be honest but not aggressive. Do not escalate tone. Ask for follow-up politely. Do not create a public review draft.",
  },
];

export const EXPERIENCE_OPTIONS: { level: ExperienceLevel; label: string }[] = [
  { level: "great", label: "Great" },
  { level: "good", label: "Good" },
  { level: "okay", label: "Okay" },
  { level: "bad", label: "Not good" },
];

export function slugify(name: string): string {
  return name
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 48);
}
