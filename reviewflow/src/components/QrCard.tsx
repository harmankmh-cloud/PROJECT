"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

type Props = {
  url: string;
  businessName: string;
};

export function QrCard({ url, businessName }: Props) {
  const [dataUrl, setDataUrl] = useState("");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    QRCode.toDataURL(url, { margin: 2, width: 280 }).then(setDataUrl).catch(() => undefined);
  }, [url]);

  async function copyLink() {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      setCopied(false);
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
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">QR code & review link</h2>
      <p className="mt-1 text-sm text-zinc-600">Print this or show it at your front desk.</p>
      {dataUrl ? (
        <img src={dataUrl} alt={`QR code for ${businessName}`} className="mx-auto mt-4 rounded-xl" />
      ) : (
        <div className="mt-4 h-[280px] animate-pulse rounded-xl bg-zinc-100" />
      )}
      <p className="mt-4 break-all text-xs text-zinc-500">{url}</p>
      <div className="mt-4 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={copyLink}
          className="rounded-2xl border border-zinc-200 px-4 py-2 text-sm font-medium text-zinc-800"
        >
          {copied ? "Copied!" : "Copy link"}
        </button>
        <button
          type="button"
          onClick={downloadQr}
          disabled={!dataUrl}
          className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-50"
        >
          Download QR
        </button>
      </div>
    </div>
  );
}
