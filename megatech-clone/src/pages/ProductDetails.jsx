// frontend/src/pages/ProductDetails.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductById } from "../api/products";
import { useCart } from "../context/CartContext";

export default function ProductDetails() {
  const { id } = useParams();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getProductById(id)
      .then(setProduct)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading…</div>;
  if (!product) return <div>Product not found</div>;

  return (
    <div className="grid gap-6 lg:grid-cols-2">
      <img
        src={product.images?.[0] || "/no-image.jpg"}
        alt={product.name}
        className="w-full rounded-lg border object-contain"
      />

      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{product.name}</h1>

        <p className="text-gray-600">
          {product.description || "No description"}
        </p>

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
          Add to Cart
        </button>
      </div>
    </div>
  );
}
