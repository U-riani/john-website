import rateLimit from "express-rate-limit";

/**
 * Admin login:
 * Very strict – brute force protection
 */
export const adminLoginLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 5,                 // 5 attempts
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many login attempts. Try again later.",
  },
});

/**
 * Payment init:
 * Prevent payment spam
 */
export const paymentInitLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    message: "Too many payment requests. Please wait.",
  },
});

/**
 * Webhook:
 * Allow UniPay, block floods
 */
export const webhookLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 30,
  standardHeaders: true,
  legacyHeaders: false,
});
