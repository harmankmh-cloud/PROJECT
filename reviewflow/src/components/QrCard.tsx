"use client";

import QRCode from "qrcode";
import { useEffect, useState } from "react";

type Props = {
  url: string;
  businessName: string;
};

export function QrCard({ url, businessName }: Props) {
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    QRCode.toDataURL(url, { margin: 2, width: 280 }).then(setDataUrl).catch(() => undefined);
  }, [url]);

  return (
    <div className="rounded-3xl border border-zinc-200 bg-white p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-zinc-900">QR code</h2>
      <p className="mt-1 text-sm text-zinc-600">Print this or show it at your front desk.</p>
      {dataUrl ? (
        <img src={dataUrl} alt={`QR code for ${businessName}`} className="mx-auto mt-4 rounded-xl" />
      ) : (
        <div className="mt-4 h-[280px] animate-pulse rounded-xl bg-zinc-100" />
      )}
      <p className="mt-4 break-all text-xs text-zinc-500">{url}</p>
    </div>
  );
}
