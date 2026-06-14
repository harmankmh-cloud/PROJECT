import type { NextRequest } from "next/server";

const AUTH_HANDLER_PREFIXES = ["/auth/confirm", "/auth/callback", "/auth/after-login"];

export function isAuthHandlerPath(pathname: string) {
  return AUTH_HANDLER_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}

/** True when URL carries Supabase email/PKCE tokens that must hit /auth/confirm. */
export function hasAuthCallbackParams(searchParams: URLSearchParams) {
  if (searchParams.get("code")) return true;
  if (searchParams.get("token_hash")) return true;
  const token = searchParams.get("token");
  const type = searchParams.get("type");
  return Boolean(token && type);
}

export function buildAuthConfirmRedirect(request: NextRequest) {
  const target = new URL("/auth/confirm", request.url);
  request.nextUrl.searchParams.forEach((value, key) => {
    target.searchParams.set(key, value);
  });
  return target;
}

/** Client-safe: build /auth/confirm URL preserving current query params. */
export function authConfirmUrlFromSearch(origin: string, searchParams: URLSearchParams) {
  const target = new URL("/auth/confirm", origin);
  searchParams.forEach((value, key) => target.searchParams.set(key, value));
  return target.toString();
}
