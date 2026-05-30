"use client";

import { useState } from "react";

type Props = {
  businessName: string;
  reviewUrl: string;
  hasGoogleLink: boolean;
  hasFeedback: boolean;
};

export function SetupChecklist({ businessName, reviewUrl, hasGoogleLink, hasFeedback }: Props) {
  const items = [
    {
      done: true,
      title: "Review page created",
      detail: "Your customer link is live",
    },
    {
      done: hasGoogleLink,
      title: "Google review link added",
      detail: hasGoogleLink
        ? "Customers can jump straight to Google"
        : "Add this in Business profile so reviews actually post",
      href: "/dashboard/settings",
    },
    {
      done: hasFeedback,
      title: "First customer response",
      detail: hasFeedback
        ? "You're collecting real feedback"
        : "Print your QR and place it at checkout",
    },
  ];

  const completed = items.filter((i) => i.done).length;
  const progress = Math.round((completed / items.length) * 100);

  if (completed === items.length) return null;

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-[#e8e2d9] bg-brand-950 px-6 py-4 text-white">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg">Launch checklist</h2>
            <p className="mt-0.5 text-sm text-white/60">
              {completed} of {items.length} done — finish setup for {businessName}
            </p>
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gold-400">{progress}%</p>
          </div>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gold-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <ul className="divide-y divide-[#e8e2d9]">
        {items.map((item) => (
          <li key={item.title} className="flex items-start gap-4 px-6 py-4">
            <span
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                item.done ? "bg-emerald-100 text-emerald-700" : "bg-cream-dark text-stone-400"
              }`}
            >
              {item.done ? "✓" : "○"}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`font-medium ${item.done ? "text-stone-500 line-through" : "text-brand-950"}`}>
                {item.title}
              </p>
              <p className="mt-0.5 text-sm text-stone-500">{item.detail}</p>
              {!item.done && item.href && (
                <a href={item.href} className="mt-2 inline-block text-sm font-semibold text-gold-600 hover:underline">
                  Complete this step →
                </a>
              )}
            </div>
          </li>
        ))}
      </ul>
      <div className="border-t border-[#e8e2d9] bg-cream px-6 py-3">
        <p className="truncate text-xs text-stone-500">Your link: {reviewUrl}</p>
      </div>
    </div>
  );
}
