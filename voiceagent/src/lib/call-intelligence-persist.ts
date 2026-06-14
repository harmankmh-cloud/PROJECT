import "server-only";
import type { CallIntelligence } from "./intelligence";

export function intelligenceToCallUpdate(
  analysis: CallIntelligence,
  existingPayload?: Record<string, unknown> | null
) {
  const handoff_payload = {
    ...(existingPayload || {}),
    intelligence: {
      score: analysis.score,
      topics: analysis.topics,
      actionItems: analysis.actionItems,
    },
  };

  return {
    summary: analysis.summary,
    sentiment: analysis.sentiment,
    intent: analysis.intent,
    score: analysis.score,
    topics: analysis.topics,
    action_items: analysis.actionItems,
    handoff_payload,
  };
}
