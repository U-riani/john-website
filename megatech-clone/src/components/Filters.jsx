// frontend/src/components/Filters.jsx
export default function Filters({
  sort,
  onSortChange,
  total,

  nameQuery,
  categories,
  subCategories,
  selectedCategory,
  selectedSubCategory,
  minPrice,
  maxPrice,
  brands,
  selectedBrands,

  onChange,
  onClear,
}) {
  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <div className="text-sm font-semibold text-gray-900">
            Refine results
          </div>
          <div className="text-xs text-gray-500">
            {total} products found
          </div>
        </div>

        <button
          type="button"
          onClick={onClear}
          className="text-xs font-medium text-gray-600 hover:text-gray-900"
        >
          Reset
        </button>
      </div>

      {/* SORT (NEW – Modern Style) */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
          Sort by
        </div>

        <div className="grid grid-cols-1 gap-2">
          <SortOption
            active={sort === ""}
            label="Default"
            onClick={() => onSortChange("")}
          />
          <SortOption
            active={sort === "price_asc"}
            label="Price: Low → High"
            onClick={() => onSortChange("price_asc")}
          />
          <SortOption
            active={sort === "price_desc"}
            label="Price: High → Low"
            onClick={() => onSortChange("price_desc")}
          />
          <SortOption
            active={sort === "name_asc"}
            label="Name: A → Z"
            onClick={() => onSortChange("name_asc")}
          />
          <SortOption
            active={sort === "name_desc"}
            label="Name: Z → A"
            onClick={() => onSortChange("name_desc")}
          />
        </div>
      </div>

      {/* Name */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-2 text-xs font-semibold uppercase tracking-wide text-gray-600">
          Name
        </div>
        <input
          type="text"
          placeholder="Search by name..."
          value={nameQuery}
          onChange={(e) => onChange("nameQuery", e.target.value)}
          className="w-full rounded-xl border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:bg-white"
        />
      </div>

      {/* Category */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
          Category
        </div>

        <select
          value={selectedCategory}
          onChange={(e) => onChange("category", e.target.value)}
          className="w-full rounded-xl border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:bg-white"
        >
          <option value="">All categories</option>
          {categories.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>

        <div className="mt-3">
          <select
            value={selectedSubCategory}
            onChange={(e) => onChange("subCategory", e.target.value)}
            className="w-full rounded-xl border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:bg-white disabled:opacity-50"
            disabled={!subCategories.length}
          >
            <option value="">All sub categories</option>
            {subCategories.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Price */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
          Price range
        </div>

        <div className="grid grid-cols-2 gap-3">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => onChange("minPrice", e.target.value)}
            className="rounded-xl border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:bg-white"
          />
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => onChange("maxPrice", e.target.value)}
            className="rounded-xl border bg-gray-50 px-3 py-2 text-sm outline-none focus:border-gray-900 focus:bg-white"
          />
        </div>
      </div>

      {/* Brand */}
      <div className="rounded-2xl border bg-white p-4 shadow-sm">
        <div className="mb-3 text-xs font-semibold uppercase tracking-wide text-gray-600">
          Brand
        </div>

        <div className="max-h-56 space-y-2 overflow-auto pr-1">
          {brands.map((brand) => {
            const checked = selectedBrands.includes(brand);
            return (
              <button
                key={brand}
                type="button"
                onClick={() => onChange("brand", brand)}
                className={`flex w-full items-center justify-between rounded-xl border px-3 py-2 text-left text-sm transition ${
                  checked
                    ? "border-gray-900 bg-gray-900 text-white"
                    : "border-gray-200 bg-white hover:bg-gray-50"
                }`}
              >
                <span className="truncate">{brand}</span>
                <span
                  className={`ml-3 inline-flex h-5 w-5 items-center justify-center rounded-full border text-xs ${
                    checked ? "border-white/30" : "border-gray-300 text-gray-600"
                  }`}
                >
                  {checked ? "✓" : ""}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}

function SortOption({ active, label, onClick }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`w-full rounded-xl border px-3 py-2 text-left text-sm transition ${
        active
          ? "border-gray-900 bg-gray-900 text-white"
          : "border-gray-200 bg-white hover:bg-gray-50"
      }`}
    >
      {label}
    </button>
  );
}