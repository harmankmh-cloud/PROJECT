"use client";

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
      <span key={PHRASES[index]} className="word-swap-in absolute left-0 top-0 whitespace-nowrap">
        {PHRASES[index]}
      </span>
      <span className="invisible">{PHRASES[1]}</span>
    </span>
  );
}
