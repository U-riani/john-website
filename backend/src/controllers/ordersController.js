// backend/src/controllers/ordersController.js
import Order from "../models/Order.js";
import {
  generateEmailCode,
  verifyEmailCode,
  isEmailVerified,
} from "../services/emailVerificationService.js";
import {
  sendVerificationEmail,
  sendAdminNewOrderEmail,
  sendClientStatusUpdateEmail,
  sendClientOrderEmail,
} from "../services/emailService.js";
import StockService from "../services/StockService.js";
import mongoose from "mongoose";
import FailedOrder from "../models/FailedOrder.js";

/**
 * STEP 1: request email verification
 */
export async function requestEmailVerification(req, res) {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ error: "Email required" });
  }

  const code = generateEmailCode(email);

  await sendVerificationEmail(email, code);

  res.json({ status: "code_sent" });
  console.log("============================\n");
}

/**
 * STEP 2: confirm email code
 */
export async function confirmEmailVerification(req, res) {
  const { email, code } = req.body;

  if (!email || !code) {
    return res.status(400).json({ error: "Email and code required" });
  }

  const ok = verifyEmailCode(email, code);

  if (!ok) {
    return res.status(400).json({ verified: false });
  }

  res.json({ verified: true });
}

/**
 * STEP 3: create order
 */

export async function createOrder(req, res) {
  const { items, firstName, lastName, email, phoneNumber } = req.body;

  if (!isEmailVerified(email)) {
    return res.status(403).json({
      error: "Email not verified",
    });
  }

  if (!items?.length) {
    return res.status(400).json({ error: "Items required" });
  }

  const totalAmount = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  const session = await mongoose.startSession();

  try {
    session.startTransaction();

    // 1️⃣ CREATE ORDER FIRST
    const order = await Order.create(
      [
        {
          items,
          totalAmount,
          client: {
            firstName,
            lastName,
            email,
            phoneNumber,
            phoneVerified: false,
            phoneVerifiedAt: null,
          },
        },
      ],
      { session },
    ).then((r) => r[0]);

    // 2️⃣ REMOVE STOCK (with meaningful reason)
    for (const item of items) {
      await StockService.remove(
        item.productId,
        item.quantity,
        "system",
        `Client order - ${order._id}`,
        session,
      );
    }

    await session.commitTransaction();
    session.endSession();

    // EMAILS AFTER COMMIT (VERY IMPORTANT)
    const clientPhone = phoneNumber.replace(/\D/g, "");

    const whatsappMessage = encodeURIComponent(
      `Hello ${firstName}, we received your order (#${order._id}).`,
    );

    const whatsappUrl = `https://wa.me/${clientPhone}?text=${whatsappMessage}`;

    const adminOrderUrl = `${process.env.ADMIN_PANEL_URL}/orders/${order._id}`;

    await sendAdminNewOrderEmail({
      orderId: order._id,
      adminOrderUrl,
      whatsappUrl,
      clientName: `${firstName} ${lastName}`,
      totalAmount,
    });

    const clientOrderUrl = `https://john-ecomerce.netlify.app/order/${order._id}`;

    await sendClientOrderEmail({
      orderId: order._id,
      clientEmail: email,
      clientName: `${firstName} ${lastName}`,
      clientOrderUrl,
      totalAmount,
    });

    return res.status(201).json({
      orderId: order._id,
      success: true,
    });
  } catch (err) {
    await session.abortTransaction();
    session.endSession();
    await FailedOrder.create({
      client: { firstName, lastName, email, phoneNumber },
      items,
      reason: err.message,
    });

    if (err.code === "NOT_ENOUGH_STOCK") {
      return res.status(409).json({
        error: "Some products are no longer available",
        code: "OUT_OF_STOCK",
      });
    }

    return res.status(400).json({
      error: err.message || "Something went wrong",
    });
  }
}

export async function getOrderByID(req, res) {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(400).json({ error: "Order not found" });
    }

    return res.status(200).json(order);
  } catch (err) {
    return res.status(400).json({ error: "Invalid order ID" });
  }
}

export async function getAllOrders(req, res) {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    return res.status(200).json(orders);
  } catch (err) {
    console.error("Get all orders failed:", err);
    return res.status(500).json({ error: "Failed to fetch orders" });
  }
}

export async function updateOrderStatus(req, res) {
  const { orderId } = req.params;
  const { status } = req.body;

  const allowedStatuses = [
    "pending",
    "collected",
    "paid",
    "sent",
    "received",
    "cancelled",
  ];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ error: "Invalid status" });
  }

  try {
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    if (order.status === status) {
      return res.status(200).json({ order, success: true });
    }

    order.status = status;
    await order.save();

    const clientOrderUrl = `https://john-ecomerce.netlify.app/order/${order._id}`;

    await sendClientStatusUpdateEmail({
      orderId: order._id,
      clientEmail: order.client.email,
      status,
      clientOrderUrl,
    });

    return res.status(200).json({ order, success: true });
  } catch (err) {
    console.error("Update order status failed:", err);

    return res.status(500).json({
      error: err.message || "Failed to update order status",
    });
  }
}

export async function getFailedOrders(req, res) {
  console.log("+++++++++++++++++++++++++++++++++++++++\n", "Fetching failed orders...");
  const failed = await FailedOrder.find()
    .sort({ createdAt: -1 });

  res.json(failed);
}
