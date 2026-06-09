"use client";

import { motion } from "framer-motion";
import { ClientOnly } from "./ClientOnly";

const BARS = 12;

function WaveformBars({ className = "" }: { className?: string }) {
  return (
    <div className={`flex h-8 items-end justify-center gap-1 ${className}`} aria-hidden>
      {Array.from({ length: BARS }).map((_, i) => (
        <motion.div
          key={i}
          className="w-1 rounded-full bg-accent shadow-[0_0_8px_rgba(34,211,238,0.6)]"
          animate={{ height: ["20%", "100%", "40%", "80%", "20%"] }}
          transition={{
            duration: 1.2,
            repeat: Infinity,
            delay: i * 0.08,
            ease: "easeInOut",
          }}
          style={{ height: "40%" }}
        />
      ))}
    </div>
  );
}

function WaveformStatic({ className = "" }: { className?: string }) {
  return (
    <div className={`flex h-8 items-end justify-center gap-1 ${className}`} aria-hidden>
      {Array.from({ length: BARS }).map((_, i) => (
        <div
          key={i}
          className="w-1 rounded-full bg-accent shadow-[0_0_8px_rgba(34,211,238,0.6)]"
          style={{ height: `${30 + (i % 3) * 20}%` }}
        />
      ))}
    </div>
  );
}

export function Waveform({ className = "" }: { className?: string }) {
  return (
    <ClientOnly fallback={<WaveformStatic className={className} />}>
      <WaveformBars className={className} />
    </ClientOnly>
  );
}
