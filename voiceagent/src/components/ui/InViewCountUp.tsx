"use client";

import { useInView } from "framer-motion";
import { useRef } from "react";
import { CountUp } from "./CountUp";

export function InViewCountUp({
  value,
  suffix = "",
  decimals,
  className = "",
  label,
}: {
  value: number;
  suffix?: string;
  decimals?: number;
  className?: string;
  label: string;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-40px" });

  const displayValue = decimals !== undefined ? value : Math.round(value);

  return (
    <div ref={ref} className="text-center">
      <p className={`font-display text-3xl text-text md:text-4xl ${className}`}>
        {inView ? (
          decimals !== undefined ? (
            <span>
              {value.toFixed(decimals)}
              {suffix}
            </span>
          ) : (
            <CountUp value={displayValue} suffix={suffix} />
          )
        ) : (
          <span>
            0{suffix}
          </span>
        )}
      </p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  );
}
