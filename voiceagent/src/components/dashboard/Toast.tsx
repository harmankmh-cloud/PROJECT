"use client";

import { useEffect, useState } from "react";
import { MaterialIcon } from "@/components/MaterialIcon";

export type ToastVariant = "success" | "error";

export function Toast({
  message,
  variant = "success",
  onClear,
}: {
  message: string | null;
  variant?: ToastVariant;
  onClear: () => void;
}) {
  const [visible, setVisible] = useState(false);
  const isError = variant === "error";

  useEffect(() => {
    if (!message) return;
    const raf = requestAnimationFrame(() => setVisible(true));
    const timer = setTimeout(() => {
      setVisible(false);
      onClear();
    }, 4000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(timer);
    };
  }, [message, onClear]);

  if (!message) return null;

  return (
    <div
      className={`fixed bottom-24 left-1/2 z-[100] flex max-w-[min(90vw,28rem)] -translate-x-1/2 items-center gap-3 rounded-full border px-6 py-3 shadow-lg transition-all duration-300 md:bottom-8 ${
        isError ? "border-error/30 bg-error/10" : "border-primary/20 glass-panel"
      } ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}
      role={isError ? "alert" : "status"}
    >
      <MaterialIcon
        name={isError ? "error" : "check_circle"}
        filled
        className={isError ? "text-error" : "text-on-tertiary-container"}
      />
      <p className="text-sm font-semibold text-on-surface">{message}</p>
    </div>
  );
}
