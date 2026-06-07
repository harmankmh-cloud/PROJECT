import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import { logHubSpotCall } from "@/lib/integrations/hubspot";
import { denyUnlessCanOperate } from "@/lib/require-org-access";

export async function POST(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 404 });

  const denied = await denyUnlessCanOperate(org.id, user.id);
  if (denied) return denied;

  const { data: call, error } = await supabase
    .from("va_calls")
    .select("id, from_number, summary, agent_id")
    .eq("id", id)
    .eq("org_id", org.id)
    .maybeSingle();

  if (error || !call) {
    return NextResponse.json({ error: "Call not found" }, { status: 404 });
  }

  const result = await logHubSpotCall(org.id, {
    phone: call.from_number || "",
    summary: call.summary || "Voice call logged from Intellivo",
    agentId: call.agent_id || undefined,
  });

  if (!result.ok) {
    const reason = result.reason === "no_integration" ? "HubSpot not connected" : "CRM sync failed";
    return NextResponse.json({ error: reason }, { status: 400 });
  }

  return NextResponse.json({ ok: true, provider: "HubSpot" });
}
