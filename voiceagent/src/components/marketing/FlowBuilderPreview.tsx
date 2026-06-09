"use client";

import Link from "next/link";
import { GitBranch, MessageCircle, PhoneForwarded, Wrench } from "lucide-react";

const MOCK_NODES = [
  { id: "greet", label: "Greeting", icon: MessageCircle, x: 8, y: 20 },
  { id: "ask", label: "Ask intent", icon: MessageCircle, x: 32, y: 20 },
  { id: "branch", label: "Route", icon: GitBranch, x: 56, y: 20 },
  { id: "book", label: "Book", icon: Wrench, x: 20, y: 55 },
  { id: "faq", label: "FAQ", icon: Wrench, x: 44, y: 55 },
  { id: "transfer", label: "Transfer", icon: PhoneForwarded, x: 68, y: 55 },
] as const;

export function FlowBuilderPreview() {
  return (
    <section className="border-t border-border py-20 md:py-[80px]" id="flow-builder">
      <div className="marketing-container">
        <div className="mb-10 text-center">
          <p className="section-eyebrow mb-3">Flow builder</p>
          <h2 className="font-display text-3xl text-text md:text-4xl">
            Design call logic without code
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            Greet greeting, booking, FAQ lookup, and warm transfer paths in a visual editor — same
            tool you use in the dashboard.
          </p>
        </div>

        <div className="glass-card relative mx-auto max-w-3xl overflow-hidden p-6">
          <div className="mb-4 flex items-center justify-between border-b border-border pb-3">
            <span className="text-xs font-medium text-muted">Inbound booking flow · read-only preview</span>
            <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary-glow">Published</span>
          </div>

          <div className="relative aspect-[16/10] rounded-lg bg-bg/60">
            <svg className="absolute inset-0 h-full w-full" aria-hidden>
              <line x1="18%" y1="28%" x2="34%" y2="28%" stroke="currentColor" className="text-border" strokeWidth="2" />
              <line x1="42%" y1="28%" x2="58%" y2="28%" stroke="currentColor" className="text-border" strokeWidth="2" />
              <line x1="60%" y1="32%" x2="24%" y2="58%" stroke="currentColor" className="text-border" strokeWidth="2" />
              <line x1="60%" y1="32%" x2="48%" y2="58%" stroke="currentColor" className="text-border" strokeWidth="2" />
              <line x1="60%" y1="32%" x2="72%" y2="58%" stroke="currentColor" className="text-border" strokeWidth="2" />
            </svg>

            {MOCK_NODES.map((node) => (
              <div
                key={node.id}
                className="absolute flex items-center gap-1.5 rounded-lg border border-border bg-surface px-2.5 py-1.5 text-xs font-medium text-text shadow-sm"
                style={{ left: `${node.x}%`, top: `${node.y}%`, transform: "translate(-50%, -50%)" }}
              >
                <node.icon className="h-3.5 w-3.5 text-primary-glow" />
                {node.label}
              </div>
            ))}
          </div>

          <div className="mt-6 flex flex-col items-center gap-3 sm:flex-row sm:justify-center">
            <Link href="/signup" className="btn-primary px-6 py-2.5 text-sm">
              Build your flow
            </Link>
            <Link href="/demo" className="btn-secondary px-6 py-2.5 text-sm">
              Explore demo dashboard
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
