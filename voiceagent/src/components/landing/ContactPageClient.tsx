"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Mail, MapPin, Phone } from "lucide-react";
import { GlowButton } from "@/components/ui/GlowButton";
import { Input } from "@/components/ui/Input";
import { fadeUp, stagger } from "@/lib/motion";

export function ContactPageClient() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setStatus("sending");
    try {
      const res = await fetch("/api/leads/capture", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          name,
          source: "contact",
          notes: message,
        }),
      });
      if (!res.ok) throw new Error("Failed");
      setStatus("sent");
      setName("");
      setEmail("");
      setMessage("");
    } catch {
      setStatus("error");
    }
  }

  return (
    <main className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        initial="hidden"
        animate="visible"
        variants={stagger}
        className="grid gap-12 lg:grid-cols-2"
      >
        <motion.div variants={fadeUp}>
          <h1 className="font-display text-4xl font-bold text-white sm:text-5xl">
            Let&apos;s talk
          </h1>
          <p className="mt-4 text-lg text-[var(--color-text-muted)]">
            Questions, partnerships, or just want to say hi? We&apos;re real humans in BC — not a ticket black hole.
          </p>
          <ul className="mt-8 space-y-4 text-sm text-[var(--color-text-muted)]">
            <li className="flex items-center gap-3">
              <Mail className="h-5 w-5 text-[var(--color-accent)]" />
              hello@greetq.com
            </li>
            <li className="flex items-center gap-3">
              <MapPin className="h-5 w-5 text-[var(--color-accent)]" />
              British Columbia, Canada
            </li>
            <li className="flex items-center gap-3">
              <Phone className="h-5 w-5 text-[var(--color-accent)]" />
              Book a demo at{" "}
              <a href="/demo" className="text-[var(--color-primary)] hover:underline">
                greetq.com/demo
              </a>
            </li>
          </ul>
        </motion.div>

        <motion.form
          variants={fadeUp}
          onSubmit={handleSubmit}
          className="card-glow-hover rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-card)] p-6"
        >
          <div className="space-y-4">
            <Input label="Name" value={name} onChange={(e) => setName(e.target.value)} required />
            <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            <div>
              <label className="mb-1 block text-sm text-[var(--color-text-muted)]">Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={5}
                required
                className="w-full rounded-lg border border-[var(--color-border)] bg-[var(--color-bg-elevated)] px-3 py-2 text-sm text-white focus:border-[var(--color-accent)] focus:outline-none focus:ring-2 focus:ring-teal-500/40"
              />
            </div>
            {status === "sent" && (
              <p className="text-sm text-emerald-400">Thanks! We&apos;ll get back to you soon.</p>
            )}
            {status === "error" && (
              <p className="text-sm text-red-400">Something went wrong. Email hello@greetq.com directly.</p>
            )}
            <GlowButton type="submit" disabled={status === "sending"} className="w-full">
              {status === "sending" ? "Sending…" : "Send message"}
            </GlowButton>
          </div>
        </motion.form>
      </motion.div>
    </main>
  );
}
