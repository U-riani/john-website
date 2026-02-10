import { Router } from "express";
import {
  initUnipayPayment,
  unipayWebhook,
} from "../controllers/paymentsController.js";
import {
  paymentInitLimiter,
  webhookLimiter,
} from "../middleware/rateLimiters.js";

const router = Router();

router.post("/unipay/init", paymentInitLimiter, initUnipayPayment);
router.post("/unipay/webhook", webhookLimiter, unipayWebhook);

export default router;
