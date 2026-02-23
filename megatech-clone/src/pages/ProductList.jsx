// frontend/src/pages/ProductList.jsx
import { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getProducts } from "../api/products";
import Filters from "../components/Filters";
import { useTranslation } from "react-i18next";
import { getLocalized } from "../utils/getLocalized";

const toNumberOrNull = (v) => {
  if (v === "" || v === null || v === undefined) return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : null;
};

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Drawer UI
  const [filtersOpen, setFiltersOpen] = useState(false);

  const { t, i18n } = useTranslation();
  const [sort, setSort] = useState("");

  // Filters state (frontend-only)
  const [nameQuery, setNameQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [selectedSubCategory, setSelectedSubCategory] = useState("");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [selectedBrands, setSelectedBrands] = useState([]);

  // Optional: still support search params for initial query/category
  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const categoryFromUrl = searchParams.get("category") || "";

  // Load products once
  useEffect(() => {
    setLoading(true);

    getProducts()
      .then((data) => {
        setProducts(data);

        if (categoryFromUrl) setSelectedCategory(categoryFromUrl);
        if (q) setNameQuery(q);
      })
      .finally(() => setLoading(false));
  }, [q, categoryFromUrl]);

  // Build filter option lists from products
  const categories = useMemo(() => {
    const set = new Set();
    for (const p of products) {
      const c = getLocalized(p.category, i18n.language);
      if (c) set.add(c);
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [products, i18n.language]);

  const brands = useMemo(() => {
    const set = new Set(products.map((p) => p.brand).filter(Boolean));
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [products]);

  const subCategories = useMemo(() => {
    const set = new Set();
    for (const p of products) {
      const c = getLocalized(p.category, i18n.language);
      if (selectedCategory && c !== selectedCategory) continue;

      const sc = getLocalized(p.subCategory, i18n.language);
      if (sc) set.add(sc);
    }
    return [...set].sort((a, b) => a.localeCompare(b));
  }, [products, i18n.language, selectedCategory]);

  // Apply filters + sort
  const filtered = useMemo(() => {
    const min = toNumberOrNull(minPrice);
    const max = toNumberOrNull(maxPrice);
    const nq = nameQuery.trim().toLowerCase();

    let result = products.filter((p) => {
      const name = (getLocalized(p.name, i18n.language) || "").toLowerCase();
      const cat = getLocalized(p.category, i18n.language) || "";
      const sub = getLocalized(p.subCategory, i18n.language) || "";
      const brand = p.brand || "";
      const price = Number(p.price || 0);

      if (nq && !name.includes(nq)) return false;
      if (selectedCategory && cat !== selectedCategory) return false;
      if (selectedSubCategory && sub !== selectedSubCategory) return false;
      if (selectedBrands.length && !selectedBrands.includes(brand))
        return false;
      if (min !== null && price < min) return false;
      if (max !== null && price > max) return false;

      return true;
    });

    if (sort === "price_asc") result.sort((a, b) => a.price - b.price);
    if (sort === "price_desc") result.sort((a, b) => b.price - a.price);

    if (sort === "name_asc") {
      result.sort((a, b) =>
        (getLocalized(a.name, i18n.language) || "").localeCompare(
          getLocalized(b.name, i18n.language) || "",
        ),
      );
    }
    if (sort === "name_desc") {
      result.sort((a, b) =>
        (getLocalized(b.name, i18n.language) || "").localeCompare(
          getLocalized(a.name, i18n.language) || "",
        ),
      );
    }

    return result;
  }, [
    products,
    i18n.language,
    nameQuery,
    selectedCategory,
    selectedSubCategory,
    selectedBrands,
    minPrice,
    maxPrice,
    sort,
  ]);

  const activeFiltersCount = useMemo(() => {
    let c = 0;
    if (nameQuery.trim()) c++;
    if (selectedCategory) c++;
    if (selectedSubCategory) c++;
    if (minPrice !== "" || maxPrice !== "") c++;
    if (selectedBrands.length) c++;
    return c;
  }, [
    nameQuery,
    selectedCategory,
    selectedSubCategory,
    minPrice,
    maxPrice,
    selectedBrands,
  ]);

  const onFilterChange = (key, value) => {
    if (key === "nameQuery") setNameQuery(value);

    if (key === "category") {
      setSelectedCategory(value);
      setSelectedSubCategory("");
    }

    if (key === "subCategory") setSelectedSubCategory(value);

    if (key === "minPrice") setMinPrice(value);
    if (key === "maxPrice") setMaxPrice(value);

    if (key === "brand") {
      setSelectedBrands((prev) =>
        prev.includes(value)
          ? prev.filter((b) => b !== value)
          : [...prev, value],
      );
    }
  };

  const clearFilters = () => {
    setNameQuery("");
    setSelectedCategory("");
    setSelectedSubCategory("");
    setMinPrice("");
    setMaxPrice("");
    setSelectedBrands([]);
    setSort("");
  };

  // Close on ESC
  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Escape") setFiltersOpen(false);
    };
    if (filtersOpen) window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [filtersOpen]);

  // Prevent background scroll when drawer open
  useEffect(() => {
    if (!filtersOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [filtersOpen]);

  if (loading) return <div>{t("loading")}</div>;

  return (
    <div className="relative">
      {/* Main content */}
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
          {filtered.map((p) => (
            <div
              key={p._id}
              className="flex flex-col overflow-hidden group rounded-2xl border border-gray-200 shadow-md bg-white "
            >
              <div className="rounded-t-xl bg-gray-50 mb-2">
                <img
                  src={p.images?.[0] || "/no-image.jpg"}
                  alt={getLocalized(p.name, i18n.language)}
                  className="h-45 w-full object-cover rounded-t-xl transition group-hover:scale-[1.02]"
                />
              </div>

              <div className="mb-3 text-zinc-500 text-sm font-semibold px-3">
                {getLocalized(p.name, i18n.language)}
              </div>

              <div className="mt-auto flex items-end justify-between  px-3 pb-3">
                <div className="text-zinc-700 font-semibold border border-gray-200 px-2 py-1 rounded-xl shadow-md">{p.price} ₾</div>
                <Link
                  key={p._id}
                  to={`/products/${p._id}`}
                  className=" rounded-xl  px-3 pt-1 pb-1 bg-lime-500/80 text-white transition shadow-md shadow-black/35 hover:bg-lime-600 hover:shadow-md active:bg-lime-500/80 active:shadow-sm"
                >
                  {t("seeMore")}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Floating filter button */}
      <button
        type="button"
        onClick={() => setFiltersOpen(true)}
        className="fixed bottom-5 right-5 z-40 flex items-center gap-2 rounded-full bg-gray-900 px-4 py-3 text-white shadow-lg transition hover:scale-[1.02] active:scale-[0.98]"
      >
        <FilterIcon />
        <span className="text-sm font-medium">Filters</span>
        {activeFiltersCount > 0 && (
          <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-white/15 px-2 text-xs">
            {activeFiltersCount}
          </span>
        )}
      </button>

      {/* Drawer + overlay */}
      <div
        className={`fixed inset-0 z-50 ${
          filtersOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        aria-hidden={!filtersOpen}
      >
        {/* overlay */}
        <div
          onClick={() => setFiltersOpen(false)}
          className={`absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity ${
            filtersOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* drawer */}
        <div
          className={`absolute right-0 top-0 h-full w-[92%] max-w-sm transform bg-white shadow-2xl transition-transform ${
            filtersOpen ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b p-4">
            <div>
              <div className="text-lg font-semibold">Filters</div>
              <div className="text-xs text-gray-500">
                Showing {filtered.length} of {products.length}
              </div>
            </div>

            <button
              type="button"
              onClick={() => setFiltersOpen(false)}
              className="rounded-full p-2 hover:bg-gray-100"
              aria-label="Close filters"
            >
              <CloseIcon />
            </button>
          </div>

          <div className="h-[calc(100%-64px)] overflow-auto p-4">
            <Filters
              sort={sort}
              onSortChange={setSort}
              total={filtered.length}
              nameQuery={nameQuery}
              categories={categories}
              subCategories={subCategories}
              selectedCategory={selectedCategory}
              selectedSubCategory={selectedSubCategory}
              minPrice={minPrice}
              maxPrice={maxPrice}
              brands={brands}
              selectedBrands={selectedBrands}
              onChange={onFilterChange}
              onClear={clearFilters}
            />

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={clearFilters}
                className="rounded-xl border px-4 py-3 text-sm font-medium hover:bg-gray-50"
              >
                Clear all
              </button>

              <button
                type="button"
                onClick={() => setFiltersOpen(false)}
                className="rounded-xl bg-gray-900 px-4 py-3 text-sm font-medium text-white hover:bg-gray-800"
              >
                Apply
              </button>
            </div>

            <div className="mt-3 text-center text-xs text-gray-500">
              Tip: Press <span className="font-semibold">ESC</span> to close.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="opacity-90"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M4 6h16M7 12h10M10 18h4"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      className="text-gray-700"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M6 6l12 12M18 6L6 18"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
}
