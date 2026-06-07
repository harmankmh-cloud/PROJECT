import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateTelnyxWebhook } from "@/lib/telnyx-webhook";
import {
  answerCall,
  decodeClientState,
  encodeClientState,
  speakOnCall,
  startTranscription,
  transferCall,
} from "@/lib/telnyx";
import { loadKnowledgeContext } from "@/lib/knowledge-context";
import { processVoiceTurn } from "@/lib/voice-flow-runtime";
import { logHubSpotCall } from "@/lib/integrations/hubspot";
import { analyzeCall } from "@/lib/intelligence";
import { intelligenceToCallUpdate } from "@/lib/call-intelligence-persist";
import { dispatchCallWebhook } from "@/lib/outbound-webhook";
import { isWithinBusinessHours, type BusinessHours } from "@/lib/business-hours";

export async function POST(request: NextRequest) {
  const rawBody = await request.text();
  if (!validateTelnyxWebhook(request, rawBody)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = JSON.parse(rawBody);
  const eventType = body?.data?.event_type as string | undefined;
  const payload = body?.data?.payload;

  if (!eventType || !payload) {
    return NextResponse.json({ ok: true });
  }

  const admin = createAdminClient();
  const callControlId = payload.call_control_id as string;
  const from = payload.from as string | undefined;
  const to = payload.to as string | undefined;

  if (eventType === "call.initiated" && payload.direction === "incoming") {
    const { data: phoneRecord } = await admin
      .from("va_phone_numbers")
      .select("org_id, agent_id, va_agents(*)")
      .eq("phone_number", to || "")
      .maybeSingle();

    const orgId = phoneRecord?.org_id || process.env.DEFAULT_ORG_ID;
    let agentId = phoneRecord?.agent_id || process.env.DEFAULT_AGENT_ID;
    let welcome = "Hello! How can I help you today?";

    if (phoneRecord?.va_agents) {
      const agent = Array.isArray(phoneRecord.va_agents)
        ? phoneRecord.va_agents[0]
        : phoneRecord.va_agents;
      if (agent) {
        welcome = agent.welcome_greeting;
        agentId = agent.id;
      }
    }

    if (orgId && orgId !== "default") {
      const { data: orgRow } = await admin
        .from("va_organizations")
        .select("business_hours, transfer_phone")
        .eq("id", orgId)
        .maybeSingle();

      const withinHours = isWithinBusinessHours(
        (orgRow?.business_hours as BusinessHours) || undefined
      );

      if (!withinHours) {
        const afterHoursMsg =
          "Thanks for calling. We're currently closed. Please call back during business hours or leave a message after the tone.";
        await answerCall(callControlId, {
          clientState: encodeClientState({ orgId, agentId: agentId || "default" }),
        });
        await speakOnCall(callControlId, afterHoursMsg);
        return NextResponse.json({ ok: true, afterHours: true });
      }

      await admin.from("va_calls").upsert(
        {
          org_id: orgId,
          agent_id: agentId !== "default" ? agentId : null,
          twilio_call_sid: callControlId,
          direction: "inbound",
          from_number: from,
          to_number: to,
          status: "initiated",
          started_at: new Date().toISOString(),
        },
        { onConflict: "twilio_call_sid" }
      );
    }

    const clientState = encodeClientState({
      orgId: orgId || "default",
      agentId: agentId || "default",
    });

    await answerCall(callControlId, { clientState });
    await startTranscription(callControlId);
    await speakOnCall(callControlId, welcome);
  }

  if (eventType === "call.transcription") {
    const transcriptData = payload.transcription_data || payload.transcription;
    const text =
      transcriptData?.transcript ||
      transcriptData?.text ||
      payload.transcription_text ||
      "";
    const isFinal =
      transcriptData?.is_final ?? transcriptData?.final ?? payload.is_final ?? true;

    if (!text?.trim() || !isFinal) {
      return NextResponse.json({ ok: true });
    }

    const state = decodeClientState(payload.client_state);
    const agentId = state.agentId;

    const { data: call } = await admin
      .from("va_calls")
      .select("id, org_id, agent_id, from_number, transferred")
      .eq("twilio_call_sid", callControlId)
      .maybeSingle();

    if (!call || call.transferred) {
      return NextResponse.json({ ok: true });
    }

    await admin.from("va_call_transcripts").insert({
      call_id: call.id,
      role: "user",
      content: text.trim(),
    });

    const { data: agent } = await admin
      .from("va_agents")
      .select("*")
      .eq("id", call.agent_id || agentId)
      .maybeSingle();

    const { data: prior } = await admin
      .from("va_call_transcripts")
      .select("role, content")
      .eq("call_id", call.id)
      .order("created_at", { ascending: true });

    const knowledgeContext = agent?.knowledge_base_enabled
      ? await loadKnowledgeContext(call.org_id, call.agent_id || agentId, text.trim())
      : "";

    const reply = await processVoiceTurn({
      callSid: callControlId,
      orgId: call.org_id,
      agentId: call.agent_id || agentId || "default",
      userMessage: text.trim(),
      systemPrompt: agent?.system_prompt || "You are a helpful phone assistant.",
      knowledgeContext: knowledgeContext || undefined,
      callerPhone: call.from_number || from || undefined,
      history: (prior || []).slice(0, -1),
    });

    await admin.from("va_call_transcripts").insert({
      call_id: call.id,
      role: "assistant",
      content: reply.text,
    });

    const escalationPhone =
      agent?.escalation_phone ||
      (await admin
        .from("va_organizations")
        .select("transfer_phone")
        .eq("id", call.org_id)
        .maybeSingle()
        .then((r) => r.data?.transfer_phone));

    if (reply.shouldTransfer && escalationPhone) {
      await speakOnCall(callControlId, "Connecting you with a team member now. Please hold.");
      await transferCall(callControlId, escalationPhone, from);
      await admin
        .from("va_calls")
        .update({
          transferred: true,
          transfer_reason: reply.transferSummary,
          contained: false,
        })
        .eq("id", call.id);
    } else {
      await speakOnCall(callControlId, reply.text);
    }
  }

  if (eventType === "call.hangup" || eventType === "call.ended") {
    const { data: call } = await admin
      .from("va_calls")
      .select("id, org_id, agent_id, from_number, transferred, duration_seconds, handoff_payload, ended_at")
      .eq("twilio_call_sid", callControlId)
      .maybeSingle();

    if (call && !call.ended_at) {
      const duration = Number(payload.duration_secs || payload.call_duration || 0);
      const minutes = Math.max(1, Math.ceil(duration / 60));

      const { data: transcripts } = await admin
        .from("va_call_transcripts")
        .select("role, content")
        .eq("call_id", call.id);

      const analysis = await analyzeCall(transcripts || []);

      await admin
        .from("va_calls")
        .update({
          status: "completed",
          duration_seconds: duration,
          cost_cents: minutes * 8,
          contained: !call.transferred,
          ended_at: new Date().toISOString(),
          ...intelligenceToCallUpdate(
            analysis,
            call.handoff_payload as Record<string, unknown> | null
          ),
        })
        .eq("id", call.id);

      await dispatchCallWebhook(call.org_id, {
        event: "call.completed",
        call: { id: call.id, from_number: call.from_number, transferred: call.transferred, duration },
        analysis,
      });

      await admin.from("va_usage_events").insert({
        org_id: call.org_id,
        call_id: call.id,
        event_type: "voice_minute",
        quantity: minutes,
      });

      if (!call.transferred && call.from_number) {
        await logHubSpotCall(call.org_id, {
          phone: call.from_number,
          summary: analysis.summary,
          agentId: call.agent_id || undefined,
        }).catch(() => {});
      }
    }
  }

  return NextResponse.json({ ok: true });
}
