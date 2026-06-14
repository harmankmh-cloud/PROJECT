import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ calls: [] });

  const { data } = await supabase
    .from("va_calls")
    .select("id, from_number, to_number, status, started_at, agent_id, is_sandbox")
    .eq("org_id", org.id)
    .in("status", ["initiated", "in-progress", "ringing"])
    .is("ended_at", null)
    .order("started_at", { ascending: false })
    .limit(10);

  return NextResponse.json({ calls: data || [] });
}
