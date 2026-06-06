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
    transcriptionProvider: "deepgram",
    ttsProvider: "elevenlabs",
    reportInputDuringAgentSpeech: "speech" as unknown as boolean,
  });

  relay.parameter({ name: "orgId", value: params.orgId });
  relay.parameter({ name: "agentId", value: params.agentId });

  return response.toString();
}
