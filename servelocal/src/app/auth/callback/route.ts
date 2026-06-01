import { NextResponse } from "next/server";
import { isPlatformAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}/login`);
  }

  if (code) {
    const supabase = await createClient();
    if (supabase) {
      const { error } = await supabase.auth.exchangeCodeForSession(code);
      if (!error) {
        if (next && next.startsWith("/") && !next.startsWith("//")) {
          return NextResponse.redirect(`${origin}${next}`);
        }

        const {
          data: { user },
        } = await supabase.auth.getUser();

        if (user && isPlatformAdmin(user.email)) {
          return NextResponse.redirect(`${origin}/admin`);
        }

        return NextResponse.redirect(`${origin}/dashboard`);
      }
    }
  }

  return NextResponse.redirect(`${origin}/login`);
}
