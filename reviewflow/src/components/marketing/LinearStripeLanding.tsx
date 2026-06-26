"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import {
  ArrowRight,
  BadgeCheck,
  Car,
  Check,
  ChevronRight,
  MessageSquareMore,
  MonitorPlay,
  QrCode,
  Scissors,
  Shield,
  Sparkles,
  Star,
  Store,
  UtensilsCrossed,
  Wrench,
} from "lucide-react";
import dynamic from "next/dynamic";
import Link from "next/link";
import { useState } from "react";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Switch } from "@/components/ui/Switch";
import { MarketingNavbar } from "@/components/marketing/MarketingNavbar";
import { MagneticButton } from "@/components/ui/MagneticButton";
import { BRAND } from "@/lib/brand";

// 3D starfield is hero-only and lazy-loaded so it never blocks first paint or SSR.
const StarField = dynamic(() => import("@/components/StarField"), { ssr: false });

const CITIES = ["Vancouver", "Surrey", "Abbotsford", "Kelowna", "Victoria", "Burnaby"];

const BUSINESS_TYPES = [
  { icon: UtensilsCrossed, label: "Restaurant" },
  { icon: Scissors, label: "Salon" },
  { icon: Wrench, label: "Contractor" },
  { icon: Car, label: "Auto" },
  { icon: Store, label: "Retail" },
] as const;

const HOW_IT_WORKS = [
  {
    icon: QrCode,
    title: "Place the QR at checkout",
    description: "Download a custom poster and place it where customers already pause. One scan, zero friction.",
  },
  {
    icon: Sparkles,
    title: "AI writes a polished review",
    description: "Customers tap a star rating and receive an authentic draft ready to publish on Google.",
  },
  {
    icon: Shield,
    title: "Bad feedback stays private",
    description: "Unhappy customers can send concerns straight to you first, protecting your reputation.",
  },
] as const;

const TESTIMONIALS = [
  {
    initials: "JS",
    name: "Jamie Singh",
    business: "Northshore Dental",
    quote:
      "We went from chasing reviews to collecting them automatically. The private routing alone saved our reputation.",
    rating: 5,
    rotation: "-2deg",
  },
  {
    initials: "MR",
    name: "Mina Rios",
    business: "Elm Street Salon",
    quote:
      "The AI review drafts feel natural, and our team spends less time writing follow-ups and more time serving clients.",
    rating: 5,
    rotation: "0deg",
  },
  {
    initials: "DT",
    name: "Derek Tran",
    business: "Harbor Auto Clinic",
    quote:
      "Our review volume jumped in two weeks. The QR flow feels effortless for every customer, even the busy ones.",
    rating: 5,
    rotation: "2deg",
  },
] as const;

const PRICING_PLAN = {
  name: "Pro",
  monthlyPrice: "$39",
  yearlyPrice: "$390",
  description: "Everything included — one flat price, no hidden fees.",
  features: [
    "Unlimited review requests",
    "AI review drafts",
    "Private complaint routing",
    "QR poster + SMS & email templates",
    "Analytics and review reminders",
    "$0 setup fee",
    "14-day money-back guarantee",
  ],
  cta: "Start 14-day free trial",
} as const;

