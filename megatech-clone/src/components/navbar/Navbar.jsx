// frontend/src/components/Navbar.jsx
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import LanguageButton from "./LanguageButton";

export default function Navbar({ onToggleSidebar }) {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { items } = useCart();

  const q = searchParams.get("q") || "";
  const [query, setQuery] = useState(q);

  useEffect(() => {
    setQuery(q);
  }, [q]);

  const onSearch = (e) => {
    e?.preventDefault();

    const value = query.trim();
    const params = new URLSearchParams();

    if (value) {
      params.set("q", value);
    }

    navigate(`/products?${params.toString()}`);
  };

  const clearSearch = () => {
    setQuery("");
    navigate("/products");
  };

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-40 border-b border-gray-200 bg-white/90 backdrop-blur">
      <div className="mx-auto flex max-w-7xl items-center gap-3 md:gap-4 px-4 py-3 sm:px-6 lg:px-8">

        {/* Mobile sidebar toggle */}
        <button
          onClick={onToggleSidebar}
          className="flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 transition hover:bg-gray-100 lg:hidden"
          aria-label="Open menu"
        >
          ☰
        </button>

        {/* Logo */}
        <Link
          to="/"
          className="flex items-center gap-2 whitespace-nowrap text-xl font-bold tracking-tight text-zinc-900"
        >
          MegaTech
        </Link>

        {/* DESKTOP SEARCH */}
        <form onSubmit={onSearch} className=" flex-1 lg:flex">
          <div className="relative w-full max-w-md">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 pr-16 text-sm outline-none transition focus:border-zinc-900 focus:bg-white"
            />

            {/* Clear X */}
            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-12 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                ✕
              </button>
            )}

            {/* Search button */}
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 rounded-xl bg-zinc-900 px-3 py-1 text-xs font-semibold text-white transition hover:bg-zinc-800"
            >
              Go
            </button>
          </div>
        </form>

        {/* Right side */}
        <div className="ml-auto flex items-center gap-3 md:gap-4">
          <LanguageButton />

          {/* Cart */}
          <Link
            to="/cart"
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl border border-gray-200 transition hover:bg-gray-100"
          >
            🛒
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-[20px] items-center justify-center rounded-full bg-rose-500 px-1 text-xs font-semibold text-white shadow-sm">
                {cartCount}
              </span>
            )}
          </Link>
        </div>
      </div>

      {/* MOBILE SEARCH */}
      {/* <div className="border-t border-gray-100 px-4 pb-3 pt-2 lg:hidden">
        <form onSubmit={onSearch} className="relative flex gap-2">
          <div className="relative flex-1">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search..."
              className="w-full rounded-2xl border border-gray-200 bg-gray-50 px-4 py-2 pr-10 text-sm outline-none transition focus:border-zinc-900 focus:bg-white"
            />

            {query && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black"
              >
                ✕
              </button>
            )}
          </div>

          <button
            type="submit"
            className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-zinc-800"
          >
            Go
          </button>
        </form>
      </div> */}
    </header>
  );
}