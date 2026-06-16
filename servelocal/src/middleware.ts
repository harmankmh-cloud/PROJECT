import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import {
  buildAuthConfirmRedirect,
  hasAuthCallbackParams,
  isAuthHandlerPath,
} from "@/lib/auth/catch-auth-tokens";
import { isHomeownerDashboardPath, isProPath } from "@/lib/auth-routing";
import { isPlatformAdmin } from "@/lib/admin-auth";
import type { UserRole } from "@/lib/user-profiles";

function roleFromUser(user: { user_metadata?: Record<string, unknown> }): UserRole | undefined {
  const metaRole = user.user_metadata?.role;
  if (metaRole === "pro" || metaRole === "homeowner") return metaRole;
  return undefined;
}

function pathNeedsSessionCheck(pathname: string) {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/onboarding") ||
    pathname.startsWith("/auth/choose-role") ||
    pathname === "/login" ||
    pathname.startsWith("/login/") ||
    pathname === "/signup" ||
    pathname.startsWith("/signup/")
  );
}

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Email confirm links often land on / (Site URL) with ?code= or ?token_hash= — forward server-side.
  if (!isAuthHandlerPath(pathname) && hasAuthCallbackParams(request.nextUrl.searchParams)) {
    return NextResponse.redirect(buildAuthConfirmRedirect(request));
  }

  // Public routes: skip getUser() — avoids /auth/v1/user on every homepage hit.
  if (isAuthHandlerPath(pathname) || pathname === "/" || !pathNeedsSessionCheck(pathname)) {
    return NextResponse.next({
      request: { headers: request.headers },
    });
  }

  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return response;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (pathname.startsWith("/admin") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin") && user && !isPlatformAdmin(user.email)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if ((pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding") || pathname === "/auth/choose-role") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (user) {
    const role = roleFromUser(user);

    if (role === "pro" && isHomeownerDashboardPath(pathname)) {
      return NextResponse.redirect(new URL("/dashboard/pro", request.url));
    }

    if (role === "homeowner" && isProPath(pathname)) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
  }

  if ((pathname === "/login" || pathname.startsWith("/login/") || pathname === "/signup" || pathname.startsWith("/signup/")) && user) {
    const as = request.nextUrl.searchParams.get("as");
    const target =
      as === "pro" || as === "homeowner" ? `/auth/after-login?as=${as}` : "/auth/after-login";
    return NextResponse.redirect(new URL(target, request.url));
  }

  return response;
}

export const config = {
  matcher: [
    "/",
    "/auth/:path*",
    "/dashboard/:path*",
    "/onboarding",
    "/onboarding/:path*",
    "/admin/:path*",
    "/login",
    "/login/:path*",
    "/signup",
    "/signup/:path*",
  ],
};
