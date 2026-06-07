import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import { buildAnalytics } from "@/lib/analytics";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const days = Math.min(90, Math.max(7, Number(request.nextUrl.searchParams.get("days")) || 30));
  const agentId = request.nextUrl.searchParams.get("agent_id");

  let query = supabase
    .from("va_calls")
    .select(
      "created_at, agent_id, sentiment, score, duration_seconds, transferred, contained, intent, handoff_payload"
    )
    .eq("org_id", org.id)
    .gte("created_at", new Date(Date.now() - days * 86400000).toISOString())
    .order("created_at", { ascending: false })
    .limit(2000);

  if (agentId) query = query.eq("agent_id", agentId);

  const { data: calls, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const { data: agents } = await supabase
    .from("va_agents")
    .select("id, name")
    .eq("org_id", org.id);

  return NextResponse.json({
    analytics: buildAnalytics(calls || [], days),
    agents: agents || [],
    days,
  });
}
