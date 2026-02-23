import { useEffect, useState } from "react";
import { getOrders } from "../api/orders";
import { Link } from "react-router-dom";
export default function Dashboard() {
  const [stats, setStats] = useState({
    total: 0,
    paid: 0,
    pending: 0,
    collected: 0,
    sent: 0,
    received: 0,
    cancelled: 0,
  });

  useEffect(() => {
    getOrders().then((orders) => {
      setStats({
        total: orders.length,
        paid: orders.filter((o) => o.status === "paid").length,
        pending: orders.filter((o) => o.status === "pending").length,
        collected: orders.filter((o) => o.status === "collected").length,
        sent: orders.filter((o) => o.status === "sent").length,
        received: orders.filter((o) => o.status === "received").length,
        cancelled: orders.filter((o) => o.status === "cancelled").length,
      });
    });
  }, []);

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      <StatCard status="total" title="Total Orders" value={stats.total} />
      <StatCard
        title="Pending Orders"
        value={stats.pending}
        color="text-yellow-600"
      />
      <StatCard
      status="collected"
        title="Collected Orders"
        value={stats.collected}
        color="text-sky-400"
      />
      <StatCard status="paid"  title="Paid Orders" value={stats.paid} color="text-green-600" />
      <StatCard
        title="Sent Orders"
        value={stats.sent}
        color="text-indigo-600"
      />
      <StatCard
      status="received"
        title="Received Orders"
        value={stats.received}
        color="text-teal-600"
      />
      <StatCard
      status="cancelled"
        title="Cancelled Orders"
        value={stats.cancelled}
        color="text-rose-600"
      />
    </div>
  );
}

function StatCard({ status, title, value, color = "" }) {
  return (
    <Link to={`/orders/${status}`} className="rounded-lg bg-white p-6 shadow">
      <div className="text-sm text-gray-500">{title}</div>
      <div className={`mt-2 text-3xl font-bold ${color}`}>{value}</div>
    </Link>
  );
}
