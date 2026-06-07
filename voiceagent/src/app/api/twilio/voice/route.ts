import { NextRequest } from "next/server";
import {
  buildConversationRelayTwiml,
  buildErrorTwiml,
  buildSimpleVoiceTwiml,
  twimlResponse,
  useSimpleTwilioVoice,
} from "@/lib/twilio";
import { ensureCallRecord, resolveVoiceContext } from "@/lib/twilio-voice-context";
import { getPublicAppUrl } from "@/lib/public-url";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const to = String(formData.get("To") || "");
    const callSid = String(formData.get("CallSid") || "");
    const from = String(formData.get("From") || "");

    const ctx = await resolveVoiceContext(to);
    await ensureCallRecord({
      callSid,
      orgId: ctx.orgId,
      agentId: ctx.agentId,
      from,
      to,
    });

    const appUrl = getPublicAppUrl(request);

    if (useSimpleTwilioVoice()) {
      const twiml = buildSimpleVoiceTwiml({
        message: ctx.welcomeGreeting,
        gatherUrl: `${appUrl}/api/twilio/gather`,
      });
      return twimlResponse(twiml);
    }

    const twiml = buildConversationRelayTwiml({
      orgId: ctx.orgId,
      agentId: ctx.agentId,
      welcomeGreeting: ctx.welcomeGreeting,
      actionUrl: `${appUrl}/api/twilio/status`,
      voice: ctx.voice,
    });

    console.info("ConversationRelay call", {
      callSid,
      wssUrl: process.env.ORCHESTRATOR_WSS_URL,
      orgId: ctx.orgId,
      agentId: ctx.agentId,
    });

    return twimlResponse(twiml);
  } catch (err) {
    console.error("Twilio voice webhook error:", err);
    return twimlResponse(buildErrorTwiml());
  }
}
