// frontend/src/components/Sidebar.jsx

import { useEffect, useState } from "react";
import { getProducts } from "../api/products";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getLocalized } from "../utils/getLocalized";

export default function Sidebar() {
  const [categories, setCategories] = useState([]);
  const {t, i18n} = useTranslation();

  useEffect(() => {
    getProducts()
      .then((products) => {
        const unique = [
          ...new Set(products.map((p) => p.category.en).filter(Boolean)),
        ];
        setCategories(unique.sort());
      })
      .catch(console.error);
  }, []);

  return (
    <div>
      {categories.map((cat, i) => (
        <Link
          key={i}
          to={`/products?category=${cat}`}
          className="block rounded-md px-3 py-2 capitalize hover:bg-gray-100"
        >
          {cat}
        </Link>
      ))}
    </div>
  );
}
