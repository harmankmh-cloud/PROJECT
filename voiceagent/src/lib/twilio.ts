import "server-only";
import twilio from "twilio";

export function getTwilioClient() {
  const sid = process.env.TWILIO_ACCOUNT_SID;
  const token = process.env.TWILIO_AUTH_TOKEN;
  if (!sid || !token) return null;
  return twilio(sid, token);
}

export function getOrchestratorWssUrl() {
  return process.env.ORCHESTRATOR_WSS_URL || "wss://localhost:8080/ws";
}

export function useSimpleTwilioVoice() {
  return (process.env.TWILIO_VOICE_MODE || "simple") === "simple";
}

export function twimlResponse(xml: string) {
  return new Response(xml, {
    headers: { "Content-Type": "text/xml" },
  });
}

export function buildErrorTwiml(message = "Sorry, something went wrong. Please try again later.") {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();
  response.say({ voice: "Polly.Joanna" }, message);
  response.hangup();
  return response.toString();
}

function sanitizeSayText(text: string) {
  const cleaned = text
    .normalize("NFKD")
    .replace(/[\u2010-\u2015]/g, "-")
    .replace(/[<>&]/g, " ")
    .replace(/[^\x20-\x7E]/g, " ")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 500);

  return cleaned || "Please wait a moment.";
}

const SPEECH_HINTS =
  "business hours, appointment, booking, help, support, pricing, location, address, phone, email, transfer, human, agent, open, closed, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday, Sunday, today, tomorrow";

function addSpeechGather(
  response: InstanceType<typeof twilio.twiml.VoiceResponse>,
  gatherUrl: string,
  hints?: string
) {
  response.gather({
    input: ["speech"],
    action: gatherUrl,
    method: "POST",
    language: "en-US",
    speechModel: "phone_call",
    enhanced: true,
    hints: hints || SPEECH_HINTS,
    speechTimeout: "3",
    profanityFilter: false,
    timeout: 8,
    actionOnEmptyResult: true,
  });
}

export function buildSimpleVoiceTwiml(params: {
  message: string;
  gatherUrl: string;
  hints?: string;
}) {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();
  response.say({ voice: "Polly.Joanna" }, sanitizeSayText(params.message));
  addSpeechGather(response, params.gatherUrl, params.hints);
  response.say({ voice: "Polly.Joanna" }, "I didn't hear anything. Goodbye.");
  return response.toString();
}

export function buildProcessingTwiml(params: { replyUrl: string }) {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();
  response.say({ voice: "Polly.Joanna" }, "Got it.");
  response.redirect({ method: "POST" }, params.replyUrl);
  return response.toString();
}

export function buildTransferTwiml(params: {
  message: string;
  escalationPhone: string;
  statusUrl: string;
}) {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();
  response.say({ voice: "Polly.Joanna" }, sanitizeSayText(params.message));
  const dial = response.dial({
    action: params.statusUrl,
    method: "POST",
  });
  dial.number(params.escalationPhone);
  return response.toString();
}

function isPollyOrAmazonVoice(voice: string) {
  return /polly\.|neural|en-us-|en-gb-/i.test(voice);
}

export function resolveRelayVoice(agentVoice?: string) {
  const ttsProvider = process.env.TWILIO_RELAY_TTS_PROVIDER || "ElevenLabs";
  const fallback =
    process.env.TWILIO_RELAY_VOICE ||
    "ZF6FPAbjXT4488VcRRnw-flash_v2_5-1.15_0.85_0.9";

  if (!agentVoice) return fallback;

  if (ttsProvider === "ElevenLabs" && isPollyOrAmazonVoice(agentVoice)) {
    return fallback;
  }

  if (ttsProvider === "Amazon" && !isPollyOrAmazonVoice(agentVoice)) {
    return "Joanna-Neural";
  }

  return agentVoice;
}

export function getRelayVoiceSettings() {
  const ttsProvider = process.env.TWILIO_RELAY_TTS_PROVIDER || "ElevenLabs";
  const voice =
    process.env.TWILIO_RELAY_VOICE ||
    "ZF6FPAbjXT4488VcRRnw-flash_v2_5-1.15_0.85_0.9";

  return {
    transcriptionProvider: process.env.TWILIO_RELAY_STT_PROVIDER || "Deepgram",
    speechModel: process.env.TWILIO_RELAY_SPEECH_MODEL || "nova-3-general",
    ttsProvider,
    voice,
    language: "en-US",
    interruptible: "speech",
    interruptSensitivity: "high",
    hints: SPEECH_HINTS,
    elevenlabsTextNormalization:
      ttsProvider === "ElevenLabs"
        ? process.env.TWILIO_RELAY_ELEVENLABS_NORMALIZE || "on"
        : undefined,
  };
}

export function buildConversationRelayTwiml(params: {
  orgId: string;
  agentId: string;
  welcomeGreeting: string;
  actionUrl: string;
  voice?: string;
}) {
  const wssUrl = getOrchestratorWssUrl();
  const relaySettings = getRelayVoiceSettings();
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();

  const connect = response.connect({ action: params.actionUrl });
  const relay = connect.conversationRelay({
    url: wssUrl,
    welcomeGreeting: params.welcomeGreeting,
    welcomeGreetingInterruptible: "speech",
    transcriptionProvider: relaySettings.transcriptionProvider,
    speechModel: relaySettings.speechModel,
    ttsProvider: relaySettings.ttsProvider,
    voice: resolveRelayVoice(params.voice) || relaySettings.voice,
    language: relaySettings.language,
    ttsLanguage: relaySettings.language,
    transcriptionLanguage: relaySettings.language,
    interruptible: relaySettings.interruptible,
    interruptSensitivity: relaySettings.interruptSensitivity,
    hints: relaySettings.hints,
    partialPrompts: false,
    preemptible: true,
    reportInputDuringAgentSpeech: true,
    ...(relaySettings.elevenlabsTextNormalization
      ? { elevenlabsTextNormalization: relaySettings.elevenlabsTextNormalization }
      : {}),
  });

  relay.parameter({ name: "orgId", value: params.orgId });
  relay.parameter({ name: "agentId", value: params.agentId });

  return response.toString();
}
