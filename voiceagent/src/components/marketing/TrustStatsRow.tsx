import { TRUST_STATS } from "@/lib/marketing-content";

export function TrustStatsRow() {
  return (
    <section className="border-b border-border py-10">
      <div className="marketing-container">
        <div className="grid grid-cols-2 gap-6 md:grid-cols-4">
          {TRUST_STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <p className="font-display text-3xl text-text md:text-4xl">{stat.value}</p>
              <p className="mt-1 text-sm font-medium text-muted">{stat.label}</p>
              {"note" in stat && stat.note && (
                <p className="mt-0.5 text-xs text-muted/70">{stat.note}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
