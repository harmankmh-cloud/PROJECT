import { NextResponse } from "next/server";
import { ensureUserOrg } from "@/lib/org-setup";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  let businessName: string | undefined;
  let phone: string | undefined;
  if (request.headers.get("content-type")?.includes("application/json")) {
    try {
      const body = (await request.json()) as { businessName?: string; phone?: string };
      businessName = body.businessName?.trim() || undefined;
      phone = body.phone?.trim() || undefined;
    } catch {
      businessName = undefined;
      phone = undefined;
    }
  }

  try {
    const { org } = await ensureUserOrg(user, { businessName, phone });
    return NextResponse.json({ org });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Server configuration error";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
