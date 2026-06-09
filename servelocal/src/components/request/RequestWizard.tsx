"use client";

import { useMemo, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Loader2 } from "lucide-react";
import Link from "next/link";
import { TRADE_CITIES, isValidCitySlug } from "@/lib/constants";
import {
  formatSubmitError,
  isValidPhone,
  normalizePhone,
  resolveCategories,
} from "@/lib/form-utils";
import type { ServiceCategory, ServiceProvider } from "@/lib/types";
import { ServiceCategoryPicker } from "@/components/ServiceCategoryPicker";
import { ShimmerButton } from "@/components/ui/ShimmerButton";
import { Avatar } from "@/components/ui/Avatar";
import { fadeUp } from "@/lib/motion";

const STEPS = [
  "What do you need?",
  "Tell us about the job",
  "Where are you located?",
  "When do you need it?",
  "Your contact info",
  "Quotes incoming!",
] as const;

const URGENCY_OPTIONS = [
  { value: "asap", label: "ASAP" },
  { value: "this_week", label: "This week" },
  { value: "flexible", label: "Flexible" },
] as const;

type Props = {
  categories: ServiceCategory[];
  defaultCity?: string;
  defaultCategory?: string;
  defaultPro?: string;
  defaultName?: string;
  defaultEmail?: string;
};

