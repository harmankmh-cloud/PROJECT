import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";
import { getGoogleAuthUrl } from "@/lib/integrations/google-calendar";

export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 400 });

  const authUrl = getGoogleAuthUrl(org.id);
  if (!authUrl) {
    return NextResponse.json({ error: "Google Calendar not configured" }, { status: 400 });
  }

  return NextResponse.json({ authUrl });
}
