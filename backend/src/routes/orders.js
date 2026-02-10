import express from "express";
import {
  requestEmailVerification,
  confirmEmailVerification,
  createOrder,
  getOrderByID,
  getAllOrders,
} from "../controllers/ordersController.js";

const router = express.Router();

router.post("/verify-email", requestEmailVerification);
router.post("/confirm-email", confirmEmailVerification);
router.post("/create", createOrder);
router.get("/:orderId", getOrderByID);
router.get("/", getAllOrders);

export default router;
