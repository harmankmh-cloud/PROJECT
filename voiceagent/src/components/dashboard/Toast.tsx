"use client";

import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";

export function Toast({
  message,
  onClear,
}: {
  message: string | null;
  onClear: () => void;
}) {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!message) {
      setVisible(false);
      return;
    }
    setVisible(true);
    const timer = setTimeout(() => {
      setVisible(false);
      onClear();
    }, 3000);
    return () => clearTimeout(timer);
  }, [message, onClear]);

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-24 left-1/2 z-[100] flex -translate-x-1/2 items-center gap-3 rounded-full border border-primary/20 glass-panel px-6 py-3 shadow-lg transition-all duration-300 md:bottom-8 ${
        visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
      role="status"
    >
      <MaterialIcon name="check_circle" filled className="text-on-tertiary-container" />
      <p className="text-sm font-semibold text-on-surface">{message}</p>
    </div>
  );
}
