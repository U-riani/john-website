// frontend/src/store/useProductStore.js

import { create } from "zustand";
import {
  getProducts,
  getProductById,
  getPaginatedProducts,
} from "../api/products";

let productsController = null;

export const useProductStore = create((set, get) => ({
  products: [],
  productMap: {},
  pagination: null,
  loading: false,
  queryCache: {},
  meta: {
    categories: [],
    brands: [],
  },

  fetchProducts: async (queryString) => {
    const { queryCache } = get();

    // ✅ RETURN CACHED DATA IF EXISTS
    if (queryCache[queryString]) {
      const cached = queryCache[queryString];

      set({
        products: cached.data,
        pagination: cached.pagination,
      });

      return;
    }

    if (productsController) {
      productsController.abort();
    }

    productsController = new AbortController();

    set({ loading: true });

    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/products/paginated?${queryString}`,
        { signal: productsController.signal },
      );

      if (!res.ok) throw new Error("Fetch failed");

      const data = await res.json();

      const map = {};
      data.data.forEach((p) => {
        map[p._id] = p;
      });

      set((state) => ({
        products: data.data,
        productMap: { ...state.productMap, ...map },
        pagination: data.pagination,
        queryCache: {
          ...state.queryCache,
          [queryString]: {
            data: data.data,
            pagination: data.pagination,
          },
        },
      }));
    } catch (e) {
      if (e.name !== "AbortError") {
        console.error("Failed to fetch products", e);
      }
    } finally {
      set({ loading: false });
    }
  },
  fetchMeta: async (lang) => {
    const { meta } = get();
    if (meta.categories.length) return; // simple cache
    try {
      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/products/meta?lang=${lang}`,
      );

      if (!res.ok) throw new Error("Meta failed");

      const data = await res.json();

      set({
        meta: {
          categories: data.categories || [],
          brands: data.brands || [],
        },
      });
    } catch (e) {
      console.error("Meta fetch failed", e);
    }
  },
  getProductByIdCached: async (id) => {
    const { productMap } = get();

    if (productMap[id]) return productMap[id];

    const product = await getProductById(id);

    set((state) => ({
      productMap: { ...state.productMap, [id]: product },
    }));

    return product;
  },
}));
