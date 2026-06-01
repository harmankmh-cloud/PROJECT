"use client";

import { useMemo, useState } from "react";
import { copyToClipboard } from "@/lib/copy";
import { resolvePublicReviewUrl } from "@/lib/app-url";

type Props = {
  businessName: string;
  reviewUrl: string;
  slug: string;
};

const templates = (businessName: string, reviewUrl: string) => [
  {
    id: "sms",
    label: "Text message",
    icon: "💬",
    text: `Hi! Thanks for visiting ${businessName}. Share a quick review — takes 30 seconds: ${reviewUrl}`,
  },
  {
    id: "email",
    label: "Email follow-up",
    icon: "✉️",
    text: `Subject: How was your visit to ${businessName}?\n\nHi,\n\nThank you for choosing us. Share a quick star rating and we'll help you write a Google review:\n\n${reviewUrl}\n\nThank you,\n${businessName}`,
  },
  {
    id: "counter",
    label: "Counter sign",
    icon: "📋",
    text: `${businessName}\n\n★ HOW WAS YOUR VISIT?\nScan to pick your stars and leave a Google review — takes under 1 minute.\n\n${reviewUrl}`,
  },
];

export function ShareKit({ businessName, reviewUrl, slug }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const [error, setError] = useState("");
  const liveReviewUrl = useMemo(() => resolvePublicReviewUrl(reviewUrl, slug), [reviewUrl, slug]);
  const items = templates(businessName, liveReviewUrl);

  async function copy(id: string, text: string) {
    setError("");
    try {
      await copyToClipboard(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Copy failed");
    }
  }

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-[#e8e2d9] bg-white px-6 py-4">
        <h2 className="font-display text-lg text-brand-950">Share kit</h2>
        <p className="mt-0.5 text-sm text-stone-500">Copy-ready messages with your business name</p>
      </div>
      <div className="space-y-3 p-6">
        {items.map((item) => (
          <div key={item.id} className="rounded-xl border border-[#e8e2d9] bg-cream p-4">
            <div className="flex items-center justify-between gap-3">
              <span className="flex items-center gap-2 text-sm font-semibold text-brand-950">
                <span>{item.icon}</span>
                {item.label}
              </span>
              <button
                type="button"
                onClick={() => copy(item.id, item.text)}
                className="text-sm font-semibold text-gold-600 hover:text-gold-500"
              >
                {copied === item.id ? "Copied!" : "Copy"}
              </button>
            </div>
            <p className="mt-3 whitespace-pre-wrap text-xs leading-relaxed text-stone-600">{item.text}</p>
          </div>
        ))}
        {error && <p className="text-sm text-rose-600">{error}</p>}
      </div>
    </div>
  );
}
