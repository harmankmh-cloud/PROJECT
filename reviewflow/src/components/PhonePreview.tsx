"use client";

import { EXPERIENCE_OPTIONS } from "@/lib/defaults";

export function PhonePreview() {
  return (
    <div className="relative mx-auto w-[280px]">
      <div className="absolute -inset-4 rounded-[2.5rem] bg-gradient-to-br from-gold-500/20 to-brand-950/10 blur-2xl" />
      <div className="relative overflow-hidden rounded-[2rem] border-[6px] border-brand-950 bg-brand-950 shadow-2xl">
        <div className="flex items-center justify-center bg-brand-950 py-2">
          <div className="h-1.5 w-16 rounded-full bg-white/20" />
        </div>
        <div className="bg-cream px-4 pb-6 pt-4">
          <p className="text-center text-[10px] font-semibold uppercase tracking-widest text-stone-400">
            Customer view
          </p>
          <p className="font-display mt-2 text-center text-lg text-brand-950">Mike&apos;s Car Wash</p>
          <p className="mt-1 text-center text-[11px] text-stone-500">How was your visit?</p>

          <div className="mt-4 grid grid-cols-2 gap-2">
            {EXPERIENCE_OPTIONS.map((option) => (
              <div
                key={option.level}
                className={`rounded-xl border px-2 py-2.5 text-center ${
                  option.level === "great"
                    ? "border-amber-300 bg-amber-50 ring-2 ring-amber-400"
                    : "border-[#e8e2d9] bg-white"
                }`}
              >
                <span className="text-lg">{option.emoji}</span>
                <p className="mt-0.5 text-[10px] font-semibold text-brand-950">{option.label}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-xl border border-[#e8e2d9] bg-white p-3">
            <p className="text-[10px] text-stone-400">AI review draft</p>
            <p className="mt-1 text-[11px] leading-relaxed text-stone-600">
              &ldquo;Fast, spotless wash and friendly team. Best car wash in town — highly
              recommend.&rdquo;
            </p>
          </div>

          <div className="mt-3 rounded-xl bg-brand-950 py-2.5 text-center text-[11px] font-semibold text-white">
            Copy & open Google
          </div>
        </div>
      </div>
    </div>
  );
}
