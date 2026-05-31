"use client";

import { STAR_OPTIONS, starsLabel } from "@/lib/defaults";

export function PhonePreview() {
  return (
    <div className="relative mx-auto w-[280px]">
      <div className="absolute -inset-6 rounded-[2.75rem] bg-gradient-to-br from-mint-400/25 via-gold-500/20 to-brand-950/10 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2rem] border border-white/20 bg-brand-950 shadow-[0_30px_80px_rgba(7,11,20,0.45)]">
        <div className="flex items-center justify-center bg-gradient-to-r from-brand-950 to-brand-900 py-2.5">
          <div className="h-1.5 w-16 rounded-full bg-white/20" />
        </div>
        <div className="bg-gradient-to-b from-cream to-white px-4 pb-6 pt-4">
          <p className="text-center text-[10px] font-semibold uppercase tracking-[0.2em] text-slate-400">
            Customer view
          </p>
          <p className="font-display mt-2 text-center text-lg text-brand-950">Mike&apos;s Car Wash</p>
          <p className="mt-1 text-center text-[11px] text-slate-500">Tap your star rating</p>

          <div className="mt-3 space-y-1.5">
            {STAR_OPTIONS.slice(0, 3).map((option) => (
              <div
                key={option.stars}
                className={`flex items-center gap-2 rounded-xl border px-2.5 py-2 ${
                  option.stars === 5
                    ? "border-mint-400/50 bg-gradient-to-r from-mint-500/10 to-gold-500/10"
                    : "border-slate-200/80 bg-white"
                }`}
              >
                <span className="text-xs tracking-wider text-gold-500">{starsLabel(option.stars)}</span>
                <span className="text-[10px] font-medium text-brand-950">{option.label}</span>
              </div>
            ))}
          </div>

          <div className="mt-3 rounded-2xl border border-slate-200/80 bg-white p-3 shadow-sm">
            <p className="text-[10px] font-bold tracking-wide text-slate-400">3 REVIEW OPTIONS</p>
            <p className="mt-1 text-[10px] leading-relaxed text-slate-600">
              Pick one → edit → copy & post on Google
            </p>
          </div>

          <div className="btn-gold mt-3 w-full py-2 text-center text-[10px]">Copy & open Google</div>
        </div>
      </div>
    </div>
  );
}
