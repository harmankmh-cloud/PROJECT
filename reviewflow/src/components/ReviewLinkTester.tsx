"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
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
  const [mounted, setMounted] = useState(false);
  const [reviewUrl, setReviewUrl] = useState(url);
  const [onLocalhost, setOnLocalhost] = useState(false);
  const [hostMismatch, setHostMismatch] = useState(false);
  const [currentHost, setCurrentHost] = useState("");

  useEffect(() => {
    setMounted(true);
    setReviewUrl(resolvePublicReviewUrl(url, slug));
    setOnLocalhost(isLocalBrowserOrigin());
    setHostMismatch(reviewUrlHostMismatch(url));
    setCurrentHost(window.location.host);
  }, [url, slug]);

  return (
    <div className="surface-card overflow-hidden border-primary/20">
      <div className="border-b border-border bg-success-bg/50 px-6 py-4">
        <h2 className="font-display text-lg text-text">Test before you print</h2>
        <p className="mt-0.5 text-sm text-muted">
          Open this link on your phone first — it must load before customers scan your QR.
        </p>
      </div>
      <div className="space-y-4 p-6">
        <div className="rounded-xl bg-surface px-4 py-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-muted">Customer link</p>
          <p className="mt-1 break-all text-sm font-medium text-text">{reviewUrl}</p>
        </div>

        {mounted && onLocalhost && (
          <div className="alert-danger">
            <p className="font-semibold">You are on localhost</p>
            <p className="mt-1">
              QR codes printed from here will not work on customer phones. Open{" "}
              <strong>ratelocal.ca</strong> or your Vercel link on your phone, then download a fresh
              poster.
            </p>
          </div>
        )}

        {mounted && hostMismatch && !onLocalhost && (
          <div className="alert-warning">
            <p className="font-semibold">Using your working website address</p>
            <p className="mt-1">
              Your saved domain may be offline. This QR uses{" "}
              <code className="text-xs">{currentHost}</code> so phones can reach it. Re-download your
              poster below.
            </p>
          </div>
        )}

        <div className="flex flex-col gap-2 sm:flex-row">
          <Link href={reviewUrl} target="_blank" rel="noreferrer" className="btn-gold flex-1 py-3 text-center">
            Test on your phone →
          </Link>
        </div>

        <p className="text-xs text-muted">
          Testing as <strong>{businessName}</strong> — the page should show your business name and star
          rating buttons.
        </p>
      </div>
    </div>
  );
}
