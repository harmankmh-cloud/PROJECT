import type { NextConfig } from "next";
import path from "path";

const securityHeaders = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "X-Frame-Options", value: "DENY" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  turbopack: {
    root: path.resolve(__dirname),
  },
  async redirects() {
    return [
      // Session cookies must match NEXT_PUBLIC_APP_URL (www) — apex → www
      {
        source: "/:path*",
        has: [{ type: "host", value: "servelocal.ca" }],
        destination: "https://www.servelocal.ca/:path*",
        permanent: true,
      },
      // Legacy / marketing URLs → canonical category slugs
      { source: "/services/plumbing", destination: "/services/plumber", permanent: true },
      { source: "/services/electrical", destination: "/services/electrician", permanent: true },
      { source: "/services/cleaning", destination: "/services/cleaner", permanent: true },
      { source: "/services/landscaping", destination: "/services/landscaper", permanent: true },
      { source: "/services/painting", destination: "/services/painter", permanent: true },
      { source: "/services/roofing", destination: "/services/roofer", permanent: true },
    ];
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
