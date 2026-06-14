import { NextResponse } from "next/server";
import { createServiceClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = supabase ? await supabase.auth.getUser() : { data: { user: null } };

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const admin = createServiceClient();
  if (admin) {
    try {
      await admin.from("site_suggestions").insert({
        message: `[PIPEDA deletion request] User ${user.id} (${user.email}) requested account deletion.`,
        email: user.email,
        page_url: "/dashboard/settings",
      });
    } catch {
      // suggestions table may be unavailable
    }
  }

  return NextResponse.json({
    ok: true,
    message:
      "Deletion request received. We will confirm by email within 30 days per PIPEDA. Contact hello@servelocal.ca with questions.",
  });
}
