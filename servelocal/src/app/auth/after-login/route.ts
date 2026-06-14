import { NextResponse } from "next/server";
import { resolvePostLoginPath } from "@/lib/auth-routing";
import { isPlatformAdmin } from "@/lib/admin-auth";
import { createClient } from "@/lib/supabase/server";
function safeRedirect(origin: string, path: string) {
  return NextResponse.redirect(`${origin}${path}`);
}

export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);
  const nextPath = searchParams.get("next");

  let user;
  try {
    const supabase = await createClient();
    if (!supabase) {
      return safeRedirect(origin, "/login?error=session_error");
    }

    const {
      data: { user: authUser },
    } = await supabase.auth.getUser();
    user = authUser;
  } catch (err) {
    console.error("[after-login] getUser failed:", err);
    return safeRedirect(origin, "/login?error=session_error");
  }

  if (!user) {
    return safeRedirect(origin, "/login");
  }

  if (isPlatformAdmin(user.email)) {
    return safeRedirect(origin, "/admin");
  }

  try {
    const target = await resolvePostLoginPath(user, { next: nextPath });
    return safeRedirect(origin, target);
  } catch (err) {
    console.error("[after-login] routing failed:", err);
    return safeRedirect(origin, "/login?error=session_error");
  }
}
