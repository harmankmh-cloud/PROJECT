import { APP_URL, BRAND } from "@/lib/brand";

export const DOCS_NAV = [
  { href: "/docs", label: "Overview" },
  { href: "/docs/quickstart", label: "Quickstart" },
  { href: "/docs/api/calls", label: "Calls API" },
  { href: "/docs/webhooks", label: "Webhooks" },
] as const;

export const DOCS_OVERVIEW = {
  title: "Developer documentation",
  sections: [
    {
      heading: "Authentication",
      body: `All API requests require a Bearer token from your dashboard API keys. Create keys at /dashboard/developer.`,
      code: `curl -H "Authorization: Bearer grtq_your_key" ${APP_URL}/api/v1/calls`,
    },
    {
      heading: "Base URL",
      body: `All endpoints are relative to ${APP_URL}.`,
    },
    {
      heading: "Rate limits",
      body: "API keys are scoped to your organization. Default limit is 100 requests per minute per key. Contact support for higher limits on Enterprise.",
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
      body: `Set your webhook URL in Settings. ${BRAND.name} sends signed call.completed events after each call.`,
    },
  ],
};

export const DOCS_CALLS_API = {
  title: "Calls API",
  endpoint: "GET /api/v1/calls",
  description: "List recent calls for your organization.",
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
      "status": "completed",
      "duration_seconds": 94,
      "summary": "Caller booked appointment for Tuesday 2pm"
    }
  ]
}`,
};

export const DOCS_WEBHOOKS = {
  title: "Outbound webhooks",
  description: `${BRAND.name} POSTs to your configured URL when a call completes.`,
  event: "call.completed",
  headers: [
    { name: "Content-Type", value: "application/json" },
    { name: "User-Agent", value: "GreetQ-Webhooks/1.0" },
    { name: "X-GreetQ-Signature", value: "sha256=… (when webhook secret is set)" },
  ],
  payload: `{
  "event": "call.completed",
  "call": { "id": "…", "from_number": "+1…", "duration": 94 },
  "analysis": { "summary": "…", "intent": "booking", "sentiment": "positive" }
}`,
};
