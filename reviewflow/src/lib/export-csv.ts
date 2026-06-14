import type { FeedbackEvent } from "./types";

function ratingOf(item: FeedbackEvent): number {
  if (item.star_rating) return item.star_rating;
  if (item.experience_level === "great") return 5;
  if (item.experience_level === "good") return 4;
  if (item.experience_level === "okay") return 3;
  return 2;
}

function escapeCsv(value: string): string {
  if (value.includes('"') || value.includes(",") || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function businessesToCsv(
  rows: {
    name: string;
    slug: string;
    business_type: string;
    plan: string;
    reviewCount: number;
    pageViews: number;
    created_at: string;
  }[]
): string {
  const header = ["Name", "Slug", "Industry", "Plan", "Reviews", "Page visits", "Joined"].join(",");
  const lines = rows.map((row) =>
    [
      escapeCsv(row.name),
      escapeCsv(row.slug),
      escapeCsv(row.business_type),
      escapeCsv(row.plan),
      String(row.reviewCount),
      String(row.pageViews),
      escapeCsv(new Date(row.created_at).toLocaleDateString()),
    ].join(",")
  );
  return [header, ...lines].join("\n");
}

export function platformFeedbackToCsv(
  rows: {
    business_name: string;
    star_rating: number | null;
    is_private: boolean;
    customer_notes: string | null;
    ai_draft: string | null;
    created_at: string;
  }[]
): string {
  const header = ["Date", "Business", "Stars", "Status", "Customer notes", "Review draft"].join(",");
  const lines = rows.map((row) => {
    const status = row.is_private ? "Private (1-2 star)" : "Google ready";
    return [
      escapeCsv(new Date(row.created_at).toLocaleString()),
      escapeCsv(row.business_name),
      row.star_rating ? String(row.star_rating) : "",
      escapeCsv(status),
      escapeCsv(row.customer_notes || ""),
      escapeCsv(row.ai_draft || ""),
    ].join(",");
  });
  return [header, ...lines].join("\n");
}

export function feedbackToCsv(rows: FeedbackEvent[]): string {
  const header = ["Date", "Stars", "Status", "Customer notes", "Review draft"].join(",");
  const lines = rows.map((item) => {
    const rating = ratingOf(item);
    const status = item.is_private ? "Needs attention" : "Google ready";
    return [
      escapeCsv(new Date(item.created_at).toLocaleString()),
      String(rating),
      escapeCsv(status),
      escapeCsv(item.customer_notes || ""),
      escapeCsv(item.ai_draft || ""),
    ].join(",");
  });

  return [header, ...lines].join("\n");
}

export function downloadCsv(filename: string, csv: string) {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = filename;
  link.click();
  URL.revokeObjectURL(url);
}
