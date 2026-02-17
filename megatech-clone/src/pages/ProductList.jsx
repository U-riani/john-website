// frontend/src/pages/ProductList.jsx
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { getProducts } from "../api/products";
import SortBar from "../components/SortBar";
import { useTranslation } from "react-i18next";
import { getLocalized } from "../utils/getLocalized";

export default function ProductList() {
  const [products, setProducts] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

  const [sort, setSort] = useState("");

  const [searchParams] = useSearchParams();
  const q = searchParams.get("q") || "";
  const category = searchParams.get("category");

  useEffect(() => {
    setLoading(true);

    getProducts(q)
      .then((data) => {
        let result = [...data];

        if (category) {
          result = result.filter(
            (p) => getLocalized(p.category, i18n.language) === category,
          );
        }

        setProducts(result);
        setFiltered(result);
      })
      .finally(() => setLoading(false));
  }, [q, category]);

  useEffect(() => {
    let result = [...products];

    if (sort === "price_asc") result.sort((a, b) => a.price - b.price);

    if (sort === "price_desc") result.sort((a, b) => b.price - a.price);

    if (sort === "name_asc")
      result.sort((a, b) =>
        getLocalized(a.name, i18n.language).localeCompare(
          getLocalized(b.name, i18n.language),
        ),
      );

    if (sort === "name_desc")
      result.sort((a, b) =>
        getLocalized(b.name, i18n.language).localeCompare(
          getLocalized(a.name, i18n.language),
        ),
      );

    setFiltered(result);
  }, [sort, products]);

  if (loading) return <div>{t("loading")}</div>;

  return (
    <div>
      <SortBar sort={sort} total={filtered.length} onChange={setSort} />

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {filtered.map((p) => (
          <Link
            key={p._id}
            to={`/products/${p._id}`}
            className="rounded-lg border bg-white p-3 hover:shadow"
          >
            <img
              src={p.images?.[0] || "/no-image.jpg"}
              alt={p.name[i18n.language] || p.name}
              className="mb-2 h-40 w-full object-contain"
            />

            <div className="text-sm font-medium">
              {getLocalized(p.name, i18n.language)}
            </div>

            <div className="mt-1 font-bold">${p.price}</div>
            <div
              className={`text-xs mt-1 ${
                p.stock > 0 ? "text-green-600" : "text-red-600"
              }`}
            >
              {p.stock > 0 ? `In stock: ${p.stock}` : "Out of stock"}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
