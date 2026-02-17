// frontend/src/components/Navbar.jsx

import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useCart } from "../../context/CartContext";
import LanguageButton from "./LanguageButton";

export default function Navbar({ onToggleSidebar }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { items } = useCart();

  const q = searchParams.get("q") || "";
  const [query, setQuery] = useState(q);

  useEffect(() => {
    setQuery(q);
  }, [q]);

  const onSearch = () => {
    const value = query.trim();
    if (!value) return;

    const params = new URLSearchParams(searchParams);
    params.set("q", value);
    navigate(`/products?${params.toString()}`);
  };

  const cartCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return (
    <header className="sticky top-0 z-30 border-b bg-white">
      <div className="mx-auto flex max-w-7xl items-center gap-3 px-4 py-3">
        <button
          className="rounded-md  hover:bg-gray-100 lg:hidden"
          onClick={onToggleSidebar}
        >
          ☰
        </button>

        <Link to="/" className="text-lg font-bold whitespace-nowrap">
          MegaTech
        </Link>

        <div className="ml-auto flex w-full max-w-xl items-center gap-2">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
            className="w-full rounded-md border px-3 py-2"
            placeholder="Search..."
          />
          <button
            onClick={onSearch}
            className="rounded-md bg-gray-900 px-4 py-2 text-white"
          >
            Search
          </button>
        </div>
        <LanguageButton />
        <Link to="/cart" className="relative rounded-md">
          🛒
          {cartCount > 0 && (
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-600 text-xs text-white">
              {cartCount}
            </span>
          )}
        </Link>
      </div>
    </header>
  );
}
