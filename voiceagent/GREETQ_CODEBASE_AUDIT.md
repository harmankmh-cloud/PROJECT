# GreetQ Codebase Audit Pack

**Product:** GreetQ — https://greetq.com  
**Code folder:** `voiceagent/` (monorepo; not the repo root)  
**Generated:** 2026-06-14  
**Purpose:** External codebase audit — stack, structure, routing, homepage

---

## Executive Summary

| Item | Value |
|------|-------|
| Framework | Next.js 16.2.6 (App Router) |
| Language | TypeScript (strict) |
| UI | React 19, Tailwind CSS 4, Radix UI |
| Auth / DB | Supabase (`lrihhjjxmxixppmrzvva`) |
| Payments | Stripe |
| Telephony | Twilio (+ Telnyx webhook) |
| Hosting | Vercel project `voiceagent` |
| Source files | ~393 `.ts`/`.tsx` under `src/` |
| Voice orchestrator | Separate `orchestrator/` package (OpenAI + Twilio WebSocket) |

**Routing model:** File-based App Router — no separate router file. URLs map to `app/**/page.tsx` and `app/api/**/route.ts`. Auth enforced in `src/middleware.ts`.

---

## 1. Project Stack & Dependencies

### 1a. Main app — `voiceagent/package.json`

```json
{
  "name": "voiceagent",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev -p 3002",
    "build": "next build",
    "start": "next start -p 3002",
    "lint": "eslint",
    "orchestrator": "cd orchestrator && npm run dev",
    "orchestrator:build": "cd orchestrator && npm run build",
    "dev:proxy": "node scripts/dev-proxy.mjs",
    "dev:relay": "node scripts/start-relay-dev.mjs",
    "stripe:setup": "node scripts/stripe-setup.mjs",
    "greetq:provision": "node scripts/greetq-provision.mjs",
    "stitch": "npx -y stitch-design-cli",
    "stitch:doctor": "bash ../scripts/stitch-doctor.sh"
  },
  "dependencies": {
    "@hookform/resolvers": "^5.4.0",
    "@radix-ui/react-dialog": "^1.1.16",
    "@radix-ui/react-dropdown-menu": "^2.1.17",
    "@radix-ui/react-slot": "^1.2.5",
    "@radix-ui/react-switch": "^1.3.0",
    "@radix-ui/react-tabs": "^1.1.14",
    "@radix-ui/react-tooltip": "^1.2.9",
    "@sentry/nextjs": "^10.57.0",
    "@supabase/ssr": "^0.10.3",
    "@supabase/supabase-js": "^2.106.2",
    "@tanstack/react-query": "^5.101.0",
    "framer-motion": "^12.40.0",
    "geist": "^1.7.2",
    "googleapis": "^144.0.0",
    "lucide-react": "^1.17.0",
    "next": "16.2.6",
    "postgres": "^3.4.7",
    "react": "19.2.4",
    "react-dom": "19.2.4",
    "react-hook-form": "^7.78.0",
    "recharts": "^3.8.1",
    "stripe": "^22.2.0",
    "twilio": "^5.4.0",
    "zod": "^4.4.3",
    "zustand": "^5.0.14"
  },
  "browserslist": [
    "chrome >= 111",
    "edge >= 111",
    "firefox >= 111",
    "safari >= 16.4"
  ],
  "devDependencies": {
    "@tailwindcss/postcss": "^4",
    "@types/node": "^20",
    "@types/react": "^19",
    "@types/react-dom": "^19",
    "eslint": "^9",
    "eslint-config-next": "16.2.6",
    "http-proxy": "^1.18.1",
    "tailwindcss": "^4",
    "typescript": "^5"
  }
}
```

### 1b. Voice orchestrator — `voiceagent/orchestrator/package.json`

