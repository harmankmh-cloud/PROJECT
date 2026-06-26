"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { LANDING_TESTIMONIALS } from "@/lib/marketing-content";
import { Avatar } from "@/components/ui/Avatar";
import { FadeUp } from "@/components/motion/FadeUp";

export function TestimonialsCarousel() {
  const [paused, setPaused] = useState(false);
  const [offset, setOffset] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (paused || LANDING_TESTIMONIALS.length === 0) return;
    const timer = setInterval(() => {
      setOffset((o) => (o + 1) % LANDING_TESTIMONIALS.length);
    }, 4000);
    return () => clearInterval(timer);
  }, [paused]);

  // No fabricated testimonials — hide the section until real reviews exist.
  if (LANDING_TESTIMONIALS.length === 0) return null;

  return (
    <section className="border-t border-border bg-surface/50 px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeUp className="text-center">
          <p className="font-label text-primary">What BC homeowners say</p>
          <h2 className="font-display mt-2 text-3xl font-black text-foreground sm:text-4xl">
            Homeowner stories
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-sm text-muted">
            Representative experiences from early users across British Columbia.
          </p>
        </FadeUp>

        <div
          ref={containerRef}
          className="relative mt-10 overflow-hidden"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
        >
          <div className="flex gap-4">
            {LANDING_TESTIMONIALS.map((t, i) => {
              const isActive = i === offset;
              return (
                <motion.article
                  key={t.id}
                  animate={{
                    opacity: isActive ? 1 : 0.4,
                    scale: isActive ? 1 : 0.95,
                  }}
                  transition={{ duration: 0.4 }}
                  className={`card-glow min-w-full rounded-[14px] border border-border bg-background p-6 shadow-sm sm:min-w-[calc(50%-8px)] lg:min-w-[calc(25%-12px)] ${
                    isActive ? "block" : "hidden sm:block"
                  }`}
                >
                  <div className="flex gap-1">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="mt-4 text-sm leading-relaxed text-muted">&ldquo;{t.quote}&rdquo;</p>
                  <div className="mt-5 flex items-center gap-3">
                    <Avatar name={t.name} size="sm" />
                    <div>
                      <p className="text-sm font-semibold text-foreground">{t.name}</p>
                      <p className="text-xs text-muted">{t.city} · {t.service}</p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>

          <div className="mt-6 flex justify-center gap-2">
            {LANDING_TESTIMONIALS.map((t, i) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setOffset(i)}
                className={`h-2 rounded-full transition-all ${
                  i === offset ? "w-6 bg-primary" : "w-2 bg-border"
                }`}
                aria-label={`Go to testimonial ${i + 1}`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
