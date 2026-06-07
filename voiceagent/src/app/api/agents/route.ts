import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import { logAudit } from "@/lib/compliance/audit";
import { denyUnlessCanOperate } from "@/lib/require-org-access";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ agents: [] });

  const { data } = await supabase
    .from("va_agents")
    .select("*")
    .eq("org_id", org.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ agents: data || [] });
}

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const denied = await denyUnlessCanOperate(org.id, user.id);
  if (denied) return denied;

  const body = await request.json();
  const { data, error } = await supabase
    .from("va_agents")
    .insert({
      org_id: org.id,
      name: body.name || "My Agent",
      system_prompt: body.system_prompt,
      welcome_greeting: body.welcome_greeting,
      voice: body.voice || "Polly.Joanna",
      language: body.language || "en-US",
      escalation_phone: body.escalation_phone,
      is_active: body.is_active ?? true,
      knowledge_base_enabled: body.knowledge_base_enabled ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logAudit({
    orgId: org.id,
    userId: user.id,
    action: "agent.created",
    resourceType: "agent",
    resourceId: data.id,
  });

  return NextResponse.json({ agent: data });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const denied = await denyUnlessCanOperate(org.id, user.id);
  if (denied) return denied;

  const body = await request.json();
  const { id } = body;

  const allowed: Record<string, unknown> = {};
  if (body.name !== undefined) allowed.name = body.name;
  if (body.system_prompt !== undefined) allowed.system_prompt = body.system_prompt;
  if (body.welcome_greeting !== undefined) allowed.welcome_greeting = body.welcome_greeting;
  if (body.voice !== undefined) allowed.voice = body.voice;
  if (body.language !== undefined) allowed.language = body.language;
  if (body.escalation_phone !== undefined) allowed.escalation_phone = body.escalation_phone;
  if (body.is_active !== undefined) allowed.is_active = body.is_active;
  if (body.knowledge_base_enabled !== undefined) {
    allowed.knowledge_base_enabled = body.knowledge_base_enabled;
  }

  const { data, error } = await supabase
    .from("va_agents")
    .update({ ...allowed, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("org_id", org.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logAudit({
    orgId: org.id,
    userId: user.id,
    action: "agent.updated",
    resourceType: "agent",
    resourceId: id,
  });

  return NextResponse.json({ agent: data });
}