```json
{
  "name": "voiceagent-orchestrator",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "tsx watch src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js"
  },
  "dependencies": {
    "dotenv": "^16.4.7",
    "openai": "^4.77.0",
    "twilio": "^5.4.0",
    "ws": "^8.18.0"
  },
  "devDependencies": {
    "@types/node": "^20",
    "@types/ws": "^8.5.13",
    "tsx": "^4.19.2",
    "typescript": "^5"
  }
}
```

### 1c. TypeScript config — `voiceagent/tsconfig.json`

```json
{
  "compilerOptions": {
    "target": "ES2017",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "react-jsx",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": [
    "next-env.d.ts",
    "**/*.ts",
    "**/*.tsx",
    ".next/types/**/*.ts",
    ".next/dev/types/**/*.ts"
  ],
  "exclude": ["node_modules", "orchestrator"]
}
```

### 1d. Next.js config — `voiceagent/next.config.ts`

```typescript
import { withSentryConfig } from "@sentry/nextjs";
import type { NextConfig } from "next";
import path from "path";

const monorepoRoot = path.resolve(__dirname, "..");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(self), geolocation=()",
  },
  { key: "X-Frame-Options", value: "DENY" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
      "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
      "img-src 'self' data: blob: https:",
      "font-src 'self' data: https://fonts.gstatic.com",
      "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com",
      "frame-src 'self' https://js.stripe.com",
      "object-src 'none'",
      "base-uri 'self'",
      "form-action 'self'",
    ].join("; "),
  },
];

const nextConfig: NextConfig = {
  outputFileTracingRoot: monorepoRoot,
  experimental: {
    optimizePackageImports: ["lucide-react", "framer-motion", "recharts"],
  },
  turbopack: {
    root: monorepoRoot,
  },
  images: {
    remotePatterns: [{ protocol: "https", hostname: "lh3.googleusercontent.com" }],
  },
  async headers() {
    return [{ source: "/:path*", headers: securityHeaders }];
  },
  async rewrites() {
    return [{ source: "/favicon.ico", destination: "/icon" }];
  },
};

export default withSentryConfig(nextConfig, {
  org: "greetq",
  project: "javascript",
  silent: !process.env.CI,
  widenClientFileUpload: true,
  tunnelRoute: "/monitoring",
  disableLogger: true,
  automaticVercelMonitors: true,
});
```

### 1e. Brand constants — `voiceagent/src/lib/brand.ts`

