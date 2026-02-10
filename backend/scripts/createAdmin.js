import bcrypt from "bcryptjs";
import connectDB from "../src/config/db.js";
import Admin from "../src/models/Admin.js";

await connectDB();

const email = "admin@megatech.ge";
const password = "Test123";

const passwordHash = await bcrypt.hash(password, 10);

await Admin.create({ email, passwordHash });

console.log("Admin created");
process.exit();
