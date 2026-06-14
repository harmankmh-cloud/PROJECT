"use client";

import { useMemo, useState } from "react";
import { TrendingDown } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { PLANS } from "@/lib/plans";

const INDUSTRY_JOB_VALUES = [
  { label: "HVAC / trades", value: 320 },
  { label: "Dental / clinic", value: 240 },
  { label: "Salon / spa", value: 95 },
  { label: "Legal / professional", value: 450 },
  { label: "Restaurant", value: 60 },
  { label: "Other local business", value: 150 },
] as const;

export function MissedRevenueEstimator() {
  const [missedPerWeek, setMissedPerWeek] = useState(8);
  const [industryIdx, setIndustryIdx] = useState(0);
  const [closeRate, setCloseRate] = useState(30);

  const monthly = useMemo(() => {
    const jobValue = INDUSTRY_JOB_VALUES[industryIdx].value;
    return Math.round(missedPerWeek * 4.3 * jobValue * (closeRate / 100));
  }, [missedPerWeek, industryIdx, closeRate]);

  const net = monthly - PLANS.starter.monthlyPrice;

  return (
    <section className="border-t border-border py-20 md:py-24" id="estimator">
      <div className="marketing-container">
        <div className="mb-10 text-center">
          <p className="section-eyebrow mb-3">The math</p>
          <h2 className="font-display text-3xl text-text md:text-4xl">
            What are missed calls costing you?
          </h2>
        </div>

        <div className="mx-auto grid max-w-4xl gap-8 rounded-xl border border-border bg-surface p-8 lg:grid-cols-2">
          <div className="space-y-6">
            <div>
              <label htmlFor="mre-industry" className="text-sm font-medium text-text">
                Your industry
              </label>
              <select
                id="mre-industry"
                value={industryIdx}
                onChange={(e) => setIndustryIdx(Number(e.target.value))}
                className="mt-2 w-full rounded-lg border border-border bg-bg px-3 py-2.5 text-sm text-text focus:border-violet-500/60 focus:outline-none"
              >
                {INDUSTRY_JOB_VALUES.map((opt, i) => (
                  <option key={opt.label} value={i}>
                    {opt.label} (~${opt.value}/job)
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="mre-missed" className="flex justify-between text-sm font-medium text-text">
                Missed calls per week
                <span className="text-violet-300">{missedPerWeek}</span>
              </label>
              <input
                id="mre-missed"
                type="range"
                min={1}
                max={40}
                value={missedPerWeek}
                onChange={(e) => setMissedPerWeek(Number(e.target.value))}
                className="mt-2 w-full accent-violet-500"
              />
            </div>

            <div>
              <label htmlFor="mre-close" className="flex justify-between text-sm font-medium text-text">
                Calls that would have booked
                <span className="text-violet-300">{closeRate}%</span>
              </label>
              <input
                id="mre-close"
                type="range"
                min={10}
                max={80}
                step={5}
                value={closeRate}
                onChange={(e) => setCloseRate(Number(e.target.value))}
                className="mt-2 w-full accent-violet-500"
              />
            </div>
          </div>

          <div className="flex flex-col justify-center rounded-xl border border-rose-500/20 bg-rose-500/5 p-6 text-center">
            <p className="flex items-center justify-center gap-2 text-sm text-muted">
              <TrendingDown className="h-4 w-4 text-rose-400" />
              Estimated revenue walking away
            </p>
            <p className="mt-3 font-display text-5xl text-text">
              ${monthly.toLocaleString("en-CA")}
              <span className="text-lg text-muted">/mo</span>
            </p>
            {net > 0 ? (
              <p className="mt-4 text-sm text-muted">
                GreetQ starts at ${PLANS.starter.monthlyPrice}/mo — that&apos;s{" "}
                <span className="font-semibold text-emerald-400">
                  ${net.toLocaleString("en-CA")}/mo
                </span>{" "}
                back in your pocket.
              </p>
            ) : null}
            <div className="mt-6">
              <GlowButton href="/signup">Stop the leak — start free</GlowButton>
            </div>
          </div>
        </div>

        <p className="mx-auto mt-6 max-w-2xl text-center text-xs text-muted">
          Estimates based on your inputs and typical job values — your numbers will vary.
        </p>
      </div>
    </section>
  );
}
