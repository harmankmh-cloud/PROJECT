"use client";

import { useEffect, useState } from "react";
import { copyToClipboard } from "@/lib/copy";
import { isLocalBrowserOrigin, resolvePublicReviewUrl } from "@/lib/app-url";
import { generateQrOnlyDataUrl, generateQrPosterDataUrl } from "@/lib/qr-poster";

type Props = {
  url: string;
  slug: string;
  businessName: string;
};

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

export function QrCard({ url, slug, businessName }: Props) {
  const [posterUrl, setPosterUrl] = useState("");
  const [qrOnlyUrl, setQrOnlyUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  const [mounted, setMounted] = useState(false);
  const [reviewUrl, setReviewUrl] = useState(url);
  const [onLocalhost, setOnLocalhost] = useState(false);

  useEffect(() => {
    setMounted(true);
    setReviewUrl(resolvePublicReviewUrl(url, slug));
    setOnLocalhost(isLocalBrowserOrigin());
  }, [url, slug]);

  useEffect(() => {
    let cancelled = false;

    async function load() {
      setLoading(true);
      setError("");
      try {
        const [poster, qrOnly] = await Promise.all([
          generateQrPosterDataUrl({ url: reviewUrl, businessName }),
          generateQrOnlyDataUrl(reviewUrl),
        ]);
        if (!cancelled) {
          setPosterUrl(poster);
          setQrOnlyUrl(qrOnly);
        }
      } catch {
        if (!cancelled) setError("Could not generate QR poster. Try refreshing.");
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, [reviewUrl, businessName]);

  async function copyLink() {
    setError("");
    try {
      await copyToClipboard(reviewUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Copy failed");
    }
  }

  function downloadPoster() {
    if (!posterUrl) return;
    const fileSlug = businessName.replace(/\s+/g, "-").toLowerCase();
    downloadDataUrl(posterUrl, `${fileSlug}-review-poster.png`);
  }

  function downloadQrOnly() {
    if (!qrOnlyUrl) return;
    const fileSlug = businessName.replace(/\s+/g, "-").toLowerCase();
    downloadDataUrl(qrOnlyUrl, `${fileSlug}-qr-code.png`);
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-[#e8e2d9] bg-white px-6 py-4">
        <h2 className="font-display text-lg text-brand-950">Smart review QR (recommended)</h2>
        <p className="mt-0.5 text-sm text-stone-500">
          Stars + AI drafts for <span className="font-medium text-brand-950">{businessName}</span> — then Google
        </p>
      </div>
      <div className="bg-white p-6">
        <div className="mx-auto max-w-[320px] overflow-hidden rounded-2xl border border-[#e8e2d9] bg-white shadow-sm">
          {posterUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- poster preview data URL
            <img
              src={posterUrl}
              alt={`Review poster for ${businessName}`}
              className="mx-auto w-full"
            />
          ) : (
            <div className="aspect-[640/860] animate-pulse bg-cream-dark" />
          )}
        </div>

        <p className="mt-4 break-all text-center text-xs text-stone-500">{reviewUrl}</p>
        {onLocalhost ? (
          <p className="mt-2 rounded-lg bg-rose-50 px-3 py-2 text-center text-xs text-rose-900">
            Do not print from localhost — open your live site on your phone first, then download again.
          </p>
        ) : (
          <p className="mt-2 rounded-lg bg-emerald-50 px-3 py-2 text-center text-xs text-emerald-900">
            QR uses your live website link so customers can scan it on their phone.
          </p>
        )}
        {error && <p className="mt-2 text-center text-xs text-rose-600">{error}</p>}

        <div className="mt-4 flex flex-col gap-2 sm:flex-row">
          <button
            type="button"
            onClick={downloadPoster}
            disabled={loading || !posterUrl || onLocalhost}
            className="btn-gold flex-1 py-2.5 text-sm disabled:opacity-50"
          >
            Download poster
          </button>
          <button
            type="button"
            onClick={downloadQrOnly}
            disabled={loading || !qrOnlyUrl || onLocalhost}
            className="btn-ghost flex-1 py-2.5 text-sm disabled:opacity-50"
          >
            QR only
          </button>
        </div>
        <button type="button" onClick={copyLink} className="btn-ghost mt-2 w-full py-2.5 text-sm">
          {copied ? "Link copied!" : "Copy review link"}
        </button>
      </div>
    </div>
  );
}
