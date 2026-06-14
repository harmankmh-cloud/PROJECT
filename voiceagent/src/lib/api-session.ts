import "server-only";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import type { User } from "@supabase/supabase-js";

export type ApiSession = {
  user: User;
  supabase: Awaited<ReturnType<typeof createClient>>;
};

export async function requireApiSession(): Promise<ApiSession | NextResponse> {
  const supabase = await createClient();
  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();

  if (error || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  return { user, supabase };
}

export function isApiSession(value: ApiSession | NextResponse): value is ApiSession {
  return "user" in value;
}
