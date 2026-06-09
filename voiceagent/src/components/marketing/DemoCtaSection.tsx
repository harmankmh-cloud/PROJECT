"use client";

import Link from "next/link";
import { Calendar, Play } from "lucide-react";
import { Waveform } from "@/components/ui/Waveform";
import { FadeInSection } from "@/components/ui/FadeInSection";

export function DemoCtaSection() {
  return (
    <section className="border-t border-border bg-surface py-20 md:py-[80px]" id="demo">
      <div className="marketing-container">
        <FadeInSection>
          <div className="mx-auto max-w-3xl text-center">
            <h2 className="font-display text-3xl text-text md:text-4xl">
              See GreetQ Answer a Real Call
            </h2>
            <p className="mt-4 text-muted">
              Watch how GreetQ handles scheduling, FAQs, and warm transfers — in under 60 seconds.
            </p>

            <div className="glass-card mx-auto mt-10 max-w-md p-8">
              <div className="flex items-center justify-center gap-4">
                <button
                  type="button"
                  className="flex h-14 w-14 items-center justify-center rounded-full bg-primary shadow-[0_0_24px_rgba(99,102,241,0.4)]"
                  aria-label="Play demo"
                >
                  <Play className="h-6 w-6 text-white" fill="white" />
                </button>
                <Waveform className="flex-1" />
              </div>
              <p className="mt-4 font-mono text-xs text-muted">
                Demo: Booking a dental appointment
              </p>
            </div>

            <div className="mt-10 flex flex-col justify-center gap-3 sm:flex-row">
              <Link href="/demo" className="btn-secondary inline-flex gap-2 px-8 py-3.5">
                <Play className="h-4 w-4" />
                Explore live demo dashboard
              </Link>
              <Link href="/help?intent=demo" className="btn-primary inline-flex gap-2 px-8 py-3.5">
                <Calendar className="h-4 w-4" />
                Book a Live Demo
              </Link>
            </div>
          </div>
        </FadeInSection>
      </div>
    </section>
  );
}
