"use client";

import dynamic from "next/dynamic";

const LiveChatWidget = dynamic(
  () => import("@/components/LiveChatWidget").then((m) => ({ default: m.LiveChatWidget })),
  { ssr: false }
);

const CookieNotice = dynamic(
  () => import("@/components/CookieNotice").then((m) => ({ default: m.CookieNotice })),
  { ssr: false }
);

/** Loaded after hydration so chat/cookie scripts do not block first paint. */
export function DeferredSiteWidgets() {
  return (
    <>
      <LiveChatWidget />
      <CookieNotice />
    </>
  );
}
