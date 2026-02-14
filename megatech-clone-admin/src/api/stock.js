// frontend/src/api/stock.js
const BASE_URL = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = localStorage.getItem("admin_token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : { "Content-Type": "application/json" };
}

/* ---------- GET STOCK ---------- */
export async function getStocks() {
  const res = await fetch(`${BASE_URL}/stock`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to load stock");

  return res.json();
}

/* ---------- ADD ---------- */
export async function addStock(payload) {
  const res = await fetch(`${BASE_URL}/stock/add`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Add stock failed");

  return res.json();
}

/* ---------- REMOVE ---------- */
export async function removeStock(payload) {
  const res = await fetch(`${BASE_URL}/stock/remove`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Remove stock failed");

  return res.json();
}

/* ---------- ADJUST ---------- */
export async function adjustStock(payload) {
  const res = await fetch(`${BASE_URL}/stock/adjust`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Adjust stock failed");

  return res.json();
}

/* ---------- LOGS ---------- */
export async function getStockLogs() {
  const res = await fetch(`${BASE_URL}/stock/logs`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to load logs");

  return res.json();
}

/* ---------- IMPORT ---------- */
export async function importStock(rows) {
  const res = await fetch(`${BASE_URL}/stock/import`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify({ rows }),
  });

  if (!res.ok) {
    const err = await res.json();
    throw new Error(err.error || "Import failed");
  }

  return res.json();
}
