// frontend/src/pages/Checkout.jsx
import { useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  requestEmailVerification,
  confirmEmailVerification,
  createOrder,
} from "../api/orders";
import { useTranslation } from "react-i18next";
import { getLocalized } from "../utils/getLocalized";

const money = (n) => {
  const num = Number(n || 0);
  return new Intl.NumberFormat("ka-GE", {
    style: "currency",
    currency: "GEL",
    maximumFractionDigits: 2,
  }).format(num);
};

export default function Checkout() {
  const { items, clearCart } = useCart();
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
  });

  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const total = useMemo(
    () => items.reduce((sum, i) => sum + i.price * i.quantity, 0),
    [items],
  );

  const onChange = (e) => {
    setForm((p) => ({ ...p, [e.target.name]: e.target.value }));
  };

  // -------- Email verification --------
  const sendCode = async () => {
    if (!form.email) {
      setError("Email is required");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await requestEmailVerification(form.email);
      setCodeSent(true);
      setVerified(false);
      setCode("");
    } catch (err) {
      setError(err?.message ? `Failed to send code: ${err.message}` : "Failed to send code");
    } finally {
      setLoading(false);
    }
  };

  const verifyCode = async () => {
    if (!code) {
      setError("Enter verification code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await confirmEmailVerification(form.email, code);
      if (!res?.verified) throw new Error("Invalid");
      setVerified(true);
    } catch {
      setError("Invalid or expired code");
      setVerified(false);
    } finally {
      setLoading(false);
    }
  };

  // -------- Submit order --------
  const submitOrder = async (e) => {
    e.preventDefault();

    if (!verified) {
      setError("Email must be verified");
      return;
    }

    if (!items.length) {
      setError("Your cart is empty");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await createOrder({
        ...form,
        items: items.map((i) => ({
          productId: i.id,
          title: i.title,
          price: i.price,
          quantity: i.quantity,
        })),
      });

      if (res?.success) {
        clearCart();
        navigate(`/order-success/${res.orderId}`);
        return;
      }

      setError("Order failed. Please try again.");
    } catch (err) {
      if (err?.message === "OUT_OF_STOCK") {
        setError("Some items are no longer in stock. Please update your cart.");
      } else {
        setError("Order failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-10">
      {/* Top actions */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <div>
          <div className="text-2xl font-bold text-zinc-900">{t("checkout") || "Checkout"}</div>
          <div className="text-sm text-gray-500">
            Confirm your items and complete the order.
          </div>
        </div>

        <Link
          to="/"
          className="rounded-2xl bg-zinc-900 px-4 py-2 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800"
        >
          {t("continueShopping")}
        </Link>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        {/* Items summary */}
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center justify-between">
            <div className="text-sm font-semibold uppercase tracking-wide text-gray-500">
              {t("items") || "Items"}
            </div>
            <div className="text-sm text-gray-600">{items.length} items</div>
          </div>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <div
                key={idx}
                className="border border-gray-200 shadow-md flex items-start justify-between gap-4 rounded-2xl bg-gray-50 p-3"
              >
                <div className="min-w-0">
                  <div className="truncate text-sm font-medium text-gray-900">
                    {getLocalized(item.title, i18n.language)}
                  </div>
                  <div className="text-xs text-gray-500">
                    Qty: {item.quantity} · {money(item.price)}
                  </div>
                </div>

                <div className="shrink-0 text-sm font-semibold text-gray-900">
                  {money(item.price * item.quantity)}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-5 flex items-center justify-between border-t pt-4">
            <div className="text-sm font-semibold text-gray-900">{t("total")}</div>
            <div className="text-lg font-bold text-gray-900">{money(total)}</div>
          </div>
        </div>

        {/* Form */}
        <form
          onSubmit={submitOrder}
          className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-5"
        >
          <div className="text-sm font-semibold uppercase tracking-wide text-gray-500">
            {t("customerDetails") || "Customer details"}
          </div>

          {error && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          )}

          <div className="grid gap-4 sm:grid-cols-2">
            <Input
              label={t("firstName") || "First Name"}
              name="firstName"
              value={form.firstName}
              onChange={onChange}
              disabled={loading}
            />
            <Input
              label={t("lastName") || "Last Name"}
              name="lastName"
              value={form.lastName}
              onChange={onChange}
              disabled={loading}
            />
          </div>

          <Input
            label={t("email") || "Email"}
            name="email"
            type="email"
            value={form.email}
            onChange={onChange}
            disabled={loading || verified}
            hint={verified ? (t("verificationSuccess") || "Verified") : ""}
          />

          <Input
            label={t("phoneNumber") || "Phone Number"}
            name="phoneNumber"
            value={form.phoneNumber}
            onChange={onChange}
            disabled={loading}
          />

          {/* Email verification section */}
          <div className="rounded-2xl border border-gray-200 bg-gray-50 p-4">
            <div className="mb-3 flex items-center justify-between gap-3">
              <div>
                <div className="text-sm font-semibold text-gray-900">
                  {t("emailVerification") || "Email verification"}
                </div>
                <div className="text-xs text-gray-500">
                  {verified
                    ? (t("verificationSuccess") || "Email verified successfully.")
                    : "We’ll send a 4-digit code to your email."}
                </div>
              </div>

              <button
                type="button"
                onClick={sendCode}
                disabled={loading || !form.email}
                className="rounded-2xl bg-lime-300 px-4 py-2 text-sm font-semibold text-black shadow-sm transition hover:brightness-95 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {codeSent ? (t("resend") || "Resend") : t("sendCode")}
              </button>
            </div>

            {codeSent && !verified && (
              <div className="flex gap-3">
                <input
                  type="text"
                  inputMode="numeric"
                  maxLength={4}
                  value={code}
                  onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                  placeholder="0000"
                  className="flex-1 rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-gray-900"
                />

                <button
                  type="button"
                  onClick={verifyCode}
                  disabled={loading || code.length !== 4}
                  className="rounded-2xl bg-zinc-900 px-4 py-3 text-sm font-semibold text-white shadow-sm transition hover:bg-zinc-800 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {t("verify") || "Verify"}
                </button>
              </div>
            )}

            {verified && (
              <div className="mt-3 inline-flex items-center gap-2 rounded-2xl bg-green-100 px-3 py-2 text-sm font-medium text-green-800">
                <span className="inline-block h-2 w-2 rounded-full bg-green-600" />
                {t("verificationSuccess") || "Verified"}
              </div>
            )}
          </div>

          <button
            type="submit"
            disabled={!verified || loading}
            className="w-full rounded-2xl bg-zinc-900 px-4 py-4 text-sm font-semibold text-white shadow-md transition hover:-translate-y-0.5 hover:bg-zinc-800 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (t("processing") || "Processing...") : t("submitOrder")}
          </button>

          <div className="text-xs text-gray-500">
            By placing the order, you agree to our terms and conditions.
          </div>
        </form>
      </div>
    </div>
  );
}

function Input({ label, hint, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center justify-between">
        <label className="text-sm font-medium text-gray-700">{label}</label>
        {hint ? <span className="text-xs text-green-700">{hint}</span> : null}
      </div>

      <input
        {...props}
        className="rounded-2xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-gray-900 disabled:bg-gray-100 disabled:cursor-not-allowed"
      />
    </div>
  );
}