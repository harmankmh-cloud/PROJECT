/** Plain-language auth errors for signup/login (non-technical users). */
export function friendlyAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("rate limit") || lower.includes("email rate")) {
    return "Too many emails sent recently. Wait about an hour, or ask the site owner to turn on custom email (SMTP). You can also sign up with Confirm email turned off in Supabase for instant access.";
  }

  if (lower.includes("already registered") || lower.includes("already been registered")) {
    return "This email already has an account. Try Sign in instead.";
  }

  if (lower.includes("invalid email")) {
    return "That email address doesn’t look valid. Check for typos.";
  }

  if (lower.includes("password") && lower.includes("least")) {
    return "Password must be at least 6 characters.";
  }

  if (lower.includes("signup is disabled")) {
    return "Sign-ups are turned off in Supabase. Contact support.";
  }

  if (lower.includes("smtp") || lower.includes("sending email")) {
    return "Email could not be sent. The site owner needs to set up SMTP in Supabase (see SMTP_SETUP.md).";
  }

  return message;
}
