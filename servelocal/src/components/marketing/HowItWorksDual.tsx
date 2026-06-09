import { CONTRACTOR_STEPS, HOMEOWNER_STEPS } from "@/content/copy";

function FlowColumn({
  title,
  eyebrow,
  steps,
}: {
  title: string;
  eyebrow: string;
  steps: readonly { step: string; title: string; body: string }[];
}) {
  return (
    <div className="card-dark flex-1">
      <p className="font-label text-primary">{eyebrow}</p>
      <h3 className="font-display mt-2 text-xl font-bold text-slate-50">{title}</h3>
      <ol className="mt-6 space-y-5">
        {steps.map((s) => (
          <li key={s.step} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white">
              {s.step}
            </span>
            <div>
              <p className="font-semibold text-slate-50">{s.title}</p>
              <p className="mt-1 text-sm leading-relaxed text-slate-400">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}

export function HowItWorksDual() {
  return (
    <section id="how-it-works" className="border-t border-slate-700/80 px-4 py-16 sm:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="font-label text-center text-primary">How it works</p>
        <h2 className="font-display mt-2 text-center text-3xl font-black text-slate-50 sm:text-4xl">
          Two sides. One local marketplace.
        </h2>
        <div className="mt-10 flex flex-col gap-6 lg:flex-row">
          <FlowColumn title="For Homeowners" eyebrow="Post free" steps={HOMEOWNER_STEPS} />
          <FlowColumn title="For Contractors" eyebrow="Get listed" steps={CONTRACTOR_STEPS} />
        </div>
      </div>
    </section>
  );
}
