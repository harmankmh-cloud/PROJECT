"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { useEffect, useState } from "react";
import { Waveform } from "@/components/ui/Waveform";
import { BRAND } from "@/lib/brand";

const TESTIMONIALS = [
  {
    quote: "GreetQ booked 4 appointments while I was asleep.",
    author: "Dr. Patel",
    business: "Abbotsford Dental",
  },
  {
    quote: "We stopped missing evening calls within the first week.",
    author: "Sarah M.",
    business: "Pacific Dental Group",
  },
  {
    quote: "Setup took an afternoon — sandbox, knowledge, then go live.",
    author: "James K.",
    business: "North Shore HVAC",
  },
] as const;

export function AuthMarketingPanel({ footer }: { footer: string }) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const t = setInterval(() => setIndex((i) => (i + 1) % TESTIMONIALS.length), 5000);
    return () => clearInterval(t);
  }, []);

  const t = TESTIMONIALS[index];

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
      </div>

      <div className="relative">
        <Waveform />
        <p className="mt-4 text-xs text-muted">{footer}</p>
      </div>
    </div>
  );
}
