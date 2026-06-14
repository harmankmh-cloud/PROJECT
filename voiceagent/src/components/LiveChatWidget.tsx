"use client";

import Link from "next/link";
import { MessageCircle } from "lucide-react";
import { useEffect, useState } from "react";
import { CONSENT_CHANGED_EVENT, hasAnalyticsConsent } from "@/components/CookieNotice";

declare global {
  interface Window {
    $crisp?: unknown[];
    CRISP_WEBSITE_ID?: string;
    Tawk_API?: { onLoad?: () => void };
    Tawk_LoadStart?: Date;
  }
}

function loadChatScripts(crispId?: string, tawkProperty?: string, tawkWidget?: string) {
  if (crispId) {
    window.$crisp = [];
    window.CRISP_WEBSITE_ID = crispId;
    const s = document.createElement("script");
    s.src = "https://client.crisp.chat/l.js";
    s.async = true;
    document.head.appendChild(s);
    return;
  }

  if (tawkProperty && tawkWidget) {
    window.Tawk_API = window.Tawk_API || {};
    window.Tawk_LoadStart = new Date();
    const s = document.createElement("script");
    s.async = true;
    s.src = `https://embed.tawk.to/${tawkProperty}/${tawkWidget}`;
    s.charset = "UTF-8";
    s.setAttribute("crossorigin", "*");
    document.head.appendChild(s);
  }
}

export function LiveChatWidget() {
  const crispId = process.env.NEXT_PUBLIC_CRISP_WEBSITE_ID?.trim();
  const tawkProperty = process.env.NEXT_PUBLIC_TAWK_PROPERTY_ID?.trim();
  const tawkWidget = process.env.NEXT_PUBLIC_TAWK_WIDGET_ID?.trim();
  const hasChatConfig = Boolean(crispId || (tawkProperty && tawkWidget));
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    const sync = () => setConsented(hasAnalyticsConsent());
    sync();
    window.addEventListener(CONSENT_CHANGED_EVENT, sync);
    return () => window.removeEventListener(CONSENT_CHANGED_EVENT, sync);
  }, []);

  useEffect(() => {
    if (!hasChatConfig || !consented) return;
    loadChatScripts(crispId, tawkProperty, tawkWidget);
  }, [consented, hasChatConfig, crispId, tawkProperty, tawkWidget]);

  if (hasChatConfig && consented) {
    return null;
  }

  return (
    <Link
      href="/help"
      className="fixed bottom-6 right-6 z-40 flex items-center gap-2 rounded-full border border-border bg-surface px-4 py-3 text-sm font-medium text-text shadow-lg transition hover:border-primary/40 hover:shadow-[0_0_20px_rgba(99,102,241,0.25)]"
      aria-label="Chat with us — opens help center"
    >
      <MessageCircle className="h-5 w-5 text-primary-glow" />
      Chat with us
    </Link>
  );
}
