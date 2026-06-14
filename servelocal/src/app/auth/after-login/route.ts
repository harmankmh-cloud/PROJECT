import { type NextRequest, NextResponse } from "next/server";
import { resolvePostLoginPath, type UserRole } from "@/lib/auth-routing";
import { isPlatformAdmin } from "@/lib/admin-auth";
import { createAuthRouteHandlerClient } from "@/lib/supabase/route-handler";
import { isSupabaseConfigured } from "@/lib/supabase/config";

function loginRedirect(origin: string, error?: string) {
  const path = error ? `/login?error=${error}` : "/login";
  return NextResponse.redirect(`${origin}${path}`);
}

export async function GET(request: NextRequest) {
  const { origin, searchParams } = new URL(request.url);
  const nextPath = searchParams.get("next");
  const asParam = searchParams.get("as");
  const asRole: UserRole | null =
    asParam === "pro" || asParam === "homeowner" ? asParam : null;

  if (!isSupabaseConfigured()) {
    return loginRedirect(origin, "not_configured");
  }

  const auth = createAuthRouteHandlerClient(request);
  if (!auth) {
    return loginRedirect(origin, "session_error");
  }

  const { supabase, redirectWithSession } = auth;

  let user;
  try {
    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch (err) {
    console.error("[after-login] getUser failed:", err);
    return loginRedirect(origin, "session_error");
  }

  if (!user) {
    return loginRedirect(origin);
  }

  if (isPlatformAdmin(user.email)) {
    return redirectWithSession(`${origin}/admin`);
  }

  try {
    const target = await resolvePostLoginPath(user, { next: nextPath, as: asRole });
    return redirectWithSession(`${origin}${target}`);
  } catch (err) {
    console.error("[after-login] routing failed:", err);
    return loginRedirect(origin, "session_error");
  }
}
