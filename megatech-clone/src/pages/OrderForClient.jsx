// frontend/src/pages/OrderForClient.jsx
import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../api/orders";

export default function OrderForClient() {
  const POLL_INTERVAL = 4000; // 4 seconds

  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);


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
        // silently fail, we retry anyway
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [order]);

  if (loading) return <div>Loading order…</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <h1 className="text-2xl font-bold text-center">View Your Order</h1>

      <div className="rounded-lg border bg-white p-4">
        <div className="mb-2 text-sm text-gray-600">Order ID</div>
        <div className="font-mono text-sm break-all">{order._id}</div>
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
      <div className="rounded-lg border bg-white p-4">
        <div className="mb-2 font-semibold">Items</div>

        <div className="space-y-2">
          {order.items.map((item, idx) => (
            <div key={idx} className="flex justify-between text-sm">
              <div>
                {item.title} × {item.quantity}
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
