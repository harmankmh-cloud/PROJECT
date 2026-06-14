import { NextResponse } from "next/server";
import { ensureUserProfileFromMetadata, getAuthUserProfile } from "@/lib/auth/queries";
import { isPlatformAdmin } from "@/lib/admin-auth";
import { getProvidersForUser } from "@/lib/data";
import { createClient } from "@/lib/supabase/server";
import type { UserRole } from "@/lib/user-profiles";

function safeRedirect(origin: string, path: string) {
  return NextResponse.redirect(`${origin}${path}`);
}

export async function GET(request: Request) {
  const { origin, searchParams } = new URL(request.url);
  const nextPath = searchParams.get("next");
  const safeNext =
    nextPath && nextPath.startsWith("/") && !nextPath.startsWith("//") ? nextPath : null;

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
    let profile = await getAuthUserProfile(user.id);
    if (!profile) {
      profile = await ensureUserProfileFromMetadata(user);
    }

    const role: UserRole | undefined =
      profile?.role ?? (user.user_metadata?.role as UserRole | undefined);

    if (role === "pro") {
      const listings = await getProvidersForUser(user.id);
      if (listings.length === 0) {
        return safeRedirect(origin, "/onboarding");
      }
      return safeRedirect(origin, safeNext ?? "/dashboard/pro");
    }

    if (!profile || !profile.onboarding_completed_at) {
      return safeRedirect(origin, "/onboarding/homeowner");
    }

    return safeRedirect(origin, safeNext ?? "/dashboard");
  } catch (err) {
    console.error("[after-login] routing failed:", err);
    const metaRole = user.user_metadata?.role as string | undefined;
    if (metaRole === "pro") {
      return safeRedirect(origin, "/onboarding?notice=listings_unavailable");
    }
    return safeRedirect(origin, "/dashboard?notice=profile_unavailable");
  }
}