```typescript
export const BRAND = {
  name: "GreetQ",
  legalName: "GreetQ Inc.",
  tagline: "AI phone agents that greet every caller",
  domain: "greetq.com",
  footer: "GreetQ — AI phone agents that never miss a call",
  productCategory: "Voice AI platform for local businesses",
  location: {
    city: "Vancouver",
    region: "BC",
    country: "Canada",
    label: "Vancouver, British Columbia, Canada",
  },
  contact: {
    email: "hello@greetq.com",
    salesEmail: "sales@greetq.com",
    supportEmail: "support@greetq.com",
    phone: "+1 (604) 791-6991",
    phoneNote: "Sales & support — Mon–Fri 9am–5pm PT",
  },
} as const;

export const APP_URL = `https://${BRAND.domain}`;
```

---

## 2. Directory Architecture

Simplified tree of `voiceagent/src/` (~188 directories, ~393 TS/TSX files):

```
voiceagent/src/
├── app/
│   ├── (marketing)/
│   │   └── page.tsx                 ← Homepage (/)
│   ├── layout.tsx                   ← Root HTML shell
│   ├── globals.css
│   ├── about/
│   ├── admin/
│   │   ├── layout.tsx
│   │   ├── page.tsx
│   │   ├── outreach/
│   │   └── users/
│   ├── api/
│   │   ├── admin/                   (outreach, users)
│   │   ├── agents/                  ([id]/preview-voice)
│   │   ├── ai/team-run/             (Monday AI growth — Activepieces)
│   │   ├── analytics/
│   │   ├── api-keys/
│   │   ├── audit/
│   │   ├── auth/sso/                (callback)
│   │   ├── billing/                 (checkout, portal, settings, status, usage)
│   │   ├── calls/                   ([id], sync-crm, live)
│   │   ├── campaigns/
│   │   ├── channels/
│   │   ├── compliance/consent/
│   │   ├── contacts/
│   │   ├── demo/call/
│   │   ├── flows/
│   │   ├── integrations/          (google-calendar, hubspot, status)
│   │   ├── internal/                (db-diag, migrate-billing)
│   │   ├── knowledge/
│   │   ├── leads/capture/
│   │   ├── make/outreach/           (daily, import — cold email cron)
│   │   ├── omnichannel/inbound/
│   │   ├── orchestrator/            (config, reply)
│   │   ├── org/setup/
│   │   ├── phone-numbers/           (purchase, search)
│   │   ├── sandbox/                 (chat, telephony-status, test-call)
│   │   ├── settings/
│   │   ├── support/
│   │   ├── tasks/completed/
│   │   ├── team/
│   │   ├── telnyx/webhook/
│   │   ├── twilio/                  (gather, reply, sandbox-outbound, status, transfer, voice)
│   │   ├── v1/calls/
│   │   ├── voices/
│   │   └── webhooks/                (post-call, stripe)
│   ├── auth/callback/
│   ├── blog/[slug]/
│   ├── careers/
│   ├── case-studies/
│   ├── changelog/
│   ├── community/
│   ├── compare/[slug]/
│   ├── contact/
│   ├── contractors/
│   ├── dashboard/
│   │   ├── layout.tsx               ← Authenticated shell
│   │   ├── page.tsx
│   │   ├── agents/                  ([id], new)
│   │   ├── analytics/
│   │   ├── appointments/
│   │   ├── audit/
│   │   ├── billing/
│   │   ├── calls/[id]/
│   │   ├── campaigns/
│   │   ├── channels/
│   │   ├── compliance/
│   │   ├── contacts/
│   │   ├── developer/
│   │   ├── flows/
│   │   ├── help/
│   │   ├── integrations/
│   │   ├── knowledge/
│   │   ├── live/
│   │   ├── messages/
│   │   ├── phone-numbers/
│   │   ├── sandbox/
│   │   ├── settings/
│   │   ├── setup/
│   │   ├── tasks/
│   │   └── team/
│   ├── demo/
│   ├── dental/
│   ├── docs/                        (api/calls, quickstart, webhooks)
│   ├── features/
│   ├── forgot-password/
│   ├── fr/                          (French landing)
│   ├── help/[slug]/
│   ├── hvac/
│   ├── integrations/
│   ├── languages/
│   ├── legal/
│   ├── login/
│   ├── onboarding/
│   ├── partners/
│   ├── press/
│   ├── pricing/
│   ├── privacy/
│   ├── property-managers/
│   ├── real-estate/
│   ├── reset-password/
│   ├── resources/buyers-guide/
│   ├── restaurants/
│   ├── salons/
│   ├── security/
│   ├── signup/
│   ├── status/
│   ├── terms/
│   └── testimonials/
├── components/
│   ├── auth/                        (AuthLayout, GoogleAuthButton, LoginForm, SignupForm)
│   ├── billing/
│   ├── dashboard/                 (shell, agent config, charts, banners)
│   ├── docs/
│   ├── help/
│   ├── landing/                     (homepage sections — see list below)
│   ├── marketing/
│   ├── onboarding/
│   ├── providers/                 (MarketingProviders, DashboardProviders, ToastProvider)
│   ├── seo/
│   └── ui/
├── hooks/
├── lib/
│   ├── ai-teams/
│   ├── compliance/
│   ├── copy/
│   ├── flow-engine/
│   ├── integrations/
│   ├── omnichannel/
│   ├── schemas/
│   ├── supabase/
│   ├── auth.ts
│   ├── brand.ts
│   └── public-api-routes.ts
├── stores/                          (Zustand)
└── middleware.ts                  ← Auth + API guards
```

### Homepage section components (`src/components/landing/`)

- `LandingNavbar.tsx`, `LandingHero.tsx`, `LandingFooter.tsx`
- `LogoMarquee.tsx`, `SampleCallPlayer.tsx`, `FeaturesBento.tsx`
- `FeatureSpotlight.tsx`, `LandingHowItWorks.tsx`, `DashboardShowcase.tsx`
- `StatsBar.tsx`, `LandingTestimonials.tsx`, `ComparisonStrip.tsx`
- `MissedRevenueEstimator.tsx`, `PricingTeaser.tsx`, `FinalCtaBanner.tsx`
- Plus pricing/demo/features page variants

### Key `lib/` modules

| Path | Purpose |
|------|---------|
| `lib/auth.ts` | Server-side user + org resolution |
| `lib/supabase/` | Browser/server/admin Supabase clients |
| `lib/public-api-routes.ts` | API paths that skip session auth |
| `lib/flow-engine/` | Call flow builder runtime |
| `lib/integrations/` | HubSpot, Google Calendar |
| `lib/omnichannel/` | SMS/voice inbound routing |
| `lib/ai-teams/` | Monday growth AI team runners |

---

## 3. Routing & Core App Layout

### 3a. Root layout — `src/app/layout.tsx`

Global HTML shell, fonts, SEO metadata. Marketing pages intentionally skip heavy client providers.

```tsx
import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { DeferredSiteWidgets } from "@/components/DeferredSiteWidgets";
import { MarketingProviders } from "@/components/providers/MarketingProviders";
import { BRAND } from "@/lib/brand";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  display: "swap",
});

