"use client";

import { useEffect, useRef } from "react";
import {
  authConfirmUrlFromSearch,
  hasAuthCallbackParams,
  isAuthHandlerPath,
} from "@/lib/auth/catch-auth-tokens";

const CONFIRM_FORWARD_KEY = "servelocal:auth-confirm-forward";

/**
 * Supabase sometimes redirects email confirmations to Site URL (/) instead of
 * /auth/confirm when redirect URLs are misconfigured. Forward once — never
 * re-hit verify from client effects (single-use tokens).
 */
export function AuthCallbackCatch() {
  const ran = useRef(false);

  useEffect(() => {
    if (ran.current) return;
    ran.current = true;

    const { pathname, search, hash, origin } = window.location;
    if (isAuthHandlerPath(pathname)) return;

    const query = new URLSearchParams(search);

    if (hasAuthCallbackParams(query)) {
      // sessionStorage guard: Strict Mode double-mount must not forward twice.
      const dedupeKey = `${CONFIRM_FORWARD_KEY}:${search}`;
      if (sessionStorage.getItem(dedupeKey)) return;
      sessionStorage.setItem(dedupeKey, "1");
      window.location.replace(authConfirmUrlFromSearch(origin, query));
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
          window.location.replace("/auth/auth-code-error?reason=auth_failed");
          return;
        }
        window.location.replace("/auth/after-login");
      } catch {
        window.location.replace("/auth/auth-code-error?reason=auth_failed");
      }
    })();
  }, []);

  return null;
}
