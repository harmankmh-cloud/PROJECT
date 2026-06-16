# Complete Development Setup Guide

## Prerequisites

### System Requirements
- **Node.js** 18+ (use `nvm install 18`)
- **npm** 9+ or **pnpm** 8+
- **Git** 2.40+
- **PostgreSQL** 14+ (for local testing, optional)
- **Docker** (for Supabase local, optional)

### Accounts Needed
- **GitHub** — code hosting, secrets
- **Supabase** — database + auth (free tier OK for dev)
- **Vercel** — deployment (optional for staging)
- **Stripe** (test mode) — billing testing
- **OpenRouter** — LLM API key (free tier has limits)
- **Telnyx** (test mode) — voice testing (optional)

---

## Step 1: Clone & Install

```bash
# Clone monorepo
git clone https://github.com/harmankmh-cloud/PROJECT.git
cd PROJECT

# Install root dependencies
npm install

# Install each product's dependencies
cd voiceagent && npm install && cd ..
cd reviewflow && npm install && cd ..
cd servelocal && npm install && cd ..
cd route-max && npm install && cd ..
```

---

## Step 2: Supabase Setup

### Option A: Cloud Supabase (Easiest for Dev)

#### For RateLocal + GreetQ (shared or separate project)
```bash
# Go to https://supabase.com
# Click "New project"
# - Name: "project-dev"
# - Database password: generate strong one
# - Region: "Canada (Central)" or nearest
# - Click "Create new project"

# Wait 2-3 minutes for setup
# Then open Project → Settings → API
# Copy:
#   - Project URL → NEXT_PUBLIC_SUPABASE_URL
#   - Anon Key → NEXT_PUBLIC_SUPABASE_ANON_KEY
#   - Service Role Key → SUPABASE_SERVICE_ROLE_KEY (SECRET!)
```

#### For ServeLocal (SEPARATE project)
```bash
# Repeat above but name it "servelocal-dev"
# (Use different keys in .env.local)
```

### Option B: Local Supabase (Advanced)

```bash
# Install Supabase CLI
npm install -g supabase

# Start local PostgreSQL + Studio
supabase start

# Returns:
# API URL: http://localhost:54321
# Anon Key: eyJhbGc...
# Service Key: eyJhbGc...

# Set these in .env.local
```

### Load Database Schema

#### RateLocal (reviewflow)
```bash
# Via Supabase Studio (web UI):
# 1. Go to SQL Editor
# 2. Click "New query"
# 3. Copy-paste contents of reviewflow/supabase/schema.sql
# 4. Click "Run"

# Or via CLI:
supabase db push --project-id xxx < reviewflow/supabase/schema.sql
```

#### GreetQ (voiceagent)
```bash
# Same process with voiceagent/supabase/schema.sql
supabase db push --project-id xxx < voiceagent/supabase/schema.sql
```

#### ServeLocal (separate project!)
```bash
# Use DIFFERENT Supabase project
# Run migrations in order:

for file in servelocal/supabase/*.sql; do
  echo "Running $file..."
  supabase db push --project-id yyy < "$file"
done

# Then apply numbered migrations
for file in servelocal/supabase/migrations/*.sql; do
  echo "Running $file..."
  supabase db push --project-id yyy < "$file"
done
```

---

## Step 3: Environment Files

### RateLocal (reviewflow/.env.local)
```bash
cd reviewflow
cp .env.example .env.local
```

**Edit `.env.local`:**
```env
# Supabase (from Step 2)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# App URLs
NEXT_PUBLIC_APP_URL=http://localhost:3000

# OpenRouter (free tier: https://openrouter.ai/keys)
OPENROUTER_API_KEY=sk-or-v1-...

# Stripe (Test mode: https://dashboard.stripe.com/test/keys)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
# Get price IDs from Stripe Dashboard → Products → Pricing
STRIPE_PRICE_STARTER_MONTHLY=price_...
STRIPE_PRICE_GROWTH_MONTHLY=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_...

# Admin access
ADMIN_EMAILS=your@email.com

# Optional: Resend email (SMTP in Supabase is free)
# Leave blank to use Supabase default email
RESEND_API_KEY=
```

