import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getTwilioClient } from "@/lib/twilio";
import { verifyOrchestratorKey } from "@/lib/auth";
import { logHubSpotCall } from "@/lib/integrations/hubspot";
import { getPublicAppUrl } from "@/lib/public-url";
import { escapeXml } from "@/lib/twilio-webhook";

export async function POST(request: NextRequest) {
  if (!verifyOrchestratorKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const {
    callSid,
    orgId,
    agentId,
    transferPhone,
    handoffSummary,
    from,
    transcripts,
  } = body;

  const admin = createAdminClient();
  const handoffPayload = {
    summary: handoffSummary,
    caller: from,
    transcript: transcripts,
    transferredAt: new Date().toISOString(),
  };

  const { data: call } = await admin
    .from("va_calls")
    .update({
      transferred: true,
      transfer_reason: handoffSummary,
      handoff_payload: handoffPayload,
      contained: false,
    })
    .eq("twilio_call_sid", callSid)
    .select("id, to_number")
    .maybeSingle();

  if (call?.id && transcripts?.length) {
    const rows = transcripts.map((t: { role: string; content: string }) => ({
      call_id: call.id,
      role: t.role,
      content: t.content,
    }));
    await admin.from("va_call_transcripts").insert(rows);
  }

  const client = getTwilioClient();
  if (client && transferPhone && callSid) {
    const appUrl = getPublicAppUrl(request);
    const callerId = call?.to_number || process.env.TWILIO_PHONE_NUMBER || from;
    const safeCallerId = escapeXml(String(callerId || ""));
    const safePhone = escapeXml(String(transferPhone));
    const statusUrl = escapeXml(`${appUrl}/api/twilio/status`);
    const twiml = `<?xml version="1.0" encoding="UTF-8"?>
<Response>
  <Say voice="Polly.Joanna">Please hold while I connect you.</Say>
  <Dial callerId="${safeCallerId}" action="${statusUrl}">
    <Number>${safePhone}</Number>
  </Dial>
</Response>`;

    await client.calls(callSid).update({ twiml });
  }

  if (orgId && from) {
    await logHubSpotCall(orgId, {
      phone: from,
      summary: handoffSummary || "Warm transfer from AI agent",
      agentId,
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true, handoffPayload });
}
