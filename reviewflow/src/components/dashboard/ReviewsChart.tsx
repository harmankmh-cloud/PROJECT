"use client";

import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { FeedbackEvent } from "@/lib/types";

export function ReviewsChart({ feedback }: { feedback: FeedbackEvent[] }) {
  const byMonth = feedback.reduce<Record<string, number>>((acc, f) => {
    const key = new Date(f.created_at).toLocaleDateString("en-CA", { month: "short", day: "numeric" });
    acc[key] = (acc[key] || 0) + 1;
    return acc;
  }, {});

  const lineData = Object.entries(byMonth).map(([date, count]) => ({ date, count }));
  const ratingDist = [5, 4, 3, 2, 1].map((r) => ({
    rating: `${r}★`,
    count: feedback.filter((f) => f.star_rating === r).length,
  }));

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <div className="card-surface">
        <h3 className="font-display text-base text-text">Reviews over time</h3>
        <div className="mt-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={lineData}>
              <defs>
                <linearGradient id="greenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#16a34a" stopOpacity={0.3} />
                  <stop offset="100%" stopColor="#16a34a" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="date" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Area type="monotone" dataKey="count" stroke="#16a34a" fill="url(#greenGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
      <div className="card-surface">
        <h3 className="font-display text-base text-text">Rating distribution</h3>
        <div className="mt-4 h-48">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={ratingDist}>
              <XAxis dataKey="rating" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="count" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
