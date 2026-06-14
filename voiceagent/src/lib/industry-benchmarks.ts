/** Reference ranges for small-business AI receptionist programs (not customer-specific). */
export const INDUSTRY_BENCHMARKS = {
  answerRate: { label: "Answer rate", yoursKey: "answerRate" as const, typical: 94, unit: "%" },
  containment: { label: "Calls handled without transfer", yoursKey: "containment" as const, typical: 72, unit: "%" },
  avgQuality: { label: "Avg call quality score", yoursKey: "quality" as const, typical: 82, unit: "" },
  missedRate: { label: "Missed-call rate", yoursKey: "missed" as const, typical: 18, unit: "%", lowerIsBetter: true },
} as const;
