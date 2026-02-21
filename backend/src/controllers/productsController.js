// backend/src/controllers/productsController.js

import Product from "../models/Product.js";

/* =====================================================
   HELPERS
===================================================== */

function makeSlug(str = "") {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

function getLocalizedValue(val) {
  if (!val) return "";
  if (typeof val === "string") return val;

  return val.en || val.ka || val.ru || "";
}

/**
 * Avoid wiping existing translations
 */
function mergeLocalized(oldVal = {}, newVal = {}) {
  if (!newVal || typeof newVal !== "object") return oldVal;

  return {
    ka: newVal.ka !== undefined ? newVal.ka : oldVal?.ka,
    en: newVal.en !== undefined ? newVal.en : oldVal?.en,
    ru: newVal.ru !== undefined ? newVal.ru : oldVal?.ru,
  };
}

function makeUniqueSlug(name = "") {
  return `${makeSlug(name)}-${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 8)}`;
}

/* =====================================================
   CREATE PRODUCT
===================================================== */

export async function createProduct(req, res) {
  try {
    const nameValue = getLocalizedValue(req.body.name);

    const product = await Product.create({
      ...req.body,
      slug: makeUniqueSlug(nameValue),
    });

    return res.status(201).json(product);
  } catch (err) {
    return res.status(400).json({
      error: err.message || "Failed to create product",
    });
  }
}

/* =====================================================
   IMPORT PRODUCTS (ADMIN)
===================================================== */

export async function importProducts(req, res) {
  const { products } = req.body;

  if (!Array.isArray(products) || !products.length) {
    return res.status(400).json({ error: "Products required" });
  }

  try {
    const createdProducts = [];

    for (const prod of products) {
      const nameValue = getLocalizedValue(prod.name);
      const newProd = await Product.create({
        ...prod,
        slug: makeUniqueSlug(nameValue),
      });
      createdProducts.push(newProd);
    }

    return res.status(201).json({
      message: `${createdProducts.length} products imported successfully`,
      products: createdProducts,
    });


  } catch (err) {
    console.log("IMPORT ERROR:", err);

    return res.status(500).json({
      error: err.message || "Import failed",
    });
  }
}

/* =====================================================
   GET PRODUCTS
===================================================== */

export async function getProducts(req, res) {
  try {
    const products = await Product.find();
 



    return res.json(products);
  } catch (err) {
    console.error("Error fetching products:", err);
    return res.status(500).json({
      error: "Failed to fetch products",
    });
  }
}

/* =====================================================
   GET SINGLE PRODUCT
===================================================== */

export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        error: "Product not found",
      });
    }



    return res.json(product);
  } catch (err) {
    console.error("Error fetching product:", err);
    return res.status(400).json({
      error: "Invalid product id",
    });
  }
}

/* =====================================================
   UPDATE PRODUCT
===================================================== */

export async function updateProduct(req, res) {
  try {
    const existing = await Product.findById(req.params.id);

    if (!existing) {
      return res.status(404).json({ error: "Product not found" });
    }

    const update = { ...req.body };

    // SAFE multilingual merge
    if (req.body.name) {
      update.name = mergeLocalized(existing.name, req.body.name);

      const nameValue = getLocalizedValue(update.name);

      update.slug = `${makeUniqueSlug(nameValue)}-${Date.now()}-${Math.floor(
        Math.random() * 1000,
      )}`;
    }

    if (req.body.category) {
      update.category = mergeLocalized(existing.category, req.body.category);
    }

    if (req.body.subCategory) {
      update.subCategory = mergeLocalized(
        existing.subCategory,
        req.body.subCategory,
      );
    }

    const localizedFields = [
      "description",
      "ingredients",
    ];

    localizedFields.forEach((field) => {
      if (req.body[field]) {
        update[field] = mergeLocalized(existing[field], req.body[field]);
      }
    });

    if ("images" in req.body) {
      update.images = Array.isArray(req.body.images)
        ? req.body.images
        : existing.images;
    }

    const product = await Product.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    return res.json(product);
  } catch {
    return res.status(400).json({
      error: "Update failed",
    });
  }
}

/* =====================================================
   DELETE PRODUCT
===================================================== */

export async function deleteProduct(req, res) {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch {
    return res.status(400).json({
      error: "Delete failed",
    });
  }
}
