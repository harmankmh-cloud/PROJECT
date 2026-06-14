import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isHomeownerDashboardPath, isProPath } from "@/lib/auth-routing";
import { isPlatformAdmin } from "@/lib/admin-auth";
import type { UserRole } from "@/lib/user-profiles";

function roleFromUser(user: { user_metadata?: Record<string, unknown> }): UserRole | undefined {
  const metaRole = user.user_metadata?.role;
  if (metaRole === "pro" || metaRole === "homeowner") return metaRole;
  return undefined;
}

export async function middleware(request: NextRequest) {
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

  const pathname = request.nextUrl.pathname;

  // Public auth handlers — must run without session gates (OTP / PKCE cookie exchange)
  if (
    pathname.startsWith("/auth/confirm") ||
    pathname.startsWith("/auth/callback") ||
    pathname.startsWith("/auth/after-login")
  ) {
    return response;
  }

  if (pathname.startsWith("/admin") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin") && user && !isPlatformAdmin(user.email)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if ((pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding")) && !user) {
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
    return NextResponse.redirect(new URL("/auth/after-login", request.url));
  }

  return response;
}

export const config = {
  matcher: [
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
