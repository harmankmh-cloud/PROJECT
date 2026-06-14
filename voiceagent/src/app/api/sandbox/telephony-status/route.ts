import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getTelephonyStatus } from "@/lib/telephony-status";

/** Returns whether sandbox voice test calls can be placed (no secrets exposed). */
export async function GET() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const status = getTelephonyStatus();
  return NextResponse.json({
    voiceAvailable: status.voiceAvailable,
    provider: status.provider,
    message: status.userMessage,
  });
}
