import { APP_URL, BRAND } from "@/lib/brand";

export const DOCS_NAV = [
  { href: "/docs", label: "Overview" },
  { href: "/docs/quickstart", label: "Quickstart" },
  { href: "/docs/api/calls", label: "Calls API" },
  { href: "/docs/webhooks", label: "Webhooks" },
  { href: "/help/hubspot-integration", label: "HubSpot setup" },
  { href: "/help/google-calendar", label: "Google Calendar" },
] as const;

export const DOCS_OVERVIEW = {
  title: "Developer documentation",
  sections: [
    {
      heading: "Authentication",
      body: `All API requests require a Bearer token from your dashboard API keys. Create keys at /dashboard/developer. Keys are org-scoped and can be revoked anytime.`,
      code: `curl -H "Authorization: Bearer grtq_your_key" ${APP_URL}/api/v1/calls`,
    },
    {
      heading: "Base URL",
      body: `All endpoints are relative to ${APP_URL}. HTTPS is required in production.`,
    },
    {
      heading: "Rate limits",
      body: "Default limit is 100 requests per minute per API key. When exceeded, the API returns HTTP 429. Contact support for higher limits on Enterprise.",
      code: `# Example 429 response
{ "error": "Rate limit exceeded" }`,
    },
    {
      heading: "Pagination",
      body: "The Calls API returns the most recent calls up to your limit (max 100). Use the created_at timestamps on returned records for cursor-style paging in your integration.",
    },
    {
      heading: "Error codes",
      body: "Common HTTP statuses: 401 invalid or missing API key, 400 malformed request, 429 rate limited, 500 server error. Error bodies include an error string.",
      code: `{ "error": "Invalid API key" }`,
    },
    {
      heading: "Code examples",
      body: "Same endpoint in JavaScript (fetch) and Python (requests):",
      code: `// JavaScript
const res = await fetch("${APP_URL}/api/v1/calls?limit=10", {
  headers: { Authorization: "Bearer grtq_…" },
});
const { calls } = await res.json();

# Python
import requests
r = requests.get(
  "${APP_URL}/api/v1/calls",
  headers={"Authorization": "Bearer grtq_…"},
  params={"limit": 10},
)
calls = r.json()["calls"]`,
    },
  ],
};

export const DOCS_QUICKSTART = {
  title: "Quickstart",
  steps: [
    {
      heading: "1. Create an agent",
      body: "Sign up, complete onboarding, and configure your agent greeting and system prompt in the dashboard.",
    },
    {
      heading: "2. Test in sandbox",
      body: "Use the text sandbox and up to three one-minute test calls before going live.",
    },
    {
      heading: "3. Connect telephony",
      body: "Point Telnyx or Twilio voice webhooks to GreetQ:",
      code: `Telnyx voice webhook: ${APP_URL}/api/telnyx/webhook\nTwilio voice webhook: ${APP_URL}/api/twilio/voice`,
    },
    {
      heading: "4. Configure outbound webhooks",
      body: `Set your webhook URL in Settings. ${BRAND.name} sends signed call.completed events after each call. Payload shape is documented on /docs/webhooks.`,
    },
    {
      heading: "5. Connect HubSpot or Google Calendar",
      body: "Use the Integrations tab in the dashboard for OAuth connectors, or follow the help articles linked in the docs sidebar.",
    },
  ],
};

export const DOCS_CALLS_API = {
  title: "Calls API",
  endpoint: "GET /api/v1/calls",
  description: "List recent calls for your organization, newest first.",
  params: [
    { name: "limit", type: "integer", default: "25", max: "100" },
  ],
  example: `curl -H "Authorization: Bearer grtq_…" "${APP_URL}/api/v1/calls?limit=10"`,
  response: `{
  "calls": [
    {
      "id": "uuid",
      "direction": "inbound",
      "from_number": "+16045550100",
      "to_number": "+16045550101",
      "status": "completed",
      "duration_seconds": 94,
      "sentiment": "positive",
      "intent": "booking",
      "summary": "Caller booked appointment for Tuesday 2pm",
      "score": 0.92,
      "topics": ["appointment", "cleaning"],
      "action_items": ["Send confirmation SMS"],
      "created_at": "2026-06-16T18:00:00.000Z"
    }
  ]
}`,
};

export const DOCS_WEBHOOKS = {
  title: "Outbound webhooks",
  description: `${BRAND.name} POSTs to your configured URL when a call completes. Retry policy: contact support for Enterprise delivery guarantees.`,
  event: "call.completed",
  headers: [
    { name: "Content-Type", value: "application/json" },
    { name: "User-Agent", value: "GreetQ-Webhooks/1.0" },
    { name: "X-GreetQ-Signature", value: "sha256=… (when webhook secret is set)" },
  ],
  payload: `{
  "event": "call.completed",
  "call": {
    "id": "…",
    "from_number": "+1…",
    "to_number": "+1…",
    "duration_seconds": 94,
    "status": "completed"
  },
  "analysis": {
    "summary": "…",
    "intent": "booking",
    "sentiment": "positive",
    "action_items": ["…"]
  }
}`,
};
