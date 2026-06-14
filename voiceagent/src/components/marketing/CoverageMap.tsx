export function CoverageMap() {
  const regions = [
    { name: "Canada", detail: "Local numbers via Telnyx & Twilio — BC, AB, ON, and nationwide" },
    { name: "United States", detail: "Inbound AI on US DIDs with same agent stack" },
    { name: "Data residency", detail: "Org-scoped storage; Enterprise options for regional controls" },
  ];

  return (
    <section className="border-t border-border py-16" id="coverage">
      <div className="marketing-container">
        <div className="grid items-center gap-10 lg:grid-cols-2">
          <div>
            <p className="section-eyebrow mb-3">Coverage</p>
            <h2 className="font-display text-2xl text-text md:text-3xl">
              Canada & US inbound — no fake global PoPs
            </h2>
            <p className="mt-3 text-sm text-muted">
              GreetQ routes voice through Telnyx and Twilio carriers you connect. We do not claim
              worldwide edge presence — we focus on reliable North American business lines.
            </p>
            <ul className="mt-6 space-y-4">
              {regions.map((r) => (
                <li key={r.name}>
                  <p className="font-medium text-text">{r.name}</p>
                  <p className="text-sm text-muted">{r.detail}</p>
                </li>
              ))}
            </ul>
          </div>

          <div className="glass-card p-6" aria-hidden>
            <svg viewBox="0 0 400 240" className="h-auto w-full text-primary-glow/40">
              <rect width="400" height="240" fill="currentColor" opacity="0.05" rx="8" />
              <path
                d="M 80 60 L 120 45 L 160 55 L 200 40 L 240 50 L 280 45 L 320 55"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                opacity="0.3"
              />
              <circle cx="120" cy="100" r="28" fill="currentColor" opacity="0.15" />
              <text x="120" y="105" textAnchor="middle" className="fill-text text-[11px] font-medium">
                CA
              </text>
              <circle cx="260" cy="120" r="32" fill="currentColor" opacity="0.15" />
              <text x="260" y="125" textAnchor="middle" className="fill-text text-[11px] font-medium">
                US
              </text>
              <text x="200" y="210" textAnchor="middle" className="fill-muted text-[10px]">
                Illustration — connect your carrier numbers
              </text>
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
