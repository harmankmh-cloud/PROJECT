"use client";

import { STAR_OPTIONS, starsLabel } from "@/lib/defaults";

export function PhonePreview() {
  return (
    <div className="relative z-10 mx-auto w-[300px] sm:w-[320px]">
      <div className="relative overflow-hidden rounded-[2.5rem] border-[4px] border-teal-400/40 bg-brand-950 shadow-[0_0_60px_rgba(20,184,166,0.35),0_40px_80px_rgba(0,0,0,0.5)] ring-2 ring-amber-400/20">
        <div className="flex items-center justify-between bg-black px-5 py-3">
          <span className="text-[11px] font-medium text-white/50">9:41</span>
          <div className="h-6 w-28 rounded-full bg-black ring-1 ring-white/15" />
          <span className="text-[10px] text-teal-400">●●●</span>
        </div>
        <div className="bg-gradient-to-b from-slate-50 via-white to-amber-50/30 px-5 pb-8 pt-5">
          <div className="mb-4 flex justify-center gap-1.5">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`h-1.5 rounded-full ${n === 1 ? "w-10 bg-gold-500" : "w-6 bg-slate-200"}`}
              />
            ))}
          </div>
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.28em] text-teal-600">
            Live preview
          </p>
          <p className="font-display mt-2 text-center text-2xl text-brand-950">Mike&apos;s Car Wash</p>
          <p className="mt-1 text-center text-sm text-slate-500">Tap a star rating</p>

          <div className="mt-5 space-y-2.5">
            {STAR_OPTIONS.map((option) => (
              <div
                key={option.stars}
                className={`flex items-center gap-3 rounded-2xl border-2 px-3 py-2.5 ${
                  option.stars === 5
                    ? "border-teal-400/50 bg-gradient-to-r from-teal-50 to-amber-50"
                    : "border-slate-200 bg-white"
                }`}
              >
                <span className="text-base tracking-wider text-gold-500">{starsLabel(option.stars)}</span>
                <span className="text-xs font-semibold text-brand-950">{option.label}</span>
              </div>
            ))}
          </div>

          <div className="btn-gold mt-5 w-full py-3 text-center text-xs font-bold">Copy & open Google</div>
        </div>
      </div>
    </div>
  );
}
