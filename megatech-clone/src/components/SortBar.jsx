export default function SortBar({ sort, onChange, total }) {
  return (
    <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
      <div className="text-sm text-gray-600">
        {total} products
      </div>

      <div className="flex items-center gap-2">
        <label className="text-sm text-gray-600">Sort by</label>
        <select
          value={sort}
          onChange={(e) => onChange(e.target.value)}
          className="rounded border px-2 py-1"
        >
          <option value="">Default</option>
          <option value="price_asc">Price: Low → High</option>
          <option value="price_desc">Price: High → Low</option>
          <option value="name_asc">Name: A → Z</option>
          <option value="name_desc">Name: Z → A</option>
        </select>
      </div>
    </div>
  );
}
