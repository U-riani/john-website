// backend/src/models/Product.js
import mongoose from "mongoose";

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    brand: {
      type: String,
      index: true,
    },

    category: {
      type: String,
      required: true,
      index: true,
    },

    subCategory: {
      type: String,
      index: true,
    },

    sku: {
      type: String,
      unique: true,
      sparse: true,
    },

    barcode: {
      type: String,
      index: true,
    },

    price: {
      type: Number,
      required: true,
      min: 0,
    },

    salePrice: {
      type: Number,
      min: 0,
    },

    currency: {
      type: String,
      default: "GEL",
    },

    stock: {
      type: Number,
      default: 0,
      min: 0,
    },

    volume: {
      type: String, // "250ml"
    },

    target: {
      type: String,
      enum: ["men", "women", "unisex"],
      default: "unisex",
    },

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    hairType: [String], // dry, oily, damaged...
    skinType: [String], // normal, sensitive...

    description: String,
    ingredients: String,
    usage: String,

    images: [String],

    tags: [String],

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

export default mongoose.model("Product", ProductSchema);
