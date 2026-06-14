import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import {
  flowCreateSchema,
  flowDeleteSchema,
  flowPatchSchema,
} from "@/lib/api-schemas";
import { isApiSession, requireApiSession } from "@/lib/api-session";
import { parseJsonBody, readJsonBody } from "@/lib/parse-json-body";
import { FlowEngine, DEFAULT_FLOW_EDGES, DEFAULT_FLOW_NODES } from "@/lib/flow-engine";
import { logAudit } from "@/lib/compliance/audit";
import { denyUnlessCanOperate } from "@/lib/require-org-access";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ flows: [] });

  const { data } = await supabase
    .from("va_flows")
    .select("*")
    .eq("org_id", org.id)
    .order("updated_at", { ascending: false });

  return NextResponse.json({ flows: data || [] });
}

export async function POST(request: NextRequest) {
  const session = await requireApiSession();
  if (!isApiSession(session)) return session;

  const org = await getUserOrg(session.user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const denied = await denyUnlessCanOperate(org.id, session.user.id);
  if (denied) return denied;

  const parsed = parseJsonBody(await readJsonBody(request), flowCreateSchema);
  if (!parsed.ok) return parsed.response;

  const body = parsed.data;
  const nodes = (body.nodes || DEFAULT_FLOW_NODES) as typeof DEFAULT_FLOW_NODES;
  const edges = (body.edges || DEFAULT_FLOW_EDGES) as typeof DEFAULT_FLOW_EDGES;

  const engine = new FlowEngine(nodes, edges);
  const errors = engine.validate();
  if (errors.length && body.is_published) {
    return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
  }

  const { data, error } = await session.supabase
    .from("va_flows")
    .insert({
      org_id: org.id,
      agent_id: body.agent_id,
      name: body.name || "Default Flow",
      nodes,
      edges,
      is_published: body.is_published ?? false,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logAudit({
    orgId: org.id,
    userId: session.user.id,
    action: "flow.created",
    resourceType: "flow",
    resourceId: data.id,
  });

  return NextResponse.json({ flow: data });
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
  const { id, nodes, edges, ...rest } = body;

  if (nodes && edges) {
    const engine = new FlowEngine(nodes, edges);
    const errors = engine.validate();
    if (errors.length && rest.is_published) {
      return NextResponse.json({ error: errors.join("; ") }, { status: 400 });
    }
  }

  const { data, error } = await supabase
    .from("va_flows")
    .update({ ...rest, nodes, edges, updated_at: new Date().toISOString() })
    .eq("id", id)
    .eq("org_id", org.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ flow: data });
}

export async function DELETE(request: NextRequest) {
  const session = await requireApiSession();
  if (!isApiSession(session)) return session;

  const org = await getUserOrg(session.user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const denied = await denyUnlessCanOperate(org.id, session.user.id);
  if (denied) return denied;

  const parsed = parseJsonBody(await readJsonBody(request), flowDeleteSchema);
  if (!parsed.ok) return parsed.response;

  const { id } = parsed.data;
  const { error } = await session.supabase.from("va_flows").delete().eq("id", id).eq("org_id", org.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logAudit({
    orgId: org.id,
    userId: session.user.id,
    action: "flow.deleted",
    resourceType: "flow",
    resourceId: id,
  });

  return NextResponse.json({ ok: true });
}
