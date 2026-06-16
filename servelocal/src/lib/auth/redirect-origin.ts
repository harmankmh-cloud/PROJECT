/** Canonical origin for Supabase emailRedirectTo — avoids www/non-www mismatch. */
export function getAuthRedirectOrigin(fallbackOrigin?: string) {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (configured) return configured;
  if (fallbackOrigin) return fallbackOrigin.replace(/\/$/, "");
  return "https://www.servelocal.ca";
}

export function authConfirmUrl(
  fallbackOrigin?: string,
  options?: { as?: "homeowner" | "pro"; next?: string }
) {
  const url = new URL("/auth/confirm", getAuthRedirectOrigin(fallbackOrigin));
  if (options?.as) url.searchParams.set("as", options.as);
  if (options?.next?.startsWith("/") && !options.next.startsWith("//")) {
    url.searchParams.set("next", options.next);
  }
  return url.toString();
}
