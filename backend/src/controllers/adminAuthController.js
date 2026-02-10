import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Admin from "../models/Admin.js";
import logger from "../utils/logger.js";

export async function login(req, res) {
  const { email, password } = req.body;

  const admin = await Admin.findOne({ email });
  if (!admin) {
    logger.warn({ email }, "Admin login failed: user not found");
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const valid = await bcrypt.compare(password, admin.passwordHash);
  if (!valid) {
    logger.warn({ email }, "Admin login failed: wrong password");
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const token = jwt.sign({ adminId: admin._id }, process.env.ADMIN_JWT_SECRET, {
    expiresIn: "12h",
  });

  logger.info({ adminId: admin._id, email }, "Admin logged in");

  res.json({ token });
}
