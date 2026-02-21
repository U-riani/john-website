// frontend/src/pages/Cart.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import { createOrder } from "../api/orders";
import { useTranslation } from "react-i18next";
import { getLocalized } from "../utils/getLocalized";

export default function Cart() {
  const { items, removeFromCart, changeQty, clearCart } = useCart();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  console.log(items);
  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

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
    return <div className="text-gray-500">{t("yourCartIsEmpty")}</div>;
  }

  return (
    <div className="space-y-4 ">
      <h1 className="text-xl font-bold ">{t("cart")}</h1>
      <div className="border border-gray-200 p-5 space-y-4 shadow-md rounded-2xl">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center gap-4 rounded-2xl border border-gray-200 shadow-md bg-white p-4"
          >
            <img
              src={item.thumbnail}
              alt={item.title}
              className="h-16 w-16 object-contain"
            />

            <div className="flex-1">
              <div className="font-medium">
                {getLocalized(item.title, i18n.language)}
              </div>
              <div className="text-sm text-gray-600">${item.price}</div>
            </div>

            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => changeQty(item.id, Number(e.target.value))}
              className="w-16 rounded-xl border border-gray-300 shadow-md px-2 py-1"
            />

            <button
              onClick={() => removeFromCart(item.id)}
              className="text-sm text-rose-500 hover:underline"
            >
              {t("remove")}
            </button>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between border-t-2 border-gray-500 pt-4">
        <div className="text-lg font-semibold border border-gray-200 px-3 py-2 rounded-2xl shadow-md">
          {t("total")}: ₾{total}
        </div>

        <button
          onClick={onCheckout}
          disabled={loading}
          className="rounded-md bg-lime-400 px-6 py-3 text-white shadow-md disabled:opacity-50 hover:bg-lime-600 cursor-pointer"
        >
          {loading ? "Processing…" : t("submitOrder")}
        </button>
      </div>
    </div>
  );
}
