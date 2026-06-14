"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState } from "react";
import { Search, Check, Building2 } from "lucide-react";
import { SEED_BUSINESSES } from "@/data/seed-businesses";

const STEPS = ["Search", "Verify", "Profile", "Live"];

export function ClaimBusinessFlow() {
  const [step, setStep] = useState(0);
  const [query, setQuery] = useState("");
  const [selected, setSelected] = useState<(typeof SEED_BUSINESSES)[0] | null>(null);
  const [verifyMethod, setVerifyMethod] = useState<"phone" | "postcard" | "google">("phone");

  const results = query.length > 1
    ? SEED_BUSINESSES.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()))
    : [];

  return (
    <div className="marketing-container max-w-lg py-10">
      <div className="flex gap-1">
        {STEPS.map((_, i) => (
          <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? "bg-primary" : "bg-border"}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div key={step} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} className="mt-8">
          {step === 0 && (
            <div>
              <h1 className="font-display text-2xl font-bold text-text">Find your business</h1>
              <p className="mt-2 text-muted">Search for your listing on RateLocal</p>
              <div className="relative mt-4">
                <Search className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-muted" />
                <input
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Business name"
                  className="input-field pl-10"
                />
              </div>
              <ul className="mt-4 space-y-2">
                {results.map((b) => (
                  <button
                    key={b.slug}
                    type="button"
                    onClick={() => { setSelected(b); setStep(1); }}
                    className="card-glow flex w-full items-center gap-3 p-4 text-left"
                  >
                    <Building2 className="h-5 w-5 text-primary" />
                    <div>
                      <p className="font-medium text-text">{b.name}</p>
                      <p className="text-sm text-muted">{b.city}</p>
                    </div>
                  </button>
                ))}
              </ul>
            </div>
          )}

          {step === 1 && selected && (
            <div>
              <h1 className="font-display text-2xl font-bold text-text">Verify ownership</h1>
              <p className="mt-2 text-muted">Confirm you own {selected.name}</p>
              <div className="mt-6 space-y-3">
                {(["phone", "postcard", "google"] as const).map((m) => (
                  <button
                    key={m}
                    type="button"
                    onClick={() => setVerifyMethod(m)}
                    className={`card-glow w-full p-4 text-left capitalize ${verifyMethod === m ? "border-primary" : ""}`}
                  >
                    {m === "phone" && "Phone call verification"}
                    {m === "postcard" && "Postcard by mail (5-7 days)"}
                    {m === "google" && "Google Business OAuth"}
                  </button>
                ))}
              </div>
              <button type="button" onClick={() => setStep(2)} className="btn-primary-pill mt-6 w-full py-3">
                Continue
              </button>
            </div>
          )}

          {step === 2 && selected && (
            <div>
              <h1 className="font-display text-2xl font-bold text-text">Complete your profile</h1>
              <div className="mt-4 space-y-4">
                <input placeholder="Business description" className="input-field" />
                <input placeholder="Phone number" className="input-field" />
                <input placeholder="Website" className="input-field" />
              </div>
              <button type="button" onClick={() => setStep(3)} className="btn-primary-pill mt-6 w-full py-3">
                Finish setup
              </button>
            </div>
          )}

          {step === 3 && selected && (
            <div className="text-center">
              <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-success/20">
                <Check className="h-8 w-8 text-success" />
              </div>
              <h1 className="font-display text-2xl font-bold text-text">Your business is live!</h1>
              <p className="mt-2 text-muted">{selected.name} is now on RateLocal</p>
              <Link href="/business/dashboard" className="btn-primary-pill mt-8 inline-block px-8 py-3">
                Go to Dashboard
              </Link>
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
