// backend/src/models/Order.js
import mongoose from "mongoose";

export const LocalizedString = {
  ka: { type: String, trim: true },
  en: { type: String, trim: true },
  ru: { type: String, trim: true },
};

const OrderItemSchema = new mongoose.Schema(
  {
    productId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
    },
    title: LocalizedString,

    price: {
      type: Number,
      required: true,
      min: 0,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
    },
  },
  { _id: false },
);

const ClientSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      trim: true,
    },
    email: {
      type: String,
      trim: true,
      lowercase: true,
    },
    phoneNumber: {
      type: String,
      required: true,
    },
    phoneVerified: {
      type: Boolean,
      default: false,
    },
    phoneVerifiedAt: {
      type: Date,
    },
  },
  { _id: false },
);

const OrderSchema = new mongoose.Schema(
  {
    items: {
      type: [OrderItemSchema],
      required: true,
      validate: (v) => v.length > 0,
    },

    totalAmount: {
      type: Number,
      required: true,
      min: 0,
    },

    status: {
      type: String,
      enum: ["pending", "collected", "paid", "sent", "received", "cancelled"],
      default: "pending",
      index: true,
    },

    client: {
      type: ClientSchema,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);

export default mongoose.model("Order", OrderSchema);
