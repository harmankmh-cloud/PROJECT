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
  if (!org) return NextResponse.json({ integrations: [] });

  const { data } = await supabase
    .from("va_integrations")
    .select("provider, is_active, token_expires_at, created_at")
    .eq("org_id", org.id);

  return NextResponse.json({ integrations: data || [] });
}
