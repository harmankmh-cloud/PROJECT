"use client";

import { motion } from "framer-motion";
import { CheckCircle2, ClipboardList, Users } from "lucide-react";
import { FadeUp } from "@/components/motion/FadeUp";
import { StaggerGrid, StaggerItem } from "@/components/motion/StaggerGrid";

const STEPS = [
  {
    step: "1",
    title: "Describe Your Project",
    body: "Tell us what you need — service type, location, and timeline. Takes under 2 minutes.",
    icon: ClipboardList,
  },
  {
    step: "2",
    title: "Get Matched with Local Pros",
    body: "We send your request to up to 5 verified pros in your area. Compare quotes side by side.",
    icon: Users,
  },
  {
    step: "3",
    title: "Book, Pay, Done",
    body: "Pick your pro, book a time, and pay securely. Payment held until the job is complete.",
    icon: CheckCircle2,
  },
] as const;

export function HowItWorks() {
  return (
    <section id="how-it-works" className="border-t border-border bg-surface/50 px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <FadeUp className="text-center">
          <p className="font-label text-primary">How it works</p>
          <h2 className="font-display mt-2 text-3xl font-black text-foreground sm:text-4xl">
            Three steps to done
          </h2>
        </FadeUp>

        <div className="relative mt-12">
          <div className="absolute left-0 right-0 top-12 hidden h-0.5 bg-gradient-to-r from-transparent via-amber-400/40 to-transparent lg:block" />
          <motion.div
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
            className="absolute left-[16.67%] right-[16.67%] top-12 hidden h-0.5 origin-left bg-gradient-to-r from-amber-400 to-sky-400 lg:block"
          />

          <StaggerGrid className="grid gap-8 lg:grid-cols-3">
            {STEPS.map(({ step, title, body, icon: Icon }) => (
              <StaggerItem key={step}>
                <div className="relative flex flex-col items-center text-center">
                  <div className="relative z-10 flex h-24 w-24 items-center justify-center rounded-2xl border border-border bg-background shadow-lg">
                    <Icon className="h-10 w-10 text-primary" />
                    <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full bg-primary text-xs font-bold text-white">
                      {step}
                    </span>
                  </div>
                  <h3 className="font-display mt-6 text-lg font-bold text-foreground">{title}</h3>
                  <p className="mt-2 max-w-xs text-sm leading-relaxed text-muted">{body}</p>
                </div>
              </StaggerItem>
            ))}
          </StaggerGrid>
        </div>
      </div>
    </section>
  );
}
