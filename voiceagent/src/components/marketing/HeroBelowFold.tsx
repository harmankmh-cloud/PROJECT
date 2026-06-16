"use client";

import dynamic from "next/dynamic";

const PhoneMockup = dynamic(
  () => import("./PhoneMockup").then((m) => ({ default: m.PhoneMockup })),
  {
    loading: () => (
      <div
        className="mx-auto h-[420px] w-full max-w-[280px] animate-pulse rounded-[2.5rem] bg-surface/60"
        aria-hidden
      />
    ),
  }
);

const HeroLeadCapture = dynamic(
  () => import("./HeroLeadCapture").then((m) => ({ default: m.HeroLeadCapture })),
  { loading: () => <div className="mx-auto mt-8 h-32 max-w-md animate-pulse rounded-xl bg-surface/40" aria-hidden /> }
);

const LiveVoiceDemo = dynamic(
  () => import("./LiveVoiceDemo").then((m) => ({ default: m.LiveVoiceDemo })),
  { loading: () => <div className="mx-auto mt-8 h-48 max-w-md animate-pulse rounded-xl bg-surface/40" aria-hidden /> }
);

/** Phone mockup, lead form, and live demo — below the fold on mobile; lazy-loaded to cut TBT. */
export function HeroBelowFold() {
  return (
    <>
      <div className="mt-16">
        <PhoneMockup />
      </div>
      <HeroLeadCapture />
      <LiveVoiceDemo />
    </>
  );
}
