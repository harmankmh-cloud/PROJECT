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
  return text.replace(/[<>&]/g, " ").replace(/\s+/g, " ").trim().slice(0, 500);
}

export function buildSimpleVoiceTwiml(params: {
  message: string;
  gatherUrl: string;
}) {
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();
  const gather = response.gather({
    input: ["speech"],
    action: params.gatherUrl,
    method: "POST",
    speechTimeout: "auto",
    language: "en-US",
  });
  gather.say({ voice: "Polly.Joanna" }, sanitizeSayText(params.message));
  response.say({ voice: "Polly.Joanna" }, "I didn't hear anything. Goodbye.");
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

export function buildConversationRelayTwiml(params: {
  orgId: string;
  agentId: string;
  welcomeGreeting: string;
  actionUrl: string;
}) {
  const wssUrl = getOrchestratorWssUrl();
  const VoiceResponse = twilio.twiml.VoiceResponse;
  const response = new VoiceResponse();

  const connect = response.connect({ action: params.actionUrl });
  const relay = connect.conversationRelay({
    url: wssUrl,
    welcomeGreeting: params.welcomeGreeting,
    reportInputDuringAgentSpeech: "speech" as unknown as boolean,
  });

  relay.parameter({ name: "orgId", value: params.orgId });
  relay.parameter({ name: "agentId", value: params.agentId });

  return response.toString();
}
