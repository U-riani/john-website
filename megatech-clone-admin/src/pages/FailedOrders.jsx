// frontend/src/pages/FailedOrders.jsx
import { useEffect, useState } from "react";
import { getFailedOrders } from "../api/orders";

export default function FailedOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  async function load() {
    try {
      const data = await getFailedOrders();
      setOrders(data);
    } catch (err) {
      console.error(err);
      alert("Failed to load failed orders");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    load();
  }, []);

  if (loading) return <div>Loading failed orders...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Failed Orders</h1>

      <div className="rounded-lg bg-white shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Client</th>
              <th className="px-4 py-3 text-left">Email</th>
              <th className="px-4 py-3 text-center">Items</th>
              <th className="px-4 py-3 text-left">Reason</th>
            </tr>
          </thead>

          <tbody>
            {orders.map((o) => (
              <tr key={o._id} className="border-b align-top">
                <td className="px-4 py-3 text-xs whitespace-nowrap">
                  {new Date(o.createdAt).toLocaleString()}
                </td>

                <td className="px-4 py-3">
                  {o.client?.firstName} {o.client?.lastName}
                </td>

                <td className="px-4 py-3 text-xs">
                  {o.client?.email || "-"}
                </td>

                <td className="px-4 py-3 text-center">
                  {o.items?.length || 0}
                </td>

                <td className="px-4 py-3 text-red-600 text-xs">
                  {o.reason || "-"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!orders.length && (
        <div className="text-sm text-gray-500">
          No failed orders. Either everything works or nobody is ordering.
        </div>
      )}
    </div>
  );
}
