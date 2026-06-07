import "server-only";

type CallRow = {
  transferred?: boolean | null;
  contained?: boolean | null;
  duration_seconds?: number | null;
};

export function computeCallStats(calls: CallRow[]) {
  const total = calls.length;
  const transferred = calls.filter((c) => c.transferred).length;
  const contained = calls.filter((c) => c.contained).length;
  const totalMinutes = calls.reduce(
    (sum, c) => sum + Math.ceil((c.duration_seconds || 0) / 60),
    0
  );

  return {
    total,
    containmentRate: total ? Math.round((contained / total) * 100) : 0,
    transferRate: total ? Math.round((transferred / total) * 100) : 0,
    totalMinutes,
  };
}
