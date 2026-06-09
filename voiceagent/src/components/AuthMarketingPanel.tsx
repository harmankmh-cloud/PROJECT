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
}));

function TestimonialCard({ quote, author, business }: { quote: string; author: string; business: string }) {
  return (
    <blockquote className="glass-card p-6">
      <p className="text-lg text-text">&ldquo;{quote}&rdquo;</p>
      <footer className="mt-4 text-sm text-muted">
        — {author}, {business}
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
      <motion.blockquote
        key={index}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35 }}
        className="glass-card p-6"
      >
        <p className="text-lg text-text">&ldquo;{t.quote}&rdquo;</p>
        <footer className="mt-4 text-sm text-muted">
          — {t.author}, {t.business}
        </footer>
      </motion.blockquote>
    </AnimatePresence>
  );
}

export function AuthMarketingPanel({ footer }: { footer: string }) {
  const first = TESTIMONIALS[0];

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

      <div className="relative min-h-[140px]">
        <ClientOnly
          fallback={<TestimonialCard quote={first.quote} author={first.author} business={first.business} />}
        >
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
