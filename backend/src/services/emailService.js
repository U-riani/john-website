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
