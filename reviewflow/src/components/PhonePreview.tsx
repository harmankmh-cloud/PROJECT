"use client";

import { STAR_OPTIONS, starsLabel } from "@/lib/defaults";

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
          <p className="mt-1 text-center text-[11px] text-stone-500">Tap your star rating</p>

          <div className="mt-3 space-y-1.5">
            {STAR_OPTIONS.slice(0, 3).map((option) => (
              <div
                key={option.stars}
                className={`flex items-center gap-2 rounded-lg border px-2 py-1.5 ${
                  option.stars === 5
                    ? "border-gold-500 bg-amber-50"
                    : "border-[#e8e2d9] bg-white"
                }`}
              >
                <span className="text-xs tracking-wider text-gold-500">{starsLabel(option.stars)}</span>
                <span className="text-[10px] font-medium text-brand-950">{option.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-xl border border-[#e8e2d9] bg-white p-3">
            <p className="text-[10px] font-bold text-stone-400">3 REVIEW OPTIONS</p>
            <p className="mt-1 text-[10px] leading-relaxed text-stone-600">
              Pick one → edit → copy & post on Google
            </p>
          </div>

          <div className="mt-3 rounded-xl bg-brand-950 py-2.5 text-center text-[10px] font-semibold text-white">
            Copy & open Google ★
          </div>
        </div>
      </div>
    </div>
  );
}
