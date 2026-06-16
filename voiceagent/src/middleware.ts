import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isPublicApiRoute } from "@/lib/public-api-routes";
import { authorizedInternalEdge } from "@/lib/internal-auth-edge";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

const PUBLIC_PATHS = ["/login", "/signup", "/forgot-password", "/reset-password"];
const PUBLIC_ANY_USER = ["/demo"];
const AUTH_PATHS = ["/onboarding"];

function redirectLogin(request: NextRequest) {
  return NextResponse.redirect(new URL("/login", request.url));
}

/** Pin first page load to this deployment — reduces server-action skew after deploys. */
function pinDeploymentVersion(request: NextRequest, response: NextResponse) {
  const deploymentId = process.env.VERCEL_DEPLOYMENT_ID;
  if (!deploymentId || request.cookies.get("__vdpl")) return;

  response.cookies.set("__vdpl", deploymentId, {
    path: "/",
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV === "production",
  });
}

function needsAuthMiddleware(pathname: string) {
  return (
    pathname.startsWith("/dashboard") ||
    pathname.startsWith("/admin") ||
    AUTH_PATHS.some((p) => pathname.startsWith(p)) ||
    pathname.startsWith("/api/") ||
    PUBLIC_PATHS.includes(pathname) ||
    PUBLIC_ANY_USER.includes(pathname)
  );
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });
  pinDeploymentVersion(request, response);

  const pathname = request.nextUrl.pathname;
  if (!needsAuthMiddleware(pathname)) {
    return response;
  }

  let url: string;
  let key: string;
  try {
    url = getSupabaseUrl();
    key = getSupabaseAnonKey();
  } catch {
    if (pathname.startsWith("/api/internal/")) {
      if (!authorizedInternalEdge(request)) {
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
        pinDeploymentVersion(request, response);
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (pathname.startsWith("/api/internal/")) {
    if (!authorizedInternalEdge(request)) {
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
    "/((?!_next/static|_next/image|favicon.ico|icon|opengraph-image|monitoring|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
