export type AuthCodeErrorReason =
  | "link_used"
  | "verification_failed"
  | "invalid_link"
  | "auth_failed"
  | "not_configured";

export function authCodeErrorReason(message: string): AuthCodeErrorReason {
  const lower = message.toLowerCase();
  if (
    lower.includes("not found") ||
    lower.includes("expired") ||
    lower.includes("already been used")
  ) {
    return "link_used";
  }
  if (lower.includes("invalid")) {
    return "invalid_link";
  }
  return "verification_failed";
}

export function authCodeErrorUrl(origin: string, reason: AuthCodeErrorReason, email?: string | null) {
  const url = new URL("/auth/auth-code-error", origin);
  url.searchParams.set("reason", reason);
  if (email) url.searchParams.set("email", email);
  return url.toString();
}

export const AUTH_CODE_ERROR_COPY: Record<
  AuthCodeErrorReason,
  { title: string; body: string }
> = {
  link_used: {
    title: "This link was already used or expired",
    body: "Confirmation links work once. Sign in if you already confirmed, or request a fresh email below.",
  },
  verification_failed: {
    title: "We could not verify that link",
    body: "The link may be incomplete or expired. Request a new confirmation email and use the latest one only.",
  },
  invalid_link: {
    title: "Invalid confirmation link",
    body: "Open the most recent confirmation email from ServeLocal, or request a new link below.",
  },
  auth_failed: {
    title: "Sign-in link failed",
    body: "Try signing in with your password, or request a new confirmation email.",
  },
  not_configured: {
    title: "Authentication unavailable",
    body: "This environment is missing auth configuration. Contact support if this persists.",
  },
};
