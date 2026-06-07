export function StatCard({ label, value, hint }: { label: string; value: string | number; hint?: string }) {
  return (
    <div className="surface-card p-5">
      <p className="text-sm text-on-surface-variant">{label}</p>
      <p className="mt-1 text-2xl font-bold text-ghost-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-slate-text">{hint}</p>}
    </div>
  );
}
