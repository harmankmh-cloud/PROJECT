# PROJECT — Local Business AI Platform (Monorepo)

**Building AI-powered voice, review, and marketplace tools for local service businesses in Canada.**

Production deployment: [greetq.com](https://greetq.com) | [ratelocal.ca](https://ratelocal.ca) | [servelocal.ca](https://servelocal.ca) | [route-max.vercel.app](https://route-max.vercel.app)

---

## 📦 Products

### 🎤 **GreetQ** (`voiceagent/`) — AI Phone Agent for Local Pros
**Enterprise voice receptionist for trades, home services, dental clinics, law firms.**

- **Live:** Inbound call handling, warm transfers, call logs, transcripts, HubSpot sync, Google Calendar booking, Stripe metering
- **In Progress:** Visual flow builder, outbound campaigns, TCPA/CASL compliance module, conversation intelligence
- **Tech:** Next.js 16, Telnyx/Twilio, Supabase, Stripe, OpenRouter LLM
- **Port:** 3002 (dashboard) + 8080 (orchestrator WebSocket)
- **Deploy:** [greetq.com](https://greetq.com) on Vercel

```bash
cd voiceagent
cp .env.example .env.local
npm install
npm run dev              # Terminal 1: Next.js dashboard
npm run orchestrator     # Terminal 2: WebSocket server
```

**Quick Setup:**
1. Create Supabase project, run `voiceagent/supabase/schema.sql`
2. Create Telnyx Call Control App, add webhook URL
3. Set `TELNYX_API_KEY`, `TELNYX_CONNECTION_ID`, `TELNYX_PHONE_NUMBER` in `.env.local`
4. See [voiceagent/README.md](voiceagent/README.md) for full setup

---

### ⭐ **RateLocal** (`reviewflow/`) — QR-Powered Google Reviews
**Honest review collection for local businesses. $39/month vs $400+ alternatives.**

- **Live:** Business signup, QR codes, customer review flow, AI prompts, dashboard, review responses, analytics, outreach
- **In Progress:** Zapier integration, review widgets
- **Tech:** Next.js 16, Supabase, Stripe (monthly billing), OpenRouter, Vercel
- **Port:** 3000 (dev)
- **Deploy:** [ratelocal.ca](https://ratelocal.ca) on Vercel

```bash
cd reviewflow
cp .env.example .env.local
npm install
npm run dev
```

**Quick Setup:**
1. Create Supabase project, run `reviewflow/supabase/schema.sql`
2. Set Stripe price IDs for monthly/yearly billing
3. Add `OPENROUTER_API_KEY` for AI prompts
4. See [reviewflow/README.md](reviewflow/README.md) for full setup

---

### 🏠 **ServeLocal** (`servelocal/`) — BC Trades Directory
**Hyper-local marketplace: homeowners find pros, pros get leads.**

- **Live:** Pro listings, reviews, verified badges, search by city/trade, job posting
- **In Progress:** Messaging, bookings with escrow, pro dashboard, job analytics
- **Tech:** Next.js 16, Supabase (separate project), Stripe, Tailwind
- **Port:** 3001 (dev)
- **Deploy:** [servelocal.ca](https://servelocal.ca) on Vercel
- **Database:** Separate Supabase project from RateLocal/GreetQ

```bash
cd servelocal
cp .env.local.template .env.local
npm install
npm run dev
```

**Quick Setup:**
1. Create **new** Supabase project
2. Run migrations in order: `servelocal.sql` → `premium.sql` → `suggestions.sql` → `guest-access.sql` → `user-accounts.sql` → `bookings.sql` → `complete-features.sql`
3. Apply migrations in `supabase/migrations/` (004+)
4. See [servelocal/README.md](servelocal/README.md) for full setup

---

### 📦 **Route Max** (`route-max/`) — Unlimited Route Planner
**Free multi-stop route planner for delivery drivers. No subscription, local privacy.**

- **Live:** Unlimited stops, route optimization, fuel analytics, CSV import/export, maps, time windows, POD notes/photos
- **Tech:** Expo, React Native, Leaflet, Nominatim
- **Ports:** 8081 (Metro, mobile) / 8000 (static web)
- **Deploy:** [route-max.vercel.app](https://route-max.vercel.app)

```bash
cd route-max
npm install
npm run start:static   # Web (port 8000)
# OR
npm start              # Expo (port 8081)
```

See [route-max/README.md](route-max/README.md) for full setup.

---

## 🏗️ Architecture

```
harmankmh-cloud/PROJECT (monorepo)
├── voiceagent/                    # GreetQ: AI phone agent
│   ├── src/app                    # Next.js App Router
│   ├── orchestrator/              # WebSocket LLM orchestrator (Railway/Fly)
│   ├── supabase/                  # Schema + migrations
│   └── scripts/                   # Billing, provisioning, DNS helpers
│
├── reviewflow/                    # RateLocal: Review collection
│   ├── src/app                    # Next.js landing + dashboard
│   ├── supabase/                  # Schema + migrations
│   └── scripts/                   # Stripe setup, webhook testing
│
├── servelocal/                    # ServeLocal: Trades directory
│   ├── src/app                    # Next.js marketplace + admin
│   ├── supabase/                  # Separate schema + migrations
│   └── scripts/                   # Auth hardening, migration helpers
│
├── route-max/                     # Route Max: Route planner
│   ├── src/                       # HTML + vanilla JS planner
│   ├── App.tsx                    # Expo mobile entry
│   └── server.js                  # Static file server
│
├── project_rag/                   # Cursor RAG index for all projects
├── openrouter_chat/               # Earlier OpenRouter experiments
├── tools/                         # Shared utilities (if any)
│
└── docs/                          # Guides, checklists, templates
    ├── ARCHITECTURE.md            # System design, deployment
    ├── SETUP.md                   # Complete onboarding
    ├── DEPLOYMENT.md              # Production checklist
    └── TROUBLESHOOTING.md         # Common issues
```

---

## 🚀 Quick Start (All Products)

### Install all dependencies
```bash
cd PROJECT
npm install
```

### 1. Start RateLocal (simplest)
```bash
cd reviewflow
cp .env.example .env.local
# Edit .env.local with Supabase keys
npm install
npm run dev
# → http://localhost:3000
```

### 2. Start GreetQ (requires orchestrator)
```bash
cd voiceagent
cp .env.example .env.local
# Edit .env.local with Supabase + Telnyx + OpenRouter keys
npm install
cd orchestrator && npm install && cd ..
npm run dev              # Terminal 1: port 3002
npm run orchestrator     # Terminal 2: port 8080
```

### 3. Start ServeLocal
```bash
cd servelocal
cp .env.local.template .env.local
# Edit .env.local (separate Supabase project)
npm install
npm run dev
# → http://localhost:3001
```

### 4. Start Route Max (web)
```bash
cd route-max
npm install
npm run start:static
# → http://localhost:8000
```

---

## 🗄️ Database Setup

### RateLocal (reviewflow) + GreetQ (voiceagent)
**Can share one Supabase project or use separate projects.**

```bash
# RateLocal schema
Supabase > SQL Editor > Run reviewflow/supabase/schema.sql

# GreetQ schema
Supabase > SQL Editor > Run voiceagent/supabase/schema.sql
```

### ServeLocal (servelocal)
**MUST use separate Supabase project** (for multi-tenancy isolation).

```bash
# Create new Supabase project
# Run migrations in order:
1. supabase/servelocal.sql
2. supabase/premium.sql
3. supabase/suggestions.sql
4. supabase/guest-access.sql
5. supabase/user-accounts.sql
6. supabase/bookings.sql
7. supabase/complete-features.sql
8. supabase/migrations/004_schema_baseline.sql
9. supabase/migrations/005_pro_job_leads_rls.sql
10. supabase/migrations/006_remove_pro_job_pii_rls.sql
```

See [docs/DATABASE.md](docs/DATABASE.md) for detailed migration troubleshooting.

---

## 🔧 Environment Setup

Each product has a `.env.example` or `.env.local.template`. Copy and fill:

### RateLocal (reviewflow/.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxx...
OPENROUTER_API_KEY=sk-or-v1...
NEXT_PUBLIC_APP_URL=https://ratelocal.ca

# Stripe
STRIPE_SECRET_KEY=sk_live_...
STRIPE_WEBHOOK_SECRET=whsec_...
STRIPE_PRICE_STARTER_MONTHLY=price_...
# (see reviewflow/.env.example for complete list)
```

### GreetQ (voiceagent/.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJxx...
SUPABASE_SERVICE_ROLE_KEY=eyJxx...

TELNYX_API_KEY=KEY...
TELNYX_CONNECTION_ID=...
TELNYX_PHONE_NUMBER=+1...
OPENROUTER_API_KEY=sk-or-v1...

STRIPE_SECRET_KEY=sk_live_...
ADMIN_EMAILS=your@email.com
# (see voiceagent/.env.example for complete list)
```

### ServeLocal (servelocal/.env.local)
```env
NEXT_PUBLIC_SUPABASE_URL=https://yyy.supabase.co    # SEPARATE project
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJyy...
SUPABASE_SERVICE_ROLE_KEY=eyJyy...
NEXT_PUBLIC_APP_URL=https://servelocal.ca
ADMIN_EMAILS=your@email.com
# (see servelocal/.env.local.template for complete list)
```

See [docs/ENV.md](docs/ENV.md) for complete variable reference.

---

## 🚢 Deployment

### RateLocal (reviewflow)
```bash
vercel link
vercel env pull
vercel deploy
# Set custom domain: ratelocal.ca
# Add env vars in Vercel dashboard
```

### GreetQ (voiceagent)
```bash
# Next.js app on Vercel
vercel deploy

# Orchestrator WebSocket on Railway/Fly
# See docs/DEPLOYMENT.md for orchestrator setup
railway link
```

### ServeLocal (servelocal)
```bash
vercel link
vercel deploy
# Set custom domain: servelocal.ca
```

### Route Max (route-max)
```bash
vercel link
# Set Root Directory: route-max
vercel deploy
# Static files only — no build command needed
```

See [docs/DEPLOYMENT.md](docs/DEPLOYMENT.md) for complete production checklist.

---

## 📖 Documentation

- **[ARCHITECTURE.md](docs/ARCHITECTURE.md)** — System design, tech decisions, deployment strategy
- **[SETUP.md](docs/SETUP.md)** — Complete dev environment setup
- **[DATABASE.md](docs/DATABASE.md)** — Schema, migrations, troubleshooting
- **[DEPLOYMENT.md](docs/DEPLOYMENT.md)** — Production checklist, health checks, scaling
- **[TROUBLESHOOTING.md](docs/TROUBLESHOOTING.md)** — Common errors and solutions
- **[CONTRIBUTING.md](docs/CONTRIBUTING.md)** — Development guidelines, PR process

### Product-Specific Docs
- [voiceagent/README.md](voiceagent/README.md) — GreetQ detailed guide
- [reviewflow/README.md](reviewflow/README.md) — RateLocal detailed guide
- [servelocal/README.md](servelocal/README.md) — ServeLocal detailed guide
- [route-max/README.md](route-max/README.md) — Route Max detailed guide

---

## 🔐 Security Checklist

- ✅ **Never commit `.env.local`** — use `.env.example` templates
- ✅ **Service role keys server-only** — never in browser bundles
- ✅ **Supabase RLS enforced** — all data policies checked
- ✅ **PIPEDA + CASL compliant** — Canadian data residency ready
- ✅ **Stripe webhook signatures verified** — all events validated
- ✅ **API keys scoped** — org-level isolation for multi-tenant

See [docs/SECURITY.md](docs/SECURITY.md) for full audit checklist.

---

## 📊 Market Position

| Product | Positioning | Key Win | ROI Story |
|---------|-------------|---------|----------|
| **RateLocal** | Review collection | $39/month vs $400 Podium | Clearest, fastest payback |
| **GreetQ** | AI voice receptionist | Voice + HubSpot + Booking | Fix missed calls problem |
| **ServeLocal** | Hyper-local directory | Pros list free, no lock-in | Density play (start Abbotsford) |
| **Route Max** | Free route planner | Unlimited stops + analytics | Distribution for other products |

**Canada is the wedge:** US tools ignore PIPEDA/CASL. Jobbr, HomeStars, RealCraft don't combine voice + reviews + directory.

See [docs/STRATEGY.md](docs/STRATEGY.md) for competitive analysis.

---

## 🤝 Contributing

1. Create a branch off `main`
2. Make changes, test locally
3. Push and open a PR with a clear description
4. CI checks must pass before merge
5. Squash merge to main

See [docs/CONTRIBUTING.md](docs/CONTRIBUTING.md) for code style, branch naming, commit conventions.

---

## 📝 License

Private proprietary code. All rights reserved.

---

## 📞 Contact

- **Email:** hello@greetq.com
- **GreetQ:** [greetq.com](https://greetq.com)
- **RateLocal:** [ratelocal.ca](https://ratelocal.ca)
- **ServeLocal:** [servelocal.ca](https://servelocal.ca)
- **Route Max:** [route-max.vercel.app](https://route-max.vercel.app)

---

**Last updated:** June 16, 2026
