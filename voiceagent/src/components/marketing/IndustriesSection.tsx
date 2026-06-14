"use client";

import Link from "next/link";
import { useState } from "react";
import { USE_CASES } from "@/lib/marketing-content";

const CHIPS = [
  { label: "Dental Clinics", href: "/dental" },
  { label: "Law Firms", href: "/legal" },
  { label: "HVAC", href: "/hvac" },
  { label: "Real Estate", href: "/real-estate" },
  { label: "Restaurants", href: "/restaurants" },
  { label: "Salons", href: "/salons" },
  { label: "Property Managers", href: "/property-managers" },
  { label: "Contractors", href: "/contractors" },
] as const;

const PAIN_POINTS: Record<string, { title: string; points: string[] }> = {
  "Dental Clinics": {
    title: "Stop losing patients to voicemail",
    points: ["After-hours booking capture", "HIPAA-aware intake routing", "Calendar sync"],
  },
  "Law Firms": {
    title: "Screen every call with full audit trail",
    points: ["Intent logging for follow-up", "Warm transfer to partners", "Compliance records"],
  },
  HVAC: {
    title: "Qualify leads before dispatch",
    points: ["Capture address and urgency", "Quote FAQs from knowledge base", "SMS summary to tech"],
  },
  "Real Estate": {
    title: "Never miss a showing request",
    points: ["Capture buyer intent", "Schedule viewings", "Route to the right agent"],
  },
  Restaurants: {
    title: "Handle reservations while you serve",
    points: ["Table booking during rush", "Hours and menu FAQs", "Large party routing"],
  },
  Salons: {
    title: "Book while stylists stay with clients",
    points: ["After-hours scheduling", "Service-specific booking", "Cancellation handling"],
  },
  "Property Managers": {
    title: "Triage maintenance calls 24/7",
    points: ["Urgent vs routine routing", "Tenant message capture", "On-call escalation"],
  },
  Contractors: {
    title: "Capture job details on first ring",
    points: ["Project scope intake", "Estimate scheduling", "Direct line to owner"],
  },
};

export function IndustriesSection() {
  const [selected, setSelected] = useState<string>(CHIPS[0].label);
  const pain = PAIN_POINTS[selected];
  const activeHref = CHIPS.find((c) => c.label === selected)?.href ?? "/dental";

  return (
    <section className="border-t border-border py-20 md:py-[80px]" id="industries">
      <div className="marketing-container">
        <div className="mb-8 text-center">
          <p className="section-eyebrow mb-3">Industries</p>
          <h2 className="font-display text-3xl text-text md:text-4xl">Built for your business</h2>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
          {CHIPS.map((chip) => (
            <Link
              key={chip.label}
              href={chip.href}
              onClick={() => setSelected(chip.label)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                selected === chip.label
                  ? "bg-primary text-white shadow-[0_0_24px_rgba(99,102,241,0.3)]"
                  : "border border-border bg-surface text-muted hover:text-text"
              }`}
            >
              {chip.label}
            </Link>
          ))}
        </div>

        <div key={selected} className="glass-card mt-6 p-8">
          <h3 className="font-display text-2xl text-text">{pain.title}</h3>
          <ul className="mt-4 space-y-2">
            {pain.points.map((p) => (
              <li key={p} className="flex items-center gap-2 text-sm text-muted">
                <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                {p}
              </li>
            ))}
          </ul>
          <Link href={activeHref} className="mt-6 inline-block text-sm font-medium text-primary-glow hover:underline">
            View {selected} page →
          </Link>
          {USE_CASES[0] && (
            <p className="mt-4 text-xs text-muted">
              Example: {USE_CASES[0].outcomeAttribution}
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
