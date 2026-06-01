"use client";

import { useEffect, useState } from "react";
import { generateQrOnlyDataUrl } from "@/lib/qr-poster";

type Props = {
  googleReviewUrl: string;
  businessName: string;
};

function downloadDataUrl(dataUrl: string, filename: string) {
  const link = document.createElement("a");
  link.href = dataUrl;
  link.download = filename;
  link.click();
}

/** QR that opens Google review page directly — like Google Business Profile's native QR. */
export function GoogleDirectQrCard({ googleReviewUrl, businessName }: Props) {
  const [qrUrl, setQrUrl] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    generateQrOnlyDataUrl(googleReviewUrl)
      .then((url) => {
        if (!cancelled) setQrUrl(url);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [googleReviewUrl]);

  const slug = businessName.replace(/\s+/g, "-").toLowerCase();

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-[#e8e2d9] bg-white px-6 py-4">
        <h2 className="font-display text-lg text-brand-950">Google review QR (direct)</h2>
        <p className="mt-0.5 text-sm text-stone-500">
          Scan goes straight to Google — no stars or AI step. Good for simple counter signs.
        </p>
      </div>
      <div className="bg-white p-6 text-center">
        {qrUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qrUrl} alt="Google review QR" className="mx-auto max-w-[220px]" />
        ) : (
          <div className="mx-auto h-[220px] max-w-[220px] animate-pulse bg-cream-dark" />
        )}
        <p className="mt-4 break-all text-xs text-stone-500">{googleReviewUrl}</p>
        <button
          type="button"
          onClick={() => qrUrl && downloadDataUrl(qrUrl, `${slug}-google-qr.png`)}
          disabled={loading || !qrUrl}
          className="btn-ghost mt-4 w-full py-2.5 text-sm disabled:opacity-50"
        >
          Download Google QR
        </button>
      </div>
    </div>
  );
}
