import { Router } from "express";
import adminAuth from "../middleware/adminAuth.js";
import { exportOrdersCsv } from "../controllers/orderExportController.js";
import { paymentInitLimiter } from "../middleware/rateLimiters.js";
import { updateOrderStatus } from "../controllers/ordersController.js";

const router = Router();

router.get(
  "/orders/export",
  adminAuth,
  paymentInitLimiter, // reuse limiter, exports are heavy
  exportOrdersCsv,
);

router.patch("/orders/:orderId/status", adminAuth, updateOrderStatus);

export default router;
