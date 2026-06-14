import type { VoiceProvider } from "./types";

export type VoiceOption = {
  id: string;
  provider: VoiceProvider;
  name: string;
  gender: "female" | "male" | "neutral";
  accent: string;
  language: string;
  description: string;
  telnyxVoice?: string;
  pollyVoice?: string;
  elevenLabsId?: string;
};

export const VOICE_CATALOG: VoiceOption[] = [
  {
    id: "telnyx-female",
    provider: "telnyx",
    name: "Ava",
    gender: "female",
    accent: "US English",
    language: "en-US",
    description: "Warm, clear — default for Telnyx",
    telnyxVoice: "female",
  },
  {
    id: "telnyx-male",
    provider: "telnyx",
    name: "James",
    gender: "male",
    accent: "US English",
    language: "en-US",
    description: "Professional male voice",
    telnyxVoice: "male",
  },
  {
    id: "polly-joanna",
    provider: "polly",
    name: "Joanna",
    gender: "female",
    accent: "US English",
    language: "en-US",
    description: "Amazon Polly — natural US female",
    pollyVoice: "Polly.Joanna",
  },
  {
    id: "polly-matthew",
    provider: "polly",
    name: "Matthew",
    gender: "male",
    accent: "US English",
    language: "en-US",
    description: "Amazon Polly — US male",
    pollyVoice: "Polly.Matthew",
  },
  {
    id: "polly-amy",
    provider: "polly",
    name: "Amy",
    gender: "female",
    accent: "British English",
    language: "en-GB",
    description: "Amazon Polly — British female",
    pollyVoice: "Polly.Amy",
  },
  {
    id: "eleven-rachel",
    provider: "elevenlabs",
    name: "Rachel",
    gender: "female",
    accent: "US English",
    language: "en-US",
    description: "ElevenLabs — conversational (Twilio relay)",
    elevenLabsId: "21m00Tcm4TlvDq8ikWAM",
  },
  {
    id: "eleven-adam",
    provider: "elevenlabs",
    name: "Adam",
    gender: "male",
    accent: "US English",
    language: "en-US",
    description: "ElevenLabs — deep narrative (Twilio relay)",
    elevenLabsId: "pNInz6obpgDQGcFmaJgB",
  },
];

export const DEFAULT_VOICE_ID = "telnyx-female";

export function getVoiceById(id: string): VoiceOption | undefined {
  return VOICE_CATALOG.find((v) => v.id === id);
}

export function resolveTelnyxSpeakVoice(voiceId?: string, legacyVoice?: string): {
  voice: string;
  language: string;
} {
  const option = voiceId ? getVoiceById(voiceId) : undefined;
  if (option?.telnyxVoice) {
    return { voice: option.telnyxVoice, language: option.language };
  }
  if (legacyVoice === "male" || legacyVoice === "female") {
    return { voice: legacyVoice, language: "en-US" };
  }
  if (legacyVoice?.toLowerCase().includes("matthew")) {
    return { voice: "male", language: "en-US" };
  }
  return { voice: "female", language: "en-US" };
}

export function agentVoiceFields(agent: {
  voice_id?: string | null;
  voice?: string | null;
  voice_provider?: string | null;
  language?: string | null;
}) {
  const voiceId = agent.voice_id || DEFAULT_VOICE_ID;
  const option = getVoiceById(voiceId);
  const telnyx = resolveTelnyxSpeakVoice(voiceId, agent.voice || undefined);
  return {
    voice_id: voiceId,
    voice_provider: (agent.voice_provider || option?.provider || "telnyx") as VoiceProvider,
    language: agent.language || option?.language || telnyx.language,
    telnyx_voice: telnyx.voice,
    relay_voice: option?.elevenLabsId || option?.pollyVoice || agent.voice || undefined,
  };
}
