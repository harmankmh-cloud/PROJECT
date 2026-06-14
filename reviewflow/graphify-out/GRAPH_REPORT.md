# Graph Report - reviewflow  (2026-05-31)

## Corpus Check
- 126 files · ~27,041 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 457 nodes · 940 edges · 33 communities (21 shown, 12 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `40faa9bb`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]

## God Nodes (most connected - your core abstractions)
1. `getAppUrl()` - 20 edges
2. `createClient()` - 17 edges
3. `compilerOptions` - 16 edges
4. `createServiceClient()` - 16 edges
5. `getDashboardData()` - 15 edges
6. `BRAND` - 14 edges
7. `getStripe()` - 13 edges
8. `isStripeConfigured()` - 13 edges
9. `isPlatformAdmin()` - 13 edges
10. `getPlatformAdminData()` - 12 edges

## Surprising Connections (you probably didn't know these)
- `ReviewsPage()` --calls--> `getDashboardData()`  [EXTRACTED]
  src/app/dashboard/reviews/page.tsx → src/lib/dashboard-data.ts
- `updateBusinessFromSubscription()` --calls--> `createServiceClient()`  [EXTRACTED]
  src/lib/stripe-subscription.ts → src/lib/supabase/admin.ts
- `CustomerReviewPage()` --calls--> `sortPrompts()`  [EXTRACTED]
  src/app/r/[slug]/page.tsx → src/lib/defaults.ts
- `countEvents()` --calls--> `createClient()`  [EXTRACTED]
  src/lib/dashboard-data.ts → src/lib/supabase/server.ts
- `BillingPage()` --calls--> `getDashboardData()`  [EXTRACTED]
  src/app/dashboard/billing/page.tsx → src/lib/dashboard-data.ts

## Import Cycles
- None detected.

## Communities (33 total, 12 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (37): ControlCenterHub(), Props, sections, ConversionFunnel(), FeedbackInbox(), Filter, Props, PhonePreview() (+29 more)

### Community 1 - "Community 1"
Cohesion: 0.08
Nodes (31): AdminActivityPage(), AdminOverviewPage(), AdminBusinessesPage(), GET(), AdminQuickActions(), Props, AdminReviewsTable(), AdminStatsGrid() (+23 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (29): AdminHubBanner(), adminLinks, GoogleDirectQrCard(), Props, GoogleSetupProvider(), Props, QrCard(), Props (+21 more)

### Community 3 - "Community 3"
Cohesion: 0.12
Nodes (22): activateProAction(), BillingPage(), POST(), ActivateProBanner(), Props, activateBusinessPlan(), ActivatePlanResult, getStripeConfigStatus() (+14 more)

### Community 4 - "Community 4"
Cohesion: 0.12
Nodes (17): AdminLayout(), GET(), adminLinks, AdminShell(), AuthMarketingPanel(), BrandLogo(), DashboardShell(), ownerLinks (+9 more)

### Community 5 - "Community 5"
Cohesion: 0.06
Nodes (33): dependencies, @datadog/browser-rum, next, qrcode, react, react-dom, stripe, @supabase/ssr (+25 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (24): bodySchema, getSupabase(), POST(), bodySchema, getPublicSupabase(), POST(), resolvePlan(), starToExperienceLevel() (+16 more)

### Community 7 - "Community 7"
Cohesion: 0.10
Nodes (18): instrument, jakarta, metadata, viewport, BusinessSettingsForm(), DatadogInit(), GoogleSetupContext, GoogleSetupContextValue (+10 more)

### Community 8 - "Community 8"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 9 - "Community 9"
Cohesion: 0.19
Nodes (12): AdminOwnerGuide(), links, BillingPanel(), Props, labels, StripeSetupChecklist(), UsageMeter(), PLAN_LIMITS (+4 more)

### Community 10 - "Community 10"
Cohesion: 0.25
Nodes (10): GET(), safeNextPath(), businessSetupFromMetadata(), BusinessSetupInput, createBusinessForUser(), completePendingBusinessFromMetadata(), DEFAULT_PROMPTS, slugify() (+2 more)

### Community 11 - "Community 11"
Cohesion: 0.15
Nodes (12): 1. Install, 2. Create Supabase project, 3. Environment variables, 4. Run locally, Deploy, How the customer flow works, Main pages, Pricing idea (+4 more)

### Community 12 - "Community 12"
Cohesion: 0.20
Nodes (9): 1. Create Stripe account, 2. Create two prices, 3. Add keys to `.env.local`, 4. Webhook (activates Pro plan after payment), 5. Enable Customer Portal, 6. Check config, 7. Test payment, Live deploy (Vercel + ratelocal.ca) (+1 more)

### Community 13 - "Community 13"
Cohesion: 0.22
Nodes (8): Cursor tools setup (Figma + Datadog), Datadog on your live site (optional), Easiest way (no command search needed), Google review link (in RateLocal — not Cursor), If you still want the command palette, Quick test, Step 1 — Quit and reopen Cursor, Step 2 — Connect Figma + Datadog (click only)

### Community 14 - "Community 14"
Cohesion: 0.67
Nodes (3): filter_noise(), NODE_NO_WARNINGS, dev.sh script

### Community 15 - "Community 15"
Cohesion: 0.67
Nodes (3): filter_noise(), NODE_NO_WARNINGS, smooth.sh script

### Community 16 - "Community 16"
Cohesion: 0.67
Nodes (3): config, isAdminEmail(), middleware()

## Knowledge Gaps
- **132 isolated node(s):** `target`, `lib`, `allowJs`, `skipLibCheck`, `strict` (+127 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **12 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `BRAND` connect `Community 7` to `Community 0`, `Community 1`, `Community 3`, `Community 4`, `Community 6`, `Community 9`?**
  _High betweenness centrality (0.043) - this node is a cross-community bridge._
- **Why does `createClient()` connect `Community 3` to `Community 0`, `Community 1`, `Community 4`, `Community 6`, `Community 10`?**
  _High betweenness centrality (0.035) - this node is a cross-community bridge._
- **Why does `getAppUrl()` connect `Community 2` to `Community 1`, `Community 3`, `Community 9`?**
  _High betweenness centrality (0.033) - this node is a cross-community bridge._
- **What connects `target`, `lib`, `allowJs` to the rest of the system?**
  _132 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06948051948051948 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.07993197278911565 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.10852713178294573 - nodes in this community are weakly interconnected._