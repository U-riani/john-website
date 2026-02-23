// backend/src/routes/orders.js
import express from "express";
import {
  requestEmailVerification,
  confirmEmailVerification,
  createOrder,
  getOrderByID,
  getAllOrders,
  getOrdersByStatus,
} from "../controllers/ordersController.js";

const router = express.Router();

router.post("/verify-email", requestEmailVerification);
router.post("/confirm-email", confirmEmailVerification);
router.post("/create", createOrder);
router.get("/status/:status", getOrdersByStatus);
router.get("/:orderId", getOrderByID);
router.get("/", getAllOrders);

export default router;
