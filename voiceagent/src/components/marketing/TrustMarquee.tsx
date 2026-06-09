const LOGOS = [
  "Pacific Dental",
  "North Shore HVAC",
  "Glow Studio",
  "Harbour Legal",
  "Fraser Valley Auto",
] as const;

export function TrustMarquee() {
  const items = [...LOGOS, ...LOGOS];

  return (
    <section className="border-y border-border bg-surface/50 py-8">
      <div className="marketing-container mb-4 text-center text-sm text-muted">
        Trusted by businesses across BC
      </div>
      <div className="overflow-hidden">
        <div className="animate-marquee flex w-max gap-12 px-4">
          {items.map((name, i) => (
            <span
              key={`${name}-${i}`}
              className="whitespace-nowrap text-sm font-medium text-muted/60"
            >
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