### GreetQ (voiceagent/.env.local)
```bash
cd voiceagent
cp .env.example .env.local
```

**Edit `.env.local`:**
```env
# Supabase (can share with reviewflow or use separate)
NEXT_PUBLIC_SUPABASE_URL=https://xxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3002
NEXT_PUBLIC_APP_NAME=GreetQ

# Admin
ADMIN_EMAILS=your@email.com

# Telnyx (test mode: https://portal.telnyx.com)
TELEPHONY_PROVIDER=telnyx
TELNYX_API_KEY=KEY...
TELNYX_CONNECTION_ID=...
TELNYX_PHONE_NUMBER=+1...

# OpenRouter
OPENROUTER_API_KEY=sk-or-v1-...
OPENROUTER_MODEL=google/gemini-2.5-flash

# Stripe (test mode)
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
STRIPE_PRICE_STARTER_MONTHLY=price_...
STRIPE_PRICE_GROWTH_MONTHLY=price_...
STRIPE_PRICE_PRO_MONTHLY=price_...
STRIPE_PRICE_ENTERPRISE_MONTHLY=price_...
STRIPE_METER_VOICE_MINUTES=meter_...
STRIPE_METER_EVENT_NAME=voice_minutes

# Orchestrator (local WebSocket)
ORCHESTRATOR_APP_URL=http://127.0.0.1:3002
ORCHESTRATOR_PORT=8080
ORCHESTRATOR_API_KEY=test-key-12345
ORCHESTRATOR_LLM_TIMEOUT_MS=10000

# For Twilio (optional)
TWILIO_VOICE_MODE=relay
TWILIO_RELAY_STT_PROVIDER=Deepgram
TWILIO_RELAY_TTS_PROVIDER=ElevenLabs

# Optional integrations
HUBSPOT_CLIENT_ID=...
HUBSPOT_CLIENT_SECRET=...
GOOGLE_CLIENT_ID=...
GOOGLE_CLIENT_SECRET=...

# Sentry (optional)
SENTRY_DSN=...
```

### ServeLocal (servelocal/.env.local)
```bash
cd servelocal
cp .env.local.template .env.local
```

**Edit `.env.local`:**
```env
# Supabase (SEPARATE project from RateLocal/GreetQ!)
NEXT_PUBLIC_SUPABASE_URL=https://yyy.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJyy...
SUPABASE_SERVICE_ROLE_KEY=eyJyy...

# App
NEXT_PUBLIC_APP_URL=http://localhost:3001

# Admin
ADMIN_EMAILS=your@email.com

# Optional: Stripe for paid listings
STRIPE_SECRET_KEY=sk_test_...
STRIPE_WEBHOOK_SECRET=whsec_test_...
```

### Route Max (route-max) — No API Keys Needed
```bash
cd route-max
# No .env file required — all client-side, local storage
```

---

## Step 4: Stripe Setup (Testing)

### Create Test Products & Prices

1. Go to https://dashboard.stripe.com/test/products
2. Click "+ Add product"
3. Create:
   - **Product 1:** "RateLocal Starter"
     - Price: $39 / month
     - Copy price ID → `STRIPE_PRICE_STARTER_MONTHLY`
   - **Product 2:** "RateLocal Growth"
     - Price: $99 / month
     - Copy price ID → `STRIPE_PRICE_GROWTH_MONTHLY`
4. For GreetQ metered usage:
   - Click "+ Add meter" (under Billing)
   - Event name: "voice_minutes"
   - Copy meter ID → `STRIPE_METER_VOICE_MINUTES`

### Set Webhook Endpoint (Local Testing)

