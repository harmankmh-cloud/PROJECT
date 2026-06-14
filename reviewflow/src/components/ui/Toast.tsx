"use client";

import { AnimatePresence, motion } from "framer-motion";
import { create } from "zustand";
import { ClientOnly } from "./ClientOnly";

type ToastItem = { id: string; message: string };

type ToastState = {
  toasts: ToastItem[];
  show: (message: string) => void;
  dismiss: (id: string) => void;
};

export const useToast = create<ToastState>((set) => ({
  toasts: [],
  show: (message) => {
    const id = crypto.randomUUID();
    set((s) => ({ toasts: [...s.toasts, { id, message }] }));
    setTimeout(() => {
      set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
    }, 3000);
  },
  dismiss: (id) => set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) })),
}));

function ToastContainer() {
  const { toasts, dismiss } = useToast();

  return (
    <div className="pointer-events-none fixed right-4 top-4 z-[100] flex flex-col gap-2">
      <AnimatePresence>
        {toasts.map((t) => (
          <motion.div
            key={t.id}
            initial={{ opacity: 0, y: -12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8 }}
            className="pointer-events-auto rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-text shadow-lg"
            onClick={() => dismiss(t.id)}
          >
            {t.message}
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}

export function Toaster() {
  return (
    <ClientOnly>
      <ToastContainer />
    </ClientOnly>
  );
}
