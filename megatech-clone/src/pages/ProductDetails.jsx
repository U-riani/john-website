// frontend/src/pages/ProductDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { useTranslation } from "react-i18next";
import { getLocalized } from "../utils/getLocalized";
import ProductMiniGallery from "../components/ProductMiniGallery";
import { useProductStore } from "../store/useProductStore";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { t, i18n } = useTranslation();

  const { getProductByIdCached } = useProductStore();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let ignore = false;

    const load = async () => {
      try {
        setLoading(true);
        const data = await getProductByIdCached(id);
        if (!ignore) setProduct(data);
      } catch {
        if (!ignore) setProduct(null);
      } finally {
        if (!ignore) setLoading(false);
      }
    };

    load();

    return () => {
      ignore = true;
    };
  }, [id]);

  if (loading)
    return (
      <div className="flex items-center justify-center py-24 text-gray-500">
        {t("loading")}
      </div>
    );

  if (!product)
    return (
      <div className="flex items-center justify-center py-24 text-gray-500">
        {t("ProductNotFound")}
      </div>
    );

  const descriptionHtml =
    getLocalized(product.description, i18n.language) ||
    "<p>No additional description available.</p>";

  const ingredientsHtml =
    getLocalized(product.ingredients, i18n.language) ||
    "<p>No ingredients information available.</p>";

  const localizedName = getLocalized(product.name, i18n.language);

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-7xl px-4">
        <div className="grid gap-5 lg:grid-cols-2">
          {/* LEFT – GALLERY */}
          <div className="space-y-6">
            <ProductMiniGallery
              images={
                product.images?.length ? product.images : ["/no-image.jpg"]
              }
            />

            {/* Desktop Ingredients */}
            <div className="hidden lg:block rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: ingredientsHtml }}
              />
            </div>
          </div>

          {/* RIGHT – PRODUCT INFO */}
          <div className="space-y-5 lg:sticky lg:top-24 self-start">
            {/* Info Card */}
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-xl">
              {/* Brand + Category */}
              <div className="mb-4 flex flex-wrap gap-2  ">
                {product.brand && (
                  <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-medium text-gray-700 shadow-md">
                    {product.brand}
                  </span>
                )}
                {getLocalized(product.category, i18n.language) && (
                  <span className="rounded-full bg-lime-100 px-3 py-1 text-xs font-medium text-gray-700 shadow-md">
                    {getLocalized(product.category, i18n.language)}
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="text-2xl font-bold tracking-tight text-zinc-900/90 rounded-2xl border border-gray-200/70 shadow-md px-4 py-2">
                {localizedName}
              </h1>

              {/* Price */}
              <div className="mt-6 text-2xl font-semibold text-zinc-900/90  rounded-2xl border border-gray-200/70 shadow-md px-4 py-2">
                ₾ {product.price}
              </div>

              {/* Add to Cart */}
              <button
                onClick={() =>
                  addToCart({
                    id: product._id,
                    title: localizedName,
                    price: product.price,
                    thumbnail: product.images?.[0],
                  })
                }
                disabled={product.stock <= 0}
                className="mt-8 w-full rounded-2xl bg-lime-500 px-6 py-4 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-lime-600 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {t("AddToCart")}
              </button>
            </div>

            {/* Description Card */}
            <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: descriptionHtml }}
              />
            </div>

            {/* Mobile Ingredients */}
            <div className="lg:hidden rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
              <div
                className="prose prose-sm max-w-none text-gray-700"
                dangerouslySetInnerHTML={{ __html: ingredientsHtml }}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
