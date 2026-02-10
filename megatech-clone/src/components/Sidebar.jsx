import { useEffect, useState } from "react";
import { getCategories } from "../api/products";
import { Link } from "react-router-dom";

export default function Sidebar() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCategories()
      .then(setCategories)
      .catch(console.error)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="">
      {/* <div className="text-sm font-semibold text-gray-600">Categories</div> */}

      {loading && <div className="text-sm text-gray-400">Loading…</div>}

      {!loading && (
        <div className="">
          {categories.map((cat) => (
            <Link
              key={cat}
              to={`/products?category=${cat}`}
              className="block rounded-md px-3 py-2 capitalize hover:bg-gray-100"
            >
              {cat.replace("-", " ")}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
