# Architecture — System Design & Tech Stack

## Overview

PROJECT is a **monorepo** containing four independent Next.js + React Native applications, each with its own database, deployment pipeline, and business logic. They share no code but follow the same design patterns.

**Tenancy Model:**
- **RateLocal** (reviewflow): Single-tenant (businesses own their reviews)
- **GreetQ** (voiceagent): Multi-tenant (organizations own agents + calls)
- **ServeLocal** (servelocal): Multi-tenant (homeowners + pros separate)
- **Route Max** (route-max): No tenancy (local-only, browser storage)

---

## Tech Stack (Unified)

### Frontend
| Layer | Tech | Purpose |
|-------|------|----------|
| Framework | Next.js 16 | SSR, API routes, streaming, edge middleware |
| UI Library | React 19.2.4 | Components, hooks, concurrent rendering |
| Styling | Tailwind CSS 4 | Utility-first, dark mode, custom theming |
| Components | Radix UI | Accessible, unstyled primitives (dialog, dropdown, etc.) |
| Forms | React Hook Form + Zod | Type-safe, minimal re-renders, validation |
| State | Zustand | Lightweight global state (calls, agents, filters) |
| Data Fetching | TanStack Query | Server state, caching, background sync |
| Animations | Framer Motion | Page transitions, modals, micro-interactions |
| Icons | Lucide React | Consistent 24px icon set |
| Type Safety | TypeScript 5 | Full type coverage, strict mode |
| Mobile | Expo 56 (route-max) | iOS + Android from React Native |

### Backend
| Layer | Tech | Purpose |
|-------|------|----------|
| Database | Supabase (PostgreSQL 14) | ACID, RLS, real-time subscriptions |
| Auth | Supabase Auth | Email/password, OAuth (Google), JWT tokens |
| File Storage | Supabase Storage | QR codes, call recordings, proof-of-delivery photos |
| Voice | Telnyx (primary) / Twilio (fallback) | PSTN, WebRTC, transcription, TTS |
| LLM | OpenRouter | Gemini, Claude, Mistral via single API |
| Email | Resend (SMTP in Supabase) | Transactional, signup, password reset |
| SMS | Twilio (optional) | Two-factor, appointment reminders |
| Billing | Stripe | Subscriptions, metered usage, invoices |
| Integrations | HubSpot, Google Calendar, Zapier | CRM sync, event booking, workflow automation |
| Monitoring | Sentry, Datadog RUM | Error tracking, performance monitoring |
| Hosting | Vercel (Next.js), Railway (Orchestrator) | Serverless compute, auto-scaling, CDN |

### Infrastructure
| Component | Tech | Purpose |
|-----------|------|----------|
| CI/CD | GitHub Actions | Auto-deploy on push to main |
| DNS | Route53 / Cloudflare | Domain routing, health checks |
| Secrets | Vercel Env, Railway Env | Environment variable management |
| Design System | Stitch CLI (Google) | Component generation, brand consistency |
| Documentation | Markdown in `/docs` | Developer guides, deployment checklists |

---

## Architecture Diagrams

### RateLocal (Simple Single-Tenant)
```
┌─────────────────────────────────────────────────────────────┐
│ Customer (Browser)                                          │
│  - Scans QR code                                            │
│  - Views review prompt                                      │
│  - Submits feedback                                         │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Vercel (Next.js App: reviewflow)                            │
│  ├─ GET /r/:slug                  Review page (public)      │
│  ├─ POST /api/feedback            Submit feedback           │
│  └─ POST /api/ai/prompt           AI draft generation       │
└──────────────────────┬──────────────────────────────────────┘
                       │ HTTPS
                       ▼
┌─────────────────────────────────────────────────────────────┐
│ Supabase (Single Project)                                   │
│  ├─ businesses (user's company)                             │
│  ├─ reviews (customer feedback)                             │
│  ├─ feedback_inbox (private complaints)                     │
│  └─ analytics (view counts, response rates)                 │
└──────────────────────┬──────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   OpenRouter    Stripe           Google Cloud
   (LLM drafts)  (Billing)        (GCS storage)
```

