// backend/src/routes/products.js
import express from "express";
import {
  createProduct,
  importProducts,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
} from "../controllers/productsController.js";
import adminAuth from "../middleware/adminAuth.js";

const router = express.Router();

// admin
router.post("/", adminAuth, createProduct);
router.post("/import", adminAuth, importProducts);
router.patch("/:id", adminAuth, updateProduct);
router.delete("/:id", adminAuth, deleteProduct);

// public/admin
router.get("/", getProducts);
router.get("/:id", getProductById);

export default router;
