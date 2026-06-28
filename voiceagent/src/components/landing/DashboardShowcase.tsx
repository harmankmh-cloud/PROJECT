"use client";

import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Phone, Smile, TrendingUp } from "lucide-react";
import { useState } from "react";

const TABS = ["Analytics", "Call log", "Sentiment"] as const;
type Tab = (typeof TABS)[number];

function Bar({ height, accent }: { height: number; accent?: boolean }) {
  return (
    <motion.div
      className={`w-full rounded-t ${accent ? "bg-violet-500" : "bg-violet-500/30"}`}
      initial={{ height: 0 }}
      whileInView={{ height: `${height}%` }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    />
  );
}

function AnalyticsTab() {
  const bars = [42, 58, 45, 70, 62, 88, 76];
  return (
    <div className="grid gap-4 p-5 sm:grid-cols-3">
      {[
        { label: "Calls this week", value: "147", icon: <Phone className="h-4 w-4 text-violet-400" /> },
        { label: "Booked", value: "38", icon: <TrendingUp className="h-4 w-4 text-teal-400" /> },
        { label: "Avg quality", value: "91", icon: <Smile className="h-4 w-4 text-emerald-400" /> },
      ].map((stat) => (
        <div key={stat.label} className="rounded-lg border border-border/60 bg-bg/50 p-4">
          <div className="flex items-center gap-2 text-xs text-muted">
            {stat.icon}
            {stat.label}
          </div>
          <p className="mt-2 font-display text-2xl text-text">{stat.value}</p>
        </div>
      ))}
      <div className="sm:col-span-3">
        <p className="mb-2 text-xs text-muted">Call volume — last 7 days</p>
        <div className="flex h-32 items-end gap-2 rounded-lg border border-border/60 bg-bg/50 p-3">
          {bars.map((h, i) => (
            <Bar key={i} height={h} accent={i === 5} />
          ))}
        </div>
      </div>
    </div>
  );
}

const CALL_ROWS = [
  { from: "(604) 555-0132", intent: "Book appointment", sentiment: "Positive", tone: "text-emerald-400", time: "4:12 PM" },
  { from: "(778) 555-0190", intent: "Pricing question", sentiment: "Neutral", tone: "text-muted", time: "3:47 PM" },
  { from: "(236) 555-0144", intent: "Reschedule", sentiment: "Positive", tone: "text-emerald-400", time: "2:15 PM" },
  { from: "(604) 555-0577", intent: "Urgent — escalated", sentiment: "Negative", tone: "text-rose-400", time: "1:02 PM" },
] as const;

function CallLogTab() {
  return (
    <div className="p-5">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="text-xs text-muted">
            <th className="pb-3 font-medium">Caller</th>
            <th className="pb-3 font-medium">Intent</th>
            <th className="hidden pb-3 font-medium sm:table-cell">Sentiment</th>
            <th className="pb-3 text-right font-medium">Time</th>
          </tr>
        </thead>
        <tbody>
          {CALL_ROWS.map((row) => (
            <tr key={row.from} className="border-t border-border/50">
              <td className="py-3 text-text">{row.from}</td>
              <td className="py-3 text-muted">{row.intent}</td>
              <td className={`hidden py-3 sm:table-cell ${row.tone}`}>{row.sentiment}</td>
              <td className="py-3 text-right text-muted">{row.time}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SentimentTab() {
  const rows = [
    { label: "Positive", pct: 68, color: "bg-emerald-500" },
    { label: "Neutral", pct: 24, color: "bg-violet-400" },
    { label: "Negative", pct: 8, color: "bg-rose-500" },
  ];
  return (
    <div className="space-y-5 p-6">
      {rows.map((row) => (
        <div key={row.label}>
          <div className="mb-1.5 flex justify-between text-sm">
            <span className="text-text">{row.label}</span>
            <span className="text-muted">{row.pct}%</span>
          </div>
          <div className="h-2.5 overflow-hidden rounded-full bg-bg/70">
            <motion.div
              className={`h-full rounded-full ${row.color}`}
              initial={{ width: 0 }}
              whileInView={{ width: `${row.pct}%` }}
              viewport={{ once: true }}
              transition={{ duration: 0.7, ease: "easeOut" }}
            />
          </div>
        </div>
      ))}
      <p className="pt-1 text-xs text-muted">
        Spot unhappy callers without listening to a single recording.
      </p>
    </div>
  );
}

export function DashboardShowcase() {
  const [tab, setTab] = useState<Tab>("Analytics");

  return (
    <section className="border-t border-border py-20 md:py-24" id="dashboard">
      <div className="marketing-container">
        <div className="mb-10 text-center">
          <p className="section-eyebrow mb-3">The dashboard</p>
          <h2 className="font-display text-3xl text-text md:text-4xl">
            See every call. Skip every recording.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Illustrative product preview — sample call volume, intents, sentiment, and quality
            scores in one view.
          </p>
        </div>

        <motion.div
          className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-border bg-surface shadow-[0_0_60px_rgba(124,58,237,0.12),0_24px_64px_rgba(0,0,0,0.45)]"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-1.5 border-b border-border/60 px-4 py-3">
            <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
            <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
            <span className="ml-3 rounded-md bg-bg/60 px-3 py-1 text-xs text-muted">
              greetq.com/dashboard
            </span>
          </div>

          <div className="flex gap-1 border-b border-border/60 px-4 pt-3" role="tablist">
            {TABS.map((t) => (
              <button
                key={t}
                type="button"
                role="tab"
                aria-selected={tab === t}
                onClick={() => setTab(t)}
                className={`rounded-t-lg px-4 py-2 text-sm transition ${
                  tab === t
                    ? "border-b-2 border-violet-500 font-medium text-text"
                    : "text-muted hover:text-text"
                }`}
              >
                {t}
              </button>
            ))}
          </div>

          <div className="min-h-[280px]">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {tab === "Analytics" ? <AnalyticsTab /> : tab === "Call log" ? <CallLogTab /> : <SentimentTab />}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>

        <div className="mt-8 text-center">
          <Link
            href="/demo"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-400 transition hover:text-violet-300"
          >
            Explore the live demo dashboard
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
