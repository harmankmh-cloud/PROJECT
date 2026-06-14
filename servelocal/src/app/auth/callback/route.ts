import { NextRequest, NextResponse } from "next/server";
import { resolvePostAuthRedirect } from "@/lib/auth/post-auth-redirect";
import { createAuthRouteHandlerClient } from "@/lib/supabase/route-handler";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/** PKCE OAuth / email confirmation via authorization code. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}/login?error=not_configured`);
  }

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const auth = createAuthRouteHandlerClient(request);
  if (!auth) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const { supabase, redirectWithSession } = auth;

  const { error } = await supabase.auth.exchangeCodeForSession(code);
  if (error) {
    console.error("[auth/callback] exchangeCodeForSession failed:", error.message);
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const target = await resolvePostAuthRedirect(origin, next, supabase);
  return redirectWithSession(target);
}
