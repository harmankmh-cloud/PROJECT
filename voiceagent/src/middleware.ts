import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isPublicApiRoute } from "@/lib/public-api-routes";
import { authorizedInternal } from "@/lib/internal-auth";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

const PUBLIC_PATHS = ["/login", "/signup", "/forgot-password", "/reset-password"];
const PUBLIC_ANY_USER = ["/demo"];
const AUTH_PATHS = ["/onboarding"];

function redirectLogin(request: NextRequest) {
  return NextResponse.redirect(new URL("/login", request.url));
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  let url: string;
  let key: string;
  try {
    url = getSupabaseUrl();
    key = getSupabaseAnonKey();
  } catch {
    const pathname = request.nextUrl.pathname;
    if (pathname.startsWith("/api/internal/")) {
      if (!authorizedInternal(request)) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return response;
    }
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/admin") ||
      (pathname.startsWith("/api/") && !isPublicApiRoute(pathname))
    ) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return redirectLogin(request);
    }
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

  if (pathname.startsWith("/api/internal/")) {
    if (!authorizedInternal(request)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return response;
  }

  if (pathname.startsWith("/api/") && !isPublicApiRoute(pathname) && !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/admin") ||
      AUTH_PATHS.some((p) => pathname.startsWith(p))) &&
    !user
  ) {
    return redirectLogin(request);
  }

  if (
    user &&
    pathname.startsWith("/dashboard") &&
    user.user_metadata?.onboarding_completed === false
  ) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  if (
    PUBLIC_PATHS.includes(pathname) &&
    user &&
    pathname !== "/reset-password" &&
    !PUBLIC_ANY_USER.includes(pathname)
  ) {
    const redirect = NextResponse.redirect(new URL("/dashboard", request.url));
    redirect.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return redirect;
  }

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    response.headers.set("Pragma", "no-cache");
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/onboarding",
    "/demo",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/api/:path*",
  ],
};
