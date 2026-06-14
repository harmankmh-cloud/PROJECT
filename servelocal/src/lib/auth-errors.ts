export function friendlyAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("rate limit") || lower.includes("email rate")) {
    return "Too many emails sent recently. Wait about an hour, or use custom SMTP (Resend) in Supabase — same setup as RateLocal. See servelocal/SMTP_SETUP.md.";
  }

  if (lower.includes("invalid login credentials") || lower.includes("invalid credentials")) {
    return "Wrong email or password. Try again.";
  }

  if (lower.includes("invalid email")) {
    return "That email address doesn't look valid.";
  }

  if (lower.includes("password") && lower.includes("least")) {
    return "Password must be at least 8 characters.";
  }

  if (lower.includes("signup is disabled")) {
    return "Sign-ups are turned off in Supabase. Contact support.";
  }

  if (lower.includes("error sending confirmation email") || lower.includes("confirmation email")) {
    return "Could not send email. Verify your domain in Resend, or turn Confirm email OFF in Supabase (same fix as RateLocal). See SMTP_SETUP.md.";
  }

  if (
    lower.includes("one-time token not found") ||
    lower.includes("otp expired") ||
    lower.includes("token has expired") ||
    lower.includes("invalid or expired")
  ) {
    return "That link was already used or has expired. Sign in below, or request a new confirmation email.";
  }

  if (
    lower.includes("already registered") ||
    lower.includes("already been registered") ||
    lower.includes("user already registered")
  ) {
    return "An account with this email already exists. Sign in, or check your inbox for the confirmation link.";
  }

  return message;
}
