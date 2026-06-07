"use client";

import { useEffect, useState } from "react";
import { HIPAA_CONTROLS, SOC2_CHECKLIST, TCPA_DISCLOSURE } from "@/lib/compliance/constants";

export default function CompliancePage() {
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");

  useEffect(() => {
    // disclosure loaded client-side from constant
  }, []);

  async function recordConsent(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/compliance/consent", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ phone_number: phone, consent_type: "pewc", consent_text: TCPA_DISCLOSURE }),
    });
    const data = await res.json();
    setMessage(data.ok ? "Consent recorded" : data.error || "Failed");
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-900">Compliance</h1>
      <p className="mt-1 text-slate-500">TCPA consent, HIPAA controls, and SOC 2 readiness.</p>

      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <div className="surface-card p-6">
          <h2 className="font-semibold">TCPA Consent Capture</h2>
          <p className="mt-2 text-sm text-slate-600">{TCPA_DISCLOSURE}</p>
          <form onSubmit={recordConsent} className="mt-4 space-y-3">
            <input className="input-field" placeholder="+1..." value={phone} onChange={(e) => setPhone(e.target.value)} required />
            <button type="submit" className="btn-primary">Record PEWC</button>
          </form>
          {message && <p className="mt-2 text-sm text-teal-600">{message}</p>}
        </div>

        <div className="surface-card p-6">
          <h2 className="font-semibold">HIPAA Controls</h2>
          <ul className="mt-3 space-y-2 text-sm text-slate-600">
            <li>Encryption at rest: {HIPAA_CONTROLS.encryptionAtRest}</li>
            <li>Encryption in transit: {HIPAA_CONTROLS.encryptionInTransit}</li>
            <li>Default retention: {HIPAA_CONTROLS.defaultRetentionDays} days</li>
            <li>BAA required: {HIPAA_CONTROLS.baaRequired ? "Yes" : "No"}</li>
            <li>No model training: {HIPAA_CONTROLS.noModelTraining ? "Yes" : "No"}</li>
          </ul>
        </div>

        <div className="surface-card p-6 lg:col-span-2">
          <h2 className="font-semibold">SOC 2 Type II Checklist</h2>
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {SOC2_CHECKLIST.map((item) => (
              <li key={item} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="text-teal-500">✓</span> {item}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
