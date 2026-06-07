# Graph Report - voiceagent  (2026-06-07)

## Corpus Check
- 91 files · ~18,361 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 404 nodes · 771 edges · 30 communities (22 shown, 8 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 4 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `718dd682`
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
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]

## God Nodes (most connected - your core abstractions)
1. `createAdminClient()` - 41 edges
2. `getUserOrg()` - 31 edges
3. `compilerOptions` - 17 edges
4. `getPublicAppUrl()` - 14 edges
5. `createClient()` - 14 edges
6. `POST()` - 12 edges
7. `POST()` - 11 edges
8. `POST()` - 11 edges
9. `validateTwilioWebhook()` - 11 edges
10. `CallSession` - 10 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `getUserOrg()`  [EXTRACTED]
  src/app/api/campaigns/route.ts → src/lib/auth.ts
- `GET()` --calls--> `getUserOrg()`  [EXTRACTED]
  src/app/api/agents/route.ts → src/lib/auth.ts
- `POST()` --calls--> `getUserOrg()`  [EXTRACTED]
  src/app/api/billing/checkout/route.ts → src/lib/auth.ts
- `POST()` --calls--> `getPublicAppUrl()`  [EXTRACTED]
  src/app/api/billing/checkout/route.ts → src/lib/public-url.ts
- `POST()` --calls--> `createAdminClient()`  [EXTRACTED]
  src/app/api/billing/checkout/route.ts → src/lib/supabase/admin.ts

## Import Cycles
- None detected.

## Communities (30 total, 8 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (23): fetchAgentConfig(), getAppUrl(), notifyCallEnd(), orchestratorDir, PORT, server, sessions, wss (+15 more)

### Community 1 - "Community 1"
Cohesion: 0.12
Nodes (25): GET(), PATCH(), POST(), GET(), POST(), logAudit(), recordConsent(), StatCard() (+17 more)

### Community 2 - "Community 2"
Cohesion: 0.14
Nodes (32): POST(), pending, PendingEntry, storePendingSpeech(), takePendingSpeech(), getPublicAppUrl(), isLocalHost(), addSpeechGather() (+24 more)

### Community 3 - "Community 3"
Cohesion: 0.16
Nodes (19): GET(), POST(), bookAppointment(), getGoogleTokens(), getHubSpotToken(), logHubSpotCall(), verifyOrchestratorKey(), verifyIntegrationOrgAccess() (+11 more)

### Community 4 - "Community 4"
Cohesion: 0.07
Nodes (32): dependencies, googleapis, next, react, react-dom, stripe, @supabase/ssr, @supabase/supabase-js (+24 more)

### Community 5 - "Community 5"
Cohesion: 0.14
Nodes (7): jakarta, metadata, DashboardShell(), NAV, BRAND, PLANS, createClient()

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (13): FlowBuilder(), NODE_TYPES, DEFAULT_FLOW_EDGES, DEFAULT_FLOW_NODES, FlowContext, FlowEngine, FlowResult, Agent (+5 more)

### Community 7 - "Community 7"
Cohesion: 0.17
Nodes (20): GET(), PATCH(), HIPAA_CONTROLS, SOC2_CHECKLIST, hasValidConsent(), isWithinCallingHours(), QUIET_HOURS, answerCall() (+12 more)

### Community 8 - "Community 8"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 9 - "Community 9"
Cohesion: 0.13
Nodes (18): dependencies, dotenv, openai, twilio, ws, devDependencies, tsx, @types/node (+10 more)

### Community 10 - "Community 10"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, outDir, rootDir, skipLibCheck, strict (+2 more)

### Community 11 - "Community 11"
Cohesion: 0.20
Nodes (8): Architecture, Features, Ports, Quick start, Supabase setup, Telnyx setup (recommended), Twilio setup (optional legacy), VoiceAgent

### Community 12 - "Community 12"
Cohesion: 0.22
Nodes (7): Build Approach, First Vertical, Geography, Primary Use Case, Provider Stack, Repo Layout, VoiceAgent — Confirmed Product Decisions

### Community 13 - "Community 13"
Cohesion: 0.34
Nodes (11): BillingPage(), PlanKey, POST(), getStripe(), isStripeConfigured(), planFromStripePriceId(), reportVoiceMinutes(), stripeMeterEventName() (+3 more)

### Community 14 - "Community 14"
Cohesion: 0.40
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 15 - "Community 15"
Cohesion: 0.50
Nodes (3): PORT, proxy, server

### Community 27 - "Community 27"
Cohesion: 0.22
Nodes (11): analyzeCall(), CallIntelligence, formatTranscript(), chatCompletion(), chatCompletionVoice(), ChatMessage, hasOpenRouter(), MODEL_CHAIN (+3 more)

## Knowledge Gaps
- **120 isolated node(s):** `eslintConfig`, `nextConfig`, `dev`, `build`, `start` (+115 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **8 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createAdminClient()` connect `Community 3` to `Community 1`, `Community 2`, `Community 7`, `Community 13`, `Community 27`?**
  _High betweenness centrality (0.084) - this node is a cross-community bridge._
- **Why does `getUserOrg()` connect `Community 1` to `Community 3`, `Community 13`, `Community 7`?**
  _High betweenness centrality (0.054) - this node is a cross-community bridge._
- **Why does `BRAND` connect `Community 5` to `Community 27`?**
  _High betweenness centrality (0.020) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `createAdminClient()` (e.g. with `GET()` and `GET()`) actually correct?**
  _`createAdminClient()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `eslintConfig`, `nextConfig`, `dev` to the rest of the system?**
  _120 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07317073170731707 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.11585365853658537 - nodes in this community are weakly interconnected._