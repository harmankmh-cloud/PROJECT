import { NextRequest, NextResponse } from "next/server";
import { isEmailOtpType } from "@/lib/auth/post-auth-redirect";
import { isSupabaseConfigured } from "@/lib/supabase/config";

/** Legacy/alternate redirect URL — forward to /auth/confirm with same params. */
export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url);

  if (!isSupabaseConfigured()) {
    return NextResponse.redirect(`${origin}/login?error=not_configured`);
  }

  const code = searchParams.get("code");
  const tokenHash = searchParams.get("token_hash");
  const typeParam = searchParams.get("type");

  if (!code && !(tokenHash && isEmailOtpType(typeParam))) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const target = new URL("/auth/confirm", origin);
  searchParams.forEach((value, key) => target.searchParams.set(key, value));
  return NextResponse.redirect(target.toString());
}
