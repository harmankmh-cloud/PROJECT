import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import { searchAvailableNumbers } from "@/lib/telnyx-numbers";

export async function GET(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const areaCode = request.nextUrl.searchParams.get("area_code") || undefined;
  const country = request.nextUrl.searchParams.get("country") || "US";

  try {
    const numbers = await searchAvailableNumbers({ areaCode, country, limit: 12 });
    return NextResponse.json({ numbers });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Search failed";
    return NextResponse.json({ error: message, numbers: [] }, { status: 400 });
  }
}
