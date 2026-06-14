/** Always-visible FAQ — no collapse, so answers render for all users and crawlers. */
export function FaqAccordion({ items }: { items: ReadonlyArray<{ q: string; a: string }> }) {
  return (
    <div className="space-y-4" role="region" aria-label="Frequently asked questions">
      {items.map((item) => (
        <article
          key={item.q}
          className="rounded-2xl border border-glass-border-subtle bg-surface-container/60 px-6 py-5"
        >
          <h3 className="text-base font-semibold text-ghost-white">{item.q}</h3>
          <p className="mt-3 text-sm leading-relaxed text-on-surface-variant">{item.a}</p>
        </article>
      ))}
    </div>
  );
}
