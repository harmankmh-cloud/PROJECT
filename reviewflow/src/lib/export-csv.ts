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
