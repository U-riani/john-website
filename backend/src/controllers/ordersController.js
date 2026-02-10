import Order from "../models/Order.js";
import {
  generateEmailCode,
  verifyEmailCode,
  isEmailVerified,
} from "../services/emailVerificationService.js";
import { sendVerificationEmail } from "../services/emailService.js";

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
  try {
    const order = await Order.create({
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
    });

    // FREE WhatsApp admin notification
    const adminPhone = "995598907062";

    const message = encodeURIComponent(
      `New Order\n` +
        `Order ID: ${order._id}\n` +
        `Client: ${firstName} ${lastName}\n` +
        `Email: ${email}\n` +
        `Phone: ${phoneNumber}\n` +
        `Total: ${totalAmount}`,
    );

    const adminWhatsAppUrl = `https://wa.me/${adminPhone}?text=${message}`;

    res.status(201).json({
      orderId: order._id,
      adminWhatsAppUrl,
      success: true,
    });
  } catch (err) {
    res.status(400).json(err);
    console.log("================\n", err);
  }
}

export async function getOrderByID(req, res) {
  const { orderId } = req.params;
  try {
    const order = await Order.findById(orderId);

    if (!order) {
      return res.status(400).json({ error: "order not found" });
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

  console.log("________________________________++++++++++")
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
    const order = await Order.findByIdAndUpdate(
      orderId,
      { status },
      { new: true },
    );

    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }

    return res.status(200).json({order, success: true});
  } catch (err) {
    console.error("Update order status failed:", err);
    return res.status(400).json({ error: "Invalid order ID" });
  }
}
