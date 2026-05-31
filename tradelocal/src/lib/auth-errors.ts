export function friendlyAuthError(message: string): string {
  const lower = message.toLowerCase();

  if (lower.includes("rate limit") || lower.includes("email rate")) {
    return "Too many attempts. Wait a few minutes and try again.";
  }

  if (lower.includes("invalid login credentials") || lower.includes("invalid credentials")) {
    return "Wrong email or password. Try again.";
  }

  if (lower.includes("invalid email")) {
    return "That email address doesn't look valid.";
  }

  if (lower.includes("password") && lower.includes("least")) {
    return "Password must be at least 6 characters.";
  }

  return message;
}