### GreetQ (Multi-Tenant, Voice-First)
```
┌──────────────────────────────────────────────────────────────┐
│ Caller (PSTN Phone)                                          │
│  - Dials GreetQ phone number                                │
│  - Hears AI greeting                                        │
│  - Books appointment / Leaves message                       │
└──────────────────────┬───────────────────────────────────────┘
                       │ SIP/Media
                       ▼
┌──────────────────────────────────────────────────────────────┐
│ Telnyx Call Control                                          │
│  - PSTN gateway                                              │
│  - Webhook → POST /api/telnyx/webhook                        │
│  - Transcription (Deepgram)                                 │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTPS
                       ▼
┌──────────────────────────────────────────────────────────────┐
│ Vercel (Next.js: voiceagent/dashboard)                      │
│  ├─ POST /api/telnyx/webhook                                 │
│  ├─ POST /api/orchestrator/answer                            │
│  ├─ GET /api/calls (org scoped)                              │
│  └─ GET /dashboard (agent config)                            │
└──────────────────────┬───────────────────────────────────────┘
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
┌──────────────┐ ┌────────────────┐ ┌────────────────┐
│ Supabase     │ │ Railway/Fly    │ │ Stripe Webhooks|
│  ├─ va_orgs  │ │  Orchestrator  │ │                │
│  ├─ va_calls │ │  (WebSocket)   │ │ Billing sync   │
│  └─ va_usage │ │  Port 8080     │ │ & metering     │
└──────────────┘ └────────────────┘ └────────────────┘
                        ▲
                        │ Real-time
                        │ media +
                        │ transcription
        ┌───────────────┘
        │
        ▼
┌──────────────────────────────────────────────────────────────┐
│ OpenRouter (LLM)                                              │
│  - Gemini 2.5 Flash (default)                                │
│  - System prompt per agent                                  │
│  - 10s response timeout                                     │
└──────────────────────────────────────────────────────────────┘

 Browser (Agent Config)
        ▲
        │ Dashboard
        │ Updates agent,
        │ views calls
        │
┌───────┴──────────────────────────────────────────────────────┐
│ Vercel (Next.js Dashboard)                                   │
│  ├─ /dashboard (calls, agents)                               │
│  ├─ /dashboard/agents/:id (config)                           │
│  ├─ /admin (platform overview)                               │
│  └─ /docs (API reference)                                    │
└──────────────────────────────────────────────────────────────┘
        │
        │ Auth (JWT + Supabase)
        ▼
    Supabase Auth
    (Email/Google OAuth)
```

### ServeLocal (Multi-Tenant Marketplace)
```
┌──────────────────────────────────────────────────────────────┐
│ Homeowner (Browser)                                           │
│  - Browse pro listings                                       │
│  - Post job request                                          │
│  - Message & book pro                                        │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTPS
                       ▼
┌──────────────────────────────────────────────────────────────┐
│ Pro (Browser)                                                │
│  - View job requests                                         │
│  - Manage listing                                            │
│  - Reply to homeowner                                        │
└──────────────────────┬───────────────────────────────────────┘
                       │
                       ▼
┌──────────────────────────────────────────────────────────────┐
│ Vercel (Next.js: servelocal)                                │
│  ├─ GET / (homepage)                                         │
│  ├─ GET /search (pro search)                                 │
│  ├─ GET /:city/:category (listings)                          │
│  ├─ GET /pro/:slug (pro profile + reviews)                   │
│  ├─ POST /api/job-requests (post job)                        │
│  ├─ POST /api/messages (pro/homeowner chat)                  │
│  ├─ /admin (approve/verify pros)                             │
│  └─ /dashboard (pro dashboard)                               │
└──────────────────────┬───────────────────────────────────────┘
                       │ HTTPS
                       ▼
┌──────────────────────────────────────────────────────────────┐
│ Supabase (SEPARATE Project: TradeLocal)                     │
│  ├─ service_providers (pro listings)                         │
│  ├─ service_provider_reviews (customer reviews)              │
│  ├─ job_requests (homeowner posts)                           │
│  ├─ booking_intent (pre-booking agreements)                  │
│  ├─ messages (pro/homeowner DMs)                             │
│  ├─ user_profiles (auth metadata)                            │
│  └─ RLS (row-level security per user)                        │
└──────────────────────┬───────────────────────────────────────┘
                       │
        ┌──────────────┼──────────────┐
        ▼              ▼              ▼
   Stripe         Resend SMTP     Google Storage
   (Optional      (Signup/       (Logo/photo
    Paid tiers)    Password)      uploads)
```

