import { NextRequest } from "next/server";
import {
  buildConversationRelayTwiml,
  buildErrorTwiml,
  buildSimpleVoiceTwiml,
  twimlResponse,
  isSimpleTwilioVoiceMode,
} from "@/lib/twilio";
import { ensureCallRecord, resolveVoiceContext } from "@/lib/twilio-voice-context";
import { getPublicAppUrl } from "@/lib/public-url";
import { validateTwilioWebhook } from "@/lib/twilio-webhook";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    if (!validateTwilioWebhook(request, formData)) {
      return twimlResponse(buildErrorTwiml("Unauthorized request."));
    }

    const to = String(formData.get("To") || "");
    const callSid = String(formData.get("CallSid") || "");
    const from = String(formData.get("From") || "");
    const direction = String(formData.get("Direction") || "inbound");
    const lookupNumber = direction.toLowerCase().startsWith("outbound") ? from : to;

    const ctx = await resolveVoiceContext(lookupNumber);
    await ensureCallRecord({
      callSid,
      orgId: ctx.orgId,
      agentId: ctx.agentId,
      from,
      to,
    });

    const appUrl = getPublicAppUrl(request);

    if (isSimpleTwilioVoiceMode()) {
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
