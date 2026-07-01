import type { NextConfig } from "next";
import path from "path";

// Content-Security-Policy scoped to the origins this app actually talks to:
// - self for first-party code/assets
// - Stripe for checkout (js/frame/api)
// - Supabase for data + realtime (https + wss, any project subdomain)
// - Datadog for RUM telemetry ingestion
// - Unsplash for remote images
// Note: 'unsafe-inline' on script-src is required because Next.js App Router
// injects inline bootstrap scripts without a nonce. Upgrade path: nonce-based
// CSP wired through middleware. Styles use 'unsafe-inline' for Tailwind/Framer.
const isDev = process.env.NODE_ENV === "development";

// Next.js dev mode needs 'unsafe-eval' (React Refresh / webpack HMR) and a local
// websocket for hot reload. These are added ONLY in development — production
// stays strict.
const scriptSrc = isDev
  ? "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://js.stripe.com"
  : "script-src 'self' 'unsafe-inline' https://js.stripe.com";

const connectSrc = isDev
  ? "connect-src 'self' ws: wss: https://*.supabase.co https://api.stripe.com https://*.datadoghq.com https://*.datadoghq.eu https://browser-intake-datadoghq.com https://*.browser-intake-datadoghq.com"
  : "connect-src 'self' https://*.supabase.co wss://*.supabase.co https://api.stripe.com https://*.datadoghq.com https://*.datadoghq.eu https://browser-intake-datadoghq.com https://*.browser-intake-datadoghq.com";

const contentSecurityPolicy = [
  "default-src 'self'",
  "base-uri 'self'",
  "object-src 'none'",
  "frame-ancestors 'none'",
  "form-action 'self'",
  "img-src 'self' data: blob: https://images.unsplash.com https://*.supabase.co",
  "font-src 'self' data:",
  "style-src 'self' 'unsafe-inline'",
  scriptSrc,
  "frame-src https://js.stripe.com https://hooks.stripe.com",
  connectSrc,
  "worker-src 'self' blob:",
  // upgrade-insecure-requests would try to force http://localhost to https in
  // dev and break local loading, so only apply it in production.
  ...(isDev ? [] : ["upgrade-insecure-requests"]),
].join("; ");

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "Content-Security-Policy", value: contentSecurityPolicy },
  { key: "X-DNS-Prefetch-Control", value: "on" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
  {
    key: "Strict-Transport-Security",
    value: "max-age=63072000; includeSubDomains; preload",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "images.unsplash.com" },
    ],
  },
  turbopack: {
    root: path.resolve(__dirname),
  },
  async headers() {
    return [
      {
        source: "/:path*",
        headers: securityHeaders,
      },
    ];
  },
};

export default nextConfig;
