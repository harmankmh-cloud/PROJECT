import Link from "next/link";

type Props = {
  orgName: string;
  hasAgent: boolean;
  hasPhoneNumber: boolean;
  hasKnowledge: boolean;
  hasPublishedFlow: boolean;
};

export function SetupChecklist({
  orgName,
  hasAgent,
  hasPhoneNumber,
  hasKnowledge,
  hasPublishedFlow,
}: Props) {
  const items = [
    {
      done: hasAgent,
      title: "AI agent configured",
      detail: hasAgent ? "Your agent has a system prompt and greeting" : "Customize your default agent",
      href: "/dashboard/agents",
      action: "Open agents →",
    },
    {
      done: hasPhoneNumber,
      title: "Phone number mapped",
      detail: hasPhoneNumber
        ? "Inbound calls route to your agent"
        : "Add your Twilio/Telnyx number and assign an agent",
      href: "/dashboard/phone-numbers",
      action: "Add number →",
    },
    {
      done: hasKnowledge,
      title: "Knowledge base started",
      detail: hasKnowledge
        ? "Agents can answer from your docs"
        : "Add FAQs, policies, or service menus",
      href: "/dashboard/knowledge",
      action: "Add knowledge →",
    },
    {
      done: hasPublishedFlow,
      title: "Call flow published",
      detail: hasPublishedFlow
        ? "Live calls follow your flow logic"
        : "Publish a flow for your primary agent",
      href: "/dashboard/flows",
      action: "Build flow →",
    },
  ];

  const completed = items.filter((i) => i.done).length;
  const progress = Math.round((completed / items.length) * 100);

  if (completed === items.length) return null;

  return (
    <div className="surface-card overflow-hidden">
      <div className="review-header">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-lg">Launch checklist</h2>
            <p className="mt-0.5 text-sm text-white/60">
              {completed} of {items.length} done — finish setup for {orgName}
            </p>
          </div>
          <p className="text-2xl font-bold text-gold-400">{progress}%</p>
        </div>
        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
          <div className="h-full rounded-full bg-gold-500 transition-all" style={{ width: `${progress}%` }} />
        </div>
      </div>
      <ul className="divide-y divide-slate-100">
        {items.map((item) => (
          <li key={item.title} className="flex items-start gap-4 px-6 py-4">
            <span
              className={`mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                item.done ? "bg-emerald-100 text-emerald-700" : "bg-cream-dark text-slate-400"
              }`}
            >
              {item.done ? "✓" : "○"}
            </span>
            <div className="min-w-0 flex-1">
              <p className={`font-medium ${item.done ? "text-slate-500 line-through" : "text-brand-900"}`}>
                {item.title}
              </p>
              <p className="mt-0.5 text-sm text-slate-500">{item.detail}</p>
              {!item.done && (
                <Link href={item.href} className="mt-2 inline-block text-sm font-semibold text-gold-600 hover:underline">
                  {item.action}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
