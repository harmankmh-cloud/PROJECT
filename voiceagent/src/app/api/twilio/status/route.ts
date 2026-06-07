import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateTwilioWebhook } from "@/lib/twilio-webhook";
import { analyzeCall } from "@/lib/intelligence";
import { intelligenceToCallUpdate } from "@/lib/call-intelligence-persist";
import { dispatchCallWebhook } from "@/lib/outbound-webhook";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  if (!validateTwilioWebhook(request, formData)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const callSid = String(formData.get("CallSid") || "");
  const callStatus = String(formData.get("CallStatus") || "completed");
  const duration = Number(formData.get("CallDuration") || 0);

  if (!callSid) {
    return NextResponse.json({ ok: true });
  }

  let admin;
  try {
    admin = createAdminClient();
  } catch {
    return NextResponse.json({ ok: true });
  }
  const { data: call } = await admin
    .from("va_calls")
    .select("id, org_id, agent_id, from_number, transferred, ended_at, handoff_payload")
    .eq("twilio_call_sid", callSid)
    .maybeSingle();

  if (call && !call.ended_at) {
    const minutes = Math.max(1, Math.ceil(duration / 60));
    const costCents = minutes * 10;

    const { data: transcripts } = await admin
      .from("va_call_transcripts")
      .select("role, content")
      .eq("call_id", call.id);

    const analysis = await analyzeCall(transcripts || []);

    await admin
      .from("va_calls")
      .update({
        status: callStatus,
        duration_seconds: duration,
        cost_cents: costCents,
        contained: !call.transferred,
        ended_at: new Date().toISOString(),
        ...intelligenceToCallUpdate(
          analysis,
          call.handoff_payload as Record<string, unknown> | null
        ),
      })
      .eq("id", call.id);

    await admin.from("va_usage_events").insert({
      org_id: call.org_id,
      call_id: call.id,
      event_type: "voice_minute",
      quantity: minutes,
    });

    await dispatchCallWebhook(call.org_id, {
      event: "call.completed",
      call: {
        id: call.id,
        from_number: call.from_number,
        transferred: call.transferred,
        duration,
      },
      analysis,
    });
  }

  return NextResponse.json({ ok: true });
}
