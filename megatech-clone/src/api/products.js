import { apiFetch } from "./client";

// get all products
export function getProducts({ limit = 20, skip = 0 } = {}) {
  return apiFetch(`/products?limit=${limit}&skip=${skip}`);
}

// search products
export function searchProducts(query) {
  return apiFetch(`/products/search?q=${encodeURIComponent(query)}`);
}

// get categories
export function getCategories() {
  return apiFetch("/products/category-list");
}

// products by category
export function getProductsByCategory(category) {
  return apiFetch(`/products/category/${category}`);
}

// single product
export function getProductById(id) {
  return apiFetch(`/products/${id}`);
}
