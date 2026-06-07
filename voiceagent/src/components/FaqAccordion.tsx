import { MaterialIcon } from "@/components/MaterialIcon";

export function FaqAccordion({ items }: { items: ReadonlyArray<{ q: string; a: string }> }) {
  return (
    <div className="space-y-4" role="region" aria-label="Frequently asked questions">
      {items.map((item, i) => (
        <details
          key={item.q}
          open={i === 0}
          className="group overflow-hidden rounded-2xl border border-glass-border-subtle bg-surface-container/60"
        >
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-6 py-5 text-sm font-semibold text-ghost-white marker:content-none [&::-webkit-details-marker]:hidden">
            <span>{item.q}</span>
            <MaterialIcon
              name="expand_more"
              className="text-on-surface-variant transition-transform group-open:rotate-180"
            />
          </summary>
          <div className="border-t border-glass-border-subtle px-6 pb-5 pt-4 text-sm leading-relaxed text-on-surface-variant">
            {item.a}
          </div>
        </details>
      ))}
    </div>
  );
}
