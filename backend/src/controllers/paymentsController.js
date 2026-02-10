import Order from "../models/Order.js";
import { verifyUnipaySignature } from "../utils/verifyUnipaySignature.js";
import logger from "../utils/logger.js";

// MOCKED UniPay endpoint for now
const UNIPAY_API_URL = `${process.env.UNIPAY_BASE_API_URL}/payments`;
const UNIPAY_MERCHANT_ID = process.env.UNIPAY_MERCHANT_ID;
const UNIPAY_SECRET = process.env.UNIPAY_SECRET;

export async function initUnipayPayment(req, res) {
  try {
    const { orderId } = req.body;

    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    if (order.status !== "pending") {
      return res.status(400).json({ message: "Order already processed" });
    }

    // Normally you call UniPay API here
    // We simulate the response shape
    const fakeUnipayResponse = {
      paymentUrl: `${process.env.UNIPAY_BASE_API_URL}/mock/${order._id}`,
      paymentIntentId: `upi_${Date.now()}`,
      reference: `REF-${order._id}`,
    };

    order.paymentIntentId = fakeUnipayResponse.paymentIntentId;
    order.paymentReference = fakeUnipayResponse.reference;
    await order.save();

    logger.info(
      { orderId: order._id, amount: order.totalAmount },
      "UniPay payment initialized"
    );

    res.json({
      paymentUrl: fakeUnipayResponse.paymentUrl,
    });
  } catch (err) {
    logger.error({ err, orderId: req.body?.orderId }, "Payment init failed");

    res.status(500).json({ message: "Payment init failed" });
  }
}

export async function unipayWebhook(req, res) {
  try {
    const signature = req.headers["x-unipay-signature"];

    if (!signature) {
      return res.status(401).json({ message: "Missing signature" });
    }

    const isValid = verifyUnipaySignature({
      rawBody: req.body,
      signature,
      secret: process.env.UNIPAY_WEBHOOK_SECRET,
    });

    if (!isValid) {
      return res.status(401).json({ message: "Invalid signature" });
    }

    // Now it's safe to trust the payload
    const payload = JSON.parse(req.body.toString());

    const { reference, status } = payload;

    if (!reference || !status) {
      return res.status(400).json({ message: "Invalid payload" });
    }

    const order = await Order.findOne({
      paymentReference: reference,
    });

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // 👇 idempotency
    if (order.status !== "pending") {
      return res.sendStatus(200);
    }

    if (status === "success") {
      order.status = "paid";
    } else if (status === "failed") {
      order.status = "cancelled";
    } else {
      return res.status(400).json({ message: "Unknown status" });
    }

    logger.info({ reference, status }, "UniPay webhook received");

    await order.save();

    logger.info({ orderId: order._id, status }, "Order payment status updated");
    
    res.sendStatus(200);
  } catch (err) {
    logger.error({ err }, "UniPay webhook processing failed");
    res.sendStatus(500);
  }
}