---

## Data Flow Patterns

### Authentication Flow
```
1. User → /signup
2. Email validation (Zod)
3. Supabase Auth.signUp() → sends OTP email (Resend SMTP)
4. User clicks link in email
5. Supabase → /auth/callback?code=xxx
6. Exchange code for session (JWT token in cookie)
7. Redirect to dashboard
8. Middleware checks cookie → allows access
```

### API Key Auth (GreetQ)
```
1. User → /dashboard/developer
2. Generate key: "grtq_" + random(32)
3. Store hashed in va_api_keys table
4. Client: curl -H "Authorization: Bearer grtq_xxx" /api/v1/calls
5. Route handler:
   - Extract key from header
   - Query va_api_keys WHERE key_hash = sha256(key)
   - Scope to org from API key
   - Execute query with RLS
```

### Call Recording & Transcription
```
1. Telnyx webhook → /api/telnyx/webhook (call.initiated)
2. Extract call_control_id, phone_number, to_number
3. Create va_calls row (pending)
4. Send Telnyx action: record_start → MP3 to S3
5. Answer call, stream media to orchestrator
6. Orchestrator: transcribe (Deepgram) → LLM → TTS (ElevenLabs)
7. On call.completed webhook:
   - Fetch recording URL
   - Store in Supabase
   - Run post_call_analysis (sentiment, intent)
   - Sync to HubSpot (if enabled)
   - Report usage to Stripe metering API
```

### Billing & Usage Tracking
```
GreetQ (metered):
1. Each call → POST /api/usage { org_id, voice_minutes }
2. Store in va_usage_events (reported_to_stripe = false)
3. Nightly batch job: GROUP BY org_id, SUM voice_minutes
4. Stripe.reportUsage() → /v1/billing/meter_event_summaries
5. Stripe charges at end of billing cycle

RateLocal (monthly subscription):
1. User selects plan ($39 or $390)
2. Stripe.sessions.create() → redirect to checkout
3. On payment success, Stripe webhook → /api/stripe/webhook
4. Mark business as "pro" in database
5. Unlock features (widgets, analytics, AI helpers)
```

---

## Database Isolation & RLS (Row-Level Security)

### RateLocal (reviewflow)
```sql
-- Anyone can submit feedback (public)
CREATE POLICY "public_feedback_insert" ON feedback
  FOR INSERT TO anon
  WITH CHECK (true);

-- Business owner can read their reviews
CREATE POLICY "business_reviews" ON reviews
  FOR SELECT TO authenticated
  USING (business_id IN (SELECT id FROM businesses WHERE user_id = auth.uid()));
```

### GreetQ (voiceagent)
```sql
-- Each org member sees only their org's calls
CREATE POLICY "org_scoped_calls" ON va_calls
  FOR SELECT TO authenticated
  USING (org_id IN (SELECT org_id FROM va_org_members WHERE user_id = auth.uid()));

-- API key scoping (computed at request time)
-- See: voiceagent/src/lib/supabase/admin.ts
```

### ServeLocal (servelocal)
```sql
-- Homeowners only see their own job requests
CREATE POLICY "homeowner_own_requests" ON job_requests
  FOR ALL TO authenticated
  USING (created_by = auth.uid())
  WITH CHECK (created_by = auth.uid());

-- Pros only see requests in their categories
CREATE POLICY "pro_filtered_requests" ON job_requests
  FOR SELECT TO authenticated
  USING (
    category_slug = ANY(
      SELECT category_slug FROM service_providers
      WHERE user_id = auth.uid()
    )
  );
```

---

## Deployment Strategy

