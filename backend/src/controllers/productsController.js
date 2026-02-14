// backend/src/controllers/productsController.js

import Product from "../models/Product.js";
import WarehouseStock from "../models/WarehouseStock.js";

function makeSlug(str = "") {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/\s+/g, "-");
}

/**
 * Create single product
 */
export async function createProduct(req, res) {
  try {
    const product = await Product.create({
      ...req.body,
      slug: `${makeSlug(req.body.name)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
    });

    return res.status(201).json(product);
  } catch (err) {
    return res.status(400).json({
      error: err.message || "Failed to create product",
    });
  }
}

/**
 * Import multiple products (ADMIN IMPORT)
 */
export async function importProducts(req, res) {
  const { products } = req.body;

  if (!Array.isArray(products) || !products.length) {
    return res.status(400).json({ error: "Products required" });
  }

  try {
    const ops = products.map((p) => ({
      updateOne: {
        filter: p.sku
          ? { sku: p.sku }
          : {
              name: p.name,
              brand: p.brand || "__no_brand__",
            },

        update: {
          $set: {
            ...p,
            slug: `${makeSlug(p.name)}-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
          },
        },
        upsert: true,
      },
    }));

    const result = await Product.bulkWrite(ops);

    return res.status(200).json({
      success: true,
      imported: result.upsertedCount,
      updated: result.modifiedCount,
    });
  } catch (err) {
    return res.status(500).json({
      error: err.message || "Import failed",
    });
  }
}

/**
 * Get products
 */
export async function getProducts(req, res) {
  try {
    const products = await Product.find();

    const stocks = await WarehouseStock.find();

    const stockMap = Object.fromEntries(
      stocks.map((s) => [s.productId.toString(), s.quantity]),
    );

    const result = products.map((p) => ({
      ...p.toObject(),
      stock: stockMap[p._id.toString()] || 0,
    }));

    return res.json(result);
  } catch {
    return res.status(500).json({ error: "Failed to fetch products" });
  }
}

/**
 * Get single product
 */
export async function getProductById(req, res) {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) return res.status(404).json({ error: "Product not found" });

    const stock = await WarehouseStock.findOne({
      productId: product._id,
    });

    return res.json({
      ...product.toObject(),
      stock: stock?.quantity || 0,
    });
  } catch {
    return res.status(400).json({ error: "Invalid product id" });
  }
}

/**
 * Update
 */
export async function updateProduct(req, res) {
  try {
    const update = { ...req.body };

    if (req.body.name) {
      update.slug = makeSlug(req.body.name);
    }

    const product = await Product.findByIdAndUpdate(req.params.id, update, {
      new: true,
    });

    return res.json(product);
  } catch {
    return res.status(400).json({ error: "Update failed" });
  }
}

/**
 * Delete
 */
export async function deleteProduct(req, res) {
  try {
    await Product.findByIdAndDelete(req.params.id);
    return res.json({ success: true });
  } catch {
    return res.status(400).json({ error: "Delete failed" });
  }
}
