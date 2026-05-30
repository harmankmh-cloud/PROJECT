"use client";

import Link from "next/link";
import { useSyncExternalStore, useState } from "react";

const STORAGE_PRINT = "reviewflow_printed_qr";
const STORAGE_TEXTED = "reviewflow_texted_customer";

function subscribe() {
  return () => undefined;
}

function readFlag(key: string) {
  return localStorage.getItem(key) === "1";
}

function useStoredFlag(key: string) {
  return useSyncExternalStore(subscribe, () => readFlag(key), () => false);
}

export function QuickStartGuide({
  reviewUrl,
  hasGoogleLink,
}: {
  reviewUrl: string;
  hasGoogleLink: boolean;
}) {
  const storedPrinted = useStoredFlag(STORAGE_PRINT);
  const storedTexted = useStoredFlag(STORAGE_TEXTED);
  const [printedMarked, setPrintedMarked] = useState(false);
  const [textedMarked, setTextedMarked] = useState(false);
  const printedDone = storedPrinted || printedMarked;
  const textedDone = storedTexted || textedMarked;

  const steps = [
    { done: true, title: "Account created", detail: "You're signed in to ReviewFlow" },
    {
      done: hasGoogleLink,
      title: "Add Google review link",
      detail: hasGoogleLink ? "Customers can open Google after copying" : "Required for one-click Google posting",
      href: "/dashboard/settings",
      action: "Do this now →",
    },
    {
      done: printedDone,
      title: "Print QR at your counter",
      detail: "Download QR from dashboard → laminate → place visible",
      onMark: () => {
        localStorage.setItem(STORAGE_PRINT, "1");
        setPrintedMarked(true);
      },
      action: "Mark as done",
    },
    {
      done: textedDone,
      title: "Text one customer the link",
      detail: "Copy from Share kit below",
      onMark: () => {
        localStorage.setItem(STORAGE_TEXTED, "1");
        setTextedMarked(true);
      },
      action: "Mark as done",
    },
  ];

  const completed = steps.filter((s) => s.done).length;
  if (completed === steps.length) return null;

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-[#e8e2d9] bg-gold-500/10 px-6 py-4">
        <h2 className="font-display text-lg text-brand-950">Quick-start guide</h2>
        <p className="mt-0.5 text-sm text-stone-600">
          {completed} of {steps.length} complete — about 10 minutes to go live
        </p>
      </div>
      <ol className="divide-y divide-[#e8e2d9]">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-4 px-6 py-4">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                step.done ? "bg-emerald-100 text-emerald-700" : "bg-brand-950 text-gold-400"
              }`}
            >
              {step.done ? "✓" : index + 1}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`font-medium ${step.done ? "text-stone-500 line-through" : "text-brand-950"}`}>
                {step.title}
              </p>
              <p className="mt-0.5 text-sm text-stone-500">{step.detail}</p>
              {!step.done && step.href && (
                <Link href={step.href} className="mt-2 inline-block text-sm font-semibold text-gold-600 hover:underline">
                  {step.action}
                </Link>
              )}
              {!step.done && step.onMark && (
                <button
                  type="button"
                  onClick={step.onMark}
                  className="mt-2 block text-sm font-semibold text-gold-600 hover:underline"
                >
                  {step.action}
                </button>
              )}
            </div>
          </li>
        ))}
      </ol>
      <div className="border-t border-[#e8e2d9] bg-cream px-6 py-3">
        <p className="truncate text-xs text-stone-500">{reviewUrl}</p>
      </div>
    </div>
  );
}