### Environments
| Env | Git Branch | Vercel | Database | Rules |
|-----|------------|--------|----------|-------|
| **Staging** | `staging` | vercel-staging | Separate DB | Auto-deploy on push |
| **Production** | `main` | vercel-prod | Prod DB | Manual approval, health checks |

### Deployment Checklist (Pre-Push)
- [ ] Local tests pass (`npm test`)
- [ ] Type check passes (`npx tsc --noEmit`)
- [ ] Lint passes (`npm run lint`)
- [ ] `.env.local` NOT committed
- [ ] Database migrations tested locally
- [ ] API endpoints manual tested

### Post-Deployment Validation
- [ ] Vercel build succeeds (logs at vercel.com)
- [ ] Health check endpoint returns 200 (e.g., `/api/health`)
- [ ] Database migrations auto-applied
- [ ] Sentry error count normal
- [ ] Datadog RUM shows no spike in errors

---

## Performance Targets

| Metric | Target | How We Hit It |
|--------|--------|---------------|
| **Landing page LCP** | <2.5s | Image optimization, font subsetting, code splitting |
| **Dashboard FCP** | <1.5s | SSR with React 18, streaming, lazy routes |
| **API latency (p95)** | <200ms | Postgres indexes, RLS optimized, connection pooling |
| **Call answer time** | <2s | WebSocket pre-connects, LLM warmup, TTS streaming |
| **DB query time (p99)** | <500ms | Indexes on org_id, created_at; analyzed query plans |
| **Uptime** | 99.9% | Multi-AZ Supabase, Vercel auto-scale, health checks |

---

## Security Model

### Secrets Management
```
NEVER in code:
- .env.local (git ignore)
- API keys (store in Vercel/Railway env)
- Database passwords (Supabase-managed)

Safe:
- Environment variables (Vercel Dashboard → Settings → Environment)
- GitHub Secrets (for CI/CD automation)
- Vercel Datadog integration (logs only, no secrets)
```

### Authentication Layers
1. **Public routes:** `/`, `/pricing`, `/demo` — no auth needed
2. **Public API:** `/api/feedback` (rate-limited, CAPTCHA pending) — no auth
3. **Authenticated API:** `/api/calls`, `/api/agents` — JWT from Supabase Auth
4. **Admin routes:** `/admin`, `/admin/billing` — ADMIN_EMAILS env check
5. **Internal routes:** `/api/internal/migrate-billing` — deploy token + service key suffix

### Data Encryption
- **In Transit:** TLS 1.3 (Vercel CDN, Supabase HTTPS)
- **At Rest:** AES-256 (Supabase managed keys) + RLS
- **Sensitive Fields:** service_role keys never exposed to browser

---

## Scaling Bottlenecks & Solutions

### Database
**Bottleneck:** Supabase free tier (500 MB storage, 50k monthly active users)

**Solution:**
- Migrate to Supabase Team plan (10 GB, 500k MAU)
- Read replicas in different regions
- Move analytics to separate read-only schema

### API Rate Limiting
**Bottleneck:** Vercel serverless (30s timeout, 6 MB response)

**Solution:**
- Background jobs on Railway (long-running tasks)
- Stream responses for large exports
- Cache frequent queries (TanStack Query + Redis)

### Voice Processing
**Bottleneck:** Telnyx connection limits

**Solution:**
- Upgrade to Telnyx Enterprise (500+ concurrent)
- Load balance across multiple numbers
- Queue calls if orchestrator busy

---

## Decision Log

### Why Supabase for auth?
- PostgreSQL + RLS = security built-in
- JWT tokens = no session storage
- Vercel-native = cold start friendly
- Open source = no vendor lock-in risk

### Why OpenRouter for LLM?
- Multiple model providers (Gemini, Claude, Mistral) behind one API
- Cheaper than direct (Claude, Gemini) providers
- No min commitments
- Can switch models without code change

### Why Telnyx over Twilio?
- Better Canada coverage + pricing
- Supports PIPEDA data residency
- ConversationRelay cheaper than Studio
- Better for simultaneous calls

### Why monorepo over separate repos?
- Shared design patterns + UI components
- Single GitHub org for consistency
- Easier onboarding (one clone, all products)
- Can split later if needed

---

**Last updated:** June 16, 2026
