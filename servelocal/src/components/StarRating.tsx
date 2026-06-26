function StarIcon({
  fill,
  size = 16,
}: {
  fill: "full" | "half" | "empty";
  size?: number;
}) {
  const id = `half-${size}-${fill}`;
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 20 20"
      aria-hidden="true"
      className="shrink-0"
    >
      {fill === "half" && (
        <defs>
          <linearGradient id={id}>
            <stop offset="50%" stopColor="#f59e0b" />
            <stop offset="50%" stopColor="transparent" />
          </linearGradient>
        </defs>
      )}
      <path
        d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.286 3.957a1 1 0 00.95.69h4.162c.969 0 1.371 1.24.588 1.81l-3.368 2.448a1 1 0 00-.364 1.118l1.286 3.957c.3.921-.755 1.688-1.539 1.118L10 15.347l-3.952 2.878c-.784.57-1.838-.197-1.539-1.118l1.286-3.957a1 1 0 00-.364-1.118L2.063 9.384c-.783-.57-.38-1.81.588-1.81h4.162a1 1 0 00.95-.69L9.049 2.927z"
        fill={
          fill === "full"
            ? "#f59e0b"
            : fill === "half"
              ? `url(#${id})`
              : "transparent"
        }
        stroke={fill === "empty" ? "#d1d5db" : "#f59e0b"}
        strokeWidth="1.5"
      />
    </svg>
  );
}

export function StarRating({
  rating,
  count,
  size = 16,
}: {
  rating: number;
  count?: number;
  size?: number;
}) {
  const rounded = Math.round(rating * 2) / 2;
  return (
    <div className="flex items-center gap-1.5">
      <div
        className="flex items-center gap-0.5"
        aria-label={`${rating} out of 5 stars`}
        role="img"
      >
        {[1, 2, 3, 4, 5].map((star) => {
          const fill: "full" | "half" | "empty" =
            star <= rounded ? "full" : star - 0.5 <= rounded ? "half" : "empty";
          return <StarIcon key={star} fill={fill} size={size} />;
        })}
      </div>
      {rating > 0 && (
        <span className="text-sm font-semibold text-foreground tabular-nums">
          {rating.toFixed(1)}
        </span>
      )}
      {count != null && count > 0 && (
        <span className="text-xs text-muted">({count})</span>
      )}
    </div>
  );
}
