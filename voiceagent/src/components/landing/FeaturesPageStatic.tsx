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
import { FEATURES_PAGE } from "@/lib/copy/landing";

const ICONS = [Phone, Calendar, Mic, Phone, FileText, MessageSquare, Building2, Plug, BarChart3, Globe];

const COMPARISON = [
  { feature: "24/7 availability", greetq: true, human: false, competitor: true },
  { feature: "Books appointments", greetq: true, human: true, competitor: true },
  { feature: "Call transcripts", greetq: true, human: false, competitor: true },
  { feature: "Under $100/mo", greetq: true, human: false, competitor: false },
  { feature: "Never calls in sick", greetq: true, human: false, competitor: true },
  { feature: "English voice (French roadmap)", greetq: "live", human: true, competitor: false },
] as const;

/** Server-rendered features page body for SEO. */
export function FeaturesPageStatic() {
  return (
    <>
      <section className="marketing-container py-16 md:py-24">
        <p className="section-eyebrow mb-3">Features</p>
        <h1 className="font-display max-w-3xl text-4xl text-text md:text-5xl">
          Everything your receptionist should do{" "}
          <span className="gradient-text">(but doesn&apos;t)</span>
        </h1>
        <p className="mt-4 max-w-2xl text-lg text-muted">
          GreetQ handles calls, books appointments, logs transcripts, and integrates with the tools
          you already use — without bathroom breaks or sick days.
        </p>
      </section>

      <div className="marketing-container space-y-8 pb-20">
        {FEATURES_PAGE.map((f, i) => {
          const Icon = ICONS[i];
          return (
            <article
              key={f.slug}
              className="card-glow flex flex-col gap-6 rounded-xl border border-border p-6 md:flex-row md:items-start"
            >
              <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl bg-violet-600/20 ring-1 ring-violet-500/30">
                <Icon className="h-7 w-7 text-violet-400" aria-hidden />
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
            </article>
          );
        })}
      </div>

      <section className="border-t border-border bg-surface/30 py-20">
        <div className="marketing-container">
          <h2 className="font-display mb-8 text-center text-2xl text-text">How GreetQ compares</h2>
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full min-w-[520px] text-left text-sm">
              <thead>
                <tr className="border-b border-border bg-surface">
                  <th scope="col" className="p-4 font-medium text-muted">
                    Capability
                  </th>
                  <th scope="col" className="p-4 font-medium text-violet-400">
                    GreetQ
                  </th>
                  <th scope="col" className="p-4 font-medium text-muted">
                    Human receptionist
                  </th>
                  <th scope="col" className="p-4 font-medium text-muted">
                    Generic AI
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON.map((row) => (
                  <tr key={row.feature} className="border-b border-border/50">
                    <td className="p-4 text-text">{row.feature}</td>
                    <td className="p-4 text-teal-400">
                      {typeof row.greetq === "string" ? row.greetq : row.greetq ? "✓" : "—"}
                    </td>
                    <td className="p-4 text-muted">{row.human ? "✓" : "—"}</td>
                    <td className="p-4 text-muted">{row.competitor ? "✓" : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}
