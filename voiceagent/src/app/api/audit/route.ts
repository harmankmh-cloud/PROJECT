import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import { canManageOrg, getOrgRole } from "@/lib/org-role";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const role = await getOrgRole(org.id, user.id);
  if (!canManageOrg(role)) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const limit = Math.min(200, Math.max(20, Number(request.nextUrl.searchParams.get("limit")) || 50));

  const { data: logs, error } = await supabase
    .from("va_audit_logs")
    .select("id, action, resource_type, resource_id, metadata, created_at, user_id")
    .eq("org_id", org.id)
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  return NextResponse.json({ logs: logs || [] });
}
