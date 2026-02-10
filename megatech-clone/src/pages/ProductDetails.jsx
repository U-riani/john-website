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
        src={product.thumbnail}
        alt={product.title}
        className="w-full rounded-lg border object-contain"
      />

      <div className="space-y-4">
        <h1 className="text-2xl font-bold">{product.title}</h1>
        <p className="text-gray-600">{product.description}</p>

        <div className="text-xl font-bold">${product.price}</div>

        <button
          onClick={() =>
            addToCart({
              id: product.id,
              title: product.title,
              price: product.price,
              thumbnail: product.thumbnail,
            })
          }
          className="rounded-md bg-gray-900 px-6 py-3 text-white"
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
}
