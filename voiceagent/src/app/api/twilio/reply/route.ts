import { NextRequest } from "next/server";
import { after } from "next/server";
import {
  buildSimpleVoiceTwiml,
  buildTransferTwiml,
  twimlResponse,
} from "@/lib/twilio";
import {
  appendTranscript,
  loadCallHistory,
  resolveVoiceContext,
} from "@/lib/twilio-voice-context";
import { loadKnowledgeContext } from "@/lib/knowledge-context";
import { processVoiceTurn } from "@/lib/voice-flow-runtime";
import { createAdminClient } from "@/lib/supabase/admin";
import { getPublicAppUrl } from "@/lib/public-url";
import { takePendingSpeech } from "@/lib/pending-speech";
import { validateTwilioWebhook } from "@/lib/twilio-webhook";

export async function POST(request: NextRequest) {
  const appUrl = getPublicAppUrl(request);
  const gatherUrl = `${appUrl}/api/twilio/gather`;

  try {
    const formData = await request.formData();
    if (!validateTwilioWebhook(request, formData)) {
      return twimlResponse(buildSimpleVoiceTwiml({ message: "Unauthorized.", gatherUrl }));
    }
    const callSid = String(formData.get("CallSid") || "");
    const to = String(formData.get("To") || "");
    const from = String(formData.get("From") || "");

    const pending = takePendingSpeech(callSid);
    if (!pending) {
      return twimlResponse(
        buildSimpleVoiceTwiml({
          message: "Sorry, I lost your question. Could you ask again?",
          gatherUrl,
        })
      );
    }

    const [ctx, history] = await Promise.all([
      resolveVoiceContext(pending.to || to),
      loadCallHistory(callSid),
    ]);

    let knowledgeContext: string | undefined;
    if (ctx.orgId !== "default") {
      try {
        const admin = createAdminClient();
        const { data: agent } = await admin
          .from("va_agents")
          .select("knowledge_base_enabled")
          .eq("id", ctx.agentId)
          .maybeSingle();
        if (agent?.knowledge_base_enabled) {
          knowledgeContext =
            (await loadKnowledgeContext(ctx.orgId, ctx.agentId, pending.speech)) || undefined;
        }
      } catch {
        /* knowledge optional */
      }
    }

    const reply = await processVoiceTurn({
      callSid,
      orgId: ctx.orgId,
      agentId: ctx.agentId,
      userMessage: pending.speech,
      systemPrompt: ctx.systemPrompt,
      knowledgeContext,
      escalationPhone: ctx.escalationPhone,
      callerPhone: from || undefined,
      history,
    });

    after(async () => {
      await appendTranscript(callSid, "user", pending.speech);
      await appendTranscript(callSid, "assistant", reply.text);
    });

    if (reply.shouldTransfer && ctx.escalationPhone) {
      try {
        const admin = createAdminClient();
        await admin
          .from("va_calls")
          .update({
            transferred: true,
            transfer_reason: reply.transferSummary,
            contained: false,
          })
          .eq("twilio_call_sid", callSid);
      } catch (err) {
        console.error("Transfer update failed:", err);
      }

      return twimlResponse(
        buildTransferTwiml({
          message: reply.text || "Connecting you now.",
          escalationPhone: ctx.escalationPhone,
          statusUrl: `${appUrl}/api/twilio/status`,
        })
      );
    }

    return twimlResponse(
      buildSimpleVoiceTwiml({
        message: reply.text,
        gatherUrl,
      })
    );
  } catch (err) {
    console.error("Twilio reply webhook error:", err);
    return twimlResponse(
      buildSimpleVoiceTwiml({
        message: "Sorry, I had a brief issue. Please ask your question again.",
        gatherUrl,
      })
    );
  }
}
