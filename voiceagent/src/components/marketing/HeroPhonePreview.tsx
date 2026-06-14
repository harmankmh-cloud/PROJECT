"use client";

import { ClientOnly } from "@/components/ui/ClientOnly";
import { FadeInSection } from "@/components/ui/FadeInSection";
import { PhoneMockup } from "./PhoneMockup";

export function HeroPhonePreview() {
  return (
    <ClientOnly
      fallback={
        <div className="mt-16 flex justify-center" aria-hidden>
          <div className="h-[420px] w-full max-w-[280px] rounded-[2.5rem] border border-border bg-zinc-900/50" />
        </div>
      }
    >
      <FadeInSection delay={0.5} className="mt-16">
        <PhoneMockup />
      </FadeInSection>
    </ClientOnly>
  );
}
