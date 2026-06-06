import { NextRequest } from "next/server";
import {
  buildErrorTwiml,
  buildSimpleVoiceTwiml,
  buildTransferTwiml,
  twimlResponse,
} from "@/lib/twilio";
import {
  appendTranscript,
  loadCallHistory,
  resolveVoiceContext,
} from "@/lib/twilio-voice-context";
import { generateVoiceReply } from "@/lib/voice-conversation";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";
  const gatherUrl = `${appUrl}/api/twilio/gather`;

  try {
    const formData = await request.formData();
    const to = String(formData.get("To") || "");
    const callSid = String(formData.get("CallSid") || "");
    const speech = String(formData.get("SpeechResult") || "").trim();

    const ctx = await resolveVoiceContext(to);

    if (!speech) {
      return twimlResponse(
        buildSimpleVoiceTwiml({
          message: "Sorry, I didn't catch that. Could you repeat?",
          gatherUrl,
        })
      );
    }

    await appendTranscript(callSid, "user", speech);
    const history = await loadCallHistory(callSid);

    const reply = await generateVoiceReply({
      systemPrompt: ctx.systemPrompt,
      history,
      userMessage: speech,
    });

    await appendTranscript(callSid, "assistant", reply.text);

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
    console.error("Twilio gather webhook error:", err);
    return twimlResponse(
      buildSimpleVoiceTwiml({
        message: "Sorry, I had a brief issue. Please ask your question again.",
        gatherUrl,
      })
    );
  }
}
