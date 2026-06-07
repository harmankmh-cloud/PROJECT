import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";

export async function POST(request: NextRequest) {
  const formData = await request.formData();
  const callSid = String(formData.get("CallSid") || "");
  const callStatus = String(formData.get("CallStatus") || "completed");
  const duration = Number(formData.get("CallDuration") || 0);

  if (!callSid) {
    return NextResponse.json({ ok: true });
  }

  const admin = createAdminClient();
  const { data: call } = await admin
    .from("va_calls")
    .select("id, org_id, transferred")
    .eq("twilio_call_sid", callSid)
    .maybeSingle();

  if (call) {
    const minutes = Math.max(1, Math.ceil(duration / 60));
    const costCents = minutes * 10;

    await admin
      .from("va_calls")
      .update({
        status: callStatus,
        duration_seconds: duration,
        cost_cents: costCents,
        contained: !call.transferred,
        ended_at: new Date().toISOString(),
      })
      .eq("id", call.id);

    await admin.from("va_usage_events").insert({
      org_id: call.org_id,
      call_id: call.id,
      event_type: "voice_minute",
      quantity: minutes,
    });
  }

  return NextResponse.json({ ok: true });
}
