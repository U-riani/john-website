// frontend/src/pages/ProductDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/products";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";
import { getLocalized } from "../utils/getLocalized";


export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

  useEffect(() => {
    getProductById(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>{t("loading")}</div>;
  if (!product) return <div>{t("ProductNotFound")}</div>;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <img
        src={product.images?.[0] || "/no-image.jpg"}
        alt={product.name[i18n.language] || product.name.en || "Product Image"}
        className="w-full rounded-lg border object-contain"
      />

      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{getLocalized(product.name, i18n.language)}</h1>

        

        <div className="text-xl font-bold">${product.price}</div>
        <div className="text-sm text-gray-600">
          {product.stock > 0 ? `In stock: ${product.stock}` : "Out of stock"}
        </div>

        <button
          onClick={() =>
            addToCart({
              id: product._id,
              title: product.name,
              price: product.price,
              thumbnail: product.images?.[0],
            })
          }
          disabled={product.stock <= 0}
          className={`rounded-md px-6 py-3 text-white ${
            product.stock <= 0
              ? "bg-gray-400 cursor-not-allowed"
              : "bg-gray-900"
          }`}
        >
          {t("AddToCart")}
        </button>
        <div>
          <h2 className="text-lg font-semibold">{t("Details")}</h2>
          <ul className="list-disc list-inside text-gray-600">
            <li>{t("Brand")}: {getLocalized(product.brand, i18n.language) || "N/A"}</li>
            <li>{t("Category")}: {getLocalized(product.category, i18n.language) || "N/A"}</li>
          </ul>
        </div>
        <div>
          <h2 className="text-lg font-semibold">{t("Description")}</h2>
          <p className="text-gray-600">
            {getLocalized(product.description, i18n.language) || "No additional description available."}
          </p>
        </div>
      </div>
    </div>
  );
}
