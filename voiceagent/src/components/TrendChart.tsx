"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function TrendChart({
  data,
  valueKey,
  label,
}: {
  data: Array<{ date: string; [key: string]: string | number | null }>;
  valueKey: string;
  label: string;
}) {
  const [animate, setAnimate] = useState(false);
  const values = data.map((d) => Number(d[valueKey]) || 0);
  const max = Math.max(...values, 1);

  useEffect(() => {
    const t = requestAnimationFrame(() => setAnimate(true));
    return () => cancelAnimationFrame(t);
  }, [data, valueKey]);

  if (!data.length) {
    return <p className="text-sm text-muted">No data for this period.</p>;
  }

  return (
    <div>
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">{label}</p>
      <div className="flex h-32 items-end gap-1">
        {data.map((row, i) => {
          const value = Number(row[valueKey]) || 0;
          const height = Math.max(4, Math.round((value / max) * 100));
          return (
            <div key={row.date} className="group flex flex-1 flex-col items-center gap-1">
              <motion.div
                className="w-full rounded-t-md bg-gradient-to-t from-teal-700 to-teal-400 group-hover:from-teal-800"
                initial={{ height: 0 }}
                animate={{ height: animate ? `${height}%` : 0 }}
                transition={{ duration: 0.5, delay: i * 0.03, ease: [0.22, 1, 0.36, 1] }}
                title={`${row.date}: ${value}`}
              />
              <span className="hidden text-[10px] text-muted sm:block">
                {row.date.slice(5)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
