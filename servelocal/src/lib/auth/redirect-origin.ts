/** Canonical origin for Supabase emailRedirectTo — avoids www/non-www mismatch. */
export function getAuthRedirectOrigin(fallbackOrigin?: string) {
  const configured = process.env.NEXT_PUBLIC_APP_URL?.replace(/\/$/, "");
  if (configured) return configured;
  if (fallbackOrigin) return fallbackOrigin.replace(/\/$/, "");
  return "https://www.servelocal.ca";
}

export function authConfirmUrl(fallbackOrigin?: string) {
  return `${getAuthRedirectOrigin(fallbackOrigin)}/auth/confirm`;
}