const siteUrl = `https://${BRAND.domain}`;
const description =
  "Canadian voice AI for salons, clinics, and local service businesses. Answer calls 24/7, book appointments, sync CRM, and warm-transfer with PIPEDA-aligned controls.";

export const metadata: Metadata = {
  title: { default: `${BRAND.name} — ${BRAND.tagline}`, template: `%s · ${BRAND.name}` },
  description,
  authors: [{ name: BRAND.name, url: siteUrl }],
  metadataBase: new URL(siteUrl),
  alternates: {
    languages: { "en-CA": siteUrl, "fr-CA": `${siteUrl}/fr` },
  },
  icons: {
    icon: "/icon",
    shortcut: "/icon",
  },
  openGraph: {
    type: "website",
    locale: "en_CA",
    url: siteUrl,
    siteName: BRAND.name,
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description,
    images: [{ url: "/opengraph-image", width: 1200, height: 630, alt: BRAND.name }],
  },
  twitter: {
    card: "summary_large_image",
    title: `${BRAND.name} — ${BRAND.tagline}`,
    description,
    images: ["/opengraph-image"],
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
  userScalable: true,
  themeColor: "#0a0a0a",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${GeistSans.variable} ${inter.variable} ${GeistMono.variable} scroll-smooth`}
    >
      <body className="min-h-full bg-bg font-sans text-text antialiased">
        <MarketingProviders>
          {children}
          <DeferredSiteWidgets />
        </MarketingProviders>
      </body>
    </html>
  );
}
```

### 3b. Marketing providers — `src/components/providers/MarketingProviders.tsx`

```tsx
/** Public marketing shell — no global client providers (keeps homepage JS lean). */
export function MarketingProviders({ children }: { children: React.ReactNode }) {
  return children;
}
```

### 3c. Dashboard providers — `src/components/providers/AppProviders.tsx`

Loaded only inside `/dashboard/*` — TanStack Query, toasts, Framer Motion.

```tsx
"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { MotionConfig } from "framer-motion";
import { useState } from "react";
import { MaterialSymbolsLoader } from "@/components/dashboard/MaterialSymbolsLoader";
import { ToastProvider } from "@/components/providers/ToastProvider";

/** Dashboard-only providers — keeps react-query and framer-motion off marketing pages. */
export function DashboardProviders({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30_000,
            retry: 1,
          },
        },
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <MotionConfig reducedMotion="user">
          <MaterialSymbolsLoader />
          {children}
        </MotionConfig>
      </ToastProvider>
    </QueryClientProvider>
  );
}
```

### 3d. Middleware (auth + API guards) — `src/middleware.ts`

```tsx
import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";
import { isPublicApiRoute } from "@/lib/public-api-routes";
import { getSupabaseAnonKey, getSupabaseUrl } from "@/lib/supabase/env";

const PUBLIC_PATHS = ["/login", "/signup", "/forgot-password", "/reset-password"];
const PUBLIC_ANY_USER = ["/demo"];
const AUTH_PATHS = ["/onboarding"];

function redirectLogin(request: NextRequest) {
  return NextResponse.redirect(new URL("/login", request.url));
}

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({ request: { headers: request.headers } });

  let url: string;
  let key: string;
  try {
    url = getSupabaseUrl();
    key = getSupabaseAnonKey();
  } catch {
    const pathname = request.nextUrl.pathname;
    if (
      pathname.startsWith("/dashboard") ||
      pathname.startsWith("/admin") ||
      (pathname.startsWith("/api/") && !isPublicApiRoute(pathname))
    ) {
      if (pathname.startsWith("/api/")) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
      }
      return redirectLogin(request);
    }
    return response;
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) =>
          response.cookies.set(name, value, options)
        );
      },
    },
  });

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const pathname = request.nextUrl.pathname;

  if (pathname.startsWith("/api/") && !isPublicApiRoute(pathname) && !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (
    (pathname.startsWith("/dashboard") ||
      pathname.startsWith("/admin") ||
      AUTH_PATHS.some((p) => pathname.startsWith(p))) &&
    !user
  ) {
    return redirectLogin(request);
  }

  if (
    user &&
    pathname.startsWith("/dashboard") &&
    user.user_metadata?.onboarding_completed === false
  ) {
    return NextResponse.redirect(new URL("/onboarding", request.url));
  }

  if (
    PUBLIC_PATHS.includes(pathname) &&
    user &&
    pathname !== "/reset-password" &&
    !PUBLIC_ANY_USER.includes(pathname)
  ) {
    const redirect = NextResponse.redirect(new URL("/dashboard", request.url));
    redirect.headers.set("Cache-Control", "no-store, no-cache, must-revalidate");
    return redirect;
  }

  if (pathname.startsWith("/dashboard") || pathname.startsWith("/admin")) {
    response.headers.set("Cache-Control", "no-store, no-cache, must-revalidate, private");
    response.headers.set("Pragma", "no-cache");
  }

  return response;
}

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/admin/:path*",
    "/onboarding",
    "/demo",
    "/login",
    "/signup",
    "/forgot-password",
    "/reset-password",
    "/api/:path*",
  ],
};
```

### 3e. Public API routes — `src/lib/public-api-routes.ts`

Webhooks, cron, and secret-header APIs bypass session auth.

```typescript
/** API routes that bypass session auth (webhooks, cron, API keys, public). */
export const PUBLIC_API_PREFIXES = [
  "/api/webhooks/",
  "/api/twilio/",
  "/api/telnyx/",
  "/api/make/outreach",
  "/api/ai/",
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
```

### 3f. Dashboard layout — `src/app/dashboard/layout.tsx`

```tsx
import { GeistMono } from "geist/font/mono";
import { redirect } from "next/navigation";
import { DashboardShell } from "@/components/DashboardShell";
import { PwaRegister } from "@/components/PwaRegister";
import { TrialStatusBanner } from "@/components/dashboard/TrialStatusBanner";
import { UsageMeterBanner } from "@/components/dashboard/UsageMeterBanner";
import { DashboardProviders } from "@/components/providers/AppProviders";
import { PageTransition } from "@/components/ui/PageTransition";
import { isPlatformAdmin } from "@/lib/admin-auth";
import { getCachedUserOrg } from "@/lib/auth";

export const dynamic = "force-dynamic";

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const ctx = await getCachedUserOrg();

  if (!ctx?.user) redirect("/login");

  const { user, org } = ctx;

  return (
    <div className={GeistMono.variable}>
      <DashboardProviders>
        <PwaRegister />
        <DashboardShell
          orgName={org?.name}
          userEmail={user.email}
          isPlatformAdmin={isPlatformAdmin(user.email)}
        >
          <TrialStatusBanner />
          <UsageMeterBanner />
          <PageTransition>{children}</PageTransition>
        </DashboardShell>
      </DashboardProviders>
    </div>
  );
}
```

### 3g. Route map (selected)

| URL | File |
|-----|------|
| `/` | `app/(marketing)/page.tsx` |
| `/login` | `app/login/page.tsx` |
| `/signup` | `app/signup/page.tsx` |
| `/pricing` | `app/pricing/page.tsx` |
| `/demo` | `app/demo/page.tsx` |
| `/dashboard` | `app/dashboard/page.tsx` |
| `/dashboard/agents` | `app/dashboard/agents/page.tsx` |
| `/dashboard/calls` | `app/dashboard/calls/page.tsx` |
| `/dashboard/billing` | `app/dashboard/billing/page.tsx` |
| `/onboarding` | `app/onboarding/page.tsx` |
| `/admin` | `app/admin/page.tsx` |
| Twilio voice webhook | `app/api/twilio/voice/route.ts` |
| Stripe webhook | `app/api/webhooks/stripe/route.ts` |
| Cold email cron | `app/api/make/outreach/daily/route.ts` |
| AI team cron | `app/api/ai/team-run/route.ts` |

---

## 4. The Homepage Component

**File:** `src/app/(marketing)/page.tsx`  
**URL:** https://greetq.com/

Composes landing sections. Below-fold blocks are `dynamic()` imports for performance.

```tsx
import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { LandingHero } from "@/components/landing/LandingHero";
import { LandingNavbar } from "@/components/landing/LandingNavbar";
import { LogoMarquee } from "@/components/landing/LogoMarquee";
import { SkipToContent } from "@/components/SkipToContent";
import { BRAND } from "@/lib/brand";

const FeaturesBento = dynamic(
  () => import("@/components/landing/FeaturesBento").then((m) => ({ default: m.FeaturesBento }))
);
const FeatureSpotlight = dynamic(
  () => import("@/components/landing/FeatureSpotlight").then((m) => ({ default: m.FeatureSpotlight }))
);
const DashboardShowcase = dynamic(
  () => import("@/components/landing/DashboardShowcase").then((m) => ({ default: m.DashboardShowcase }))
);
const ComparisonStrip = dynamic(
  () => import("@/components/landing/ComparisonStrip").then((m) => ({ default: m.ComparisonStrip }))
);
const SampleCallPlayer = dynamic(
  () => import("@/components/landing/SampleCallPlayer").then((m) => ({ default: m.SampleCallPlayer }))
);
const MissedRevenueEstimator = dynamic(
  () => import("@/components/landing/MissedRevenueEstimator").then((m) => ({ default: m.MissedRevenueEstimator }))
);
const LandingHowItWorks = dynamic(
  () => import("@/components/landing/LandingHowItWorks").then((m) => ({ default: m.LandingHowItWorks }))
);
const StatsBar = dynamic(() => import("@/components/landing/StatsBar").then((m) => ({ default: m.StatsBar })));
const LandingTestimonials = dynamic(
  () => import("@/components/landing/LandingTestimonials").then((m) => ({ default: m.LandingTestimonials }))
);
const PricingTeaser = dynamic(
  () => import("@/components/landing/PricingTeaser").then((m) => ({ default: m.PricingTeaser }))
);
const FinalCtaBanner = dynamic(
  () => import("@/components/landing/FinalCtaBanner").then((m) => ({ default: m.FinalCtaBanner }))
);

export const metadata: Metadata = {
  title: "Your AI Receptionist. Always On.",
  description:
    "GreetQ answers calls, books appointments, and greets every customer like a pro — so you don't have to.",
  alternates: { canonical: "/" },
};

export default function HomePage() {
  const siteUrl = `https://${BRAND.domain}`;
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        name: BRAND.legalName,
        alternateName: BRAND.name,
        url: siteUrl,
        logo: `${siteUrl}/icon`,
      },
      {
        "@type": "SoftwareApplication",
        name: BRAND.name,
        applicationCategory: "BusinessApplication",
        operatingSystem: "Web",
        url: siteUrl,
        offers: { "@type": "Offer", price: "79", priceCurrency: "CAD" },
      },
    ],
  };

  return (
    <div className="flex min-h-screen flex-col overflow-x-hidden bg-bg">
      <SkipToContent />
      <LandingNavbar />
      <main id="main-content">
        <LandingHero />
        <LogoMarquee />
        <div className="perf-below-fold">
          <SampleCallPlayer />
        </div>
        <div className="perf-below-fold">
          <FeaturesBento />
        </div>
        <div className="perf-below-fold">
          <FeatureSpotlight />
        </div>
        <div className="perf-below-fold">
          <LandingHowItWorks />
        </div>
        <div className="perf-below-fold">
          <DashboardShowcase />
        </div>
        <div className="perf-below-fold">
          <StatsBar />
        </div>
        <div className="perf-below-fold">
          <LandingTestimonials />
        </div>
        <div className="perf-below-fold">
          <ComparisonStrip />
        </div>
        <div className="perf-below-fold">
          <MissedRevenueEstimator />
        </div>
        <div className="perf-below-fold">
          <PricingTeaser />
        </div>
        <div className="perf-below-fold">
          <FinalCtaBanner />
        </div>
      </main>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <LandingFooter />
    </div>
  );
}
```

---

## 5. Infrastructure & Ops (for auditors)

| Item | Value |
|------|-------|
| Vercel project | `voiceagent` |
| Production domain | https://greetq.com |
| Supabase project ref | `lrihhjjxmxixppmrzvva` |
| Required env vars | `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` |
| Cold email cron | Activepieces → `POST /api/make/outreach/daily` (header `X-GreetQ-Secret`) |
| AI team cron | Activepieces → `POST /api/ai/team-run` (header `X-GreetQ-Secret`) |
| Monorepo siblings | RateLocal (`reviewflow/`), ServeLocal (`servelocal/`) — separate apps |

### Auth flow (high level)

1. User signs in via Supabase (Google OAuth or email) → `app/auth/callback/route.ts`
2. `middleware.ts` reads session cookie on protected paths
3. Incomplete onboarding → redirect to `/onboarding`
4. Dashboard loads org context via `getCachedUserOrg()` in `lib/auth.ts`

### Telephony flow (high level)

1. Inbound call hits Twilio → `POST /api/twilio/voice`
2. TwiML gather/reply/status routes under `app/api/twilio/*`
3. Real-time AI voice handled by `orchestrator/` (WebSocket + OpenAI)
4. Post-call webhook → `app/api/webhooks/post-call`

---

## 6. Auditor Quick Reference

| Question | Answer |
|----------|--------|
| Where is the app? | `voiceagent/` folder in monorepo |
| Entry point | `app/layout.tsx` + file-based routes |
| Homepage | `app/(marketing)/page.tsx` → `/` |
| Auth guard | `src/middleware.ts` + Supabase SSR cookies |
| Public APIs | `lib/public-api-routes.ts` prefix list |
| Dashboard shell | `app/dashboard/layout.tsx` + `DashboardShell` |
| State management | Zustand (`stores/`), TanStack Query (dashboard only) |
| Payments | Stripe checkout/portal + `webhooks/stripe` |
| Voice AI runtime | `orchestrator/` (separate Node process) |

---

*End of GreetQ Codebase Audit Pack*
