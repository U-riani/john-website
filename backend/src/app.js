// backend/src/app.js
import express from "express";
import cors from "cors";
import ordersRoutes from "./routes/orders.js";
import paymentsRoutes from "./routes/payments.js";
import adminAuthRoutes from "./routes/adminAuth.js";
import httpLogger from "./middleware/httpLogger.js";
import adminOrdersRoutes from "./routes/adminOrders.js";
import adminProductsRoutes from "./routes/products.js";
import uploadRoutes from "./routes/upload.js";

const app = express();

app.use(httpLogger);

app.use(cors());

// 👇 capture raw body for webhook verification
app.use(
  "/api/payments/unipay/webhook",
  express.raw({ type: "application/json" }),
);

// 👇 normal JSON for everything else
app.use(express.json());

app.use("/api/orders", ordersRoutes);

app.use("/api/products", adminProductsRoutes);

// image upload
app.use("/api/upload", uploadRoutes);

app.use("/api/payments", paymentsRoutes);

app.use("/api/admin", adminAuthRoutes);

app.use("/api/admin", adminOrdersRoutes);

app.get("/api", (req, res) => {
  res.json({ title: "working" });
});

app.use((err, req, res, next) => {
  req.log.error({ err }, "Unhandled error");
  res.status(500).json({ message: "Internal server error" });
});

export default app;
