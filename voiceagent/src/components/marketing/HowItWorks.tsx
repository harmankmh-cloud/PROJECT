import { Calendar, Phone, Sparkles } from "lucide-react";

const STEPS = [
  {
    n: "1",
    icon: Sparkles,
    title: "Register your business",
    desc: "Create your account and add your business details in under 30 seconds.",
  },
  {
    n: "2",
    icon: Calendar,
    title: "GreetQ learns your business",
    desc: "Add FAQs, hours, and services. GreetQ builds your AI receptionist.",
  },
  {
    n: "3",
    icon: Phone,
    title: "Every call answered",
    desc: "Bookings, messages, and warm transfers — delivered to you instantly.",
  },
] as const;

export function HowItWorks() {
  return (
    <section className="perf-below-fold py-20 md:py-[80px]" id="how-it-works">
      <div className="marketing-container">
        <div className="mb-12 text-center">
          <p className="section-eyebrow mb-3">How it works</p>
          <h2 className="font-display text-3xl text-text md:text-4xl">Live in three steps</h2>
        </div>

        <div className="relative mx-auto max-w-2xl">
          <div className="absolute left-6 top-0 hidden h-full w-px border-l border-dashed border-border md:block" />
          <div className="space-y-8">
            {STEPS.map((step) => (
              <div key={step.n} className="flex gap-6">
                <div className="relative z-10 flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-primary/20 text-primary-glow">
                  <step.icon className="h-5 w-5" />
                </div>
                <div className="glass-card flex-1 p-6">
                  <span className="text-xs font-medium text-primary-glow">Step {step.n}</span>
                  <h3 className="mt-1 font-display text-lg text-text">{step.title}</h3>
                  <p className="mt-2 text-sm text-muted">{step.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
