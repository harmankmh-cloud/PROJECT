import { Check } from "lucide-react";
import { TRUST_ITEMS } from "@/content/copy";

export function TrustBar() {
  return (
    <section className="border-y border-slate-700/80 bg-surface/50 px-4 py-5 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-center gap-x-6 gap-y-3">
        {TRUST_ITEMS.map((item) => (
          <span key={item} className="inline-flex items-center gap-2 text-sm text-slate-300">
            <Check className="h-4 w-4 text-success" aria-hidden />
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
