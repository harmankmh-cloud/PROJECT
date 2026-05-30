"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";
import { copyToClipboard } from "@/lib/copy";

type Props = {
  url: string;
  businessName: string;
};

export function QrCard({ url, businessName }: Props) {
  const [dataUrl, setDataUrl] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    QRCode.toDataURL(url, {
      margin: 2,
      width: 280,
      color: { dark: "#000000", light: "#ffffff" },
    })
      .then(setDataUrl)
      .catch(() => setError("Could not generate QR code."));
  }, [url]);

  async function copyLink() {
    setError("");
    try {
      await copyToClipboard(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Copy failed");
    }
  }

  function downloadQr() {
    if (!dataUrl) return;
    const link = document.createElement("a");
    link.href = dataUrl;
    link.download = `${businessName.replace(/\s+/g, "-").toLowerCase()}-review-qr.png`;
    link.click();
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-[#e8e2d9] bg-white px-6 py-4">
        <h2 className="font-display text-lg text-brand-950">Your QR code</h2>
        <p className="mt-0.5 text-sm text-stone-500">Print-ready black & white — laminate or show on a tablet</p>
      </div>
      <div className="bg-white p-6">
        <div className="mx-auto max-w-[280px] rounded-2xl border border-[#e8e2d9] bg-white p-4 shadow-sm">
          {dataUrl ? (
            // eslint-disable-next-line @next/next/no-img-element -- QR data URL
            <img src={dataUrl} alt={`QR code for ${businessName}`} className="mx-auto w-full" />
          ) : (
            <div className="aspect-square animate-pulse rounded-xl bg-cream-dark" />
          )}
          <p className="mt-3 text-center font-display text-sm text-brand-950">{businessName}</p>
          <p className="text-center text-[10px] uppercase tracking-widest text-stone-400">Scan to review</p>
        </div>
        <p className="mt-4 break-all text-center text-xs text-stone-500">{url}</p>
        {error && <p className="mt-2 text-center text-xs text-rose-600">{error}</p>}
        <div className="mt-4 flex gap-2">
          <button type="button" onClick={copyLink} className="btn-ghost flex-1 py-2.5 text-sm">
            {copied ? "Copied!" : "Copy link"}
          </button>
          <button
            type="button"
            onClick={downloadQr}
            disabled={!dataUrl}
            className="btn-gold flex-1 py-2.5 text-sm disabled:opacity-50"
          >
            Download PNG
          </button>
        </div>
      </div>
    </div>
  );
}
