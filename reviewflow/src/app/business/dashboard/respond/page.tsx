"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

export default function RespondPage() {
  const [suggestion, setSuggestion] = useState(
    "Thank you so much for your kind words, Sarah! We're thrilled you enjoyed the seasonal risotto — it's a team favourite too. We hope to see you again soon!"
  );

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <h1 className="font-display text-2xl font-bold text-text">Respond to Reviews</h1>
      <div className="card-surface p-5">
        <p className="text-sm font-medium text-text">Sarah M. — 5★</p>
        <p className="mt-2 text-sm text-muted">&ldquo;Absolutely loved our dinner here!&rdquo;</p>
        <div className="mt-4 rounded-lg border border-star/20 bg-star/5 p-4">
          <p className="flex items-center gap-1 text-xs font-semibold text-star">
            <Sparkles className="h-3 w-3" /> AI suggestion — edit before sending
          </p>
          <textarea
            value={suggestion}
            onChange={(e) => setSuggestion(e.target.value)}
            className="input-field mt-2 min-h-[100px]"
          />
        </div>
        <button type="button" className="btn-primary-pill mt-4 px-6 py-2 text-sm">Send response</button>
      </div>
    </div>
  );
}
