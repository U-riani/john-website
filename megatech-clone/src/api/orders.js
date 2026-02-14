// frontend/src/api/orders.js
const BASE_URL = import.meta.env.VITE_API_URL;

// ---- Email verification ----
export async function requestEmailVerification(email) {
  const res = await fetch(`${BASE_URL}/orders/verify-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  if (!res.ok) throw new Error("Failed to send verification email");
}

export async function confirmEmailVerification(email, code) {
  const res = await fetch(`${BASE_URL}/orders/confirm-email`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  if (!res.ok) throw new Error("Verification failed");
  return res.json();
}

// ---- Order ----
export async function createOrder(payload) {
  const res = await fetch(`${BASE_URL}/orders/create`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    const data = await res.json();
    throw new Error(data.code || data.error);
  }

  return res.json();
}

export async function getOrderById(id) {
  const res = await fetch(`${BASE_URL}/orders/${id}`);

  if (!res.ok) {
    throw new Error("Failed to fetch order");
  }

  return res.json();
}
