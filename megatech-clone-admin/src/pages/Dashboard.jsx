import { useEffect, useState } from "react";
import { getOrders } from "../api/orders";

export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
  });

  useEffect(() => {
    getOrders().then((orders) => {
      setStats({
        total: orders.length,
        paid: orders.filter((o) => o.status === "paid").length,
        pending: orders.filter((o) => o.status === "pending").length,
      });
    });
  }, []);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard
        title="Total Orders"
        value={stats.total}
      />
      <StatCard
        title="Paid Orders"
        value={stats.paid}
        color="text-green-600"
      />
      <StatCard
        title="Pending Orders"
        value={stats.pending}
        color="text-yellow-600"
      />
    </div>
  );
}

function StatCard({ title, value, color = "" }) {
  return (
    <div className="rounded-lg bg-white p-6 shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className={`mt-2 text-3xl font-bold ${color}`}>
        {value}
      </div>
    </div>
  );
}
