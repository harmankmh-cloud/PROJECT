"use client";

import { createContext, useCallback, useContext, useMemo, useState } from "react";
import { Toast, type ToastVariant } from "@/components/dashboard/Toast";

type ToastState = {
  message: string;
  variant: ToastVariant;
};

type ToastContextValue = {
  showToast: (message: string, variant?: ToastVariant) => void;
  showError: (message: string) => void;
  showSuccess: (message: string) => void;
};

const ToastContext = createContext<ToastContextValue | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toast, setToast] = useState<ToastState | null>(null);

  const clearToast = useCallback(() => setToast(null), []);

  const value = useMemo<ToastContextValue>(
    () => ({
      showToast: (message, variant = "success") => setToast({ message, variant }),
      showError: (message) => setToast({ message, variant: "error" }),
      showSuccess: (message) => setToast({ message, variant: "success" }),
    }),
    []
  );

  return (
    <ToastContext.Provider value={value}>
      {children}
      <Toast message={toast?.message ?? null} variant={toast?.variant ?? "success"} onClear={clearToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error("useToast must be used within ToastProvider");
  }
  return ctx;
}
