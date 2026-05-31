"use client";

import Link from "next/link";
import { useMemo } from "react";
import {
  isLocalBrowserOrigin,
  resolvePublicReviewUrl,
  reviewUrlHostMismatch,
} from "@/lib/app-url";

type Props = {
  url: string;
  slug: string;
  businessName: string;
};

export function ReviewLinkTester({ url, slug, businessName }: Props) {
  const reviewUrl = useMemo(() => resolvePublicReviewUrl(url, slug), [url, slug]);
  const onLocalhost = isLocalBrowserOrigin();
  const hostMismatch = reviewUrlHostMismatch(url);

  return (
    <div className="surface-card overflow-hidden border-gold-500/30">
      <div className="border-b border-[#e8e2d9] bg-gold-500/10 px-6 py-4">
        <h2 className="font-display text-lg text-brand-950">Test before you print</h2>
        <p className="mt-0.5 text-sm text-stone-600">
          Open this link on your phone first — it must load before customers scan your QR.
        </p>
      </div>
      <div className="space-y-4 p-6">
        <div className="rounded-xl bg-cream px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-stone-400">Customer link</p>
          <p className="mt-1 break-all text-sm font-medium text-brand-950">{reviewUrl}</p>
        </div>

        {onLocalhost && (
          <div className="rounded-xl bg-rose-50 px-4 py-3 text-sm text-rose-900">
            <p className="font-semibold">You are on localhost</p>
            <p className="mt-1">
              QR codes printed from here will not work on customer phones. Open{" "}
              <strong>ratelocal.ca</strong> or your Vercel link on your phone, then download a fresh
              poster.
            </p>
          </div>
        )}

        {hostMismatch && !onLocalhost && (
          <div className="rounded-xl bg-amber-50 px-4 py-3 text-sm text-amber-950">
            <p className="font-semibold">Using your working website address</p>
            <p className="mt-1">
              Your saved domain may be offline. This QR uses{" "}
              <code className="text-xs">{typeof window !== "undefined" ? window.location.host : ""}</code>{" "}
              so phones can reach it. Re-download your poster below.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href={reviewUrl} target="_blank" rel="noreferrer" className="btn-gold flex-1 py-3 text-center">
            Test on your phone →
          </Link>
          <Link
            href={`/r/${slug}`}
            target="_blank"
            rel="noreferrer"
            className="btn-ghost flex-1 py-3 text-center"
          >
            Preview {businessName}
          </Link>
        </div>
      </div>
    </div>
  );
}
