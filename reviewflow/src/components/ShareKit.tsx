"use client";

import { useState } from "react";

type Props = {
  businessName: string;
  reviewUrl: string;
};

const templates = (businessName: string, reviewUrl: string) => [
  {
    id: "sms",
    label: "Text message",
    icon: "💬",
    text: `Hi! Thanks for visiting ${businessName}. We'd love your feedback — takes 30 seconds: ${reviewUrl}`,
  },
  {
    id: "email",
    label: "Email follow-up",
    icon: "✉️",
    text: `Subject: How was your visit to ${businessName}?\n\nHi,\n\nThank you for choosing us. If you have a moment, share a quick note about your experience — we'll help you write a Google review if you'd like:\n\n${reviewUrl}\n\nThank you,\n${businessName}`,
  },
  {
    id: "counter",
    label: "Counter sign",
    icon: "📋",
    text: `★ LOVED YOUR VISIT?\nScan here — we'll help you leave a Google review in under a minute.\n\n${reviewUrl}`,
  },
];

export function ShareKit({ businessName, reviewUrl }: Props) {
  const [copied, setCopied] = useState<string | null>(null);
  const items = templates(businessName, reviewUrl);

  async function copy(id: string, text: string) {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(id);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      setCopied(null);
    }
  }

  return (
    <div className="surface-card p-6">
      <h2 className="font-display text-xl text-brand-950">Share kit</h2>
      <p className="mt-1 text-sm text-stone-500">
        Copy-ready messages to get customers to your review page
      </p>
      <div className="mt-5 space-y-3">
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
            <p className="mt-3 whitespace-pre-wrap text-xs leading-relaxed text-stone-600">
              {item.text}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
