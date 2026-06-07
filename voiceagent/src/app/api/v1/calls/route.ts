import { NextRequest, NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyApiKey } from "@/lib/api-key-auth";

export async function GET(request: NextRequest) {
  const auth = await verifyApiKey(request);
  if (!auth) return NextResponse.json({ error: "Invalid API key" }, { status: 401 });

  const limit = Math.min(100, Math.max(1, Number(request.nextUrl.searchParams.get("limit")) || 25));
  const admin = createAdminClient();

  const { data: calls, error } = await admin
    .from("va_calls")
    .select(
      "id, direction, from_number, to_number, status, duration_seconds, sentiment, intent, summary, score, topics, action_items, created_at"
    )
    .eq("org_id", auth.orgId)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ calls: calls || [] });
}
