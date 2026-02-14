// frontend/src/api/products.js
const BASE_URL = import.meta.env.VITE_API_URL;

function authHeaders() {
  const token = localStorage.getItem("admin_token");
  return token
    ? {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      }
    : {
        "Content-Type": "application/json",
      };
}

// ---------- GET ----------
export async function getProducts() {
  const res = await fetch(`${BASE_URL}/products`, {
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to fetch products");
  return res.json();
}

// ---------- CREATE ----------
export async function createProduct(payload) {
  const res = await fetch(`${BASE_URL}/products`, {
    method: "POST",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to create product");
  return res.json();
}

// ---------- UPDATE ----------
export async function updateProduct(id, payload) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "PATCH",
    headers: authHeaders(),
    body: JSON.stringify(payload),
  });

  if (!res.ok) throw new Error("Failed to update product");
  return res.json();
}

// ---------- DELETE ----------
export async function deleteProduct(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`, {
    method: "DELETE",
    headers: authHeaders(),
  });

  if (!res.ok) throw new Error("Failed to delete product");
}