1. Install Stripe CLI: `brew install stripe/stripe-cli/stripe` (macOS) or [download](https://stripe.com/docs/stripe-cli)
2. Authenticate: `stripe login`
3. Forward webhooks to localhost:
   ```bash
   stripe listen --forward-to localhost:3000/api/stripe/webhook
   # Copy signing secret → STRIPE_WEBHOOK_SECRET in .env.local
   ```
4. Keep this terminal open while testing

---

## Step 5: Run Each Product

### RateLocal (reviewflow)
```bash
cd reviewflow
npm run dev

# Runs on http://localhost:3000
# Signup: any email
# Test stripe: use card 4242 4242 4242 4242
```

### GreetQ (voiceagent) — Requires Orchestrator
```bash
# Terminal 1: Install orchestrator deps
cd voiceagent/orchestrator
npm install
cd ..

# Terminal 1: Run Next.js dashboard
npm run dev
# Runs on http://localhost:3002

# Terminal 2: Run WebSocket orchestrator
npm run orchestrator
# Runs on http://localhost:8080
# Logs: "Orchestrator listening on port 8080"
```

### ServeLocal (servelocal)
```bash
cd servelocal
npm run dev

# Runs on http://localhost:3001
# Signup: join as homeowner or pro
```

### Route Max (route-max)
```bash
# Web version
cd route-max
npm run start:static
# Runs on http://localhost:8000

# OR Expo mobile
npm start
# Scan QR code with Expo Go app
```

---

## Step 6: Test Core Flows

### RateLocal Signup → Dashboard
```bash
# 1. http://localhost:3000
# 2. Click "Sign up"
# 3. Enter email + password (8+ chars)
# 4. Check email, click confirm link
# 5. Create business (name, type, city)
# 6. See dashboard with QR code
# 7. Click QR to see customer review page
```

### GreetQ Agent Config
```bash
# 1. http://localhost:3002/signup
# 2. Create account
# 3. Create org (name)
# 4. Create agent (name, prompt, greeting)
# 5. Test: POST /api/calls (should return empty initially)
# 6. Check /dashboard/calls (empty until incoming calls)
```

### ServeLocal Pro Signup
```bash
# 1. http://localhost:3001/signup
# 2. Choose "Contractor"
# 3. Create account
# 4. Complete onboarding (category, city, phone)
# 5. View /pro/your-slug
# 6. As homeowner, click "Contact"
```

---

## Troubleshooting

### "Supabase connection refused"
```bash
# Check credentials in .env.local
echo $NEXT_PUBLIC_SUPABASE_URL
echo $NEXT_PUBLIC_SUPABASE_ANON_KEY

# Test connection
curl -H "Authorization: Bearer $NEXT_PUBLIC_SUPABASE_ANON_KEY" \
  "$NEXT_PUBLIC_SUPABASE_URL/rest/v1/"
```

### "OpenRouter API key invalid"
```bash
# Check key at https://openrouter.ai/keys
# Should start with sk-or-v1-
echo $OPENROUTER_API_KEY
```

### "Orchestrator connection timeout"
```bash
# Make sure:
# 1. npm run orchestrator is running (port 8080)
# 2. ORCHESTRATOR_APP_URL=http://127.0.0.1:3002 in .env.local
# 3. Firewall not blocking localhost:8080

netstat -an | grep 8080  # Should show LISTEN
```

### "RLS policy prevents insert"
```bash
# Check Supabase SQL editor for RLS policies
# Example fix for development (INSECURE — don't use in prod):
ALTER TABLE public.businesses DISABLE ROW LEVEL SECURITY;

# Then re-enable for testing:
ALTER TABLE public.businesses ENABLE ROW LEVEL SECURITY;
```

### "npm install fails with peer dependency warnings"
```bash
# Safe to ignore most warnings
# If build fails, try:
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

---

## IDE Setup (Recommended: VS Code)

### Extensions
```json
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "esbenp.prettier-vscode",
    "bradlc.vscode-tailwindcss",
    "supabase.supabase-js",
    "PKief.material-icon-theme"
  ]
}
```

### VS Code Settings (`.vscode/settings.json`)
```json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": true
  },
  "typescript.tsdk": "node_modules/typescript/lib",
  "typescript.enablePromptUseWorkspaceTsdk": true
}
```

---

## Next Steps

1. **Read code:** Start with `reviewflow/src/app/page.tsx` (simplest product)
2. **Understand patterns:** Check `voiceagent/src/lib/auth.ts` (multi-tenant patterns)
3. **Test APIs:** Use Postman or `curl` to test endpoints
4. **Run tests:** `npm test` (if you add tests)
5. **Deploy staging:** Push to GitHub `staging` branch → auto-deploys to Vercel staging

---

**Last updated:** June 16, 2026
