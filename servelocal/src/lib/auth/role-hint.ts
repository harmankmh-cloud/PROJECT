import type { UserRole } from "@/lib/user-profiles";

/** Infer pro/homeowner intent from URL path or query (login/signup flows). */
export function roleHintFromRequest(pathname: string, searchAs: string | null): UserRole | null {
  if (searchAs === "pro" || searchAs === "homeowner") return searchAs;
  if (pathname.startsWith("/signup/pro") || pathname.startsWith("/login/pro")) return "pro";
  if (pathname.startsWith("/signup/homeowner") || pathname.startsWith("/login/homeowner")) {
    return "homeowner";
  }
  return null;
}
