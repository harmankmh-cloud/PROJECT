"use client";

/**
 * SoftAuroraHero — the homepage hero.
 *
 * A soft, light, continuously-morphing blue→periwinkle→violet aurora with a
 * frosted-glass "review card" centerpiece and the RateLocal star-pin seal.
 * Calm and premium, not loud. All motion is transform/opacity/filter only
 * (GPU compositor) and fully disabled under prefers-reduced-motion via the
 * scoped stylesheet below.
 */

import { motion, useReducedMotion } from "framer-motion";
import { Car, ChevronRight, Scissors, Store, UtensilsCrossed, Wrench } from "lucide-react";
import Link from "next/link";

const TAGS = [
  { icon: UtensilsCrossed, label: "Restaurant" },
  { icon: Scissors, label: "Salon" },
  { icon: Wrench, label: "Contractor" },
  { icon: Car, label: "Auto" },
  { icon: Store, label: "Retail" },
] as const;

/** RateLocal star-pin mark (a 5-point star fused with a location pin). */
function StarPin({ size = 22, fill = "#4f46e5", star = "#ffffff" }: { size?: number; fill?: string; star?: string }) {
  return (
    <svg width={size} height={size * 1.25} viewBox="0 0 32 40" aria-hidden="true">
      <path d="M16 1 C7.7 1 1 7.7 1 16 C1 26 16 39 16 39 C16 39 31 26 31 16 C31 7.7 24.3 1 16 1 Z" fill={fill} />
      <path d="M16 6.6 L18.0 12.1 L23.9 12.3 L19.2 15.9 L20.9 21.6 L16 18.3 L11.1 21.6 L12.8 15.9 L8.1 12.3 L14.0 12.1 Z" fill={star} />
    </svg>
  );
}

