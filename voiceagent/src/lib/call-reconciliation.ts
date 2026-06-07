import "server-only";
import type { SupabaseClient } from "@supabase/supabase-js";
import { analyzeCall } from "./intelligence";
import { intelligenceToCallUpdate } from "./call-intelligence-persist";

const STALE_MS = 2 * 60 * 60 * 1000; // 2 hours

/** Close calls stuck in-progress when hangup webhooks were missed. */
export async function reconcileStaleCalls(
  admin: SupabaseClient,
  orgId: string
): Promise<number> {
  const cutoff = new Date(Date.now() - STALE_MS).toISOString();

  const { data: stale } = await admin
    .from("va_calls")
    .select("id, org_id, created_at, ended_at, status, handoff_payload, transferred, from_number")
    .eq("org_id", orgId)
    .is("ended_at", null)
    .lt("created_at", cutoff)
    .limit(50);

  if (!stale?.length) return 0;

  let closed = 0;

  for (const call of stale) {
    const started = new Date(call.created_at).getTime();
    const durationSeconds = Math.max(30, Math.floor((Date.now() - started) / 1000));
    const minutes = Math.max(1, Math.ceil(durationSeconds / 60));

    const { data: transcripts } = await admin
      .from("va_call_transcripts")
      .select("role, content")
      .eq("call_id", call.id);

    const analysis = await analyzeCall(transcripts || []);

    await admin
      .from("va_calls")
      .update({
        status: "completed",
        duration_seconds: durationSeconds,
        ended_at: new Date().toISOString(),
        contained: !call.transferred,
        ...intelligenceToCallUpdate(
          analysis,
          call.handoff_payload as Record<string, unknown> | null
        ),
      })
      .eq("id", call.id);

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

    closed++;
  }

  return closed;
}
