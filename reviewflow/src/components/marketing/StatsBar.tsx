import { MARKETING } from "@/content/copy";

export function StatsBar() {
  return (
    <section className="border-y border-border bg-surface py-6">
      <div className="marketing-container flex flex-wrap items-center justify-center gap-8 md:gap-16">
        {MARKETING.statsBar.map((stat) => (
          <div key={stat.label} className="text-center">
            <p className="font-display text-xl text-text md:text-2xl">{stat.value}</p>
            <p className="mt-1 text-sm text-muted">{stat.label}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
