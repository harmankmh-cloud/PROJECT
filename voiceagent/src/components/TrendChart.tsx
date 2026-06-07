"use client";

export function TrendChart({
  data,
  valueKey,
  label,
}: {
  data: Array<{ date: string; [key: string]: string | number | null }>;
  valueKey: string;
  label: string;
}) {
  const values = data.map((d) => Number(d[valueKey]) || 0);
  const max = Math.max(...values, 1);

  if (!data.length) {
    return <p className="text-sm text-slate-400">No data for this period.</p>;
  }

  return (
    <div>
      <p className="mb-3 text-xs font-medium uppercase tracking-wide text-slate-500">{label}</p>
      <div className="flex h-32 items-end gap-1">
        {data.map((row) => {
          const value = Number(row[valueKey]) || 0;
          const height = Math.max(4, Math.round((value / max) * 100));
          return (
            <div key={row.date} className="group flex flex-1 flex-col items-center gap-1">
              <div
                className="w-full rounded-t-md bg-gradient-to-t from-teal-600 to-teal-400 transition group-hover:from-teal-700"
                style={{ height: `${height}%` }}
                title={`${row.date}: ${value}`}
              />
              <span className="hidden text-[10px] text-slate-400 sm:block">
                {row.date.slice(5)}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
