import { BadgeCheck, FileCheck, Shield } from "lucide-react";
import type { ServiceProvider } from "@/lib/types";
import { FadeUp } from "@/components/motion/FadeUp";

type Props = {
  provider: ServiceProvider;
};

const CREDENTIALS = [
  {
    key: "licensed",
    label: "Licensed",
    icon: FileCheck,
    check: (p: ServiceProvider) => p.licensed,
    detail: (p: ServiceProvider) => (p.license_number ? `Lic #${p.license_number}` : "BC licensed"),
  },
  {
    key: "insurance",
    label: "Insured",
    icon: Shield,
    check: (p: ServiceProvider) => p.insurance_verified,
    detail: () => "Liability insurance verified",
  },
  {
    key: "background",
    label: "Verified Pro",
    icon: BadgeCheck,
    check: (p: ServiceProvider) => p.verified,
    detail: () => "Licence & identity reviewed by ServeLocal",
  },
] as const;

export function ProCredentials({ provider }: Props) {
  const active = CREDENTIALS.filter((c) => c.check(provider));
  if (active.length === 0) return null;

  return (
    <FadeUp>
      <section>
        <h2 className="font-display text-xl font-bold text-foreground">Credentials</h2>
        <div className="mt-4 grid gap-3 sm:grid-cols-3">
          {active.map(({ key, label, icon: Icon, detail }) => (
            <div
              key={key}
              className="flex items-start gap-3 rounded-[14px] border border-border bg-surface p-4"
            >
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-success/10 text-success">
                <Icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{label}</p>
                <p className="mt-0.5 text-xs text-muted">{detail(provider)}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </FadeUp>
  );
}
