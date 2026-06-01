export function StarRating({ rating, count }: { rating: number; count?: number }) {
  const full = Math.round(rating * 2) / 2;
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex text-amber-400" aria-label={`${rating} out of 5 stars`}>
        {[1, 2, 3, 4, 5].map((star) => (
          <span key={star} className={star <= full ? "text-amber-400" : star - 0.5 <= full ? "text-amber-300" : "text-slate-200"}>
            ★
          </span>
        ))}
      </div>
      {rating > 0 && (
        <span className="text-sm font-semibold text-brand-950">{rating.toFixed(1)}</span>
      )}
      {count != null && count > 0 && (
        <span className="text-xs text-slate-500">({count})</span>
      )}
    </div>
  );
}
