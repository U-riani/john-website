import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById, updateOrderStatus } from "../api/orders";
import { orderStatus } from "../constants/orderStatus";
import { STATUS_STYLES } from "../constants/statusStyles";

export default function OrderDetails() {
  const { id } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [savingStatus, setSavingStatus] = useState(false);

  useEffect(() => {
    getOrderById(id)
      .then(setOrder)
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <div>Loading order…</div>;
  if (!order) return <div>Order not found</div>;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">Order Details</h1>

        <Link to="/orders" className="text-sm text-blue-600 hover:underline">
          ← Back to orders
        </Link>
      </div>

      {/* Order meta */}
      <div className="grid gap-4 sm:grid-cols-2">
        <InfoCard label="Order ID">
          <span className="font-mono text-xs break-all">{order._id}</span>
        </InfoCard>

        <InfoCard label="Change Status">
          <div className="flex items-center justify-between">
            <span
              className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold border
    ${STATUS_STYLES[order.status]}`}
            >
              {order.status}
            </span>
            <div className="flex gap-2 items-center">
              <select
                value={order.status}
                disabled={savingStatus}
                onChange={(e) => setOrder({ ...order, status: e.target.value })}
                className={`rounded border px-2 py-1 text-sm transition-colors disabled:opacity-50
    ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-700"}`}
              >
                {Object.keys(orderStatus).map((s) => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
              </select>

              <button
                disabled={savingStatus}
                onClick={async () => {
                  try {
                    setSavingStatus(true);

                    const updated = await updateOrderStatus({
                      id: order._id,
                      status: order.status,
                    });

                    // backend returns { order, success }
                    setOrder(updated.order ?? updated);
                  } catch (e) {
                    alert("Failed to update status");
                  } finally {
                    setSavingStatus(false);
                  }
                }}
                className="rounded bg-blue-600 px-3 py-1 text-sm text-white disabled:opacity-50"
              >
                {savingStatus ? "Saving…" : "Save"}
              </button>
            </div>
          </div>
        </InfoCard>

        <InfoCard label="Payment Provider">{order.paymentProvider}</InfoCard>

        <InfoCard label="Payment Reference">
          <span className="font-mono text-xs">
            {order.paymentReference || "-"}
          </span>
        </InfoCard>

        <InfoCard label="Created At">
          {new Date(order.createdAt).toLocaleString()}
        </InfoCard>

        <InfoCard label="Last Update">
          {new Date(order.updatedAt).toLocaleString()}
        </InfoCard>
      </div>

      {/* Items */}
      <div className="rounded-lg bg-white shadow">
        <table className="w-full text-sm">
          <thead className="border-b bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-center">Qty</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-right">Total</th>
            </tr>
          </thead>

          <tbody>
            {order.items.map((item, idx) => (
              <tr key={idx} className="border-b">
                <td className="px-4 py-3">{item.title}</td>
                <td className="px-4 py-3 text-center">{item.quantity}</td>
                <td className="px-4 py-3 text-right">${item.price}</td>
                <td className="px-4 py-3 text-right font-medium">
                  ${item.price * item.quantity}
                </td>
              </tr>
            ))}
          </tbody>

          <tfoot>
            <tr>
              <td colSpan="3" className="px-4 py-3 text-right font-bold">
                Total
              </td>
              <td className="px-4 py-3 text-right font-bold">
                ${order.totalAmount}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>
    </div>
  );
}

/* ---------- helpers ---------- */

function InfoCard({ label, children }) {
  return (
    <div className="rounded-lg bg-white p-4 shadow">
      <div className="text-xs text-gray-500">{label}</div>
      <div className="mt-1 text-sm">{children}</div>
    </div>
  );
}

function StatusBadge({ status }) {
  const color =
    status === "paid"
      ? "bg-green-100 text-green-700"
      : status === "pending"
        ? "bg-yellow-100 text-yellow-700"
        : "bg-red-100 text-red-700";

  return (
    <span
      className={`inline-block rounded-full px-3 py-1 text-xs font-semibold ${color}`}
    >
      {status}
    </span>
  );
}
