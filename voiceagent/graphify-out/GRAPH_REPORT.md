# Graph Report - voiceagent  (2026-06-06)

## Corpus Check
- 82 files · ~16,758 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 369 nodes · 661 edges · 27 communities (21 shown, 6 thin omitted)
- Extraction: 100% EXTRACTED · 0% INFERRED · 0% AMBIGUOUS · INFERRED: 2 edges (avg confidence: 0.8)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `0358b05b`
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
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]

## God Nodes (most connected - your core abstractions)
1. `createAdminClient()` - 39 edges
2. `getUserOrg()` - 27 edges
3. `compilerOptions` - 16 edges
4. `createClient()` - 12 edges
5. `POST()` - 11 edges
6. `CallSession` - 10 edges
7. `POST()` - 10 edges
8. `compilerOptions` - 9 edges
9. `scripts` - 9 edges
10. `POST()` - 9 edges

## Surprising Connections (you probably didn't know these)
- `GET()` --calls--> `getUserOrg()`  [EXTRACTED]
  src/app/api/campaigns/route.ts → src/lib/auth.ts
- `GET()` --calls--> `createAdminClient()`  [INFERRED]
  src/app/api/integrations/google-calendar/callback/route.ts → src/lib/supabase/admin.ts
- `GET()` --calls--> `createAdminClient()`  [INFERRED]
  src/app/api/integrations/hubspot/callback/route.ts → src/lib/supabase/admin.ts
- `POST()` --calls--> `createAdminClient()`  [EXTRACTED]
  src/app/api/org/setup/route.ts → src/lib/supabase/admin.ts
- `GET()` --calls--> `getUserOrg()`  [EXTRACTED]
  src/app/api/agents/route.ts → src/lib/auth.ts

## Import Cycles
- None detected.

## Communities (27 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.08
Nodes (23): fetchAgentConfig(), getAppUrl(), notifyCallEnd(), orchestratorDir, PORT, server, sessions, wss (+15 more)

### Community 1 - "Community 1"
Cohesion: 0.13
Nodes (24): GET(), PATCH(), POST(), BillingPage(), GET(), POST(), logAudit(), recordConsent() (+16 more)

### Community 2 - "Community 2"
Cohesion: 0.16
Nodes (28): POST(), pending, PendingEntry, storePendingSpeech(), takePendingSpeech(), getPublicAppUrl(), isLocalHost(), addSpeechGather() (+20 more)

### Community 3 - "Community 3"
Cohesion: 0.14
Nodes (22): GET(), POST(), bookAppointment(), getGoogleTokens(), getHubSpotToken(), logHubSpotCall(), verifyOrchestratorKey(), analyzeCall() (+14 more)

### Community 4 - "Community 4"
Cohesion: 0.06
Nodes (32): dependencies, googleapis, next, react, react-dom, stripe, @supabase/ssr, @supabase/supabase-js (+24 more)

### Community 5 - "Community 5"
Cohesion: 0.10
Nodes (13): jakarta, metadata, DashboardShell(), NAV, BRAND, chatCompletionVoice(), ChatMessage, hasOpenRouter() (+5 more)

### Community 6 - "Community 6"
Cohesion: 0.12
Nodes (13): FlowBuilder(), NODE_TYPES, DEFAULT_FLOW_EDGES, DEFAULT_FLOW_NODES, FlowContext, FlowEngine, FlowResult, Agent (+5 more)

### Community 7 - "Community 7"
Cohesion: 0.18
Nodes (19): GET(), PATCH(), HIPAA_CONTROLS, SOC2_CHECKLIST, hasValidConsent(), isWithinCallingHours(), QUIET_HOURS, answerCall() (+11 more)

### Community 8 - "Community 8"
Cohesion: 0.10
Nodes (19): compilerOptions, allowJs, esModuleInterop, incremental, isolatedModules, jsx, lib, module (+11 more)

### Community 9 - "Community 9"
Cohesion: 0.11
Nodes (18): dependencies, dotenv, openai, twilio, ws, devDependencies, tsx, @types/node (+10 more)

### Community 10 - "Community 10"
Cohesion: 0.18
Nodes (10): compilerOptions, esModuleInterop, module, moduleResolution, outDir, rootDir, skipLibCheck, strict (+2 more)

### Community 11 - "Community 11"
Cohesion: 0.22
Nodes (8): Architecture, Features, Ports, Quick start, Supabase setup, Telnyx setup (recommended), Twilio setup (optional legacy), VoiceAgent

### Community 12 - "Community 12"
Cohesion: 0.25
Nodes (7): Build Approach, First Vertical, Geography, Primary Use Case, Provider Stack, Repo Layout, VoiceAgent — Confirmed Product Decisions

### Community 13 - "Community 13"
Cohesion: 0.67
Nodes (3): getStripe(), reportVoiceMinutes(), POST()

### Community 14 - "Community 14"
Cohesion: 0.40
Nodes (4): compat, __dirname, eslintConfig, __filename

### Community 15 - "Community 15"
Cohesion: 0.50
Nodes (3): PORT, proxy, server

## Knowledge Gaps
- **125 isolated node(s):** `__filename`, `__dirname`, `compat`, `eslintConfig`, `nextConfig` (+120 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `createAdminClient()` connect `Community 3` to `Community 1`, `Community 2`, `Community 13`, `Community 7`?**
  _High betweenness centrality (0.092) - this node is a cross-community bridge._
- **Why does `getUserOrg()` connect `Community 1` to `Community 3`, `Community 7`?**
  _High betweenness centrality (0.050) - this node is a cross-community bridge._
- **Are the 2 inferred relationships involving `createAdminClient()` (e.g. with `GET()` and `GET()`) actually correct?**
  _`createAdminClient()` has 2 INFERRED edges - model-reasoned connections that need verification._
- **What connects `__filename`, `__dirname`, `compat` to the rest of the system?**
  _125 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07564102564102564 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.12660028449502134 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.13725490196078433 - nodes in this community are weakly interconnected._