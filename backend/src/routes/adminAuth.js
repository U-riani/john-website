import { Router } from "express";
import { login } from "../controllers/adminAuthController.js";
import { adminLoginLimiter } from "../middleware/rateLimiters.js";

const router = Router();

router.post("/login",adminLoginLimiter, login);

export default router;
