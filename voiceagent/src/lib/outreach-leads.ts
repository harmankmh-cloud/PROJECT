/** Skip scraped addresses that are not real business inboxes. */
const BLOCKED_EMAIL_RE =
  /(?:^|[.@])(?:noreply|no-reply|donotreply|healthlinkbc|gov\.bc\.ca|example\.com|facebook\.com|instagram\.com|twitter\.com|linkedin\.com)/i;

export function isSendableOutreachEmail(email: string): boolean {
  const normalized = email.trim().toLowerCase();
  if (!normalized || !normalized.includes("@")) return false;
  if (BLOCKED_EMAIL_RE.test(normalized)) return false;
  return true;
}

export function formatApiError(error: unknown): string {
  if (typeof error === "string") return error;
  if (error instanceof Error) return error.message;
  if (error && typeof error === "object") {
    try {
      return JSON.stringify(error);
    } catch {
      return "Unknown error";
    }
  }
  return "Unknown error";
}
