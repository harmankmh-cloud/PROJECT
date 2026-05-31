"use client";

import { INDUSTRY_OPTIONS } from "@/lib/defaults";

type Props = {
  value: string;
  onChange: (label: string) => void;
};

export function IndustryPicker({ value, onChange }: Props) {
  return (
    <div className="mt-2 max-h-72 overflow-y-auto rounded-xl border border-[#e8e2d9] bg-cream p-2">
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
        {INDUSTRY_OPTIONS.map((industry) => (
          <button
            key={industry.id}
            type="button"
            onClick={() => onChange(industry.label)}
            className={`rounded-xl border p-2.5 text-left transition ${
              value === industry.label
                ? "border-gold-500 bg-amber-50 ring-2 ring-gold-500/30"
                : "border-[#e8e2d9] bg-white hover:border-gold-500/40"
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
