import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import { knowledgeCreateSchema } from "@/lib/api-schemas";
import { isApiSession, requireApiSession } from "@/lib/api-session";
import { parseJsonBody, readJsonBody } from "@/lib/parse-json-body";
import { logAudit } from "@/lib/compliance/audit";
import { denyUnlessCanOperate } from "@/lib/require-org-access";
import { createAdminClient } from "@/lib/supabase/admin";
import { embedText } from "@/lib/embeddings";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ docs: [] });

  const { data } = await supabase
    .from("va_knowledge_docs")
    .select("*, va_agents(id, name)")
    .eq("org_id", org.id)
    .order("created_at", { ascending: false });

  return NextResponse.json({ docs: data || [] });
}

export async function POST(request: NextRequest) {
  const session = await requireApiSession();
  if (!isApiSession(session)) return session;

  const org = await getUserOrg(session.user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const denied = await denyUnlessCanOperate(org.id, session.user.id);
  if (denied) return denied;

  const parsed = parseJsonBody(await readJsonBody(request), knowledgeCreateSchema);
  if (!parsed.ok) return parsed.response;

  const { title, content, source_url, agent_id } = parsed.data;

  const { data, error } = await session.supabase
    .from("va_knowledge_docs")
    .insert({
      org_id: org.id,
      agent_id: agent_id ?? null,
      title,
      content,
      source_url: source_url ? source_url.trim() : null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const embedding = await embedText(`${title}\n${content}`);
  if (embedding) {
    const admin = createAdminClient();
    await admin.from("va_knowledge_docs").update({ embedding }).eq("id", data.id);
  }

  await logAudit({
    orgId: org.id,
    userId: session.user.id,
    action: "knowledge.created",
    resourceType: "knowledge_doc",
    resourceId: data.id,
  });

  return NextResponse.json({ doc: { ...data, embedding: embedding || null } });
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
  if (body.title !== undefined) allowed.title = String(body.title).trim();
  if (body.content !== undefined) allowed.content = String(body.content).trim();
  if (body.agent_id !== undefined) allowed.agent_id = body.agent_id || null;
  if (body.source_url !== undefined) allowed.source_url = body.source_url || null;

  const { data, error } = await supabase
    .from("va_knowledge_docs")
    .update(allowed)
    .eq("id", id)
    .eq("org_id", org.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  if (body.title !== undefined || body.content !== undefined) {
    const embedding = await embedText(`${data.title}\n${data.content}`);
    if (embedding) {
      const admin = createAdminClient();
      await admin.from("va_knowledge_docs").update({ embedding }).eq("id", data.id);
    }
  }

  return NextResponse.json({ doc: data });
}

export async function DELETE(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const denied = await denyUnlessCanOperate(org.id, user.id);
  if (denied) return denied;

  const id = request.nextUrl.searchParams.get("id");
  if (!id) return NextResponse.json({ error: "Missing id" }, { status: 400 });

  const { error } = await supabase
    .from("va_knowledge_docs")
    .delete()
    .eq("id", id)
    .eq("org_id", org.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ ok: true });
}
