import { NextRequest } from "next/server";
import {
  buildConversationRelayTwiml,
  buildErrorTwiml,
  buildSimpleVoiceTwiml,
  twimlResponse,
  isSimpleTwilioVoiceMode,
} from "@/lib/twilio";
import { createAdminClient } from "@/lib/supabase/admin";
import { canMakeProductionCall, productionBlockReason, type TrialOrg } from "@/lib/trial";
import { ensureCallRecord, resolveVoiceContext } from "@/lib/twilio-voice-context";
import { getFlowWelcomeGreeting } from "@/lib/voice-flow-runtime";
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

    if (ctx.orgId && ctx.orgId !== "default") {
      try {
        const admin = createAdminClient();
        const { data: orgRow } = await admin
          .from("va_organizations")
          .select("plan, stripe_subscription_id, trial_minutes_remaining")
          .eq("id", ctx.orgId)
          .maybeSingle();
        if (orgRow && !canMakeProductionCall(orgRow as TrialOrg)) {
          return twimlResponse(
            buildErrorTwiml(
              productionBlockReason(orgRow as TrialOrg) ||
                "This line is not active. Please visit greetq.com to subscribe."
            )
          );
        }
      } catch {
        // Fall through if admin client unavailable in dev
      }
    }

    const welcomeGreeting = await getFlowWelcomeGreeting(
      ctx.orgId,
      ctx.agentId,
      ctx.welcomeGreeting
    );
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
        message: welcomeGreeting,
        gatherUrl: `${appUrl}/api/twilio/gather`,
      });
      return twimlResponse(twiml);
    }

    const twiml = buildConversationRelayTwiml({
      orgId: ctx.orgId,
      agentId: ctx.agentId,
      welcomeGreeting,
      actionUrl: `${appUrl}/api/twilio/status`,
      voice: ctx.voice,
      voiceId: ctx.voiceId,
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