export function LinearStripeLanding() {
  const [billing, setBilling] = useState<"monthly" | "yearly">("monthly");
  const [demoStage, setDemoStage] = useState<"qr" | "rating" | "review" | "feedback">("qr");
  const [selectedStars, setSelectedStars] = useState(0);
  const shouldReduceMotion = useReducedMotion();

  const handleStarSelect = (value: number) => {
    setSelectedStars(value);
    setDemoStage(value >= 4 ? "review" : "feedback");
  };

  return (
    <>
      {/* Fixed dark backdrop + hero-only 3D starfield (sits behind hero content). */}
      <div aria-hidden className="rl-dark fixed inset-0 -z-10" />
      <main className="relative z-10 min-h-screen text-ink">
        <MarketingNavbar />

      <section className="relative overflow-hidden border-b border-white/10">
        <StarField />
        <div className="landing-radial absolute inset-x-0 top-0 h-[24rem]" />
        <div className="mx-auto flex min-h-[calc(100dvh-4rem)] max-w-7xl flex-col justify-center gap-16 px-6 py-24 lg:px-8 lg:py-28">
          <div className="grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr]">
            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "circOut" }}
              className="max-w-3xl"
            >
              <Badge variant="default" className="rounded-full border border-gold/25 bg-gold/10 px-3 py-1 text-[0.7rem] uppercase tracking-[0.3em] text-gold">
                Reputation management for BC local businesses
              </Badge>
              <h1 className="mt-6 font-grotesk text-5xl font-semibold leading-[0.95] tracking-tight text-ink sm:text-6xl lg:text-8xl">
                {["Turn every visit", "into a 5★ review"].map((line, i) => (
                  <motion.span
                    key={line}
                    className="block"
                    initial={shouldReduceMotion ? false : { opacity: 0, y: "0.6em" }}
                    animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, delay: 0.15 + i * 0.12, ease: [0.23, 1, 0.32, 1] }}
                  >
                    {i === 1 ? (
                      <>
                        into a <span className="rl-text-gold-gradient">5★</span> review
                      </>
                    ) : (
                      line
                    )}
                  </motion.span>
                ))}
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted-soft sm:text-xl">
                AI-powered QR prompts that route unhappy customers privately and guide happy ones to Google — in seconds. No fake reviews. No risk. Built for BC.
              </p>
              <div className="mt-10 flex flex-col items-start gap-3 sm:flex-row sm:items-center">
                <MagneticButton href="/signup" className="px-9 py-4 text-base">
                  Start Free Trial
                </MagneticButton>
                <Link
                  href="#demo"
                  className="inline-flex items-center gap-2 rounded-[14px] border border-white/15 bg-white/[0.04] px-8 py-4 text-base text-muted-soft transition hover:border-gold/30 hover:text-ink"
                >
                  See live demo <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="mt-12 flex flex-wrap items-center gap-3 rounded-full border border-[#27272A]/70 bg-[#121214]/60 px-4 py-3 backdrop-blur">
                <span className="text-sm font-medium text-[#FAFAFA]">Trusted by 200+ local businesses</span>
                <span className="h-1 w-1 rounded-full bg-[#27272A]" />
                <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                  <Star className="h-4 w-4 fill-current text-[#3B82F6]" />
                  <span>4.9/5 average rating</span>
                </div>
                <div className="ml-2 flex items-center gap-3 text-sm text-[#A1A1AA]">
                  {BUSINESS_TYPES.map((type) => {
                    const Icon = type.icon;
                    return (
                      <span key={type.label} className="flex items-center gap-1.5 rounded-full border border-[#27272A]/70 px-2.5 py-1">
                        <Icon className="h-3.5 w-3.5" />
                        {type.label}
                      </span>
                    );
                  })}
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
              animate={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.1, ease: "circOut" }}
              className="mx-auto w-full max-w-xl"
            >
              <div className="rounded-[2rem] border border-[#27272A]/80 bg-[#121214]/80 p-4 shadow-2xl shadow-black/20 backdrop-blur">
                <div className="rounded-[1.75rem] border border-[#27272A]/70 bg-[#0A0A0B]/90 p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#FAFAFA]">Customer review flow</p>
                      <p className="text-sm text-[#A1A1AA]">QR scan • AI draft • private routing</p>
                    </div>
                    <Badge variant="success" className="rounded-full bg-[#3B82F6]/10 px-3 py-1 text-[#3B82F6]">
                      Live preview
                    </Badge>
                  </div>
                  <div className="hero-float mt-6 rounded-[1.5rem] border border-[#27272A]/70 bg-[#121214]/80 p-5">
                    <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                      <div className="rounded-[1.25rem] border border-[#27272A]/70 bg-[#0A0A0B]/90 p-5">
                        <div className="rounded-2xl border border-dashed border-[#3B82F6]/30 bg-[#3B82F6]/5 p-4 text-center">
                          <QrCode className="mx-auto h-10 w-10 text-[#3B82F6]" />
                          <p className="mt-3 text-sm font-semibold text-[#FAFAFA]">Scan to review</p>
                          <p className="mt-1 text-xs text-[#A1A1AA]">Branded, mobile-first</p>
                        </div>
                        <div className="mt-4 rounded-2xl border border-[#27272A]/70 bg-[#121214]/80 p-3 text-sm text-[#A1A1AA]">
                          <div className="flex items-center justify-between">
                            <span>Thanks for visiting</span>
                            <BadgeCheck className="h-4 w-4 text-[#3B82F6]" />
                          </div>
                          <p className="mt-2 font-semibold text-[#FAFAFA]">How was your visit?</p>
                        </div>
                      </div>
                      <div className="rounded-[1.25rem] border border-[#27272A]/70 bg-[#0A0A0B]/90 p-5">
                        <div className="flex items-center gap-2 text-sm text-[#A1A1AA]">
                          <MessageSquareMore className="h-4 w-4 text-[#3B82F6]" />
                          Review request ready
                        </div>
                        <div className="mt-4 rounded-2xl border border-[#27272A]/70 bg-[#121214]/80 p-4 shadow-sm">
                          <p className="text-sm text-[#FAFAFA]">“The team made me feel welcome from start to finish. I’d recommend them again.”</p>
                        </div>
                        <div className="mt-4 flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <Star key={star} className="h-4 w-4 fill-current text-[#3B82F6]" />
                          ))}
                        </div>
                        <p className="mt-4 text-sm text-[#A1A1AA]">AI-generated draft, ready to post to Google in one tap.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      <section id="product" className="border-b border-[#27272A]/80 bg-[#121214] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "circOut" }}
            className="max-w-3xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#3B82F6]">How it works</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#FAFAFA] sm:text-4xl">
              Three steps to turn every visit into a review.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-[#A1A1AA]">
              The experience stays simple for customers, and powerful for the teams behind the counter or the desk.
            </p>
          </motion.div>

          <div className="mt-12 grid gap-4 lg:grid-cols-3">
            {HOW_IT_WORKS.map((item, index) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                  whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.1, ease: "circOut" }}
                  whileHover={shouldReduceMotion ? undefined : { y: -6, scale: 1.01, transition: { duration: 0.2, ease: "easeOut" } }}
                >
                  <Card className={`h-full border ${index === 1 ? "border-[#3B82F6]/40 bg-[#3B82F6]/5" : "border-[#27272A]/80 bg-[#0A0A0B]/70"}`}>
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#3B82F6]/10 text-[#3B82F6]">
                      <Icon className="h-5 w-5" />
                    </div>
                    <h3 className="mt-5 text-xl font-semibold text-[#FAFAFA]">{item.title}</h3>
                    <p className="mt-3 text-sm leading-relaxed text-[#A1A1AA]">{item.description}</p>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="about" className="border-b border-[#27272A]/80 bg-[#0A0A0B] py-24">
        <div className="mx-auto grid max-w-7xl gap-12 px-6 lg:grid-cols-[0.95fr_1.05fr] lg:px-8">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "circOut" }}
            className="lg:sticky lg:top-24 lg:h-fit"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#3B82F6]">Social proof</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#FAFAFA] sm:text-4xl">
              Local businesses are winning with real reviews.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-[#A1A1AA]">
              Customers trust businesses that respond, and shops trust RateLocal because the flow feels natural and easy to manage.
            </p>
            <div className="mt-8 rounded-3xl border border-[#27272A]/80 bg-[#121214]/70 p-6">
              <p className="text-4xl font-semibold tracking-tight text-[#FAFAFA]">4.9x</p>
              <p className="mt-2 text-sm text-[#A1A1AA]">more Google reviews collected on average after launching QR prompts.</p>
            </div>
            <div className="mt-6 overflow-hidden rounded-full border border-[#27272A]/80 bg-[#121214]/70 px-4 py-3">
              <div className="marquee-track flex w-max items-center gap-8 text-sm font-medium uppercase tracking-[0.25em] text-[#A1A1AA]">
                {[...CITIES, ...CITIES].map((city, index) => (
                  <span key={`${city}-${index}`} className="whitespace-nowrap">
                    {city}
                  </span>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="space-y-4">
            {TESTIMONIALS.map((testimonial, index) => (
              <motion.div
                key={testimonial.name}
                initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }}
                whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.5, delay: index * 0.08, ease: "circOut" }}
              >
                <Card className="border border-[#27272A]/80 bg-[#121214]/70 p-8" style={{ transform: testimonial.rotation }}>
                  <div className="flex items-center gap-4">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-[#3B82F6] to-[#10B981] text-sm font-semibold text-white">
                      {testimonial.initials}
                    </div>
                    <div>
                      <p className="font-semibold text-[#FAFAFA]">{testimonial.name}</p>
                      <p className="text-sm text-[#A1A1AA]">{testimonial.business}</p>
                    </div>
                  </div>
                  <p className="mt-6 text-base leading-relaxed text-[#A1A1AA]">“{testimonial.quote}”</p>
                  <div className="mt-6 flex items-center gap-1 text-[#3B82F6]">
                    {Array.from({ length: testimonial.rating }).map((_, starIndex) => (
                      <Star key={starIndex} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section id="demo" className="border-b border-[#27272A]/80 bg-[#121214] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <motion.div
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.6, ease: "circOut" }}
            className="max-w-3xl"
          >
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#3B82F6]">Interactive demo</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#FAFAFA] sm:text-4xl">
              See the flow your customers experience in real time.
            </h2>
          </motion.div>

          <div className="mt-12 grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
            <Card className="border border-[#27272A]/80 bg-[#0A0A0B]/70 p-8">
              <div className="flex items-center gap-3 text-[#3B82F6]">
                <MonitorPlay className="h-5 w-5" />
                <span className="text-sm font-semibold uppercase tracking-[0.25em]">Product-led demo</span>
              </div>
              <h3 className="mt-6 text-2xl font-semibold text-[#FAFAFA]">A live review journey, not a static mockup.</h3>
              <p className="mt-4 text-base leading-relaxed text-[#A1A1AA]">
                Click through the experience end to end. Happy customers get a polished Google draft. Unhappy ones get a private feedback form first.
              </p>
              <Button pill className="button-shimmer mt-8 rounded-full bg-[#3B82F6] px-6 py-3.5 text-sm text-white hover:bg-blue-500" onClick={() => setDemoStage("qr")}>
                Reset demo
              </Button>
            </Card>

            <Card className="border border-[#27272A]/80 bg-[#0A0A0B]/80 p-6">
              <div className="grid gap-6 lg:grid-cols-[0.95fr_1.05fr]">
                <div className="rounded-[1.5rem] border border-[#27272A]/70 bg-[#121214]/70 p-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-semibold text-[#FAFAFA]">Customer prompt</p>
                      <p className="mt-1 text-sm text-[#A1A1AA]">Tap the QR and start the journey</p>
                    </div>
                    <Badge variant="muted" className="rounded-full px-3 py-1 text-xs uppercase tracking-[0.2em]">
                      {demoStage === "qr" ? "Ready" : demoStage === "rating" ? "Rating" : demoStage === "review" ? "Draft" : "Feedback"}
                    </Badge>
                  </div>
                  <div className="mt-6 rounded-[1.25rem] border border-dashed border-[#3B82F6]/30 bg-[#3B82F6]/5 p-6 text-center">
                    <QrCode className="mx-auto h-12 w-12 text-[#3B82F6]" />
                    <p className="mt-3 text-base font-semibold text-[#FAFAFA]">Scan the review QR</p>
                    <p className="mt-2 text-sm text-[#A1A1AA]">Customer-friendly and zero-friction.</p>
                    {demoStage === "qr" ? (
                      <Button pill className="button-shimmer mt-5 rounded-full bg-[#3B82F6] px-5 py-2.5 text-sm text-white hover:bg-blue-500" onClick={() => setDemoStage("rating")}>
                        Simulate scan
                      </Button>
                    ) : null}
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-[#27272A]/70 bg-[#121214]/70 p-5">
                  <AnimatePresence mode="wait">
                    {demoStage === "qr" ? (
                      <motion.div key="qr" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} className="space-y-4">
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">Start</p>
                        <p className="text-lg font-semibold text-[#FAFAFA]">How was your visit?</p>
                        <p className="text-sm leading-relaxed text-[#A1A1AA]">The experience begins in seconds and stays lightweight for the customer.</p>
                      </motion.div>
                    ) : demoStage === "rating" ? (
                      <motion.div key="rating" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">Step 2</p>
                        <p className="mt-2 text-lg font-semibold text-[#FAFAFA]">Choose a rating</p>
                        <div className="mt-4 flex items-center gap-2">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <button
                              key={star}
                              type="button"
                              aria-label={`Select ${star} stars`}
                              onClick={() => handleStarSelect(star)}
                              className="rounded-full p-1 text-[#3B82F6] transition hover:scale-110"
                            >
                              <Star className={`h-7 w-7 ${star <= selectedStars ? "fill-current" : "text-[#3B82F6]/30"}`} />
                            </button>
                          ))}
                        </div>
                        <p className="mt-4 text-sm leading-relaxed text-[#A1A1AA]">Select a rating to continue. Four or five stars trigger an easy Google review draft; lower ratings stay private.</p>
                      </motion.div>
                    ) : demoStage === "review" ? (
                      <motion.div key="review" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">Step 3</p>
                        <p className="mt-2 text-lg font-semibold text-[#FAFAFA]">Google review draft is ready</p>
                        <div className="mt-4 rounded-2xl border border-[#27272A]/70 bg-[#0A0A0B]/80 p-4 text-sm leading-relaxed text-[#A1A1AA]">
                          “The team made us feel valued from the moment we arrived. Clean space, clear communication, and a great experience from start to finish.”
                        </div>
                        <Button pill className="button-shimmer mt-5 rounded-full bg-[#3B82F6] px-5 py-2.5 text-sm text-white hover:bg-blue-500">
                          Post to Google
                        </Button>
                      </motion.div>
                    ) : (
                      <motion.div key="feedback" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
                        <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#3B82F6]">Private feedback</p>
                        <p className="mt-2 text-lg font-semibold text-[#FAFAFA]">We will help you make it right.</p>
                        <div className="mt-4 rounded-2xl border border-[#27272A]/70 bg-[#0A0A0B]/80 p-4 text-sm leading-relaxed text-[#A1A1AA]">
                          Share what went wrong and we will route it directly to your team before it becomes a public review.
                        </div>
                        <Button pill className="button-shimmer mt-5 rounded-full bg-[#3B82F6] px-5 py-2.5 text-sm text-white hover:bg-blue-500">
                          Send private feedback
                        </Button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      <section id="pricing" className="bg-[#0A0A0B] py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-8">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#3B82F6]">Pricing</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#FAFAFA] sm:text-4xl">Simple, honest pricing.</h2>
            <p className="mt-4 text-lg leading-relaxed text-[#A1A1AA]">One plan, everything included. No setup fee. 14-day money-back guarantee.</p>
            <div className="mt-8 flex items-center justify-center gap-4 rounded-full border border-[#27272A]/80 bg-[#121214]/70 px-4 py-3">
              <span className={`text-sm font-medium ${billing === "monthly" ? "text-[#FAFAFA]" : "text-[#A1A1AA]"}`}>Monthly</span>
              <Switch checked={billing === "yearly"} onCheckedChange={(value) => setBilling(value ? "yearly" : "monthly")} />
              <span className={`text-sm font-medium ${billing === "yearly" ? "text-[#FAFAFA]" : "text-[#A1A1AA]"}`}>Yearly</span>
            </div>
          </div>

          <div className="mx-auto mt-12 max-w-md">
            <motion.div initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }} whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.5, ease: "circOut" }}>
              <Card className="h-full border border-[#3B82F6]/40 bg-[#3B82F6]/5 shadow-2xl shadow-blue-500/10">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-[#FAFAFA]">{PRICING_PLAN.name}</h3>
                  <Badge variant="default" className="rounded-full bg-[#3B82F6]/10 px-3 py-1 text-[#3B82F6]">Everything included</Badge>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-[#A1A1AA]">{PRICING_PLAN.description}</p>
                <div className="mt-6 flex items-end gap-1">
                  <span className="text-4xl font-semibold tracking-tight text-[#FAFAFA]">{billing === "yearly" ? PRICING_PLAN.yearlyPrice : PRICING_PLAN.monthlyPrice}</span>
                  <span className="pb-1 text-sm text-[#A1A1AA]">{billing === "yearly" ? "/yr" : "/mo"}</span>
                </div>
                <ul className="mt-8 space-y-3 text-sm text-[#A1A1AA]">
                  {PRICING_PLAN.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-[#3B82F6]" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
                <Button pill className="button-shimmer mt-8 w-full rounded-full bg-[#3B82F6] px-5 py-3.5 text-sm text-white hover:bg-blue-500">
                  {PRICING_PLAN.cta}
                </Button>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="border-t border-[#27272A]/80 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.15),transparent_70%)] py-24">
        <div className="mx-auto max-w-4xl px-6 text-center lg:px-8">
          <motion.div initial={shouldReduceMotion ? false : { opacity: 0, y: 20 }} whileInView={shouldReduceMotion ? { opacity: 1 } : { opacity: 1, y: 0 }} viewport={{ once: true, margin: "-100px" }} transition={{ duration: 0.6, ease: "circOut" }}>
            <p className="text-sm font-semibold uppercase tracking-[0.3em] text-[#3B82F6]">Closer</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-[#FAFAFA] sm:text-4xl">Start collecting reviews today.</h2>
            <p className="mt-4 text-lg leading-relaxed text-[#A1A1AA]">Join 200+ BC businesses. No credit card required.</p>
            <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
              <Button pill className="button-shimmer rounded-full bg-[#3B82F6] px-10 py-5 text-lg text-white hover:bg-blue-500">
                Get Started for Free
              </Button>
              <Link href="/help" className="inline-flex items-center justify-center gap-2 rounded-full border border-[#27272A]/80 px-10 py-5 text-lg font-semibold text-[#A1A1AA] transition hover:border-[#3B82F6]/30 hover:text-[#FAFAFA]">
                Book a 5-minute setup call <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-[#27272A]/80 bg-[#121214] py-12">
        <div className="mx-auto grid max-w-7xl gap-10 px-6 lg:grid-cols-4 lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-2xl border border-[#3B82F6]/20 bg-[#3B82F6]/10 text-[#3B82F6]">
                <Star className="h-5 w-5 fill-current" />
              </span>
              <div>
                <p className="font-semibold text-[#FAFAFA]">{BRAND.name}</p>
                <p className="text-sm text-[#A1A1AA]">Turn visits into Google reviews</p>
              </div>
            </div>
            <p className="mt-5 text-sm leading-relaxed text-[#A1A1AA]">Premium review collection for local service businesses that want honest, trustworthy growth.</p>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#A1A1AA]">Product</p>
            <ul className="mt-4 space-y-3 text-sm text-[#A1A1AA]">
              <li><Link href="#product" className="transition hover:text-[#FAFAFA]">How it works</Link></li>
              <li><Link href="#demo" className="transition hover:text-[#FAFAFA]">Interactive demo</Link></li>
              <li><Link href="#pricing" className="transition hover:text-[#FAFAFA]">Pricing</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#A1A1AA]">Company</p>
            <ul className="mt-4 space-y-3 text-sm text-[#A1A1AA]">
              <li><Link href="/about" className="transition hover:text-[#FAFAFA]">About</Link></li>
              <li><Link href="/help" className="transition hover:text-[#FAFAFA]">Support</Link></li>
              <li><Link href="/privacy" className="transition hover:text-[#FAFAFA]">Privacy</Link></li>
            </ul>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-[#A1A1AA]">Legal</p>
            <ul className="mt-4 space-y-3 text-sm text-[#A1A1AA]">
              <li><Link href="/terms" className="transition hover:text-[#FAFAFA]">Terms</Link></li>
            </ul>
          </div>
        </div>
        <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-4 border-t border-[#27272A]/80 px-6 pt-6 text-sm text-[#A1A1AA] lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <p>© 2026 {BRAND.name}. Made in British Columbia.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-2"><BadgeCheck className="h-4 w-4 text-[#3B82F6]" /> Privacy-first review collection</span>
          </div>
        </div>
      </footer>
      </main>
    </>
  );
}
