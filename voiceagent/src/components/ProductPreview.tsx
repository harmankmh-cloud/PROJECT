/** CSS-only dashboard mockup for the marketing hero — no screenshot assets required. */
export function ProductPreview() {
  return (
    <div
      className="surface-dark mx-auto mt-12 max-w-3xl overflow-hidden rounded-2xl text-left shadow-2xl"
      aria-hidden="true"
    >
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-red-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400/80" />
        <span className="h-2.5 w-2.5 rounded-full bg-teal-400/80" />
        <span className="ml-2 text-xs text-white/40">Intellivo — Live call</span>
      </div>
      <div className="grid gap-0 sm:grid-cols-5">
        <div className="border-r border-white/10 p-4 sm:col-span-2">
          <p className="text-[10px] font-bold uppercase tracking-wider text-teal-400">Caller</p>
          <p className="mt-1 text-sm font-semibold text-white">+1 (604) 555-0142</p>
          <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-white/40">Intent</p>
          <p className="mt-1 rounded-lg bg-teal-500/20 px-2 py-1 text-xs text-teal-200">Book appointment</p>
          <p className="mt-4 text-[10px] font-bold uppercase tracking-wider text-white/40">Status</p>
          <p className="mt-1 flex items-center gap-2 text-xs text-white/70">
            <span className="inline-block h-2 w-2 animate-pulse rounded-full bg-teal-400" />
            AI agent speaking
          </p>
        </div>
        <div className="space-y-2 p-4 sm:col-span-3">
          <div className="rounded-lg bg-white/5 px-3 py-2 text-xs text-white/60">
            <span className="text-white/40">Caller · 0:04</span>
            <p className="mt-1 text-white/85">Hi, I need to book a cleaning for next Tuesday.</p>
          </div>
          <div className="rounded-lg bg-teal-500/15 px-3 py-2 text-xs">
            <span className="text-teal-300/70">Agent · 0:08</span>
            <p className="mt-1 text-white/90">
              I can help with that. We have 10am or 2pm open on Tuesday — which works better?
            </p>
          </div>
          <div className="rounded-lg bg-white/5 px-3 py-2 text-xs text-white/60">
            <span className="text-white/40">Caller · 0:15</span>
            <p className="mt-1 text-white/85">2pm please.</p>
          </div>
          <div className="mt-2 flex gap-2">
            <span className="rounded-md bg-violet-500/20 px-2 py-1 text-[10px] text-violet-200">
              Calendar sync
            </span>
            <span className="rounded-md bg-white/10 px-2 py-1 text-[10px] text-white/60">Logged to CRM</span>
          </div>
        </div>
      </div>
    </div>
  );
}
