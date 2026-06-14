export type ModelOption = {
  id: string;
  label: string;
  description: string;
  latency: "fast" | "balanced" | "quality";
  cost: "low" | "medium" | "high";
};

export const MODEL_CATALOG: ModelOption[] = [
  {
    id: "google/gemini-2.5-flash",
    label: "Gemini 2.5 Flash",
    description: "Fast, low cost — recommended for voice",
    latency: "fast",
    cost: "low",
  },
  {
    id: "google/gemini-2.0-flash-001",
    label: "Gemini 2.0 Flash",
    description: "Stable flash model",
    latency: "fast",
    cost: "low",
  },
  {
    id: "openai/gpt-4o-mini",
    label: "GPT-4o Mini",
    description: "Strong reasoning, quick replies",
    latency: "balanced",
    cost: "medium",
  },
  {
    id: "anthropic/claude-3.5-haiku",
    label: "Claude 3.5 Haiku",
    description: "Natural tone, good for reception",
    latency: "fast",
    cost: "medium",
  },
  {
    id: "meta-llama/llama-3.3-70b-instruct",
    label: "Llama 3.3 70B",
    description: "Open model, higher quality",
    latency: "balanced",
    cost: "low",
  },
];

export const DEFAULT_LLM_MODEL = "google/gemini-2.5-flash";

export function resolveAgentModel(model?: string | null): string {
  if (model?.trim()) return model.trim();
  const env = process.env.OPENROUTER_MODEL?.trim().replace(/^OPENROUTER_MODEL=/i, "");
  return env || DEFAULT_LLM_MODEL;
}
