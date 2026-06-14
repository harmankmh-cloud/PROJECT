export const AUTH_ERROR_MESSAGES: Record<string, string> = {
  auth_failed: "Sign-in link expired or invalid. Please try again.",
  missing_code: "Sign-in link was incomplete. Please request a new one.",
  session_error: "We could not verify your session. Please sign in again.",
  not_configured: "Authentication is not configured on this environment.",
  unauthorized: "You do not have access to that area.",
  verification_failed: "Email verification failed. Request a new confirmation link.",
  invalid_link: "That verification link is invalid or has expired.",
  link_used:
    "That confirmation link was already used or has expired. Sign in below, or request a new confirmation email.",
};

export function authErrorMessage(code: string | undefined | null) {
  if (!code) return null;
  return AUTH_ERROR_MESSAGES[code] ?? "Sign-in failed. Please try again.";
}
