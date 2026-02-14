// backend/src/models/FailedOrder.js
import mongoose from "mongoose";

const FailedOrderSchema = new mongoose.Schema(
  {
    client: {
      firstName: String,
      lastName: String,
      email: String,
      phoneNumber: String,
    },
    items: [
      {
        productId: mongoose.Schema.Types.ObjectId,
        title: String,
        quantity: Number,
        price: Number,
      },
    ],
    reason: String,
  },
  { timestamps: true },
);

export default mongoose.model("FailedOrder", FailedOrderSchema);
