"use client";

import { useState } from "react";
import { StarDisplay } from "@/components/ui/StarRating";
import { FadeInSection } from "@/components/ui/FadeInSection";

const WIDGETS = [
  {
    id: "badge",
    title: "Review Badge",
    description: "Embed your star rating on your website",
    code: `<div id="ratelocal-badge" data-slug="your-business"></div>\n<script src="https://ratelocal.ca/widgets/badge.js"></script>`,
  },
  {
    id: "feed",
    title: "Review Feed",
    description: "Live-scrolling reviews embed",
    code: `<div id="ratelocal-feed" data-slug="your-business"></div>\n<script src="https://ratelocal.ca/widgets/feed.js"></script>`,
  },
  {
    id: "cta",
    title: "Write a Review Button",
    description: "Drive reviews from your site",
    code: `<a href="https://ratelocal.ca/review/new/your-business" class="ratelocal-cta">Write a Review</a>`,
  },
];

export function WidgetsPageContent() {
  const [active, setActive] = useState("badge");
  const widget = WIDGETS.find((w) => w.id === active)!;

  return (
    <div className="marketing-container py-16">
      <FadeInSection>
        <h1 className="font-display text-3xl font-bold text-text">Widgets & Embeds</h1>
        <p className="mt-2 text-muted">Show your RateLocal reputation on your own website</p>
      </FadeInSection>

      <div className="mt-10 grid gap-8 lg:grid-cols-2">
        <div className="space-y-3">
          {WIDGETS.map((w) => (
            <button
              key={w.id}
              type="button"
              onClick={() => setActive(w.id)}
              className={`card-glow w-full p-4 text-left ${active === w.id ? "border-primary" : ""}`}
            >
              <h3 className="font-semibold text-text">{w.title}</h3>
              <p className="text-sm text-muted">{w.description}</p>
            </button>
          ))}
          <div className="card-glow p-4">
            <h3 className="font-semibold text-text">Google Reviews Sync</h3>
            <p className="text-sm text-muted">Pull in + display Google reviews alongside RateLocal (Pro plan)</p>
          </div>
        </div>

        <div>
          <div className="card-glow mb-4 flex items-center justify-center p-8">
            <div className="text-center">
              <StarDisplay value={4.7} size="lg" showValue />
              <p className="mt-2 text-sm text-muted">Preview — {widget.title}</p>
            </div>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-border bg-bg p-4 text-xs text-muted">
            {widget.code}
          </pre>
          <button
            type="button"
            onClick={() => navigator.clipboard.writeText(widget.code)}
            className="btn-primary-pill mt-4 w-full py-2.5 text-sm"
          >
            Copy embed code
          </button>
        </div>
      </div>
    </div>
  );
}
