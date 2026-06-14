import { type EmailOtpType, type SupabaseClient } from "@supabase/supabase-js";
import { NextRequest, NextResponse } from "next/server";
import {
  authCodeErrorReason,
  authCodeErrorUrl,
  type AuthCodeErrorReason,
} from "@/lib/auth/confirm-errors";
import { resolvePostLoginPath } from "@/lib/auth-routing";
import { ensureUserProfileFromMetadata } from "@/lib/auth/queries";
import { isEmailOtpType } from "@/lib/auth/post-auth-redirect";
import { authLog, authMetric } from "@/lib/auth/observability";
import { createAuthRouteHandlerClient } from "@/lib/supabase/route-handler";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function redirectAuthCodeError(origin: string, reason: AuthCodeErrorReason, email?: string | null) {
  return NextResponse.redirect(authCodeErrorUrl(origin, reason, email));
}

async function finishAuthRedirect(
  origin: string,
  next: string | null,
  email: string | null,
  supabase: SupabaseClient,
  redirectWithSession: (target: string) => NextResponse
) {
  // Fresh read after verify — do not use cached getServerAuthUser here.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    authLog("confirm.fail", { step: "no_user_after_verify" });
    return redirectAuthCodeError(origin, "auth_failed", email);
  }

  await ensureUserProfileFromMetadata(user);

  const path = await resolvePostLoginPath(user, { next });
  authLog("confirm.ok", { userId: user.id, target: path });
  return redirectWithSession(`${origin}${path}`);
}

/**
 * Single server-side verify for email links — one request, no client/middleware re-verify.
 * PKCE `code` and OTP `token_hash` both land here via emailRedirectTo.
 */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);
  const tokenHash = searchParams.get("token_hash");
  const token = searchParams.get("token");
  const email = searchParams.get("email");
  const typeParam = searchParams.get("type");
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (!isSupabaseConfigured()) {
    return redirectAuthCodeError(origin, "not_configured");
  }

  const auth = createAuthRouteHandlerClient(request);
  if (!auth) {
    return redirectAuthCodeError(origin, "auth_failed", email);
  }

  const { supabase, redirectWithSession } = auth;

  authLog("confirm.start", {
    hasCode: Boolean(code),
    hasTokenHash: Boolean(tokenHash),
    hasToken: Boolean(token),
    type: typeParam,
  });
  authMetric("confirm.verify");

  if (code) {
    const { error } = await supabase.auth.exchangeCodeForSession(code);
    if (error) {
      authLog("confirm.fail", { step: "exchangeCodeForSession", message: error.message });
      return redirectAuthCodeError(origin, authCodeErrorReason(error.message), email);
    }
    return finishAuthRedirect(origin, next, email, supabase, redirectWithSession);
  }

  if (tokenHash && isEmailOtpType(typeParam)) {
    const { error } = await supabase.auth.verifyOtp({
      type: typeParam as EmailOtpType,
      token_hash: tokenHash,
    });

    if (error) {
      authLog("confirm.fail", { step: "verifyOtp", message: error.message });
      return redirectAuthCodeError(origin, authCodeErrorReason(error.message), email);
    }

    return finishAuthRedirect(origin, next, email, supabase, redirectWithSession);
  }

  if (token && isEmailOtpType(typeParam)) {
    const verifyPayload = email
      ? { type: typeParam as EmailOtpType, token, email }
      : { type: typeParam as EmailOtpType, token_hash: token };

    const { error } = await supabase.auth.verifyOtp(verifyPayload);

    if (error) {
      authLog("confirm.fail", { step: "verifyOtp(token)", message: error.message });
      return redirectAuthCodeError(origin, authCodeErrorReason(error.message), email);
    }

    return finishAuthRedirect(origin, next, email, supabase, redirectWithSession);
  }

  authLog("confirm.fail", { step: "missing_params" });
  return redirectAuthCodeError(origin, "invalid_link", email);
}
