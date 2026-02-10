const BASE_URL = import.meta.env.VITE_API_URL;

export async function initUnipayPayment(orderId) {
  const res = await fetch(
    `${BASE_URL}/payments/unipay/init`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderId }),
    }
  );

  if (!res.ok) {
    throw new Error("Payment init failed");
  }

  return res.json();
}
