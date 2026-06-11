"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { Phone } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/Input";

const INDUSTRIES = [
  { id: "salon", label: "Salon", greeting: "Hi! Thanks for calling Glow Studio. How can I help you book today?" },
  { id: "clinic", label: "Clinic", greeting: "Hello, Pacific Dental. I can help schedule an appointment or answer questions." },
  { id: "restaurant", label: "Restaurant", greeting: "Thanks for calling Harbour Bistro! Reservations or takeout?" },
  { id: "auto", label: "Auto Shop", greeting: "North Shore Auto — I can book service or check availability for you." },
  { id: "law", label: "Law Office", greeting: "Harbour Legal intake. I can take your details and schedule a consultation." },
] as const;

const SCRIPT_LINES = [
  { role: "caller", text: "Hi, I'd like to book an appointment." },
  { role: "greetq", text: "" },
  { role: "caller", text: "Thursday afternoon works." },
  { role: "greetq", text: "I have 2:00 PM or 4:30 PM available. Which works better?" },
];

export function DemoSalesPage() {
  const [industry, setIndustry] = useState<(typeof INDUSTRIES)[number]["id"]>("salon");
  const [lineIndex, setLineIndex] = useState(0);
  const [form, setForm] = useState({ name: "", business: "", email: "", phone: "", time: "" });
  const [submitted, setSubmitted] = useState(false);
  const heroRef = useRef(null);
  const inView = useInView(heroRef, { once: true });

  const selected = INDUSTRIES.find((i) => i.id === industry)!;
  const calendlyUrl = process.env.NEXT_PUBLIC_CALENDLY_URL?.trim();

  useEffect(() => {
    const id = setInterval(() => setLineIndex((i) => (i + 1) % SCRIPT_LINES.length), 2200);
    return () => clearInterval(id);
  }, [industry]);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    await fetch("/api/leads/capture", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: form.email,
        business_name: form.business,
        source: "demo-page",
      }),
    });
    setSubmitted(true);
  }

  const activeLine = SCRIPT_LINES[lineIndex];
  const displayText =
    activeLine.role === "greetq"
      ? selected.greeting
      : activeLine.text;

  return (
    <div ref={heroRef} className="marketing-container py-12 md:py-20">
      <motion.div initial={{ opacity: 0, y: 40 }} animate={inView ? { opacity: 1, y: 0 } : {}}>
        <h1 className="font-display text-3xl text-text md:text-4xl">See GreetQ answer a real call</h1>
        <p className="mt-3 max-w-2xl text-muted">
          Pick your industry. Watch the demo. We&apos;ll call you — our AI answers so you can hear it
          yourself.
        </p>
      </motion.div>

      <div className="mt-10 flex flex-wrap gap-2">
        {INDUSTRIES.map((ind) => (
          <button
            key={ind.id}
            type="button"
            onClick={() => setIndustry(ind.id)}
            className={`rounded-lg border px-4 py-2 text-sm transition ${
              industry === ind.id
                ? "border-violet-500 bg-violet-600/20 text-text"
                : "border-border text-muted hover:border-violet-500/40"
            }`}
          >
            {ind.label}
          </button>
        ))}
      </div>

      <div className="mt-10 grid gap-10 lg:grid-cols-2">
        <motion.div
          className="card-glow rounded-xl border border-border p-6"
          animate={{ boxShadow: ["0 0 24px rgba(124,58,237,0.1)", "0 0 40px rgba(124,58,237,0.25)", "0 0 24px rgba(124,58,237,0.1)"] }}
          transition={{ duration: 2.5, repeat: Infinity }}
        >
          <div className="flex items-center justify-between text-xs text-muted">
            <span>Incoming call — demo</span>
            <span className="flex items-center gap-1.5 text-teal-400">
              <span className="pulse-dot bg-teal-400" />
              Live
            </span>
          </div>
          <div className="mt-6 flex justify-center">
            <div className="relative">
              <motion.div
                className="absolute inset-0 rounded-full bg-violet-600/30"
                animate={{ scale: [1, 1.2, 1], opacity: [0.5, 0.2, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <div className="relative flex h-16 w-16 items-center justify-center rounded-full bg-violet-600">
                <Phone className="h-7 w-7 text-white" />
              </div>
            </div>
          </div>
          <motion.div
            key={`${industry}-${lineIndex}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 rounded-xl bg-bg/60 p-4 text-sm"
          >
            <p className="text-xs uppercase tracking-wider text-muted">
              {activeLine.role === "greetq" ? "GreetQ" : "Caller"}
            </p>
            <p className="mt-2 text-text">{displayText}</p>
          </motion.div>
        </motion.div>

        <div>
          <h2 className="font-display text-xl text-text">Book a live demo call</h2>
          <p className="mt-2 text-sm text-muted">
            We&apos;ll call you. Our AI answers so you can hear it yourself.
          </p>
          {submitted ? (
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="mt-6 rounded-xl border border-teal-500/30 bg-teal-500/10 p-6 text-center"
            >
              <p className="font-semibold text-text">You&apos;re on the list!</p>
              <p className="mt-2 text-sm text-muted">We&apos;ll reach out shortly to schedule your demo call.</p>
            </motion.div>
          ) : (
            <form onSubmit={handleSubmit} className="mt-6 space-y-4">
              <Input label="Your name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
              <Input label="Business name" value={form.business} onChange={(e) => setForm({ ...form, business: e.target.value })} required />
              <Input label="Email" type="email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} required />
              <Input label="Phone" type="tel" value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })} />
              <Input label="Best time to call" value={form.time} onChange={(e) => setForm({ ...form, time: e.target.value })} />
              <GlowButton type="submit" className="w-full justify-center">
                Request demo call
              </GlowButton>
            </form>
          )}
          {calendlyUrl ? (
            <div className="mt-8 overflow-hidden rounded-xl border border-border">
              <iframe
                src={calendlyUrl}
                title="Schedule a demo"
                className="h-[480px] w-full"
              />
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
