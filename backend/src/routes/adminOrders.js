import { Router } from "express";
import adminAuth from "../middleware/adminAuth.js";
import { exportOrdersCsv } from "../controllers/orderExportController.js";
import { paymentInitLimiter } from "../middleware/rateLimiters.js";
import {
  updateOrderStatus,
  getFailedOrders,
} from "../controllers/ordersController.js";

const router = Router();

router.get(
  "/orders/export",
  adminAuth,
  paymentInitLimiter, // reuse limiter, exports are heavy
  exportOrdersCsv,
);

router.patch("/orders/:orderId/status", adminAuth, updateOrderStatus);
router.get("/orders/failed", adminAuth, getFailedOrders);

export default router;
