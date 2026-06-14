import { NextResponse } from "next/server";
import { dashboardPathForRole, resolveUserRole } from "@/lib/auth-routing";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.json({ user: null, role: null, dashboardPath: "/login" });
  }

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ user: null, role: null, dashboardPath: "/login" });
  }

  const role = await resolveUserRole(user);

  return NextResponse.json({
    user: { id: user.id, email: user.email },
    role: role ?? null,
    dashboardPath: dashboardPathForRole(role),
  });
}
