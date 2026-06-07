import { MaterialIcon } from "@/components/MaterialIcon";

export function HeroCallPreview() {
  return (
    <div className="relative mt-12 md:mt-0">
      <div className="glass-card relative z-10 rounded-xl border border-white/40 p-6 shadow-2xl">
        <div className="mb-8 flex items-center justify-between border-b border-outline-variant/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-electric-blue text-white">
              <MaterialIcon name="person" />
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-text">Caller</p>
              <p className="font-bold text-on-surface">+1 (604) 555-0142</p>
            </div>
          </div>
          <span className="flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-semibold text-green-700">
            <span className="h-2 w-2 animate-pulse rounded-full bg-green-500" />
            Live Session
          </span>
        </div>
        <div className="space-y-6">
          <div className="flex max-w-[80%] flex-col gap-2">
            <p className="px-1 text-[10px] font-bold uppercase text-slate-text">Caller · 0:04</p>
            <div className="rounded-lg rounded-tl-none bg-surface-container-low p-3 text-sm">
              Hi, I need to book a cleaning for next Tuesday.
            </div>
          </div>
          <div className="ml-auto flex max-w-[80%] flex-col items-end gap-2">
            <p className="px-1 text-[10px] font-bold uppercase text-electric-blue">Agent · 0:08</p>
            <div className="rounded-lg rounded-tr-none bg-primary-container p-3 text-sm text-white">
              I can help with that. We have 10am or 2pm open on Tuesday — which works better?
            </div>
          </div>
          <div className="flex max-w-[80%] flex-col gap-2">
            <p className="px-1 text-[10px] font-bold uppercase text-slate-text">Caller · 0:15</p>
            <div className="rounded-lg rounded-tl-none bg-surface-container-low p-3 text-sm">
              2pm please.
            </div>
          </div>
        </div>
        <div className="mt-8 flex gap-3">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-blue-100 bg-blue-50 p-3">
            <MaterialIcon name="calendar_today" className="text-[20px] text-blue-600" />
            <span className="text-xs font-semibold text-blue-800">Calendar Sync</span>
          </div>
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-purple-100 bg-purple-50 p-3">
            <MaterialIcon name="database" className="text-[20px] text-purple-600" />
            <span className="text-xs font-semibold text-purple-800">Logged to CRM</span>
          </div>
        </div>
      </div>
      <div className="absolute -right-6 -top-6 h-32 w-32 rounded-full bg-violet-500/20 blur-3xl" />
      <div className="absolute -bottom-10 -left-10 h-48 w-48 rounded-full bg-electric-blue/10 blur-3xl" />
    </div>
  );
}
