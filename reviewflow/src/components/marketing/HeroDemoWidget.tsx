"use client";

import { AnimatePresence, motion } from "framer-motion";
import { MessageSquare, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { ClientOnly } from "@/components/ui/ClientOnly";

const STEPS = ["sms", "stars", "prompts"] as const;
type Step = (typeof STEPS)[number];

function DemoSequence() {
  const [step, setStep] = useState<Step>("sms");

  useEffect(() => {
    const interval = setInterval(() => {
      setStep((s) => {
        const i = STEPS.indexOf(s);
        return STEPS[(i + 1) % STEPS.length];
      });
    }, 2800);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative mx-auto max-w-sm">
      <div className="phone-glow-ring absolute inset-0 rounded-[2.5rem]" />
      <div className="relative rounded-[2.5rem] border border-border bg-white p-3 shadow-xl">
        <div className="overflow-hidden rounded-[2rem] bg-surface">
          <AnimatePresence mode="wait">
            {step === "sms" && (
              <motion.div
                key="sms"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="p-5"
              >
                <div className="flex items-center gap-2 text-xs text-muted">
                  <MessageSquare className="h-4 w-4" />
                  Review request SMS
                </div>
                <div className="mt-4 rounded-2xl bg-white p-4 shadow-sm">
                  <p className="text-sm text-text">
                    Hi Sarah! Thanks for visiting Pacific Dental. Rate your experience:
                  </p>
                  <p className="mt-2 text-sm font-semibold text-primary">Rate Your Experience →</p>
                </div>
              </motion.div>
            )}
            {step === "stars" && (
              <motion.div
                key="stars"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="p-5 text-center"
              >
                <p className="text-sm text-muted">How was your visit?</p>
                <div className="mt-4 flex justify-center gap-1">
                  {[1, 2, 3, 4, 5].map((n) => (
                    <motion.div
                      key={n}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: n * 0.15, type: "spring" }}
                    >
                      <Star className="h-8 w-8 fill-star text-star" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
            {step === "prompts" && (
              <motion.div
                key="prompts"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                className="space-y-2 p-5"
              >
                <p className="text-xs font-semibold text-primary">Pick a review prompt</p>
                {[
                  "Dr. Patel was incredibly thorough and kind...",
                  "Best dental experience I've had in years...",
                  "The team made me feel comfortable from start to finish...",
                ].map((text, i) => (
                  <motion.div
                    key={text}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                    className="rounded-xl border border-border bg-white p-3 text-xs text-text"
                  >
                    {text}
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}

export function HeroDemoWidget() {
  return (
    <ClientOnly
      fallback={
        <div className="mx-auto h-[320px] max-w-sm rounded-[2.5rem] border border-border bg-surface" />
      }
    >
      <DemoSequence />
    </ClientOnly>
  );
}
