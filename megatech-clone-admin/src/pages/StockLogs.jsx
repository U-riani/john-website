// frontend/src/pages/StockLogs.jsx

import { useEffect, useState } from "react";
import { getStockLogs } from "../api/stock";

export default function StockLogs() {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  async function loadLogs() {
    try {
      const data = await getStockLogs();
      setLogs(data);
    } catch (err) {
      console.log("Failed to load logs", err.message);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadLogs();
  }, []);

  if (loading) return <div>Loading logs...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Stock Logs</h1>

      <div className="rounded-lg bg-white shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Date</th>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-center">Type</th>
              <th className="px-4 py-3 text-center">Qty</th>
              <th className="px-4 py-3 text-center">Before</th>
              <th className="px-4 py-3 text-center">After</th>
              <th className="px-4 py-3 text-left">Reason</th>
              <th className="px-4 py-3 text-left">Admin</th>
            </tr>
          </thead>

          <tbody>
            {logs.map((l) => (
              <tr key={l._id} className="border-b">
                <td className="px-4 py-3 text-xs">
                  {new Date(l.createdAt).toLocaleString()}
                </td>

                <td className="px-4 py-3">{l.productId?.name.en || "Unknown"}</td>

                <td className="px-4 py-3 text-center font-semibold">
                  {l.type}
                </td>

                <td className="px-4 py-3 text-center">{l.quantity}</td>
                <td className="px-4 py-3 text-center">{l.before}</td>
                <td className="px-4 py-3 text-center">{l.after}</td>

                <td className="px-4 py-3">
                  {l.reason?.startsWith("Client order -") ? (
                    <a
                      href={`/orders/${l.reason.split(" - ")[1]}`}
                      className="text-blue-600 hover:underline"
                    >
                      {l.reason}
                    </a>
                  ) : (
                    l.reason || "-"
                  )}
                </td>
                <td className="px-4 py-3 text-xs">{l.adminId || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
