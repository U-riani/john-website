// frontend/src/pages/Checkout.jsx
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import {
  requestEmailVerification,
  confirmEmailVerification,
  createOrder,
} from "../api/orders";
import { useTranslation } from "react-i18next";
import { getLocalized } from "../utils/getLocalized";

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

  const total = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const onChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
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
    } catch (err) {
      setError("Failed to send verification email: ", err.message);
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
      if (!res.verified) throw new Error();
      setVerified(true);
    } catch {
      setError("Invalid or expired code");
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
      console.log(res);
      if (res.success) {
        clearCart();
        navigate(`/order-success/${res.orderId}`);
      }
    } catch (err) {
      if (err.message === "OUT_OF_STOCK") {
        setError("Some items are no longer in stock. Please update your cart.");
      } else {
        setError("Order failed. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-lg space-y-4">
      <div className="text-center">
        <Link
          to="/"
          className="inline-block rounded-md bg-gray-900 px-4 py-2 text-white"
        >
          {t("continueShopping")}
        </Link>
      </div>

      {/* Items */}
      <div className="rounded-lg border bg-white p-4">
        <div className="mb-2 font-semibold">Items</div>
        {items.map((item, idx) => (
          <div key={idx} className="flex justify-between text-sm">
            <div>
              {getLocalized(item.title, i18n.language)} × {item.quantity}
            </div>
            <div className="font-medium">${item.price * item.quantity}</div>
          </div>
        ))}
        <div className="mt-3 flex justify-between border-t pt-3 font-bold">
          <div>{t("total")}</div>
          <div>${total}</div>
        </div>
      </div>

      {/* Form */}
      <form
        onSubmit={submitOrder}
        className="rounded-lg border bg-white p-4 space-y-3"
      >
        {error && (
          <div className="rounded bg-red-100 p-2 text-sm text-red-700">
            {error}
          </div>
        )}

        <Input
          label="First Name"
          name="firstName"
          value={form.firstName}
          onChange={onChange}
        />
        <Input
          label="Last Name"
          name="lastName"
          value={form.lastName}
          onChange={onChange}
        />
        <Input
          label="Email"
          name="email"
          type="email"
          value={form.email}
          onChange={onChange}
        />
        <Input
          label="Phone Number"
          name="phoneNumber"
          value={form.phoneNumber}
          onChange={onChange}
        />

        {/* Email verification */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={sendCode}
            disabled={codeSent || loading}
            className="rounded-md bg-sky-900 px-4 py-2 text-white disabled:opacity-50"
          >
            {t("sendCode")}
          </button>
        </div>

        {codeSent && !verified && (
          <div className="flex gap-2">
            <input
              type="text"
              maxLength={4}
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="flex-1 border rounded px-2"
            />
            <button
              type="button"
              onClick={verifyCode}
              className="rounded-md bg-green-700 px-4 py-2 text-white"
            >
                
            </button>
          </div>
        )}

        {verified && (
          <div className="text-sm text-green-700 font-medium">
            {t("verificationSuccess")}
          </div>
        )}

        <button
          type="submit"
          disabled={!verified || loading}
          className="w-full rounded-md bg-sky-900 px-4 py-3 text-white disabled:opacity-50"
        >
          {t("submitOrder")}
        </button>
      </form>
    </div>
  );
}

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label>{label}</label>
      <input {...props} className="border rounded px-2" />
    </div>
  );
}
