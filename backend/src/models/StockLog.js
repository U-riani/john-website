// backend/src/models/StockLog.js
import mongoose from "mongoose";

const StockLogSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    type: {
      type: String,
      enum: ["IN", "OUT", "ADJUST"],
      required: true,
    },

    quantity: Number,
    before: Number,
    after: Number,

    reason: String,

    adminId: String,
    productSnapshot: {
      name: String,
      sku: String,
    },
  },
  { timestamps: true },
);

export default mongoose.model("StockLog", StockLogSchema);
