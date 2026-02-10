import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import {
  getProducts,
  getProductsByCategory,
  searchProducts,
} from "../api/products";
import Filters from "../components/Filters";
import SortBar from "../components/SortBar";
import ActiveFilters from "../components/ActiveFilters";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);

  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [minRating, setMinRating] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);
  const [brands, setBrands] = useState([]);

  const [showFilters, setShowFilters] = useState(false);
  const [sort, setSort] = useState("");

  const [searchParams, setSearchParams] = useSearchParams();
  const category = searchParams.get("category");
  const q = searchParams.get("q");

  const handleFilterChange = (key, value) => {
    if (key === "minPrice") setMinPrice(value);
    if (key === "maxPrice") setMaxPrice(value);
    if (key === "minRating") setMinRating(value);

    if (key === "brand") {
      setSelectedBrands((prev) =>
        prev.includes(value)
          ? prev.filter((b) => b !== value)
          : [...prev, value]
      );
    }
  };

  // Fetch products
  useEffect(() => {
    setLoading(true);

    let request;
    if (q) request = searchProducts(q);
    else if (category) request = getProductsByCategory(category);
    else request = getProducts({ limit: 100 });

    request
      .then((data) => setProducts(data.products || []))
      .finally(() => setLoading(false));
  }, [category, q]);

  // Apply filters + sorting
  useEffect(() => {
    let result = [...products];

    if (minPrice) result = result.filter((p) => p.price >= Number(minPrice));
    if (maxPrice) result = result.filter((p) => p.price <= Number(maxPrice));
    if (minRating) result = result.filter((p) => p.rating >= Number(minRating));

    if (selectedBrands.length) {
      result = result.filter((p) => selectedBrands.includes(p.brand));
    }

    if (sort === "price_asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") result.sort((a, b) => b.price - a.price);
    if (sort === "name_asc")
      result.sort((a, b) => a.title.localeCompare(b.title));
    if (sort === "name_desc")
      result.sort((a, b) => b.title.localeCompare(a.title));

    setFiltered(result);
  }, [products, minPrice, maxPrice, minRating, selectedBrands, sort]);

  // Extract brands
  useEffect(() => {
    const uniqueBrands = [
      ...new Set(products.map((p) => p.brand).filter(Boolean)),
    ].sort();
    setBrands(uniqueBrands);
  }, [products]);

  // Clear filters when search query changes
  useEffect(() => {
    setMinPrice("");
    setMaxPrice("");
    setMinRating("");
    setSelectedBrands([]);
  }, [q, category]);

  if (loading) return <div>Loading products…</div>;

  return (
    <div className="flex gap-6">
      {/* Desktop filters */}
      <aside className="hidden w-64 shrink-0 lg:block">
        <Filters
          minPrice={minPrice}
          maxPrice={maxPrice}
          minRating={minRating}
          brands={brands}
          selectedBrands={selectedBrands}
          onChange={handleFilterChange}
        />
      </aside>

      {/* Mobile filters */}
      {showFilters && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div
            className="absolute inset-0 bg-black/40"
            onClick={() => setShowFilters(false)}
          />
          <div className="absolute left-0 top-0 h-full w-80 bg-white p-4 shadow-xl">
            <div className="mb-3 flex items-center justify-between">
              <div className="font-semibold">Filters</div>
              <button onClick={() => setShowFilters(false)} className="text-sm">
                Close
              </button>
            </div>

            <Filters
              minPrice={minPrice}
              maxPrice={maxPrice}
              minRating={minRating}
              brands={brands}
              selectedBrands={selectedBrands}
              onChange={handleFilterChange}
            />
          </div>
        </div>
      )}

      {/* Products */}
      <div className="flex-1">
        <div className="mb-2 flex items-center justify-between lg:hidden">
          <button
            onClick={() => setShowFilters(true)}
            className="rounded-md border px-3 py-2 text-sm"
          >
            Filters
          </button>
        </div>

        {/* Active filters */}
        <ActiveFilters
          search={q}
          minPrice={minPrice}
          maxPrice={maxPrice}
          minRating={minRating}
          selectedBrands={selectedBrands}
          onRemove={(key, value) => {
            if (key === "search") {
              searchParams.delete("q");
              setSearchParams(searchParams);
            }
            if (key === "minPrice") setMinPrice("");
            if (key === "maxPrice") setMaxPrice("");
            if (key === "minRating") setMinRating("");
            if (key === "brand") {
              setSelectedBrands((prev) => prev.filter((b) => b !== value));
            }
          }}
          onClearAll={() => {
            setMinPrice("");
            setMaxPrice("");
            setMinRating("");
            setSelectedBrands([]);
            searchParams.delete("q");
            setSearchParams(searchParams);
            setShowFilters(false);
          }}
        />

        {/* Sort */}
        <SortBar sort={sort} total={filtered.length} onChange={setSort} />

        {/* Grid */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <Link
              key={p.id}
              to={`/products/${p.id}`}
              className="rounded-lg border bg-white p-3 transition hover:shadow"
            >
              <img
                src={p.thumbnail}
                alt={p.title}
                className="mb-2 h-40 w-full object-contain"
              />
              <div className="text-sm font-medium line-clamp-2">{p.title}</div>
              <div className="mt-1 font-bold">${p.price}</div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
