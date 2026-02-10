// backend/src/services/emailService.js
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();
5472

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
