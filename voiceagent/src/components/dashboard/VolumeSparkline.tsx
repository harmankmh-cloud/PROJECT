export function VolumeSparkline({ values }: { values: number[] }) {
  const max = Math.max(...values, 1);

  return (
    <div className="mt-4 flex h-12 w-full items-end gap-1">
      {values.map((value, i) => {
        const height = Math.max(12, Math.round((value / max) * 100));
        const opacity = 0.2 + (i / Math.max(values.length - 1, 1)) * 0.8;
        return (
          <div
            key={i}
            className="w-full rounded-t-sm bg-electric-blue"
            style={{ height: `${height}%`, opacity }}
          />
        );
      })}
    </div>
  );
}
