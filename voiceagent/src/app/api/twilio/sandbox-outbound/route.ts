import { NextRequest } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import {
  buildConversationRelayTwiml,
  buildErrorTwiml,
  buildSimpleVoiceTwiml,
  isSimpleTwilioVoiceMode,
  twimlResponse,
} from "@/lib/twilio";
import { getPublicAppUrl } from "@/lib/public-url";
import { validateTwilioWebhook } from "@/lib/twilio-webhook";
import { getFlowWelcomeGreeting } from "@/lib/voice-flow-runtime";
import { ensureCallRecord } from "@/lib/twilio-voice-context";

/** TwiML for outbound sandbox test calls — agent context from query params. */
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    if (!validateTwilioWebhook(request, formData)) {
      return twimlResponse(buildErrorTwiml("Unauthorized request."));
    }

    const orgId = request.nextUrl.searchParams.get("org_id") || "";
    const agentId = request.nextUrl.searchParams.get("agent_id") || "";
    const callSid = String(formData.get("CallSid") || "");
    const from = String(formData.get("From") || "");
    const to = String(formData.get("To") || "");

    if (!orgId || !agentId) {
      return twimlResponse(buildErrorTwiml("Sandbox call is missing agent context."));
    }

    const admin = createAdminClient();
    const { data: agent } = await admin
      .from("va_agents")
      .select("id, org_id, welcome_greeting, voice, voice_id")
      .eq("id", agentId)
      .eq("org_id", orgId)
      .maybeSingle();

    if (!agent) {
      return twimlResponse(buildErrorTwiml("Agent not found for this test call."));
    }

    const welcomeGreeting = await getFlowWelcomeGreeting(
      orgId,
      agentId,
      agent.welcome_greeting || "Hello! Thanks for calling. How can I help?"
    );

    await ensureCallRecord({
      callSid,
      orgId,
      agentId,
      from,
      to,
    });

    const appUrl = getPublicAppUrl(request);

    if (isSimpleTwilioVoiceMode()) {
      return twimlResponse(
        buildSimpleVoiceTwiml({
          message: welcomeGreeting,
          gatherUrl: `${appUrl}/api/twilio/gather`,
        })
      );
    }

    return twimlResponse(
      buildConversationRelayTwiml({
        orgId,
        agentId,
        welcomeGreeting,
        actionUrl: `${appUrl}/api/twilio/status`,
        voice: agent.voice || undefined,
        voiceId: agent.voice_id || undefined,
      })
    );
  } catch (err) {
    console.error("sandbox-outbound TwiML error:", err);
    return twimlResponse(buildErrorTwiml("Sorry, the test call could not start."));
  }
}
