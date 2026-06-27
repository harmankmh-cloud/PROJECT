import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

function isAdminEmail(email: string | undefined) {
  if (!email) return false;
  const raw = process.env.ADMIN_EMAILS || process.env.ADMIN_EMAIL || "";
  return raw
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean)
    .includes(email.toLowerCase());
}

export async function updateSession(request: NextRequest) {
  let supabaseResponse = NextResponse.next({ request });

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!url || !key) {
    return supabaseResponse;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        // Cookies must be set on the request so the updated values are
        // forwarded to the new NextResponse, and on supabaseResponse so
        // they are sent back to the browser. Both sides are needed for
        // the session token refresh to propagate correctly.
        // The two loops are intentional: the request update must happen
        // before NextResponse.next({ request }) is called.
        cookiesToSet.forEach(({ name, value }) =>
          request.cookies.set(name, value)
        );
        supabaseResponse = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          supabaseResponse.cookies.set(name, value, options)
        );
      },
    },
  });

  // IMPORTANT: Do not add logic between createServerClient and getUser().
  // A simple mistake could make it very hard to debug issues with users being
  // randomly logged out.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/admin") && !user) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/admin") && user && !isAdminEmail(user.email)) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if (
    (pathname.startsWith("/dashboard") || pathname.startsWith("/onboarding")) &&
    !user
  ) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  if (pathname.startsWith("/business/dashboard")) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  if ((pathname === "/login" || pathname === "/signup") && user) {
    if (isAdminEmail(user.email)) {
      return NextResponse.redirect(new URL("/admin", request.url));
    }
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  // IMPORTANT: Return the supabaseResponse object as-is. Returning a new
  // NextResponse.next() without copying cookies will break session refresh.
  return supabaseResponse;
}
