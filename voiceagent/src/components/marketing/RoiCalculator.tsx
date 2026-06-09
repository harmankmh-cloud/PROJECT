"use client";

import Link from "next/link";
import { useState } from "react";

const RECEPTIONIST_MONTHLY = 2800;

export function RoiCalculator() {
  const [callsPerMonth, setCallsPerMonth] = useState(400);
  const [avgBookingValue, setAvgBookingValue] = useState(150);
  const missedRate = 0.15;
  const greetqMonthly = 199;

  const missedCalls = Math.round(callsPerMonth * missedRate);
  const recoveredRevenue = missedCalls * avgBookingValue * 0.3;
  const receptionistSavings = RECEPTIONIST_MONTHLY - greetqMonthly;
  const totalSavings = recoveredRevenue + receptionistSavings;

  return (
    <section className="border-t border-border py-20" id="roi">
      <div className="marketing-container">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-3xl text-text">See how much you save</h2>
          <p className="mt-3 text-muted">
            Compare GreetQ to a part-time receptionist and missed-call revenue.
          </p>
        </div>
        <div className="glass-card mx-auto mt-10 max-w-xl p-8">
          <label className="block text-sm text-muted">
            Calls per month
            <input
              type="range"
              min={50}
              max={2000}
              step={50}
              value={callsPerMonth}
              onChange={(e) => setCallsPerMonth(Number(e.target.value))}
              className="mt-2 w-full accent-primary"
            />
            <span className="text-text">{callsPerMonth}</span>
          </label>
          <label className="mt-6 block text-sm text-muted">
            Average booking value ($)
            <input
              type="range"
              min={50}
              max={500}
              step={25}
              value={avgBookingValue}
              onChange={(e) => setAvgBookingValue(Number(e.target.value))}
              className="mt-2 w-full accent-primary"
            />
            <span className="text-text">${avgBookingValue}</span>
          </label>
          <div className="mt-8 rounded-xl border border-primary/30 bg-primary/10 p-6 text-center">
            <p className="text-sm text-muted">Estimated monthly benefit</p>
            <p className="font-display mt-2 text-4xl text-text">
              ${Math.round(totalSavings).toLocaleString()}
            </p>
            <p className="mt-2 text-xs text-muted">
              Includes ~{missedCalls} recovered calls + ${receptionistSavings.toLocaleString()}/mo vs
              part-time receptionist
            </p>
          </div>
          <Link href="/signup" className="btn-primary mt-6 block py-3 text-center">
            Start free trial
          </Link>
        </div>
      </div>
    </section>
  );
}
