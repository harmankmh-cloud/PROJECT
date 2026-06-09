import Link from "next/link";
import { Icon } from "@/components/ui/Icon";

export function HeroCallPreview() {
  return (
    <div className="relative mt-12 md:mt-0">
      <div className="glass-card relative z-10 rounded-2xl p-6">
        <div className="mb-4 flex items-center justify-between gap-3 border-b border-white/[0.08] pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full border border-white/[0.08] bg-white/[0.04] text-electric-cyan">
              <Icon name="person" size={18} />
            </div>
            <div>
              <p className="text-xs text-on-surface-variant">Sample caller</p>
              <p className="font-semibold text-ghost-white">+1 (604) 555-0142</p>
            </div>
          </div>
          <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1 text-[10px] font-medium uppercase tracking-wide text-slate-text">
            Example transcript
          </span>
        </div>
        <p className="mb-5 text-xs text-slate-text">
          Illustrative booking flow — not a live recording.{" "}
          <Link href="/signup" className="text-electric-cyan hover:underline">
            Try the sandbox
          </Link>{" "}
          with your own agent.
        </p>
        <div className="space-y-4">
          <div className="flex max-w-[80%] flex-col gap-1.5">
            <p className="px-1 text-[10px] font-medium uppercase text-on-surface-variant">Caller · 0:04</p>
            <div className="rounded-xl rounded-tl-none border border-white/[0.08] bg-white/[0.03] p-3 text-sm text-on-surface">
              Hi, I need to book a cleaning for next Tuesday.
            </div>
          </div>
          <div className="ml-auto flex max-w-[80%] flex-col items-end gap-1.5">
            <p className="px-1 text-[10px] font-medium uppercase text-electric-cyan">Agent · 0:08</p>
            <div className="rounded-xl rounded-tr-none border border-electric-cyan/20 bg-electric-cyan/5 p-3 text-sm text-ghost-white">
              I can help with that. We have 10am or 2pm open on Tuesday — which works better?
            </div>
          </div>
          <div className="flex max-w-[80%] flex-col gap-1.5">
            <p className="px-1 text-[10px] font-medium uppercase text-on-surface-variant">Caller · 0:15</p>
            <div className="rounded-xl rounded-tl-none border border-white/[0.08] bg-white/[0.03] p-3 text-sm text-on-surface">
              2pm please.
            </div>
          </div>
        </div>
        <div className="mt-6 flex gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-electric-cyan/20 bg-electric-cyan/5 p-3">
            <Icon name="calendar" size={16} className="text-electric-cyan" />
            <span className="text-xs font-medium text-electric-cyan">Calendar Sync</span>
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-white/[0.08] bg-white/[0.03] p-3">
            <Icon name="database" size={16} className="text-on-surface-variant" />
            <span className="text-xs font-medium text-on-surface-variant">Logged to CRM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