export function SoftAuroraHero() {
  const reduce = useReducedMotion();

  return (
    <section className="sah relative overflow-hidden">
      <style>{`
        .sah{ --ink:#212a48; --ink-soft:#3b466b; }
        .sah-bg{position:absolute;inset:0;z-index:0;
          background:linear-gradient(125deg,#93C5FD,#A5B4FC 28%,#C4B5FD 52%,#BAE6FD 74%,#C7D2FE);
          background-size:300% 300%;
          animation:sah-move 18s ease-in-out infinite, sah-hue 24s ease-in-out infinite;}
        @keyframes sah-move{0%{background-position:0% 50%}50%{background-position:100% 50%}100%{background-position:0% 50%}}
        @keyframes sah-hue{0%{filter:hue-rotate(-16deg)}50%{filter:hue-rotate(16deg)}100%{filter:hue-rotate(-16deg)}}
        .sah-blob{position:absolute;border-radius:50%;filter:blur(70px);opacity:.5;z-index:0;pointer-events:none}
        .sah-b1{width:34vw;height:34vw;background:#DBEAFE;top:-12vw;right:-8vw;animation:sah-float 9s ease-in-out infinite}
        .sah-b2{width:30vw;height:30vw;background:#DDD6FE;bottom:-14vw;left:-8vw;animation:sah-float 11s ease-in-out infinite reverse}
        @keyframes sah-float{0%,100%{transform:translateY(0)}50%{transform:translateY(26px)}}
        .sah-star{display:inline-block;color:#FBBF24;animation:sah-pop 1.6s ease-in-out infinite}
        .sah-star:nth-child(2){animation-delay:.12s}.sah-star:nth-child(3){animation-delay:.24s}
        .sah-star:nth-child(4){animation-delay:.36s}.sah-star:nth-child(5){animation-delay:.48s}
        @keyframes sah-pop{0%,100%{transform:translateY(0) scale(1)}50%{transform:translateY(-5px) scale(1.14)}}
        .sah-card{animation:sah-bob 7s ease-in-out infinite}
        @keyframes sah-bob{0%,100%{transform:rotate(2deg) translateY(0)}50%{transform:rotate(2deg) translateY(-11px)}}
        .sah-fade{position:absolute;left:0;right:0;bottom:0;height:16rem;z-index:1;pointer-events:none;
          background:linear-gradient(to bottom,transparent,#121214)}
        @media (prefers-reduced-motion: reduce){
          .sah-bg,.sah-blob,.sah-star,.sah-card{animation:none!important}
          .sah-card{transform:rotate(2deg)!important}
        }
      `}</style>

      <div className="sah-bg" aria-hidden />
      <div className="sah-blob sah-b1" aria-hidden />
      <div className="sah-blob sah-b2" aria-hidden />

      <div className="relative z-[2] mx-auto flex min-h-[calc(100dvh-4rem)] max-w-7xl flex-col justify-center px-6 py-24 lg:px-8 lg:py-28">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_0.95fr]">
          {/* LEFT */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "circOut" }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/60 px-4 py-2 text-[13px] font-semibold text-[#3a4675] backdrop-blur">
              <StarPin size={13} fill="#4f46e5" star="#ffffff" /> AI reviews · built for BC
            </span>

            <h1 className="mt-6 font-grotesk text-5xl font-extrabold leading-[0.98] tracking-tight text-[#212a48] sm:text-6xl lg:text-7xl">
              Turn every visit
              <br />
              into a{" "}
              <span className="whitespace-nowrap align-middle text-4xl sm:text-5xl lg:text-6xl">
                <span className="sah-star">★</span>
                <span className="sah-star">★</span>
                <span className="sah-star">★</span>
                <span className="sah-star">★</span>
                <span className="sah-star">★</span>
              </span>
              <br />
              review.
            </h1>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-[#3b466b] sm:text-xl">
              AI-powered QR prompts that route unhappy customers privately and guide happy ones to Google — in seconds. No fake reviews. No risk. Built for BC.
            </p>

            <div className="mt-9 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
              <Link
                href="/signup"
                className="inline-flex items-center gap-2 rounded-2xl bg-[#2a3566] px-8 py-4 text-base font-semibold text-white shadow-[0_16px_34px_-14px_rgba(42,53,102,0.7)] transition hover:-translate-y-0.5"
              >
                Start free — 50 reviews →
              </Link>
              <Link
                href="#demo"
                className="inline-flex items-center gap-2 rounded-2xl border border-white/80 bg-white/60 px-7 py-4 text-base font-semibold text-[#2a3566] backdrop-blur transition hover:bg-white/80"
              >
                See live demo <ChevronRight className="h-4 w-4" />
              </Link>
            </div>

            <div className="mt-10 flex flex-wrap items-center gap-2">
              {TAGS.map((t) => {
                const Icon = t.icon;
                return (
                  <span
                    key={t.label}
                    className="inline-flex items-center gap-1.5 rounded-full border border-white/70 bg-white/50 px-3 py-1.5 text-[13px] font-semibold text-[#414d78] backdrop-blur"
                  >
                    <Icon className="h-3.5 w-3.5" /> {t.label}
                  </span>
                );
              })}
            </div>
          </motion.div>

          {/* RIGHT — glass review card */}
          <motion.div
            initial={reduce ? false : { opacity: 0, y: 24 }}
            animate={reduce ? { opacity: 1 } : { opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "circOut" }}
            className="mx-auto w-full max-w-md"
            style={{ perspective: 1200 }}
          >
            <div className="sah-card relative rounded-[26px] border border-white/60 bg-white/85 p-6 shadow-[0_40px_90px_-30px_rgba(90,100,175,0.55)] backdrop-blur-xl">
              {/* star-pin seal */}
              <div className="absolute -left-4 -top-5 drop-shadow-[0_10px_20px_rgba(90,100,175,0.4)]">
                <StarPin size={44} fill="#818CF8" star="#ffffff" />
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="grid h-11 w-11 place-items-center rounded-full bg-gradient-to-br from-[#60A5FA] to-[#A78BFA] font-bold text-white">
                    JM
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-[#1e2740]">Jordan M.</p>
                    <p className="text-xs text-[#7a86a8]">Verified visit · just now</p>
                  </div>
                </div>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-[#e0e7ff] px-2.5 py-1 text-[11px] font-bold text-[#4f46e5]">
                  ● Live
                </span>
              </div>

              <div className="mt-5 text-[22px] tracking-[2px] text-[#FBBF24]">★★★★★</div>

              <p className="mt-3 text-[15px] font-semibold leading-relaxed text-[#26314f]">
                “Genuinely the best experience I&apos;ve had — I&apos;d recommend them to anyone!”
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-dashed border-[#e2e6f2] pt-4 text-xs text-[#7a86a8]">
                <span>Drafted in 1.2s · edit before posting</span>
                <span className="rounded-lg bg-gradient-to-r from-[#60A5FA] to-[#A78BFA] px-3 py-1.5 font-bold text-white">
                  Post to Google →
                </span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* smooth transition into the dark sections below */}
      <div className="sah-fade" aria-hidden />
    </section>
  );
}

export default SoftAuroraHero;
