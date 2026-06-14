import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import { agentVoiceFields, getVoiceById } from "@/lib/voice-catalog";
import { isTelnyxConfigured } from "@/lib/telnyx";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const body = await request.json().catch(() => ({}));
  const text =
    (body.text as string)?.trim() ||
    "Hello! Thanks for calling. How can I help you today?";

  const { data: agent } = await supabase
    .from("va_agents")
    .select("*")
    .eq("id", id)
    .eq("org_id", org.id)
    .maybeSingle();

  if (!agent) return NextResponse.json({ error: "Agent not found" }, { status: 404 });

  const voiceId = (body.voice_id as string) || agent.voice_id;
  const fields = agentVoiceFields({
    voice_id: voiceId,
    voice: agent.voice,
    voice_provider: body.voice_provider || agent.voice_provider,
    language: (body.language as string) || agent.language,
  });

  const voiceMeta = getVoiceById(voiceId);

  if (!isTelnyxConfigured()) {
    return NextResponse.json({
      ok: true,
      preview: "unavailable",
      message: "Voice preview requires Telnyx. Showing voice metadata only.",
      voice: {
        id: voiceId,
        name: voiceMeta?.name || fields.telnyx_voice,
        language: fields.language,
        provider: fields.voice_provider,
      },
      sampleText: text,
    });
  }

  return NextResponse.json({
    ok: true,
    preview: "metadata",
    voice: {
      id: voiceId,
      name: voiceMeta?.name || fields.telnyx_voice,
      telnyx_voice: fields.telnyx_voice,
      language: fields.language,
      provider: fields.voice_provider,
    },
    sampleText: text,
    hint: "Use 'Call my phone' in Sandbox to hear this voice on a live test call.",
  });
}
