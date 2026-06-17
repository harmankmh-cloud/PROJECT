"use client";

import { motion, useInView } from "framer-motion";
import Link from "next/link";
import {
  BarChart3,
  Building2,
  Calendar,
  FileText,
  Globe,
  MessageSquare,
  Mic,
  Phone,
  Plug,
} from "lucide-react";
import { useRef } from "react";
import { FEATURES_PAGE } from "@/lib/copy/landing";
import { fadeUp, stagger } from "@/lib/motion";
import { GlowCard } from "@/components/ui/GlowCard";

const ICONS = [Phone, Calendar, Mic, Phone, FileText, MessageSquare, Building2, Plug, BarChart3, Globe];

const COMPARISON = [
  { feature: "24/7 availability", greetq: true, human: false, competitor: true },
  { feature: "Books appointments", greetq: true, human: true, competitor: true },
  { feature: "Call transcripts", greetq: true, human: false, competitor: true },
  { feature: "Under $100/mo", greetq: true, human: false, competitor: false },
  { feature: "Never calls in sick", greetq: true, human: false, competitor: true },
  { feature: "English voice (French roadmap)", greetq: "live", human: true, competitor: false },
] as const;

export function FeaturesPageContent() {
  const heroRef = useRef(null);
  const listRef = useRef(null);
  const tableRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const listInView = useInView(listRef, { once: true, margin: "-60px" });
  const tableInView = useInView(tableRef, { once: true, margin: "-60px" });

  return (
    <>
      <motion.section
        ref={heroRef}
        initial={{ opacity: 0, y: 40 }}
        animate={heroInView ? { opacity: 1, y: 0 } : {}}
        transition={{ duration: 0.5 }}
        className="marketing-container py-16 md:py-24"
      >
        <p className="section-eyebrow mb-3">Features</p>
        <h1 className="font-display max-w-3xl text-4xl text-text md:text-5xl">
          Everything your receptionist should do{" "}
          <span className="gradient-text">(but doesn&apos;t)</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          GreetQ handles calls, books appointments, logs transcripts, and integrates with the tools
          you already use — without bathroom breaks or sick days.
        </p>
      </motion.section>

      <motion.div
        ref={listRef}
        className="marketing-container space-y-8 pb-20"
        initial="hidden"
        animate={listInView ? "visible" : "hidden"}
        variants={stagger}
      >
        {FEATURES_PAGE.map((f, i) => {
          const Icon = ICONS[i];
          return (
            <motion.div key={f.slug} variants={fadeUp}>
              <GlowCard className="flex flex-col gap-6 md:flex-row md:items-start">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-violet-600/20 ring-1 ring-violet-500/30">
                  <Icon className="h-7 w-7 text-violet-400" />
                </div>
                <div className="flex-1">
                  <h2 className="font-display text-xl text-text">{f.title}</h2>
                  <p className="mt-2 text-muted">{f.desc}</p>
                  <p className="mt-2 text-sm text-muted">{f.detail}</p>
                  <Link
                    href="/signup"
                    className="mt-3 inline-block text-sm font-semibold text-violet-400 hover:text-violet-300"
                  >
                    Learn more →
                  </Link>
                </div>
              </GlowCard>
            </motion.div>
          );
        })}
      </motion.div>

      <section className="border-t border-border bg-surface/30 py-20">
        <motion.div
          ref={tableRef}
          className="marketing-container"
          initial="hidden"
          animate={tableInView ? "visible" : "hidden"}
          variants={fadeUp}
        >
          <h2 className="font-display mb-8 text-center text-2xl text-text">How GreetQ compares</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th className="p-4 font-medium text-muted">Capability</th>
                  <th className="p-4 font-medium text-violet-400">GreetQ</th>
                  <th className="p-4 font-medium text-muted">Human receptionist</th>
                  <th className="p-4 font-medium text-muted">Generic AI</th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.feature} className="border-b border-border/50">
                    <td className="p-4 text-text">{row.feature}</td>
                    <td className="p-4 text-teal-400">{row.greetq ? "✓" : "—"}</td>
                    <td className="p-4 text-muted">{row.human ? "✓" : "—"}</td>
                    <td className="p-4 text-muted">{row.competitor ? "✓" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </section>
    </>
  );
}
