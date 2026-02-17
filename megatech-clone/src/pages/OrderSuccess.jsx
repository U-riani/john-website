// frontend/src/pages/OrderForClient.jsx

import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../api/orders";
import { initUnipayPayment } from "../api/payments";
import { useTranslation } from "react-i18next";
import { getLocalized } from "../utils/getLocalized";

export default function OrderSuccess() {
  const POLL_INTERVAL = 4000; // 4 seconds

  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const { t, i18n } = useTranslation();

  

  useEffect(() => {
    getOrderById(orderId)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  useEffect(() => {
    if (!order || order.status !== "pending") return;

    const interval = setInterval(async () => {
      try {
        const freshOrder = await getOrderById(order._id);
        setOrder(freshOrder);
      } catch (e) {
        console.error("Failed to fetch order status: ", e);
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [order]);
console.log(order);
  if (loading) return <div>Loading order…</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-bold text-center">Order placed 🎉</h1>

      <div className="rounded-lg border bg-white p-4">
        <div className="mb-2 text-sm text-gray-600">Order ID</div>
        <div className="font-mono text-sm break-all">{order._id}</div>
      </div>

      <div className="rounded-lg border bg-white p-4">
        <div className="mb-2 font-semibold">Items</div>

        <div className="space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <div>
                {getLocalized(item.title, i18n.language)} × {item.quantity}
              </div>
              <div className="font-medium">${item.price * item.quantity}</div>
            </div>
          ))}
        </div>

        <div className="mt-3 flex justify-between border-t pt-3 font-bold">
          <div>Total</div>
          <div>${order.totalAmount}</div>
        </div>
      </div>

      <div className="rounded-lg border bg-white p-4 text-sm">
        <div>
          Status:{" "}
          <b
            className={
              order.status === "paid"
                ? "text-green-600"
                : order.status === "pending"
                ? "text-yellow-600"
                : "text-red-600"
            }
          >
            {order.status}
          </b>
          {order.status === "pending" && (
            <span className="ml-2 text-xs text-gray-500">
              (waiting for admin confirmation…)
            </span>
          )}
        </div>

      </div>

      {/* {order.status === "pending" && (
        <button
          onClick={onPay}
          disabled={paying}
          className="w-full rounded-md bg-green-600 px-4 py-3 text-white disabled:opacity-50"
        >
          {paying ? "Redirecting…" : "Pay with UniPay"}
        </button>
      )} */}

      <div className="text-center">
        <Link
          to="/"
          className="inline-block rounded-md bg-gray-900 px-4 py-2 text-white"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
