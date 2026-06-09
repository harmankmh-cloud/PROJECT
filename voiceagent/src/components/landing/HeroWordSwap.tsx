"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

import { LANDING_COPY } from "@/lib/copy/landing";

const PHRASES = LANDING_COPY.hero.wordSwap;

export function HeroWordSwap() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % PHRASES.length), 2800);
    return () => clearInterval(id);
  }, []);

  return (
    <span className="relative inline-block min-w-[10ch] text-left text-violet-400">
      <AnimatePresence mode="wait">
        <motion.span
          key={PHRASES[index]}
          initial={{ opacity: 0, y: 16, filter: "blur(4px)" }}
          animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          exit={{ opacity: 0, y: -12, filter: "blur(4px)" }}
          transition={{ duration: 0.35 }}
          className="absolute left-0 top-0 whitespace-nowrap"
        >
          {PHRASES[index]}
        </motion.span>
      </AnimatePresence>
      <span className="invisible">{PHRASES[1]}</span>
    </span>
  );
}
