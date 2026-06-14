"use client";

import { useEffect, useRef, useState } from "react";
import { useSyncExternalStore } from "react";

function subscribe() {
  return () => {};
}

export function CountUp({
  value,
  duration = 800,
  suffix = "",
  className = "",
}: {
  value: number;
  duration?: number;
  suffix?: string;
  className?: string;
}) {
  const mounted = useSyncExternalStore(subscribe, () => true, () => false);
  const [display, setDisplay] = useState(value);
  const prevValue = useRef(value);

  useEffect(() => {
    if (!mounted) return;
    if (prevValue.current === value) return;
    prevValue.current = value;

    const start = performance.now();
    let frame: number;

    const tick = (now: number) => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setDisplay(Math.round(value * eased));
      if (progress < 1) frame = requestAnimationFrame(tick);
    };

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [value, duration, mounted]);

  const shown = mounted ? display : value;

  return (
    <span className={className}>
      {shown.toLocaleString()}
      {suffix}
    </span>
  );
}
