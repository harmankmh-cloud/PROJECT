"use client";

import { INDUSTRY_OPTIONS } from "@/lib/defaults";

type Props = {
  value: string;
  onChange: (label: string) => void;
};

export function IndustryPicker({ value, onChange }: Props) {
  return (
    <div className="mt-2 max-h-72 overflow-y-auto rounded-2xl border border-slate-200/80 bg-white/60 p-2 shadow-inner backdrop-blur-sm">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {INDUSTRY_OPTIONS.map((industry) => (
          <button
            key={industry.id}
            type="button"
            onClick={() => onChange(industry.label)}
            className={`rounded-2xl border p-2.5 text-left transition duration-200 ${
              value === industry.label
                ? "border-mint-400/60 bg-gradient-to-br from-mint-500/10 to-gold-500/10 shadow-[0_8px_24px_rgba(20,184,166,0.12)] ring-2 ring-mint-400/30"
                : "border-slate-200/80 bg-white hover:border-mint-400/40 hover:shadow-sm"
            }`}
          >
            <span className="text-base">{industry.emoji}</span>
            <p className="mt-0.5 text-xs font-medium leading-snug text-brand-950">{industry.label}</p>
          </button>
        ))}
      </div>
    </div>
  );
}
