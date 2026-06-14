import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { type NextRequest, NextResponse } from "next/server";
import { isSupabaseConfigured } from "@/lib/supabase/config";

type CollectedCookie = { name: string; value: string; options: CookieOptions };

/**
 * Supabase client for auth route handlers (confirm, callback).
 * Session cookies from exchangeCodeForSession / verifyOtp are collected and
 * must be applied to the redirect response — cookies() alone does not attach
 * them to NextResponse.redirect() reliably.
 */
export function createAuthRouteHandlerClient(request: NextRequest) {
  if (!isSupabaseConfigured()) {
    return null;
  }

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
  const collected: CollectedCookie[] = [];

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value, options }) => {
          collected.push({ name, value, options });
        });
      },
    },
  });

  function redirectWithSession(target: string) {
    const response = NextResponse.redirect(target);
    collected.forEach(({ name, value, options }) => {
      response.cookies.set(name, value, options);
    });
    return response;
  }

  return { supabase, redirectWithSession };
}
