import { NextRequest, NextResponse } from "next/server";
import {
  buildSimpleVoiceTwiml,
  buildTransferTwiml,
} from "@/lib/twilio";
import {
  appendTranscript,
  loadCallHistory,
  resolveVoiceContext,
} from "@/lib/twilio-voice-context";
import { generateVoiceReply } from "@/lib/voice-conversation";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const to = String(formData.get("To") || "");
  const callSid = String(formData.get("CallSid") || "");
  const speech = String(formData.get("SpeechResult") || "").trim();

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";
  const ctx = await resolveVoiceContext(to);

  if (!speech) {
    const twiml = buildSimpleVoiceTwiml({
      message: "Sorry, I didn't catch that. Could you repeat?",
      gatherUrl: `${appUrl}/api/twilio/gather`,
    });
    return new NextResponse(twiml, {
      headers: { "Content-Type": "text/xml" },
    });
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
    const admin = createAdminClient();
    await admin
      .from("va_calls")
      .update({
        transferred: true,
        transfer_reason: reply.transferSummary,
        contained: false,
      })
      .eq("twilio_call_sid", callSid);

    const twiml = buildTransferTwiml({
      message: reply.text || "Connecting you now.",
      escalationPhone: ctx.escalationPhone,
      statusUrl: `${appUrl}/api/twilio/status`,
    });
    return new NextResponse(twiml, {
      headers: { "Content-Type": "text/xml" },
    });
  }

  const twiml = buildSimpleVoiceTwiml({
    message: reply.text,
    gatherUrl: `${appUrl}/api/twilio/gather`,
  });

  return new NextResponse(twiml, {
    headers: { "Content-Type": "text/xml" },
  });
}
