import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import type { Call } from "@/lib/types";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ calls: [], stats: {} });

  const { data: calls } = await supabase
    .from("va_calls")
    .select("*")
    .eq("org_id", org.id)
    .order("created_at", { ascending: false })
    .limit(100);

  const rows = (calls || []) as Call[];
  const total = rows.length;
  const transferred = rows.filter((c) => c.transferred).length;
  const contained = rows.filter((c) => c.contained).length;
  const totalMinutes = rows.reduce((sum, c) => sum + Math.ceil((c.duration_seconds || 0) / 60), 0);

  return NextResponse.json({
    calls: rows,
    stats: {
      total,
      containmentRate: total ? Math.round((contained / total) * 100) : 0,
      transferRate: total ? Math.round((transferred / total) * 100) : 0,
      totalMinutes,
    },
  });
}
