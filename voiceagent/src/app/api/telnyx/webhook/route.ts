import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { validateTelnyxWebhook } from "@/lib/telnyx-webhook";
import {
  answerCall,
  decodeClientState,
  encodeClientState,
  speakOnCall,
  startCallRecording,
  startTranscription,
  transferCall,
} from "@/lib/telnyx";
import { agentVoiceFields } from "@/lib/voice-catalog";
import { loadKnowledgeContext } from "@/lib/knowledge-context";
import { processVoiceTurn } from "@/lib/voice-flow-runtime";
import { logHubSpotCall } from "@/lib/integrations/hubspot";
import { analyzeCall } from "@/lib/intelligence";
import { intelligenceToCallUpdate } from "@/lib/call-intelligence-persist";
import { dispatchCallWebhook } from "@/lib/outbound-webhook";
import { isWithinBusinessHours, type BusinessHours } from "@/lib/business-hours";
import {
  canAcceptNewCall,
  type BillingOrg,
} from "@/lib/billing-gates";
import { orgSelectFields } from "@/lib/billing-schema";
import { recordCallUsage } from "@/lib/usage-metering";

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

  const isInbound = eventType === "call.initiated" && payload.direction === "incoming";
  const isOutbound = eventType === "call.initiated" && payload.direction === "outgoing";

  if (isInbound || isOutbound) {
    const { data: phoneRecord } = await admin
      .from("va_phone_numbers")
      .select("org_id, agent_id, va_agents(*)")
      .eq("phone_number", to || "")
      .maybeSingle();

    const clientStateEarly = decodeClientState(payload.client_state);
    const orgId = clientStateEarly.orgId || phoneRecord?.org_id || process.env.DEFAULT_ORG_ID;
    let agentId = clientStateEarly.agentId || phoneRecord?.agent_id || process.env.DEFAULT_AGENT_ID;
    let welcome = "Hello! How can I help you today?";
    let agentRow: Record<string, unknown> | null = null;
    const isSandbox = clientStateEarly.sandbox === "true";

    if (phoneRecord?.va_agents) {
      const agent = Array.isArray(phoneRecord.va_agents)
        ? phoneRecord.va_agents[0]
        : phoneRecord.va_agents;
      if (agent) {
        agentRow = agent as Record<string, unknown>;
        welcome = String(agent.welcome_greeting);
        agentId = String(agent.id);
      }
    }

    if (!agentRow && agentId && agentId !== "default" && orgId && orgId !== "default") {
      const { data: loaded } = await admin
        .from("va_agents")
        .select("*")
        .eq("id", agentId)
        .maybeSingle();
      if (loaded) {
        agentRow = loaded;
        welcome = String(loaded.welcome_greeting || welcome);
      }
    }

    const speakOpts = agentVoiceFields({
      voice_id: agentRow?.voice_id as string | undefined,
      voice: agentRow?.voice as string | undefined,
      voice_provider: agentRow?.voice_provider as string | undefined,
      language: agentRow?.language as string | undefined,
    });

    if (orgId && orgId !== "default") {
      const { data: orgData } = await admin
        .from("va_organizations")
        .select(
          await orgSelectFields(
            "id, business_hours, transfer_phone, plan, stripe_subscription_id, trial_minutes_remaining"
          )
        )
        .eq("id", orgId)
        .maybeSingle();

      const orgRow = orgData as
        | (BillingOrg & { business_hours?: BusinessHours; transfer_phone?: string | null })
        | null;

      const orgBilling = (orgRow || {}) as BillingOrg;
      const withinHours = isWithinBusinessHours(
        (orgRow?.business_hours as BusinessHours) || undefined
      );

      if (!isSandbox) {
        const gate = await canAcceptNewCall(admin, { ...orgBilling, id: orgId });
        if (!gate.allowed) {
          const blockedMsg =
            gate.reason ||
            "This line is not active. Please visit greetq.com to subscribe.";
          await answerCall(callControlId, {
            clientState: encodeClientState({ orgId, agentId: agentId || "default" }),
          });
          await speakOnCall(callControlId, blockedMsg, {
            voice: speakOpts.telnyx_voice,
            language: speakOpts.language,
          });
          return NextResponse.json({ ok: true, blocked: "billing_gate" });
        }
      }

      if (isInbound && !withinHours && !isSandbox) {
        const afterHoursMsg =
          "Thanks for calling. We're currently closed. Please call back during business hours or leave a message after the tone.";
        await answerCall(callControlId, {
          clientState: encodeClientState({ orgId, agentId: agentId || "default" }),
        });
        await speakOnCall(callControlId, afterHoursMsg, {
          voice: speakOpts.telnyx_voice,
          language: speakOpts.language,
        });
        return NextResponse.json({ ok: true, afterHours: true });
      }

      await admin.from("va_calls").upsert(
        {
          org_id: orgId,
          agent_id: agentId !== "default" ? agentId : null,
          twilio_call_sid: callControlId,
          direction: isOutbound ? "outbound" : "inbound",
          from_number: from,
          to_number: to,
          status: "initiated",
          is_sandbox: isSandbox,
          started_at: new Date().toISOString(),
        },
        { onConflict: "twilio_call_sid" }
      );
    }

    const clientState = encodeClientState({
      orgId: orgId || "default",
      agentId: agentId || "default",
      sandbox: isSandbox ? "true" : "false",
    });

    if (isInbound) {
      await answerCall(callControlId, { clientState });
    }
    await startTranscription(callControlId);
    if (!isSandbox) {
      await startCallRecording(callControlId).catch(() => {});
    }
    await speakOnCall(callControlId, welcome, {
      voice: speakOpts.telnyx_voice,
      language: speakOpts.language,
    });
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
      agentConfig: agent
        ? {
            llm_model: agent.llm_model,
            temperature: agent.temperature,
            max_tokens: agent.max_tokens,
          }
        : undefined,
    });

    const speakOpts = agentVoiceFields({
      voice_id: agent?.voice_id,
      voice: agent?.voice,
      voice_provider: agent?.voice_provider,
      language: agent?.language,
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
      await speakOnCall(
        callControlId,
        "Connecting you with a team member now. Please hold.",
        { voice: speakOpts.telnyx_voice, language: speakOpts.language }
      );
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
      await speakOnCall(callControlId, reply.text, {
        voice: speakOpts.telnyx_voice,
        language: speakOpts.language,
      });
    }
  }

  if (eventType === "call.recording.saved") {
    const recordingUrl = payload.recording_urls?.mp3 || payload.public_recording_urls?.mp3;
    if (recordingUrl) {
      const { data: call } = await admin
        .from("va_calls")
        .select("id")
        .eq("twilio_call_sid", callControlId)
        .maybeSingle();
      if (call) {
        await admin.from("va_call_recordings").insert({
          call_id: call.id,
          storage_url: recordingUrl,
        });
      }
    }
  }

  if (eventType === "call.hangup" || eventType === "call.ended") {
    const { data: call } = await admin
      .from("va_calls")
      .select("id, org_id, agent_id, from_number, transferred, duration_seconds, handoff_payload, ended_at, is_sandbox")
      .eq("twilio_call_sid", callControlId)
      .maybeSingle();

    if (call && !call.ended_at) {
      const duration = Number(payload.duration_secs || payload.call_duration || 0);
      const handoff = call.handoff_payload as { sandboxMaxSeconds?: number } | null;
      const maxSandbox = handoff?.sandboxMaxSeconds || 60;
      const cappedDuration =
        call.is_sandbox && duration > maxSandbox ? maxSandbox : duration;
      const minutes = Math.max(1, Math.ceil(cappedDuration / 60));

      const { data: transcripts } = await admin
        .from("va_call_transcripts")
        .select("role, content")
        .eq("call_id", call.id);

      const analysis = await analyzeCall(transcripts || []);

      await admin
        .from("va_calls")
        .update({
          status: "completed",
          duration_seconds: cappedDuration,
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

      await recordCallUsage(admin, {
        orgId: call.org_id,
        callId: call.id,
        minutes,
        isSandbox: Boolean(call.is_sandbox),
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
