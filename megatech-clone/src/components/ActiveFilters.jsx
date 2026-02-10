export default function ActiveFilters({
  search,
  minPrice,
  maxPrice,
  minRating,
  selectedBrands,
  onRemove,
  onClearAll,
}) {
  const hasFilters =
    search ||
    minPrice ||
    maxPrice ||
    minRating ||
    selectedBrands.length > 0;

  if (!hasFilters) return null;

  return (
    <div className="mb-3 flex flex-wrap items-center gap-2 text-sm">
      <span className="text-gray-500">Filters:</span>

      {search && (
        <FilterChip
          label={`Search: "${search}"`}
          onRemove={() => onRemove("search")}
        />
      )}

      {(minPrice || maxPrice) && (
        <FilterChip
          label={`Price: ${minPrice || 0}–${maxPrice || "∞"}`}
          onRemove={() => {
            onRemove("minPrice");
            onRemove("maxPrice");
          }}
        />
      )}

      {minRating && (
        <FilterChip
          label={`Rating ≥ ${minRating}`}
          onRemove={() => onRemove("minRating")}
        />
      )}

      {selectedBrands.map((b) => (
        <FilterChip
          key={b}
          label={`Brand: ${b}`}
          onRemove={() => onRemove("brand", b)}
        />
      ))}

      <button
        onClick={onClearAll}
        className="ml-2 text-xs text-red-600 hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}

function FilterChip({ label, onRemove }) {
  return (
    <span className="flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1">
      {label}
      <button
        onClick={onRemove}
        className="text-gray-500 hover:text-black"
      >
        ✕
      </button>
    </span>
  );
}
