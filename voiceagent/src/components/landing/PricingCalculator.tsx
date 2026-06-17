"use client";

import Link from "next/link";
import { useState } from "react";
import {
  COMPETITOR_FLAT_RATE_MONTHLY,
  estimatedMonthly,
  PLANS,
  RECEPTIONIST_BENCHMARK_MONTHLY,
  recommendedPlanKey,
} from "@/lib/plans";
import { TRIAL_MARKETING } from "@/lib/trial";
import {
  matrixCellLabel,
  PRICING_COMPETITOR_MATRIX,
  type MatrixCell,
} from "@/lib/competitor-matrix";

export function PricingCalculator() {
  const [callsPerMonth, setCallsPerMonth] = useState(120);
  const [avgMinutes, setAvgMinutes] = useState(3);

  const estimatedMinutes = Math.round(callsPerMonth * avgMinutes);
  const planKey = recommendedPlanKey(estimatedMinutes);
  const plan = PLANS[planKey];
  const monthlyTotal = estimatedMonthly(planKey, estimatedMinutes);
  const vsReceptionist = RECEPTIONIST_BENCHMARK_MONTHLY - monthlyTotal;
  const vsFlatRate = COMPETITOR_FLAT_RATE_MONTHLY - monthlyTotal;

  return (
    <section className="border-t border-border bg-surface/20 py-16 md:py-20">
      <div className="marketing-container mx-auto max-w-4xl">
        <div className="mb-10 text-center">
          <p className="section-eyebrow mb-3">Estimate your cost</p>
          <h2 className="font-display text-2xl text-text md:text-3xl">
            How much would GreetQ cost for your call volume?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            Based on your inputs and our published plan rates. Overage applies above included minutes.
          </p>
        </div>

        <div className="card-glow rounded-xl border border-border p-6 md:p-8">
          <div className="grid gap-8 md:grid-cols-2">
            <div className="space-y-6">
              <div>
                <label htmlFor="pc-calls" className="flex justify-between text-sm font-medium text-text">
                  Calls per month
                  <span className="text-violet-300">{callsPerMonth}</span>
                </label>
                <input
                  id="pc-calls"
                  type="range"
                  min={10}
                  max={1000}
                  step={10}
                  value={callsPerMonth}
                  onChange={(e) => setCallsPerMonth(Number(e.target.value))}
                  className="mt-2 w-full accent-violet-500"
                />
              </div>
              <div>
                <label htmlFor="pc-length" className="flex justify-between text-sm font-medium text-text">
                  Average call length (minutes)
                  <span className="text-violet-300">{avgMinutes}</span>
                </label>
                <input
                  id="pc-length"
                  type="range"
                  min={1}
                  max={5}
                  step={1}
                  value={avgMinutes}
                  onChange={(e) => setAvgMinutes(Number(e.target.value))}
                  className="mt-2 w-full accent-violet-500"
                />
              </div>
            </div>

            <div className="rounded-xl border border-violet-500/20 bg-violet-500/5 p-6">
              <p className="text-sm text-muted">Estimated usage</p>
              <p className="mt-1 font-display text-3xl text-text">
                {estimatedMinutes.toLocaleString("en-CA")} min/mo
              </p>
              <p className="mt-4 text-sm text-muted">
                Recommended plan:{" "}
                <span className="font-semibold text-violet-300">{plan.name}</span> (
                {plan.includedMinutes.toLocaleString()} min included)
              </p>
              <p className="mt-2 font-display text-4xl text-text">
                ${monthlyTotal.toLocaleString("en-CA")}
                <span className="text-lg text-muted">/mo CAD</span>
              </p>
              <ul className="mt-4 space-y-1.5 text-xs text-muted">
                <li>
                  vs part-time receptionist (~${RECEPTIONIST_BENCHMARK_MONTHLY.toLocaleString("en-CA")}
                  /mo):{" "}
                  <span className={vsReceptionist > 0 ? "text-emerald-400" : "text-muted"}>
                    {vsReceptionist > 0
                      ? `save ~$${vsReceptionist.toLocaleString("en-CA")}/mo`
                      : "receptionist may cost less at very low volume"}
                  </span>
                </li>
                <li>
                  vs flat-rate competitor (~${COMPETITOR_FLAT_RATE_MONTHLY}/mo):{" "}
                  <span className={vsFlatRate > 0 ? "text-emerald-400" : "text-amber-400"}>
                    {vsFlatRate > 0
                      ? `save ~$${vsFlatRate.toLocaleString("en-CA")}/mo`
                      : `~$${Math.abs(vsFlatRate).toLocaleString("en-CA")}/mo more at this volume`}
                  </span>
                </li>
              </ul>
              <Link
                href={`/signup?plan=${planKey}`}
                className="btn-primary mt-6 flex w-full justify-center rounded-full px-5 py-2.5 text-sm font-semibold"
              >
                {TRIAL_MARKETING.cta}
              </Link>
            </div>
          </div>
        </div>

        <CompetitorMatrixTable className="mt-12" />
      </div>
    </section>
  );
}

function CompetitorMatrixTable({ className = "" }: { className?: string }) {
  const { competitors, rows } = PRICING_COMPETITOR_MATRIX;
  const keys: Record<(typeof competitors)[number], keyof (typeof rows)[number]> = {
    GreetQ: "greetq",
    NextPhone: "nextPhone",
    "Smith.ai": "smithAi",
  };

  return (
    <div className={className}>
      <h3 className="mb-4 text-center font-display text-xl text-text">How we compare</h3>
      <div className="overflow-x-auto rounded-xl border border-border">
        <table className="w-full min-w-[560px] text-left text-sm">
          <thead>
            <tr className="border-b border-border bg-surface">
              <th scope="col" className="p-4 font-medium text-muted">
                Feature
              </th>
              {competitors.map((c) => (
                <th
                  key={c}
                  scope="col"
                  className={`p-4 font-medium ${c === "GreetQ" ? "text-violet-400" : "text-muted"}`}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.feature} className="border-b border-border/50">
                <td className="p-4 text-text">{row.feature}</td>
                {competitors.map((c) => {
                  const val = row[keys[c]] as MatrixCell;
                  return (
                    <td
                      key={c}
                      className={`p-4 ${c === "GreetQ" ? "text-teal-400" : "text-muted"}`}
                    >
                      {matrixCellLabel(val)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-3 text-center text-xs text-muted">
        Competitor pricing and features based on public listings — verify before you buy.
      </p>
    </div>
  );
}
