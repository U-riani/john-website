// frontend/src/pages/OrderForClient.jsx
import { useEffect, useMemo, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getOrderById } from "../api/orders";
import { useTranslation } from "react-i18next";
import { getLocalized } from "../utils/getLocalized";

const POLL_INTERVAL = 4000; // 4 seconds

const money = (n) => {
  const num = Number(n || 0);
  return new Intl.NumberFormat("ka-GE", {
    style: "currency",
    currency: "GEL",
    maximumFractionDigits: 2,
  }).format(num);
};

function StatusPill({ status }) {
  const style =
    status === "paid"
      ? "bg-green-100 text-green-800 border-green-200"
      : status === "pending"
      ? "bg-yellow-100 text-yellow-800 border-yellow-200"
      : "bg-red-100 text-red-800 border-red-200";

  const dot =
    status === "paid"
      ? "bg-green-600"
      : status === "pending"
      ? "bg-yellow-600"
      : "bg-red-600";

  return (
    <span className={`inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold ${style}`}>
      <span className={`h-2 w-2 rounded-full ${dot}`} />
      {status}
    </span>
  );
}

export default function OrderForClient() {
  const { orderId } = useParams();
  const { t, i18n } = useTranslation();

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [polling, setPolling] = useState(false);

  useEffect(() => {
    setLoading(true);
    getOrderById(orderId)
      .then(setOrder)
      .catch(() => setOrder(null))
      .finally(() => setLoading(false));
  }, [orderId]);

  // Poll while pending
  useEffect(() => {
    if (!order?._id || order.status !== "pending") {
      setPolling(false);
      return;
    }

    setPolling(true);

    const interval = setInterval(async () => {
      try {
        const fresh = await getOrderById(order._id);
        setOrder(fresh);
      } catch (e) {
        console.error("Failed to fetch order status:", e);
      }
    }, POLL_INTERVAL);

    return () => clearInterval(interval);
  }, [order?._id, order?.status]);

  const itemsTotal = useMemo(() => {
    if (!order?.items?.length) return 0;
    return order.items.reduce((sum, it) => sum + Number(it.price || 0) * Number(it.quantity || 0), 0);
  }, [order]);

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-3xl border border-gray-200 bg-white p-8 shadow-sm">
          <div className="h-6 w-40 animate-pulse rounded bg-gray-100" />
          <div className="mt-4 space-y-2">
            <div className="h-4 w-full animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-gray-100" />
            <div className="h-4 w-2/3 animate-pulse rounded bg-gray-100" />
          </div>
        </div>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16">
        <div className="rounded-3xl border border-gray-200 bg-white p-10 text-center shadow-sm">
          <div className="text-2xl font-bold text-zinc-900">Order not found</div>
          <div className="mt-2 text-sm text-gray-500">
            That order ID doesn’t exist or is unavailable.
          </div>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-2xl bg-zinc-900 px-5 py-3 text-sm font-semibold text-white hover:bg-zinc-800"
          >
            Continue shopping
          </Link>
        </div>
      </div>
    );
  }

  const statusText =
    order.status === "paid"
      ? (t("orderPaid") || "Payment confirmed")
      : order.status === "pending"
      ? (t("orderPending") || "Waiting for confirmation")
      : (t("orderFailed") || "There was an issue");

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12">
        {/* Header */}
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-lime-300/30 px-3 py-1 text-xs font-semibold text-gray-800">
              <span className="h-2 w-2 rounded-full bg-lime-500" />
              {t("orderPlaced") || "Order placed"}
            </div>

            <h1 className="mt-3 text-3xl font-bold tracking-tight text-zinc-900">
              🎉 {t("thanks") || "Thank you!"}
            </h1>

            <div className="mt-2 text-sm text-gray-600">
              {statusText}
              {polling && (
                <span className="ml-2 inline-flex items-center gap-2 text-xs text-gray-500">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-yellow-500" />
                  Updating status…
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            <StatusPill status={order.status} />
            <Link
              to="/"
              className="inline-flex rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
            >
              Continue shopping
            </Link>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          {/* Items */}
          <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
            <div className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
              {t("items") || "Items"}
            </div>

            <div className="space-y-3">
              {order.items?.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-start justify-between gap-4 rounded-2xl p-4 border border-gray-200 shadow-md "
                >
                  <div className="min-w-0">
                    <div className="truncate text-sm font-medium text-gray-900">
                      {getLocalized(item.title, i18n.language)}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Qty: {item.quantity} · {money(item.price)}
                    </div>
                  </div>

                  <div className="shrink-0 text-sm font-semibold text-gray-900">
                    {money(Number(item.price || 0) * Number(item.quantity || 0))}
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 flex items-center justify-between border-t pt-4">
              <div className="text-sm font-semibold text-gray-900">
                {t("total") || "Total"}
              </div>
              <div className="text-lg font-bold text-gray-900">
                {money(order.totalAmount ?? itemsTotal)}
              </div>
            </div>
          </div>

          {/* Summary */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 text-xs font-semibold uppercase tracking-wide text-gray-500">
                {t("orderInfo") || "Order info"}
              </div>

              <div className="space-y-3 text-sm">
                <div className="flex items-start justify-between gap-4 border border-gray-200 rounded-xl bg-gray-50 p-3">
                  <div className="text-gray-500">Order ID</div>
                  <div className="max-w-[220px] break-all text-right font-mono text-xs text-gray-900">
                    {order._id}
                  </div>
                </div>

                <div className="flex items-center justify-between border border-gray-200 rounded-xl bg-gray-50 p-3">
                  <div className="text-gray-500">Status</div>
                  <StatusPill status={order.status} />
                </div>

                {order.status === "pending" && (
                  <div className="rounded-2xl border border-yellow-200 bg-yellow-50 px-4 py-3 text-xs text-yellow-800">
                    Waiting for admin confirmation. This page updates automatically.
                  </div>
                )}
              </div>
            </div>

            <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
              <div className="text-xs font-semibold uppercase tracking-wide text-gray-500">
                {t("nextSteps") || "Next steps"}
              </div>
              <ul className="mt-4 space-y-2 text-sm text-gray-700">
                <li>• Keep this order ID for reference.</li>
                <li>• You’ll receive updates after confirmation.</li>
                <li>• If something looks wrong, contact support.</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}