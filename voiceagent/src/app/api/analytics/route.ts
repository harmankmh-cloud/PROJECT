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

  const since = new Date(Date.now() - days * 86400000).toISOString();
  const selectWithScore =
    "created_at, agent_id, sentiment, score, duration_seconds, transferred, contained, intent, handoff_payload";
  const selectFallback =
    "created_at, agent_id, sentiment, duration_seconds, transferred, contained, intent, handoff_payload";

  let query = supabase
    .from("va_calls")
    .select(selectWithScore)
    .eq("org_id", org.id)
    .gte("created_at", since)
    .order("created_at", { ascending: false })
    .limit(2000);

  if (agentId) query = query.eq("agent_id", agentId);

  const primary = await query;
  let calls: Array<Record<string, unknown>> | null = primary.data;
  if (primary.error) {
    let fallbackQuery = supabase
      .from("va_calls")
      .select(selectFallback)
      .eq("org_id", org.id)
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(2000);
    if (agentId) fallbackQuery = fallbackQuery.eq("agent_id", agentId);
    const fallback = await fallbackQuery;
    if (fallback.error) return NextResponse.json({ error: fallback.error.message }, { status: 400 });
    calls = fallback.data;
  }

  const { data: agents } = await supabase
    .from("va_agents")
    .select("id, name")
    .eq("org_id", org.id);

  return NextResponse.json({
    analytics: buildAnalytics((calls || []) as Parameters<typeof buildAnalytics>[0], days),
    agents: agents || [],
    days,
  });
}
