import { type EmailOtpType } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import { buildAfterLoginRedirect, isEmailOtpType, resolvePostAuthRedirect } from "@/lib/auth/post-auth-redirect";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/**
 * Server-side email / OTP link verification.
 * Sets session cookies via the SSR client, then 302 redirects so the browser
 * persists cookies before the next page load (avoids stale client router state).
 *
 * Supports:
 * - token_hash + type (email template / OTP links)
 * - code (PKCE flow — same as /auth/callback)
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

  const supabase = await createClient();
  if (!supabase) {
    return NextResponse.redirect(`${origin}/login?error=auth_failed`);
  }

  // PKCE: ?code=... (some Supabase projects send this to the confirm redirect URL)
  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      console.error("[auth/confirm] exchangeCodeForSession failed:", error.message);
      return NextResponse.redirect(`${origin}/login?error=auth_failed`);
    }
    const target = await resolvePostAuthRedirect(origin, next);
    return NextResponse.redirect(target);
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

    const target = await resolvePostAuthRedirect(origin, next);
    return NextResponse.redirect(target);
  }

  return NextResponse.redirect(`${origin}/login?error=invalid_link`);
}
