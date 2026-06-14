import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getUserOrg } from "@/lib/auth";
import { agentCreateSchema, agentPatchSchema } from "@/lib/api-schemas";
import { isApiSession, requireApiSession } from "@/lib/api-session";
import { parseJsonBody, readJsonBody } from "@/lib/parse-json-body";
import { logAudit } from "@/lib/compliance/audit";
import { denyUnlessCanOperate } from "@/lib/require-org-access";
import {
  agentLimitBlockReason,
  canCreateAgent,
  type BillingOrg,
} from "@/lib/billing-gates";

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
  const session = await requireApiSession();
  if (!isApiSession(session)) return session;

  const org = await getUserOrg(session.user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const denied = await denyUnlessCanOperate(org.id, session.user.id);
  if (denied) return denied;

  const admin = createAdminClient();
  const { count: agentCount } = await admin
    .from("va_agents")
    .select("id", { count: "exact", head: true })
    .eq("org_id", org.id);

  const billingOrg = org as BillingOrg;
  if (!canCreateAgent(billingOrg, agentCount ?? 0)) {
    return NextResponse.json(
      { error: agentLimitBlockReason(billingOrg, agentCount ?? 0) },
      { status: 403 }
    );
  }

  const parsed = parseJsonBody(await readJsonBody(request), agentCreateSchema);
  if (!parsed.ok) return parsed.response;

  const payload = parsed.data;
  const { data, error } = await session.supabase
    .from("va_agents")
    .insert({
      org_id: org.id,
      name: payload.name || "My Agent",
      system_prompt: payload.system_prompt,
      welcome_greeting: payload.welcome_greeting,
      voice: payload.voice || "Polly.Joanna",
      voice_provider: payload.voice_provider || "telnyx",
      voice_id: payload.voice_id || "telnyx-female",
      language: payload.language || "en-US",
      llm_model: payload.llm_model ?? null,
      temperature: payload.temperature ?? 0.2,
      max_tokens: payload.max_tokens ?? 50,
      persona_template: payload.persona_template || "receptionist",
      escalation_phone: payload.escalation_phone,
      is_active: payload.is_active ?? true,
      knowledge_base_enabled: payload.knowledge_base_enabled ?? true,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logAudit({
    orgId: org.id,
    userId: session.user.id,
    action: "agent.created",
    resourceType: "agent",
    resourceId: data.id,
  });

  return NextResponse.json({ agent: data });
}

export async function PATCH(request: NextRequest) {
  const session = await requireApiSession();
  if (!isApiSession(session)) return session;

  const org = await getUserOrg(session.user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const denied = await denyUnlessCanOperate(org.id, session.user.id);
  if (denied) return denied;

  const parsed = parseJsonBody(await readJsonBody(request), agentPatchSchema);
  if (!parsed.ok) return parsed.response;

  const { id, ...fields } = parsed.data;
  const allowed: Record<string, unknown> = { updated_at: new Date().toISOString() };
  for (const [key, value] of Object.entries(fields)) {
    if (value !== undefined) allowed[key] = value;
  }

  const { data, error } = await session.supabase
    .from("va_agents")
    .update(allowed)
    .eq("id", id)
    .eq("org_id", org.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logAudit({
    orgId: org.id,
    userId: session.user.id,
    action: "agent.updated",
    resourceType: "agent",
    resourceId: id,
  });

  return NextResponse.json({ agent: data });
}
