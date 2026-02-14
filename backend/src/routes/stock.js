// backend/src/routes/stock.js
import express from "express";
import adminAuth from "../middleware/adminAuth.js";
import {
  importStock,
  getStocks,
  addStock,
  removeStock,
  adjustStock,
  getStockLogs,
} from "../controllers/stockController.js";

const router = express.Router();

router.get("/", adminAuth, getStocks);
router.post("/add", adminAuth, addStock);
router.post("/remove", adminAuth, removeStock);
router.post("/adjust", adminAuth, adjustStock);
router.post("/import", adminAuth, importStock);
router.get("/logs", adminAuth, getStockLogs);

export default router;
