import Link from "next/link";
import { MaterialIcon } from "@/components/MaterialIcon";

export function HeroCallPreview() {
  return (
    <div className="relative mt-12 md:mt-0">
      <div className="glass-card glow-border relative z-10 rounded-2xl p-6 shadow-2xl">
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-glass-border-subtle pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-violet-500 to-electric-cyan text-ghost-white">
              <MaterialIcon name="person" />
            </div>
            <div>
              <p className="text-xs font-semibold text-on-surface-variant">Sample caller</p>
              <p className="font-bold text-ghost-white">+1 (604) 555-0142</p>
            </div>
          </div>
          <span className="rounded-full border border-glass-border-subtle bg-surface-container-high px-3 py-1 text-[10px] font-bold uppercase tracking-wide text-slate-text">
            Example transcript
          </span>
        </div>
        <p className="mb-5 text-xs text-slate-text">
          Illustrative booking flow — not a live recording.{" "}
          <Link href="/signup" className="text-primary hover:underline">
            Try the sandbox
          </Link>{" "}
          with your own agent.
        </p>
        <div className="space-y-5">
          <div className="flex max-w-[80%] flex-col gap-2">
            <p className="px-1 text-[10px] font-bold uppercase text-on-surface-variant">Caller · 0:04</p>
            <div className="rounded-xl rounded-tl-none border border-glass-border-subtle bg-surface-container-low p-3 text-sm text-on-surface">
              Hi, I need to book a cleaning for next Tuesday.
            </div>
          </div>
          <div className="ml-auto flex max-w-[80%] flex-col items-end gap-2">
            <p className="px-1 text-[10px] font-bold uppercase text-primary">Agent · 0:08</p>
            <div className="rounded-xl rounded-tr-none border border-primary/20 bg-gradient-to-br from-violet-500/20 to-electric-cyan/10 p-3 text-sm text-ghost-white">
              I can help with that. We have 10am or 2pm open on Tuesday — which works better?
            </div>
          </div>
          <div className="flex max-w-[80%] flex-col gap-2">
            <p className="px-1 text-[10px] font-bold uppercase text-on-surface-variant">Caller · 0:15</p>
            <div className="rounded-xl rounded-tl-none border border-glass-border-subtle bg-surface-container-low p-3 text-sm text-on-surface">
              2pm please.
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 p-3">
            <MaterialIcon name="calendar_today" className="text-[20px] text-primary" />
            <span className="text-xs font-semibold text-primary">Calendar Sync</span>
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-violet-500/20 bg-violet-500/5 p-3">
            <MaterialIcon name="database" className="text-[20px] text-vivid-violet" />
            <span className="text-xs font-semibold text-vivid-violet">Logged to CRM</span>
          </div>
        </div>
      </div>
      <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-violet-500/25 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-electric-cyan/15 blur-3xl" />
    </div>
  );
}
