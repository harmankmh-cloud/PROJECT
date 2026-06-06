import { NextRequest, NextResponse } from "next/server";
import {
  buildConversationRelayTwiml,
  buildSimpleVoiceTwiml,
  useSimpleTwilioVoice,
} from "@/lib/twilio";
import { ensureCallRecord, resolveVoiceContext } from "@/lib/twilio-voice-context";

export async function POST(request: NextRequest) {
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

  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3002";

  if (useSimpleTwilioVoice()) {
    const twiml = buildSimpleVoiceTwiml({
      message: ctx.welcomeGreeting,
      gatherUrl: `${appUrl}/api/twilio/gather`,
    });
    return new NextResponse(twiml, {
      headers: { "Content-Type": "text/xml" },
    });
  }

  const twiml = buildConversationRelayTwiml({
    orgId: ctx.orgId,
    agentId: ctx.agentId,
    welcomeGreeting: ctx.welcomeGreeting,
    actionUrl: `${appUrl}/api/twilio/status`,
  });

  return new NextResponse(twiml, {
    headers: { "Content-Type": "text/xml" },
  });
}
