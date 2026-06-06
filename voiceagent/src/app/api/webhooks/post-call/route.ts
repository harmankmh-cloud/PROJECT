import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyOrchestratorKey } from "@/lib/auth";
import { analyzeCall } from "@/lib/intelligence";
import { logHubSpotCall } from "@/lib/integrations/hubspot";

export async function POST(request: NextRequest) {
  if (!verifyOrchestratorKey(request)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { callSid, transcripts } = await request.json();
  if (!callSid) {
    return NextResponse.json({ error: "Missing callSid" }, { status: 400 });
  }

  const admin = createAdminClient();
  const { data: call } = await admin
    .from("va_calls")
    .select("id, org_id, agent_id, from_number, transferred")
    .eq("twilio_call_sid", callSid)
    .maybeSingle();

  if (!call) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  if (transcripts?.length) {
    const existing = await admin
      .from("va_call_transcripts")
      .select("id")
      .eq("call_id", call.id)
      .limit(1);

    if (!existing.data?.length) {
      await admin.from("va_call_transcripts").insert(
        transcripts.map((t: { role: string; content: string }) => ({
          call_id: call.id,
          role: t.role,
          content: t.content,
        }))
      );
    }
  }

  const analysis = await analyzeCall(transcripts || []);

  await admin
    .from("va_calls")
    .update({
      summary: analysis.summary,
      sentiment: analysis.sentiment,
      intent: analysis.intent,
    })
    .eq("id", call.id);

  if (call.from_number) {
    await admin.from("va_contacts").upsert(
      {
        org_id: call.org_id,
        phone_number: call.from_number,
        last_call_at: new Date().toISOString(),
        memory: { lastIntent: analysis.intent, lastSummary: analysis.summary },
      },
      { onConflict: "org_id,phone_number" }
    );
  }

  if (!call.transferred) {
    await logHubSpotCall(call.org_id, {
      phone: call.from_number || "",
      summary: analysis.summary,
      agentId: call.agent_id || undefined,
    }).catch(() => {});
  }

  return NextResponse.json({ ok: true, analysis });
}
