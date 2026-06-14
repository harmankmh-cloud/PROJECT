import Link from "next/link";
import { ArrowRight, Check, Minus, X } from "lucide-react";
import { COMPARISON_ROWS } from "@/lib/copy/landing";

function Cell({ value }: { value: boolean | string }) {
  if (typeof value === "string") {
    return <span className="text-sm text-text">{value}</span>;
  }
  return value ? (
    <Check className="mx-auto h-4 w-4 text-emerald-400" aria-label="Yes" />
  ) : (
    <X className="mx-auto h-4 w-4 text-rose-400/70" aria-label="No" />
  );
}

export function ComparisonStrip() {
  return (
    <section className="border-t border-border py-20 md:py-24">
      <div className="marketing-container">
        <div className="mb-10 text-center">
          <p className="section-eyebrow mb-3">The honest comparison</p>
          <h2 className="font-display text-3xl text-text md:text-4xl">
            Receptionist. Voicemail. GreetQ.
          </h2>
        </div>

        <div className="mx-auto max-w-3xl overflow-hidden rounded-xl border border-border">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border bg-surface/70 text-sm">
                <th className="px-5 py-4 font-medium text-muted">
                  <Minus className="h-4 w-4 opacity-0" aria-hidden />
                </th>
                <th className="px-4 py-4 text-center font-medium text-muted">Human receptionist</th>
                <th className="px-4 py-4 text-center font-medium text-muted">Voicemail</th>
                <th className="bg-violet-600/10 px-4 py-4 text-center font-semibold text-violet-300">
                  GreetQ
                </th>
              </tr>
            </thead>
            <tbody>
              {COMPARISON_ROWS.map((row) => (
                <tr key={row.label} className="border-b border-border/50 last:border-0">
                  <td className="px-5 py-3.5 text-sm text-text">{row.label}</td>
                  <td className="px-4 py-3.5 text-center text-sm text-muted">
                    <Cell value={row.human} />
                  </td>
                  <td className="px-4 py-3.5 text-center text-sm text-muted">
                    <Cell value={row.voicemail} />
                  </td>
                  <td className="bg-violet-600/10 px-4 py-3.5 text-center">
                    <Cell value={row.greetq} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="mt-8 text-center">
          <Link
            href="/compare"
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-violet-400 transition hover:text-violet-300"
          >
            Compare GreetQ to other AI receptionists
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}
