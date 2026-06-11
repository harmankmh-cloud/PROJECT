"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, FileCheck2, Lock, ScrollText, ShieldCheck, Smile } from "lucide-react";
import { FEATURE_SPOTLIGHTS } from "@/lib/copy/landing";
import { fadeUp, stagger } from "@/lib/motion";

function CallCardArtifact() {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-text">Inbound · (604) 555-0132</p>
          <p className="text-xs text-muted">Today 4:12 PM · 2m 41s</p>
        </div>
        <span className="flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-2.5 py-1 text-xs font-medium text-emerald-400">
          <Smile className="h-3.5 w-3.5" /> Positive
        </span>
      </div>
      <div className="mt-4 rounded-lg bg-bg/60 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">AI summary</p>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          Caller requested a teeth cleaning for next week and asked about insurance coverage. Booked
          Tuesday 2:00 PM with Dr. Chen. Wants a reminder text the day before.
        </p>
      </div>
      <div className="mt-3 space-y-1.5">
        <p className="text-xs font-semibold uppercase tracking-wide text-violet-300">Action items</p>
        {["Confirm Pacific Blue Cross coverage", "Send reminder SMS Monday"].map((item) => (
          <p key={item} className="flex items-center gap-2 text-sm text-text">
            <FileCheck2 className="h-3.5 w-3.5 text-teal-400" /> {item}
          </p>
        ))}
      </div>
      <div className="mt-4 flex items-center justify-between border-t border-border/60 pt-3 text-xs text-muted">
        <span>
          Intent: <span className="text-text">Book appointment</span>
        </span>
        <span>
          Quality: <span className="font-semibold text-emerald-400">94/100</span>
        </span>
      </div>
    </div>
  );
}

function SmsThreadArtifact() {
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
      <p className="text-xs text-muted">Text thread · just now</p>
      <div className="mt-3 space-y-3">
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-bg/70 p-3 text-sm text-text">
          Hi Sarah! You&apos;re confirmed for Tuesday, Jun 16 at 2:00 PM with Dr. Chen. Reply C to
          change. — GreetQ for Lakeside Dental
        </div>
        <div className="ml-auto max-w-[60%] rounded-2xl rounded-tr-sm bg-violet-600/80 p-3 text-sm text-white">
          Perfect, thank you!
        </div>
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm bg-bg/70 p-3 text-sm text-text">
          You&apos;re welcome! We&apos;ll text a reminder the day before. 🦷
        </div>
      </div>
    </div>
  );
}

const CODE_SAMPLE = `curl https://greetq.com/api/v1/calls \\
  -H "Authorization: Bearer $GREETQ_API_KEY"

{
  "calls": [{
    "direction": "inbound",
    "summary": "Caller booked a cleaning…",
    "sentiment": "positive",
    "intent": "book_appointment",
    "action_items": ["Confirm insurance"],
    "score": 94
  }]
}`;

function CodeArtifact() {
  return (
    <div className="overflow-hidden rounded-xl border border-border bg-[#0d0d12] shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
      <div className="flex items-center gap-1.5 border-b border-border/60 px-4 py-2.5">
        <span className="h-2.5 w-2.5 rounded-full bg-rose-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-500/70" />
        <span className="h-2.5 w-2.5 rounded-full bg-emerald-500/70" />
        <span className="ml-2 text-xs text-muted">GET /api/v1/calls</span>
      </div>
      <pre className="overflow-x-auto p-4 text-[13px] leading-relaxed text-violet-200">
        <code>{CODE_SAMPLE}</code>
      </pre>
    </div>
  );
}

function SecurityArtifact() {
  const items = [
    { icon: <ShieldCheck className="h-4 w-4 text-emerald-400" />, label: "PIPEDA-aligned handling", sub: "Org-scoped isolation, export & deletion" },
    { icon: <ScrollText className="h-4 w-4 text-violet-300" />, label: "Full audit trail", sub: "Settings, team, and API changes logged" },
    { icon: <Lock className="h-4 w-4 text-teal-400" />, label: "CASL outbound controls", sub: "Consent records + quiet hours" },
    { icon: <Check className="h-4 w-4 text-emerald-400" />, label: "HIPAA mode (Enterprise)", sub: "Signed BAA for US healthcare" },
  ];
  return (
    <div className="rounded-xl border border-border bg-surface p-5 shadow-[0_8px_40px_rgba(0,0,0,0.35)]">
      <div className="space-y-3">
        {items.map((item) => (
          <div key={item.label} className="flex items-start gap-3 rounded-lg bg-bg/60 p-3">
            <span className="mt-0.5">{item.icon}</span>
            <div>
              <p className="text-sm font-medium text-text">{item.label}</p>
              <p className="text-xs text-muted">{item.sub}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const ARTIFACTS = {
  "call-card": <CallCardArtifact />,
  "sms-thread": <SmsThreadArtifact />,
  code: <CodeArtifact />,
  security: <SecurityArtifact />,
} as const;

export function FeatureSpotlight() {
  return (
    <section className="border-t border-border py-20 md:py-24" id="intelligence">
      <div className="marketing-container">
        <div className="mb-14 text-center">
          <p className="section-eyebrow mb-3">Under the hood</p>
          <h2 className="font-display text-3xl text-text md:text-4xl">
            Not just answered. Understood.
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-muted">
            Every GreetQ plan includes the intelligence layer competitors charge extra for.
          </p>
        </div>

        <div className="space-y-20">
          {FEATURE_SPOTLIGHTS.map((spotlight, i) => (
            <motion.div
              key={spotlight.id}
              id={spotlight.id}
              className={`grid items-center gap-10 lg:grid-cols-2 lg:gap-16 ${
                i % 2 === 1 ? "lg:[&>*:first-child]:order-2" : ""
              }`}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-80px" }}
              variants={stagger}
            >
              <motion.div variants={fadeUp} transition={{ duration: 0.45 }}>
                <p className="section-eyebrow mb-3">{spotlight.eyebrow}</p>
                <h3 className="font-display text-2xl text-text md:text-3xl">{spotlight.title}</h3>
                <p className="mt-4 text-muted">{spotlight.desc}</p>
                <ul className="mt-5 space-y-2.5">
                  {spotlight.bullets.map((bullet) => (
                    <li key={bullet} className="flex items-center gap-2.5 text-sm text-text">
                      <Check className="h-4 w-4 shrink-0 text-violet-400" />
                      {bullet}
                    </li>
                  ))}
                </ul>
                <Link
                  href={spotlight.cta.href}
                  className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-violet-400 transition hover:text-violet-300"
                >
                  {spotlight.cta.label}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </motion.div>
              <motion.div variants={fadeUp} transition={{ duration: 0.45 }}>
                {ARTIFACTS[spotlight.artifact]}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
