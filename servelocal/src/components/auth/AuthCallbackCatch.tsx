"use client";

import { useEffect } from "react";

const AUTH_HANDLER_PREFIXES = ["/auth/confirm", "/auth/callback", "/auth/after-login"];

function isAuthHandlerPath(pathname: string) {
  return AUTH_HANDLER_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/**
 * Supabase sometimes redirects email confirmations to Site URL (/) instead of
 * /auth/confirm when redirect URLs are misconfigured. Catch tokens on any page
 * and forward to the server handler, or set session from hash tokens client-side.
 */
export function AuthCallbackCatch() {
  useEffect(() => {
    const { pathname, search, hash, origin } = window.location;
    if (isAuthHandlerPath(pathname)) return;

    const query = new URLSearchParams(search);
    const code = query.get("code");
    const tokenHash = query.get("token_hash");
    const type = query.get("type");

    if (code || (tokenHash && type)) {
      const target = new URL("/auth/confirm", origin);
      query.forEach((value, key) => target.searchParams.set(key, value));
      window.location.replace(target.toString());
      return;
    }

    const hashBody = hash.startsWith("#") ? hash.slice(1) : hash;
    if (!hashBody) return;

    const hashParams = new URLSearchParams(hashBody);
    const accessToken = hashParams.get("access_token");
    const refreshToken = hashParams.get("refresh_token");
    if (!accessToken || !refreshToken) return;

    void (async () => {
      try {
        const { createClient } = await import("@/lib/supabase/client");
        const supabase = createClient();
        const { error } = await supabase.auth.setSession({
          access_token: accessToken,
          refresh_token: refreshToken,
        });
        if (error) {
          window.location.replace("/login?error=auth_failed");
          return;
        }
        window.location.replace("/auth/after-login");
      } catch {
        window.location.replace("/login?error=auth_failed");
      }
    })();
  }, []);

  return null;
}
