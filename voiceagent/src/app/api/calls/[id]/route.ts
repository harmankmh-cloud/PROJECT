import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { getUserOrg } from "@/lib/auth";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const org = await getUserOrg(user.id);
  if (!org) return NextResponse.json({ error: "No organization" }, { status: 404 });

  const { data: call, error } = await supabase
    .from("va_calls")
    .select("*")
    .eq("id", id)
    .eq("org_id", org.id)
    .maybeSingle();

  if (error || !call) {
    return NextResponse.json({ error: "Call not found" }, { status: 404 });
  }

  const [{ data: transcripts }, { data: recordings }] = await Promise.all([
    supabase
      .from("va_call_transcripts")
      .select("id, role, content, created_at")
      .eq("call_id", id)
      .order("created_at", { ascending: true }),
    supabase
      .from("va_call_recordings")
      .select("id, storage_url, created_at")
      .eq("call_id", id)
      .order("created_at", { ascending: false }),
  ]);

  return NextResponse.json({
    call,
    transcripts: transcripts || [],
    recordings: recordings || [],
  });
}
