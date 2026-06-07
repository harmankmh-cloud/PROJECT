import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyOrchestratorKey } from "@/lib/auth";
import { analyzeCall } from "@/lib/intelligence";
import { intelligenceToCallUpdate } from "@/lib/call-intelligence-persist";
import { dispatchCallWebhook } from "@/lib/outbound-webhook";
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
    .select("id, org_id, agent_id, from_number, transferred, ended_at, created_at, handoff_payload")
    .eq("twilio_call_sid", callSid)
    .maybeSingle();

  if (!call) {
    return NextResponse.json({ ok: true, skipped: true });
  }

  const alreadyClosed = Boolean(call.ended_at);

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

  const durationSeconds = alreadyClosed
    ? 0
    : Math.max(30, Math.floor((Date.now() - new Date(call.created_at).getTime()) / 1000));
  const minutes = Math.max(1, Math.ceil(durationSeconds / 60));

  await admin
    .from("va_calls")
    .update({
      ...(alreadyClosed
        ? intelligenceToCallUpdate(analysis, call.handoff_payload as Record<string, unknown> | null)
        : {
            status: "completed",
            ended_at: new Date().toISOString(),
            duration_seconds: durationSeconds,
            contained: !call.transferred,
            ...intelligenceToCallUpdate(
              analysis,
              call.handoff_payload as Record<string, unknown> | null
            ),
          }),
    })
    .eq("id", call.id);

  if (!alreadyClosed) {
    const { count } = await admin
      .from("va_usage_events")
      .select("id", { count: "exact", head: true })
      .eq("call_id", call.id)
      .eq("event_type", "voice_minute");

    if (!count) {
      await admin.from("va_usage_events").insert({
        org_id: call.org_id,
        call_id: call.id,
        event_type: "voice_minute",
        quantity: minutes,
      });
    }
  }

  await dispatchCallWebhook(call.org_id, {
    event: "call.completed",
    call: { id: call.id, from_number: call.from_number, transferred: call.transferred },
    analysis,
  });

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
