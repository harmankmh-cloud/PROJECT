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
  if (!org) return NextResponse.json({ contacts: [] });

  const { data } = await supabase
    .from("va_contacts")
    .select("*")
    .eq("org_id", org.id)
    .order("last_call_at", { ascending: false, nullsFirst: false })
    .limit(100);

  return NextResponse.json({ contacts: data || [] });
}
