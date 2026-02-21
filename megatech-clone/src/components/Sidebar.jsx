// frontend/src/components/Sidebar.jsx
import { useEffect, useMemo, useState } from "react";
import { getProducts } from "../api/products";
import { Link, useSearchParams } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLocalized } from "../utils/getLocalized";

export default function Sidebar() {
  const { i18n } = useTranslation();

  const [loading, setLoading] = useState(true);
  const [tree, setTree] = useState([]); // [{ name, subs: [] }]
  const [openCat, setOpenCat] = useState(null);

  const [searchParams] = useSearchParams();
  const activeCategory = searchParams.get("category") || "";
  const activeSubCategory = searchParams.get("subCategory") || "";

  useEffect(() => {
    let mounted = true;

    setLoading(true);
    getProducts()
      .then((products) => {
        if (!mounted) return;

        // Build category -> subcategory set
        const map = new Map(); // cat -> Set(subs)

        for (const p of products) {
          const cat = getLocalized(p.category, i18n.language);
          if (!cat) continue;

          const sub = getLocalized(p.subCategory, i18n.language);

          if (!map.has(cat)) map.set(cat, new Set());
          if (sub) map.get(cat).add(sub);
        }

        const built = [...map.entries()]
          .map(([name, subsSet]) => ({
            name,
            subs: [...subsSet].sort((a, b) => a.localeCompare(b)),
          }))
          .sort((a, b) => a.name.localeCompare(b.name));

        setTree(built);

        // Auto-open active category (nice UX)
        if (activeCategory) setOpenCat(activeCategory);
      })
      .catch(console.error)
      .finally(() => {
        if (mounted) setLoading(false);
      });

    return () => {
      mounted = false;
    };
    // important: re-run on language change so names rebuild in new lang
  }, [i18n.language, activeCategory]);

  const toggle = (catName) => {
    setOpenCat((prev) => (prev === catName ? null : catName));
  };

  if (loading) {
    return (
      <div className="space-y-2">
        <div className="h-10 w-full animate-pulse rounded-xl bg-gray-100" />
        <div className="h-10 w-full animate-pulse rounded-xl bg-gray-100" />
        <div className="h-10 w-full animate-pulse rounded-xl bg-gray-100" />
      </div>
    );
  }

  if (!tree.length) {
    return <div className="text-sm text-gray-500">No categories</div>;
  }

  return (
    <div className="rounded-2xl border border-gray-300 bg-white p-3 shadow-sm">
      <div className="px-2 pb-2 text-xs font-semibold uppercase tracking-wide text-gray-500">
        Categories
      </div>

      <div className="space-y-1">
        {tree.map((cat) => {
          const isOpen = openCat === cat.name;
          const isActiveCat = activeCategory === cat.name;

          return (
            <div
              key={cat.name}
              className="rounded-xl border border-gray-300 px-2 py-1 shadow-md"
            >
              {/* Category row */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => toggle(cat.name)}
                  className={`flex h-10 w-10 items-center justify-center rounded-xl border transition ${
                    isOpen
                      ? "border-gray-300 bg-lime-300 text-white "
                      : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
                  }`}
                  aria-label={isOpen ? "Collapse" : "Expand"}
                >
                  <ChevronIcon open={isOpen} />
                </button>

                <Link
                  to={`/products?category=${encodeURIComponent(cat.name)}`}
                  className={`bg-lime-300 flex-1 rounded-xl px-3 py-2 text-sm font-medium transition ${
                    isActiveCat
                      ? "bg-lime-300 text-white "
                      : "text-gray-800  hover:bg-gray-50"
                  }`}
                  onClick={() => setOpenCat(cat.name)} // keep open after click
                >
                  {cat.name}
                </Link>
              </div>

              {/* Subcategories */}
              {isOpen && (
                <div className="mt-2 space-y-1 pl-12 pr-2 pb-2 animate-fadeIn">
                  {cat.subs.length > 0 ? (
                    cat.subs.map((sub) => {
                      const isActiveSub =
                        activeCategory === cat.name &&
                        activeSubCategory === sub;

                      return (
                        <Link
                          key={sub}
                          to={`/products?category=${encodeURIComponent(
                            cat.name,
                          )}&subCategory=${encodeURIComponent(sub)}`}
                          className={`block rounded-xl px-3 py-2 text-sm transition border border-gray-300 shadow-md ${
                            isActiveSub
                              ? "bg-lime-200 text-gray-900 font-semibold"
                              : "text-gray-700 hover:bg-gray-50"
                          }`}
                        >
                          {sub}
                        </Link>
                      );
                    })
                  ) : (
                    <div className="text-xs text-gray-500">
                      No subcategories
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChevronIcon({ open }) {
  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      className={`transition-transform ${open ? "rotate-90" : "rotate-0"}`}
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M9 18l6-6-6-6"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
