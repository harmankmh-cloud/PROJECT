"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { ClientOnly } from "@/components/ui/ClientOnly";
import { Waveform } from "@/components/ui/Waveform";
import { BRAND } from "@/lib/brand";
import { TESTIMONIALS } from "@/lib/marketing-content";

const AUTH_TESTIMONIALS = TESTIMONIALS.map((t) => ({
  quote: t.quote,
  author: t.name,
  business: t.company,
  location: "location" in t ? (t as { location?: string }).location : undefined,
  caseStudyHref: "caseStudyHref" in t ? (t as { caseStudyHref?: string }).caseStudyHref : undefined,
}));

function TestimonialCard({
  quote,
  author,
  business,
  location,
  caseStudyHref,
}: {
  quote: string;
  author: string;
  business: string;
  location?: string;
  caseStudyHref?: string;
}) {
  return (
    <blockquote className="glass-card p-6">
      <p className="text-lg text-text">&ldquo;{quote}&rdquo;</p>
      <footer className="mt-4 flex items-center gap-3 text-sm text-muted">
        <div
          className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-violet-600/30 text-xs font-semibold text-violet-200"
          aria-hidden
        >
          {author
            .split(" ")
            .map((p) => p[0])
            .join("")
            .slice(0, 2)}
        </div>
        <div>
          <p>
            — {author}, {business}
            {location ? ` · ${location}` : ""}
          </p>
          {caseStudyHref ? (
            <Link href={caseStudyHref} className="mt-1 inline-block font-semibold text-violet-400 hover:text-violet-300">
              Read the full story →
            </Link>
          ) : null}
        </div>
      </footer>
    </blockquote>
  );
}

function RotatingTestimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % AUTH_TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const t = AUTH_TESTIMONIALS[index];

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={index}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35 }}
      >
        <TestimonialCard {...t} />
      </motion.div>
    </AnimatePresence>
  );
}

export function AuthMarketingPanel({ footer }: { footer: string }) {
  const first = AUTH_TESTIMONIALS[0];

  return (
    <div className="relative hidden w-[45%] flex-col justify-between overflow-hidden bg-gradient-to-br from-indigo-950 via-bg to-bg p-10 lg:flex">
      <div className="hero-glow left-0 top-0 h-80 w-80 bg-primary/20" />
      <div className="hero-glow bottom-0 right-0 h-72 w-72 bg-accent/10" />

      <div className="relative">
        <Link href="/" className="flex items-center gap-2 font-display text-xl text-text">
          <Sparkles className="h-5 w-5 text-primary-glow" />
          {BRAND.name}
        </Link>
        <p className="mt-2 text-sm text-muted">AI receptionist for Canadian businesses</p>
      </div>

      <div className="relative min-h-[160px]">
        <ClientOnly fallback={<TestimonialCard {...first} />}>
          <RotatingTestimonials />
        </ClientOnly>
      </div>

      <div className="relative">
        <Waveform />
        <p className="mt-4 text-xs text-muted">{footer}</p>
      </div>
    </div>
  );
}

/** Compact testimonial shown below auth forms on mobile. */
export function AuthMobileTestimonial() {
  const t = AUTH_TESTIMONIALS[0];
  return (
    <div className="mt-8 lg:hidden">
      <TestimonialCard {...t} />
    </div>
  );
}
