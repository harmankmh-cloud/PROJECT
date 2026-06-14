"use client";

import { useGoogleSetup } from "@/components/GoogleSetupModal";

export function GoogleLinkBanner() {
  const { openGoogleSetup } = useGoogleSetup();

  return (
    <div className="rounded-xl border-2 border-amber-300 bg-amber-50 px-5 py-4 text-sm text-amber-950">
      <p className="font-semibold">Add your Google review link to finish setup</p>
      <p className="mt-1 leading-relaxed text-amber-900/90">
        Without it, happy customers can leave feedback here but won&apos;t be sent to Google Maps to post
        publicly. Paste your Maps &quot;Write a review&quot; link — usually{" "}
        <code className="text-xs">g.page/r/...</code>.
      </p>
      <button
        type="button"
        onClick={openGoogleSetup}
        className="mt-3 text-sm font-semibold text-gold-700 hover:underline"
      >
        Add Google link now →
      </button>
    </div>
  );
}
