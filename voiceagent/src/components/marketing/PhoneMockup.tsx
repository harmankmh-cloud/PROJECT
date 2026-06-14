"use client";

import { Waveform } from "@/components/ui/Waveform";

export function PhoneMockup() {
  return (
    <div className="relative mx-auto w-full max-w-[280px]">
      <div className="rounded-[2.5rem] border border-border bg-zinc-900 p-3 shadow-[0_0_40px_rgba(99,102,241,0.2)]">
        <div className="overflow-hidden rounded-[2rem] bg-bg">
          <div className="flex items-center justify-between px-5 py-3 text-xs text-muted">
            <span>9:41</span>
            <div className="h-5 w-16 rounded-full bg-zinc-800" />
          </div>
          <div className="px-5 pb-6 pt-4">
            <div className="mb-6 text-center">
              <p className="text-xs text-muted">Incoming call</p>
              <p className="mt-1 font-display text-xl text-text">Sarah M.</p>
              <div className="mt-2 flex items-center justify-center gap-2">
                <span className="pulse-dot" />
                <span className="text-sm text-accent">Answering...</span>
              </div>
            </div>
            <Waveform className="mb-6" />
            <div className="space-y-2 rounded-xl bg-surface p-3 font-mono text-xs text-muted">
              <p className="text-accent">GreetQ:</p>
              <p className="text-text">Hi Sarah! Thanks for calling. How can I help you today?</p>
              <p className="mt-2 text-primary-glow">Caller:</p>
              <p className="text-text">I&apos;d like to book an appointment for Thursday.</p>
            </div>
            <div className="mt-6 flex justify-center gap-8">
              <div className="h-12 w-12 rounded-full bg-danger/20" />
              <div className="h-12 w-12 rounded-full bg-success/20" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
