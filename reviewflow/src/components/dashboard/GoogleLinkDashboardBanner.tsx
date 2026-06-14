"use client";

import { AlertTriangle } from "lucide-react";
import { useGoogleSetup } from "@/components/GoogleSetupModal";
import { DASHBOARD } from "@/content/copy";

export function GoogleLinkDashboardBanner() {
  const { openGoogleSetup } = useGoogleSetup();

  return (
    <div className="warning-banner flex flex-col gap-3 border-2 border-amber-400 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <p className="font-semibold">{DASHBOARD.googleBanner.title}</p>
      </div>
      <button
        type="button"
        onClick={openGoogleSetup}
        className="shrink-0 rounded-full bg-amber-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-amber-700"
      >
        {DASHBOARD.googleBanner.cta}
      </button>
    </div>
  );
}
