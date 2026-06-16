import { after } from "next/server";
import { NextRequest } from "next/server";
import {
  buildConversationRelayTwiml,
  buildErrorTwiml,
  buildMediaStreamTwiml,
  buildSimpleVoiceTwiml,
  getOrchestratorStreamUrl,
  twimlResponse,
  isSimpleTwilioVoiceMode,
  isRealtimeTwilioVoiceMode,
} from "@/lib/twilio";
import { createAdminClient } from "@/lib/supabase/admin";
import { canAcceptNewCall, type BillingOrg } from "@/lib/billing-gates";
import { orgSelectFields } from "@/lib/billing-schema";
import { ensureCallRecord, resolveVoiceContext } from "@/lib/twilio-voice-context";
import { getFlowWelcomeGreeting } from "@/lib/voice-flow-runtime";
import { getPublicAppUrl } from "@/lib/public-url";
import { validateTwilioWebhook } from "@/lib/twilio-webhook";

const FLOW_GREETING_BUDGET_MS = 150;

async function resolveWelcomeGreeting(
  orgId: string,
  agentId: string,
  fallback: string
): Promise<string> {
  try {
    return await Promise.race([
      getFlowWelcomeGreeting(orgId, agentId, fallback),
      new Promise<string>((resolve) => setTimeout(() => resolve(fallback), FLOW_GREETING_BUDGET_MS)),
    ]);
  } catch {
    return fallback;
  }
}

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
          .select(
            await orgSelectFields(
              "id, plan, stripe_subscription_id, trial_minutes_remaining"
            )
          )
          .eq("id", ctx.orgId)
          .maybeSingle();
        if (orgRow) {
          const gate = await canAcceptNewCall(admin, {
            ...(orgRow as BillingOrg),
            id: ctx.orgId,
          });
          if (!gate.allowed) {
            return twimlResponse(
              buildErrorTwiml(
                gate.reason ||
                  "This line is not active. Please visit greetq.com to subscribe."
              )
            );
          }
        }
      } catch {
        // Fall through if admin client unavailable in dev
      }
    }

    after(async () => {
      await ensureCallRecord({
        callSid,
        orgId: ctx.orgId,
        agentId: ctx.agentId,
        from,
        to,
      });
    });

    const appUrl = getPublicAppUrl(request);

    if (isSimpleTwilioVoiceMode()) {
      const welcomeGreeting = await resolveWelcomeGreeting(
        ctx.orgId,
        ctx.agentId,
        ctx.welcomeGreeting
      );
      const twiml = buildSimpleVoiceTwiml({
        message: welcomeGreeting,
        gatherUrl: `${appUrl}/api/twilio/gather`,
      });
      return twimlResponse(twiml);
    }

    if (isRealtimeTwilioVoiceMode()) {
      const streamUrl = getOrchestratorStreamUrl({
        orgId: ctx.orgId,
        agentId: ctx.agentId,
        callSid,
        from,
      });

      console.info("MediaStream call (realtime)", {
        callSid,
        streamUrl: streamUrl.replace(/from=[^&]+/, "from=REDACTED"),
        orgId: ctx.orgId,
        agentId: ctx.agentId,
      });

      return twimlResponse(buildMediaStreamTwiml({ streamUrl }));
    }

    const welcomeGreeting = await resolveWelcomeGreeting(
      ctx.orgId,
      ctx.agentId,
      ctx.welcomeGreeting
    );

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
