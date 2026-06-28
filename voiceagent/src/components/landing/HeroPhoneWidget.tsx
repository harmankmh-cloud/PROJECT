import { Phone } from "lucide-react";

export function HeroPhoneWidget() {
  return (
    <div className="relative mx-auto w-full max-w-sm lg:mx-0">
      <div className="hero-pulse-ring absolute inset-0 rounded-full bg-violet-600/20" aria-hidden />
      <div
        className="hero-pulse-ring-delayed absolute inset-4 rounded-full border border-teal-500/30"
        aria-hidden
      />
      <div className="hero-phone-enter relative rounded-2xl border border-border/80 bg-surface/90 p-6 shadow-[0_0_48px_rgba(124,58,237,0.2)] backdrop-blur-sm">
        <div className="flex items-center justify-between text-xs text-muted">
          <span>Incoming call</span>
          <span className="flex items-center gap-1.5 text-teal-400">
            <span className="pulse-dot bg-teal-400" />
            Live
          </span>
        </div>
        <p className="mt-4 font-display text-2xl text-text">Sample caller</p>
        <p className="mt-1 text-sm text-muted">Booking a Thursday appointment</p>
        <div className="mt-6 flex h-10 items-end justify-center gap-1" aria-hidden>
          {Array.from({ length: 10 }).map((_, i) => (
            <div
              key={i}
              className="waveform-bar w-1 rounded-full bg-teal-400/80"
              style={{ animationDelay: `${i * 0.07}s` }}
            />
          ))}
        </div>
        <div className="mt-6 rounded-xl bg-bg/60 p-3 text-xs leading-relaxed text-muted">
          <p className="text-teal-400">GreetQ</p>
          <p className="mt-1 text-text">
            Hi! I can book you for Thursday — 2 PM or 4:30 PM works. Which do you prefer?
          </p>
        </div>
        <div className="mt-5 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-violet-600 shadow-[0_0_24px_rgba(124,58,237,0.5)]">
            <Phone className="h-6 w-6 text-white" />
          </div>
        </div>
      </div>
    </div>
  );
}
