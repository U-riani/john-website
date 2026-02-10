// backend/src/services/emailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendVerificationEmail(email, code) {
  const res = await transporter.sendMail({
    from: `"Shop" <${process.env.SMTP_USER}>`,
    to: email,
    subject: "Your verification code",
    text: `Your verification code is ${code}. It expires in 1 minute.`,
  });

  console.log("\n++++++\n", res)
}

export async function sendAdminNewOrderEmail({
  orderId,
  adminOrderUrl,
  whatsappUrl,
  clientName,
  totalAmount,
}) {
  const res = await transporter.sendMail({
    from: `"Shop" <${process.env.SMTP_USER}>`,
    to: process.env.SMTP_USER, // admin email (same for testing)
    subject: `🛒 New Order #${orderId}`,
    html: `
      <h2>New Order Received</h2>

      <p><strong>Client:</strong> ${clientName}</p>
      <p><strong>Total:</strong> $${totalAmount}</p>

      <p>
        👉 <a href="${adminOrderUrl}" target="_blank">
          Open Order in Admin Panel
        </a>
      </p>

      <p>
        💬 <a href="${whatsappUrl}" target="_blank">
          Chat with client on WhatsApp
        </a>
      </p>

      <hr />
      <small>This is an automated notification.</small>
    `,
  });

  console.log("Admin order email sent:", res.messageId);
}

export async function sendClientOrderEmail({
  orderId,
  clientEmail,
  clientName,
  clientOrderUrl,
  totalAmount,
}) {
  const res = await transporter.sendMail({
    from: `"Shop" <${process.env.SMTP_USER}>`,
    to: clientEmail,
    subject: `Your order #${orderId} was placed successfully`,
    html: `
      <h2>Thank you for your order, ${clientName}!</h2>

      <p>Your order has been received and is being processed.</p>

      <p><strong>Order ID:</strong> ${orderId}</p>
      <p><strong>Total:</strong> $${totalAmount}</p>

      <p>
        👉 <a href="${clientOrderUrl}" target="_blank">
          View your order status
        </a>
      </p>

      <hr />
      <small>You will receive updates when your order status changes.</small>
    `,
  });

  console.log("Client order email sent:", res.messageId);
}

export async function sendClientStatusUpdateEmail({
  orderId,
  clientEmail,
  status,
  clientOrderUrl,
}) {
  const res = await transporter.sendMail({
    from: `"Shop" <${process.env.SMTP_USER}>`,
    to: clientEmail,
    subject: `Order #${orderId} status updated`,
    html: `
      <h2>Your order status has changed</h2>

      <p><strong>New status:</strong> ${status}</p>

      <p>
        👉 <a href="${clientOrderUrl}" target="_blank">
          View your order
        </a>
      </p>

      <hr />
      <small>This is an automated update.</small>
    `,
  });

  console.log("Client status email sent:", res.messageId);
}
