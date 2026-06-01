import type { StarRating } from "./types";

export function buildFallbackReviewOptions(input: {
  businessName: string;
  starRating: number;
  customerNotes: string;
}): string[] {
  const notes = input.customerNotes.trim();
  const name = input.businessName;
  const stars = input.starRating;

  if (stars <= 2) {
    return [
      `My visit to ${name} wasn't great. ${notes} I hope they can improve.`,
      `Disappointed with ${name} today. ${notes}`,
      `Below expectations at ${name}. ${notes} Sharing an honest review.`,
    ];
  }
  if (stars === 3) {
    return [
      `Average experience at ${name}. ${notes} Some things were fine, some could improve.`,
      `${name} was okay overall. ${notes}`,
      `Decent visit to ${name}. ${notes} Nothing amazing, nothing terrible.`,
    ];
  }
  if (stars === 4) {
    return [
      `Good experience at ${name}. ${notes} Would visit again.`,
      `I enjoyed my visit to ${name}. ${notes} Solid service overall.`,
      `${name} did a nice job. ${notes} Happy to recommend.`,
    ];
  }
  return [
    `Excellent experience at ${name}! ${notes} Highly recommend.`,
    `Loved ${name}. ${notes} Five stars from me.`,
    `Outstanding visit to ${name}. ${notes} Will definitely be back.`,
  ];
}

export function starRatingFromInput(value: unknown): StarRating | null {
  const n = typeof value === "number" ? value : parseInt(String(value), 10);
  if (n >= 1 && n <= 5) return n as StarRating;
  return null;
}
