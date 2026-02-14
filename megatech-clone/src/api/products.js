// frontend/src/api/products.js
const BASE_URL = import.meta.env.VITE_API_URL;

/* ---------- GET ALL PRODUCTS ---------- */
export async function getProducts(query = "") {
  const url = query
    ? `${BASE_URL}/products?q=${encodeURIComponent(query)}`
    : `${BASE_URL}/products`;

  const res = await fetch(url);

  if (!res.ok) throw new Error("Failed to fetch products");

  return res.json();
}

/* ---------- GET SINGLE PRODUCT ---------- */
export async function getProductById(id) {
  const res = await fetch(`${BASE_URL}/products/${id}`);

  if (!res.ok) throw new Error("Product not found");

  return res.json();
}
