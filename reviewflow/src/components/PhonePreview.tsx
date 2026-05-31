"use client";

import { STAR_OPTIONS, starsLabel } from "@/lib/defaults";

export function PhonePreview() {
  return (
    <div className="relative mx-auto w-[300px] sm:w-[320px]">
      <div className="absolute -inset-8 rounded-[3rem] bg-gradient-to-br from-teal-400/30 via-amber-400/20 to-brand-950/15 blur-3xl" />
      <div className="relative overflow-hidden rounded-[2.25rem] border-[3px] border-slate-800/90 bg-brand-950 shadow-[0_40px_100px_-20px_rgba(5,8,16,0.55)] ring-1 ring-white/10">
        <div className="flex items-center justify-between bg-gradient-to-r from-brand-950 to-brand-800 px-5 py-3">
          <span className="text-[10px] font-semibold text-white/40">9:41</span>
          <div className="h-5 w-24 rounded-full bg-black/40 ring-1 ring-white/10" />
          <span className="text-[10px] text-white/40">●●●</span>
        </div>
        <div className="bg-gradient-to-b from-cream via-white to-slate-50 px-5 pb-7 pt-5">
          <div className="mb-3 flex justify-center gap-1">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className={`h-1 w-8 rounded-full ${n === 1 ? "bg-gold-500" : "bg-slate-200"}`}
              />
            ))}
          </div>
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.24em] text-teal-600">
            Customer view
          </p>
          <p className="font-display mt-2 text-center text-xl text-brand-950">Mike&apos;s Car Wash</p>
          <p className="mt-1 text-center text-xs text-slate-500">How was your visit?</p>

          <div className="mt-4 space-y-2">
            {STAR_OPTIONS.map((option) => (
              <div
                key={option.stars}
                className={`star-option cursor-default py-2.5 ${
                  option.stars === 5 ? "star-option-highlight" : ""
                }`}
              >
                <span className="text-sm tracking-wider text-gold-500">{starsLabel(option.stars)}</span>
                <span>
                  <span className="block text-xs font-semibold text-brand-950">{option.label}</span>
                  <span className="text-[10px] text-slate-500">{option.subtitle}</span>
                </span>
              </div>
            ))}
          </div>

          <div className="mt-4 rounded-2xl border border-slate-200/80 bg-white p-3.5 shadow-sm">
            <p className="text-[10px] font-bold uppercase tracking-wider text-teal-600">AI draft ready</p>
            <p className="mt-1.5 text-[11px] leading-relaxed text-slate-600">
              Pick wording → edit → copy & post on Google in one tap.
            </p>
          </div>

          <div className="btn-gold mt-4 w-full py-2.5 text-center text-xs">Copy & open Google</div>
        </div>
      </div>
    </div>
  );
}
