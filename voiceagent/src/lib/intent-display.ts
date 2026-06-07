export type IntentTag = {
  label: string;
  className: string;
};

export function intentTag(intent: string | null | undefined): IntentTag {
  const value = (intent || "general").toLowerCase();
  if (value.includes("book") || value.includes("appoint") || value.includes("schedul")) {
    return {
      label: "Booking",
      className: "bg-accent-purple/10 text-accent-purple",
    };
  }
  if (value.includes("pric") || value.includes("quote") || value.includes("inquir")) {
    return {
      label: "Inquiry",
      className: "bg-electric-blue/10 text-electric-blue",
    };
  }
  if (value.includes("support") || value.includes("help") || value.includes("password")) {
    return {
      label: "Support",
      className: "bg-accent-yellow/10 text-accent-yellow",
    };
  }
  if (value === "unknown" || value === "general") {
    return {
      label: "Unclassified",
      className: "bg-surface-container-high text-on-surface-variant",
    };
  }
  const label = intent
    ? intent.charAt(0).toUpperCase() + intent.slice(1).slice(0, 24)
    : "General";
  return {
    label,
    className: "bg-electric-blue/10 text-electric-blue",
  };
}

export function isUnclassifiedIntent(intent: string | null | undefined): boolean {
  if (!intent) return true;
  const v = intent.trim().toLowerCase();
  return v === "unknown" || v === "general" || v === "general inquiry";
}
