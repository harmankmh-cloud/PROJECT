/** API routes that bypass session auth (webhooks, cron, API keys, public). */
export const PUBLIC_API_PREFIXES = [
  "/api/webhooks/",
  "/api/twilio/",
  "/api/telnyx/",
  "/api/make/outreach",
  "/api/auth/",
  "/api/leads/capture",
  "/api/demo/call",
  "/api/v1/calls",
  "/api/voices",
  "/api/omnichannel/inbound",
  "/api/orchestrator/",
  "/api/internal/",
] as const;

export function isPublicApiRoute(pathname: string): boolean {
  return PUBLIC_API_PREFIXES.some((prefix) => pathname.startsWith(prefix));
}
