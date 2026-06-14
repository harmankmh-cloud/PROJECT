export type ChangelogEntry = {
  date: string;
  title: string;
  tag: "New" | "Improved" | "Fixed";
  items: readonly string[];
};

export const CHANGELOG: readonly ChangelogEntry[] = [
  {
    date: "2026-06-11",
    title: "Unified site, call intelligence spotlight, and global trust signals",
    tag: "Improved",
    items: [
      "New navigation with Product and Industries menus — every vertical one click away",
      "Homepage now shows the intelligence layer: AI summaries, sentiment, action items, and quality scores",
      "Interactive sample call player — hear a booking call without sharing your number",
      "Missed-revenue estimator with per-industry job values",
      "Data residency statement and subprocessor list on the Security page",
    ],
  },
  {
    date: "2026-05-20",
    title: "Call intelligence on every plan",
    tag: "New",
    items: [
      "Every completed call gets a 2-sentence AI summary",
      "Sentiment, intent, topics, and action items extracted automatically",
      "0–100 call quality score in the dashboard and API",
    ],
  },
  {
    date: "2026-05-02",
    title: "Public API v1",
    tag: "New",
    items: [
      "GET /api/v1/calls with org-scoped API keys",
      "Webhook events for call lifecycle",
      "Developer docs at /docs",
    ],
  },
  {
    date: "2026-04-14",
    title: "Industry pages and compare hub",
    tag: "New",
    items: [
      "Eight industry landing pages from dental to property management",
      "Honest comparison pages — no fabricated competitor claims",
    ],
  },
  {
    date: "2026-03-28",
    title: "Outbound campaigns with CASL tooling",
    tag: "New",
    items: [
      "Consent records and quiet-hours enforcement",
      "Do-not-call list support",
      "Campaign analytics in the dashboard",
    ],
  },
] as const;
