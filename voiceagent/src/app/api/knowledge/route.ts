import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import { logAudit } from "@/lib/compliance/audit";

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
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const body = await request.json();
  const title = String(body.title || "").trim();
  const content = String(body.content || "").trim();

  if (!title || !content) {
    return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("va_knowledge_docs")
    .insert({
      org_id: org.id,
      agent_id: body.agent_id || null,
      title,
      content,
      source_url: body.source_url || null,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logAudit({
    orgId: org.id,
    userId: user.id,
    action: "knowledge.created",
    resourceType: "knowledge_doc",
    resourceId: data.id,
  });

  return NextResponse.json({ doc: data });
}

export async function PATCH(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

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
