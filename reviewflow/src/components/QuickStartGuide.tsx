import Link from "next/link";

export function QuickStartGuide({
  reviewUrl,
  hasGoogleLink,
}: {
  reviewUrl: string;
  hasGoogleLink: boolean;
}) {
  const steps = [
    {
      done: true,
      title: "Account created",
      detail: "You're signed in to ReviewFlow",
    },
    {
      done: hasGoogleLink,
      title: "Add Google review link",
      detail: hasGoogleLink ? "Customers can open Google after copying" : "Required for one-click Google posting",
      href: "/dashboard/settings",
    },
    {
      done: false,
      title: "Print QR at your counter",
      detail: "Download QR from dashboard → laminate → place visible",
    },
    {
      done: false,
      title: "Text one customer the link",
      detail: `Copy from Share kit: ${reviewUrl}`,
    },
  ];

  return (
    <div className="surface-card overflow-hidden">
      <div className="border-b border-[#e8e2d9] bg-gold-500/10 px-6 py-4">
        <h2 className="font-display text-lg text-brand-950">Your quick-start guide</h2>
        <p className="mt-0.5 text-sm text-stone-600">Follow these 4 steps — takes about 10 minutes</p>
      </div>
      <ol className="divide-y divide-[#e8e2d9]">
        {steps.map((step, index) => (
          <li key={step.title} className="flex gap-4 px-6 py-4">
            <span
              className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                step.done ? "bg-emerald-100 text-emerald-700" : "bg-brand-950 text-gold-400"
              }`}
            >
              {step.done ? "✓" : index + 1}
            </span>
            <div>
              <p className="font-medium text-brand-950">{step.title}</p>
              <p className="mt-0.5 text-sm text-stone-500">{step.detail}</p>
              {step.href && !step.done && (
                <Link href={step.href} className="mt-2 inline-block text-sm font-semibold text-gold-600 hover:underline">
                  Do this now →
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </div>
  );
}
