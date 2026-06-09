"use client";

import { Star } from "lucide-react";
import { TESTIMONIALS } from "@/content/copy";

function ReviewCard({ t }: { t: (typeof TESTIMONIALS)[number] }) {
  return (
    <div className="card-dark mx-3 w-[320px] shrink-0">
      <div className="flex gap-0.5">
        {Array.from({ length: 5 }).map((_, i) => (
          <Star
            key={i}
            className={`h-4 w-4 ${i < t.rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`}
          />
        ))}
      </div>
      <p className="mt-3 text-sm leading-relaxed text-slate-300">&ldquo;{t.quote}&rdquo;</p>
      <p className="mt-4 text-xs text-slate-500">
        {t.name} · {t.city} · hired {t.trade}
      </p>
    </div>
  );
}

export function SocialProofMarquee() {
  const doubled = [...TESTIMONIALS, ...TESTIMONIALS];

  return (
    <section className="overflow-hidden border-t border-slate-700/80 py-12">
      <p className="font-label mb-6 text-center text-primary">Homeowner reviews</p>
      <div className="flex w-max animate-marquee">
        {doubled.map((t, i) => (
          <ReviewCard key={`${t.name}-${i}`} t={t} />
        ))}
      </div>
    </section>
  );
}
