import { FLOW_STEPS } from "@/lib/marketing-content";

export function FlowDemoStrip() {
  return (
    <div className="mt-6 rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur-sm">
      <p className="text-center text-[10px] font-bold uppercase tracking-[0.2em] text-teal-300">
        See the flow
      </p>
      <ol className="mt-3 grid grid-cols-4 gap-2">
        {FLOW_STEPS.map((step, i) => (
          <li
            key={step.label}
            className="flow-demo-step rounded-xl border border-white/10 bg-brand-950/40 px-2 py-3 text-center"
            style={{ animationDelay: `${i * 0.6}s` }}
          >
            <span className="text-lg" aria-hidden>
              {step.icon}
            </span>
            <p className="mt-1 text-[10px] font-semibold leading-tight text-white/80">{step.label}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
