import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api/orders";

export default function Cart() {
  const { items, removeFromCart, changeQty, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const total = items.reduce(
    (sum, i) => sum + i.price * i.quantity,
    0
  );

  const onCheckout = async () => {
    navigate(`/checkout`);
    // try {
    //   setLoading(true);

    //   const order = await createOrder(
    //     items.map((i) => ({
    //       productId: i.id,
    //       title: i.title,
    //       price: i.price,
    //       quantity: i.quantity,
    //     }))
    //   );

    //   // clearCart();
    //   // navigate(`/order-success/${order._id}`);
    // } catch (err) {
    //   alert("Checkout failed. Try again.");
    // } finally {
    //   setLoading(false);
    // }
  };

  if (!items.length) {
    return <div className="text-gray-500">Your cart is empty.</div>;
  }

  return (
    <div className="space-y-4">
      <h1 className="text-xl font-bold">Cart</h1>

      {items.map((item) => (
        <div
          key={item.id}
          className="flex items-center gap-4 rounded-md border bg-white p-4"
        >
          <img
            src={item.thumbnail}
            alt={item.title}
            className="h-16 w-16 object-contain"
          />

          <div className="flex-1">
            <div className="font-medium">{item.title}</div>
            <div className="text-sm text-gray-600">${item.price}</div>
          </div>

          <input
            type="number"
            min="1"
            value={item.quantity}
            onChange={(e) =>
              changeQty(item.id, Number(e.target.value))
            }
            className="w-16 rounded border px-2 py-1"
          />

          <button
            onClick={() => removeFromCart(item.id)}
            className="text-sm text-red-600 hover:underline"
          >
            Remove
          </button>
        </div>
      ))}

      <div className="flex items-center justify-between border-t pt-4">
        <div className="text-lg font-bold">Total: ${total}</div>

        <button
          onClick={onCheckout}
          disabled={loading}
          className="rounded-md bg-gray-900 px-6 py-3 text-white disabled:opacity-50"
        >
          {loading ? "Processing…" : "Checkout"}
        </button>
      </div>
    </div>
  );
}
