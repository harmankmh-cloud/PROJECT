import { type EmailOtpType, type SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { ensureUserProfileFromMetadata } from "@/lib/auth/queries";
import { isEmailOtpType, resolvePostAuthRedirect } from "@/lib/auth/post-auth-redirect";
import { createAuthRouteHandlerClient } from "@/lib/supabase/route-handler";
import { isSupabaseConfigured } from "@/lib/supabase/config";

async function finishAuthRedirect(
  origin: string,
  next: string | null,
  supabase: SupabaseClient,
  redirectWithSession: (target: string) => NextResponse
) {
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) {
    await ensureUserProfileFromMetadata(user);
  }

  const target = await resolvePostAuthRedirect(origin, next, supabase);
  return redirectWithSession(target);
}

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

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("[auth/confirm] exchangeCodeForSession failed:", error.message);
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }
    return finishAuthRedirect(origin, next, supabase, redirectWithSession);
  }

  if (tokenHash && isEmailOtpType(typeParam)) {
    const { error } = await supabase.auth.verifyOtp({
      type: typeParam as EmailOtpType,
      token_hash: tokenHash,
    });

    if (error) {
      console.error("[auth/confirm] verifyOtp failed:", error.message);
      return NextResponse.redirect(`${origin}/login?error=verification_failed`);
    }

    return finishAuthRedirect(origin, next, supabase, redirectWithSession);
  }

  return NextResponse.redirect(`${origin}/login?error=invalid_link`);
}