export function RequestWizard({
  categories,
  defaultCity,
  defaultCategory,
  defaultPro,
  defaultName = "",
  defaultEmail = "",
}: Props) {
  const safeCategories = useMemo(() => resolveCategories(categories), [categories]);
  const [step, setStep] = useState(0);
  const [matching, setMatching] = useState(false);

  const [categorySlug, setCategorySlug] = useState(
    safeCategories.find((c) => c.slug === defaultCategory)?.slug || safeCategories[0]?.slug || ""
  );
  const [citySlug, setCitySlug] = useState<string>(
    isValidCitySlug(defaultCity) ? defaultCity : TRADE_CITIES[0].slug
  );
  const [description, setDescription] = useState("");
  const [urgency, setUrgency] = useState("this_week");
  const [address, setAddress] = useState("");
  const [preferredDate, setPreferredDate] = useState("");
  const [preferredTime, setPreferredTime] = useState("");
  const [customerName, setCustomerName] = useState(defaultName);
  const [customerPhone, setCustomerPhone] = useState("");
  const [customerEmail, setCustomerEmail] = useState(defaultEmail);
  const [error, setError] = useState("");
  const [matches, setMatches] = useState<ServiceProvider[]>([]);

  function next() {
    setError("");
    if (step === 1 && description.trim().length < 10) {
      setError("Describe your job in at least 10 characters.");
      return;
    }
    if (step === 2 && !address.trim()) {
      setError("Enter your address or neighbourhood.");
      return;
    }
    if (step === 4) {
      if (!customerName.trim()) {
        setError("Enter your name.");
        return;
      }
      if (!isValidPhone(customerPhone)) {
        setError("Enter a valid 10-digit phone number.");
        return;
      }
      submitRequest();
      return;
    }
    setStep((s) => Math.min(s + 1, STEPS.length - 1));
  }

  function back() {
    setError("");
    setStep((s) => Math.max(s - 1, 0));
  }

  async function submitRequest() {
    setMatching(true);
    setStep(5);
    setError("");

    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          categorySlug,
          citySlug,
          customerName: customerName.trim(),
          customerPhone: normalizePhone(customerPhone),
          customerEmail: customerEmail.trim(),
          description: `${description.trim()}${address ? `\n\nAddress: ${address}` : ""}${preferredDate ? `\nPreferred: ${preferredDate} ${preferredTime}` : ""}${defaultPro ? `\n\nRequested pro: ${defaultPro}` : ""}`,
          urgency,
        }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Submit failed");
      setMatches((data.matches || []).slice(0, 5));
    } catch (err) {
      setError(formatSubmitError(err instanceof Error ? err.message : "Submit failed"));
      setStep(4);
    } finally {
      setMatching(false);
    }
  }

  return (
    <div className="mx-auto max-w-xl">
      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between text-xs text-muted">
          {STEPS.slice(0, 5).map((label, i) => (
            <span key={label} className={i <= step ? "text-primary font-semibold" : ""}>
              {i + 1}
            </span>
          ))}
        </div>
        <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
          <motion.div
            className="h-full bg-gradient-to-r from-amber-500 to-sky-500"
            animate={{ width: `${((step + 1) / STEPS.length) * 100}%` }}
            transition={{ duration: 0.4 }}
          />
        </div>
        <p className="mt-2 text-sm font-medium text-foreground">{STEPS[step]}</p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} variants={fadeUp} initial="hidden" animate="visible" exit="hidden">
          {step === 0 && (
            <div>
              <p className="mb-4 text-sm text-muted">Select the service you need</p>
              <ServiceCategoryPicker
                categories={safeCategories}
                value={categorySlug}
                onChange={setCategorySlug}
              />
            </div>
          )}

          {step === 1 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Describe your project</label>
                <textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  rows={5}
                  placeholder="What's the job? Include size, materials, access issues..."
                  className="input-focus-glow mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                />
              </div>
              <div>
                <p className="text-sm font-medium text-foreground">Urgency</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {URGENCY_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setUrgency(opt.value)}
                      className={`rounded-full px-4 py-2 text-sm font-medium ${
                        urgency === opt.value
                          ? "bg-primary text-white"
                          : "border border-border text-muted"
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Your address</label>
                <input
                  value={address}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="123 Main St, Surrey, BC"
                  className="input-focus-glow mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">City</label>
                <select
                  value={citySlug}
                  onChange={(e) => setCitySlug(e.target.value)}
                  className="input-focus-glow mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                >
                  {TRADE_CITIES.map((c) => (
                    <option key={c.slug} value={c.slug}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-foreground">Preferred date</label>
                <input
                  type="date"
                  value={preferredDate}
                  onChange={(e) => setPreferredDate(e.target.value)}
                  className="input-focus-glow mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                />
              </div>
              <div>
                <label className="text-sm font-medium text-foreground">Preferred time</label>
                <select
                  value={preferredTime}
                  onChange={(e) => setPreferredTime(e.target.value)}
                  className="input-focus-glow mt-2 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
                >
                  <option value="">Any time</option>
                  <option value="morning">Morning (8am–12pm)</option>
                  <option value="afternoon">Afternoon (12pm–5pm)</option>
                  <option value="evening">Evening (5pm–8pm)</option>
                </select>
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="space-y-4">
              <input
                value={customerName}
                onChange={(e) => setCustomerName(e.target.value)}
                placeholder="Your name"
                className="input-focus-glow w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
              />
              <input
                type="email"
                value={customerEmail}
                onChange={(e) => setCustomerEmail(e.target.value)}
                placeholder="Email"
                className="input-focus-glow w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
              />
              <input
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                placeholder="Phone (604-555-1234)"
                className="input-focus-glow w-full rounded-xl border border-border bg-background px-4 py-3 text-sm"
              />
            </div>
          )}

          {step === 5 && (
            <div className="text-center">
              {matching ? (
                <div className="py-8">
                  <Loader2 className="mx-auto h-12 w-12 animate-spin text-primary" />
                  <p className="mt-4 font-semibold text-foreground">Matching you with pros...</p>
                  <p className="mt-2 text-sm text-muted">Sending your request to up to 5 verified pros</p>
                </div>
              ) : (
                <>
                  <CheckCircle2 className="mx-auto h-16 w-16 text-success" />
                  <h2 className="font-display mt-4 text-2xl font-bold text-foreground">
                    Quotes incoming! 🎉
                  </h2>
                  <p className="mt-2 text-sm text-muted">
                    Your request was sent to {matches.length} matched pro{matches.length === 1 ? "" : "s"}.
                  </p>
                  {matches.length > 0 && (
                    <ul className="mt-6 space-y-3 text-left">
                      {matches.map((p) => (
                        <li
                          key={p.id}
                          className="flex items-center gap-3 rounded-[14px] border border-border bg-surface p-3"
                        >
                          <Avatar name={p.display_name} size="sm" />
                          <div>
                            <p className="font-semibold text-foreground">{p.display_name}</p>
                            <Link href={`/pro/${p.slug}`} className="text-xs text-primary hover:underline">
                              View profile →
                            </Link>
                          </div>
                        </li>
                      ))}
                    </ul>
                  )}
                  <p className="mt-6 text-sm text-muted">
                    While you wait,{" "}
                    <Link href={`/services/${categorySlug}`} className="text-primary hover:underline">
                      browse top-rated pros
                    </Link>
                  </p>
                </>
              )}
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {error && <p className="mt-4 text-sm text-red-500">{error}</p>}

      {step < 5 && (
        <div className="mt-8 flex gap-3">
          {step > 0 && (
            <button
              type="button"
              onClick={back}
              className="flex-1 rounded-full border border-border py-3 text-sm font-semibold text-foreground"
            >
              Back
            </button>
          )}
          <ShimmerButton type="button" onClick={next} className="flex-1">
            {step === 4 ? "Submit & Match Pros" : "Continue"}
          </ShimmerButton>
        </div>
      )}
    </div>
  );
}
