"use client";

import { useEffect, useState } from "react";

export default function SettingsPage() {
  const [dataRegion, setDataRegion] = useState("us");
  const [whiteLabel, setWhiteLabel] = useState({ brandName: "", domain: "" });
  const [transferPhone, setTransferPhone] = useState("");
  const [hipaa, setHipaa] = useState(false);

  useEffect(() => {
    setDataRegion(process.env.NEXT_PUBLIC_DEFAULT_DATA_REGION || "us");
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold text-brand-900">Settings</h1>
      <p className="mt-1 text-slate-500">White-label, data residency, and organization defaults.</p>

      <div className="mt-8 space-y-6">
        <div className="surface-card p-6 space-y-4">
          <h2 className="font-semibold">Organization</h2>
          <input className="input-field" placeholder="Default transfer phone" value={transferPhone} onChange={(e) => setTransferPhone(e.target.value)} />
        </div>

        <div className="surface-card p-6 space-y-4">
          <h2 className="font-semibold">Data Residency (EU)</h2>
          <select className="input-field" value={dataRegion} onChange={(e) => setDataRegion(e.target.value)}>
            <option value="us">United States</option>
            <option value="eu">European Union</option>
          </select>
          <p className="text-xs text-slate-500">EU region routes storage and processing to EU infrastructure when enabled.</p>
        </div>

        <div className="surface-card p-6 space-y-4">
          <h2 className="font-semibold">White-label (Enterprise)</h2>
          <input className="input-field" placeholder="Brand name" value={whiteLabel.brandName} onChange={(e) => setWhiteLabel({ ...whiteLabel, brandName: e.target.value })} />
          <input className="input-field" placeholder="Custom domain" value={whiteLabel.domain} onChange={(e) => setWhiteLabel({ ...whiteLabel, domain: e.target.value })} />
        </div>

        <div className="surface-card p-6">
          <label className="flex items-center gap-3">
            <input type="checkbox" checked={hipaa} onChange={(e) => setHipaa(e.target.checked)} />
            <span className="text-sm">Enable HIPAA mode (BAA required, 30-day retention default)</span>
          </label>
        </div>

        <div className="surface-card p-6">
          <h2 className="font-semibold">Enterprise SSO</h2>
          <p className="mt-2 text-sm text-slate-600">Configure SAML_ENTRY_POINT, SAML_ISSUER, and SAML_CERT in environment.</p>
          <a href="/api/auth/sso" className="btn-secondary mt-4 inline-block text-sm">Test SSO login</a>
        </div>
      </div>
    </div>
  );
}
