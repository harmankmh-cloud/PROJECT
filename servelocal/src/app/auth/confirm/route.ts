import { type EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { isEmailOtpType, resolvePostAuthRedirect } from "@/lib/auth/post-auth-redirect";
import { createAuthRouteHandlerClient } from "@/lib/supabase/route-handler";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Server-side email / OTP link verification.
 * Sets session cookies on the redirect response, then 302 so the browser
 * persists cookies before /auth/after-login runs.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const typeParam = searchParams.get("type");
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}/login?error=not_configured`);
  }

  const auth = createAuthRouteHandlerClient(request);
  if (!auth) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  const { supabase, redirectWithSession } = auth;

  // PKCE: ?code=... (some Supabase projects send this to the confirm redirect URL)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("[auth/confirm] exchangeCodeForSession failed:", error.message);
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }
    const target = await resolvePostAuthRedirect(origin, next, supabase);
    return redirectWithSession(target);
  }

  // Email OTP / magic link: ?token_hash=...&type=signup|email|recovery|...
  if (tokenHash && isEmailOtpType(typeParam)) {
    const { error } = await supabase.auth.verifyOtp({
      type: typeParam as EmailOtpType,
      token_hash: tokenHash,
    });

    if (error) {
      console.error("[auth/confirm] verifyOtp failed:", error.message);
      return NextResponse.redirect(`${origin}/login?error=verification_failed`);
    }

    const target = await resolvePostAuthRedirect(origin, next, supabase);
    return redirectWithSession(target);
  }

  return NextResponse.redirect(`${origin}/login?error=invalid_link`);
}
