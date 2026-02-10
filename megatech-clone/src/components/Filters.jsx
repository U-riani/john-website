export default function Filters({
  minPrice,
  maxPrice,
  brands,
  selectedBrands,
  minRating,
  onChange,
}) {
  return (
    <div className="space-y-5 rounded-lg border bg-white p-4">
      <div className="font-semibold text-lg">Filters</div>

      {/* Price */}
      <div>
        <div className="mb-1 text-sm font-medium text-gray-700">
          Price range
        </div>
        <div className="flex gap-2">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onChange("minPrice", e.target.value)}
            className="w-full rounded border px-2 py-1"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onChange("maxPrice", e.target.value)}
            className="w-full rounded border px-2 py-1"
          />
        </div>
      </div>

      {/* Brand */}
      <div>
        <div className="mb-2 text-sm font-medium text-gray-700">
          Brand
        </div>
        <div className="max-h-40 space-y-1 overflow-auto pr-1">
          {brands.map((brand) => (
            <label
              key={brand}
              className="flex items-center gap-2 text-sm"
            >
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => onChange("brand", brand)}
              />
              {brand}
            </label>
          ))}
        </div>
      </div>

      {/* Rating */}
      <div>
        <div className="mb-1 text-sm font-medium text-gray-700">
          Minimum rating
        </div>
        <select
          value={minRating}
          onChange={(e) => onChange("minRating", e.target.value)}
          className="w-full rounded border px-2 py-1"
        >
          <option value="">Any</option>
          <option value="4">4★ & up</option>
          <option value="3">3★ & up</option>
          <option value="2">2★ & up</option>
        </select>
      </div>
    </div>
  );
}
