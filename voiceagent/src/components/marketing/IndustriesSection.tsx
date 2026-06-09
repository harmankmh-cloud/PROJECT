"use client";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { ClientOnly } from "@/components/ui/ClientOnly";
import { USE_CASES } from "@/lib/marketing-content";

const CHIPS = [
  "Dental Clinics",
  "Law Firms",
  "HVAC",
  "Real Estate",
  "Restaurants",
  "Salons",
  "Property Managers",
  "Contractors",
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
  const [selected, setSelected] = useState<string>(CHIPS[0]);
  const pain = PAIN_POINTS[selected];

  return (
    <section className="border-t border-border py-20 md:py-[80px]" id="industries">
      <div className="marketing-container">
        <div className="mb-8 text-center">
          <p className="section-eyebrow mb-3">Industries</p>
          <h2 className="font-display text-3xl text-text md:text-4xl">Built for your business</h2>
        </div>

        <div className="flex gap-2 overflow-x-auto pb-4 scrollbar-none">
          {CHIPS.map((chip) => (
            <button
              key={chip}
              type="button"
              onClick={() => setSelected(chip)}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium transition ${
                selected === chip
                  ? "bg-primary text-white shadow-[0_0_24px_rgba(99,102,241,0.3)]"
                  : "border border-border bg-surface text-muted hover:text-text"
              }`}
            >
              {chip}
            </button>
          ))}
        </div>

        <ClientOnly
          fallback={
            <div className="glass-card mt-6 p-8">
              <h3 className="font-display text-2xl text-text">{pain.title}</h3>
              <ul className="mt-4 space-y-2">
                {pain.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {p}
                  </li>
                ))}
              </ul>
            </div>
          }
        >
          <AnimatePresence mode="wait">
            <motion.div
              key={selected}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.25 }}
              className="glass-card mt-6 p-8"
            >
              <h3 className="font-display text-2xl text-text">{pain.title}</h3>
              <ul className="mt-4 space-y-2">
                {pain.points.map((p) => (
                  <li key={p} className="flex items-center gap-2 text-sm text-muted">
                    <span className="h-1.5 w-1.5 rounded-full bg-accent" />
                    {p}
                  </li>
                ))}
              </ul>
              {USE_CASES[0] && (
                <p className="mt-6 text-xs text-muted">
                  Example: {USE_CASES[0].outcomeAttribution}
                </p>
              )}
            </motion.div>
          </AnimatePresence>
        </ClientOnly>
      </div>
    </section>
  );
}
