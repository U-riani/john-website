// backend/src/models/Product.js
import mongoose from "mongoose";

/* ---------- MULTI LANGUAGE FIELD ---------- */
const LocalizedString = {
  ka: { type: String, trim: true },
  en: { type: String, trim: true },
  ru: { type: String, trim: true },
};

const LocalizedArray = {
  ka: { type: [String], default: [] },
  en: { type: [String], default: [] },
  ru: { type: [String], default: [] },
};

const ProductSchema = new mongoose.Schema(
  {
    /* ---------- MULTI LANG CONTENT ---------- */

    name: {
      ...LocalizedString,
    },

    description: {
      ...LocalizedString,
    },
    ingredients: {
      ...LocalizedString,
    },

    /* NEW → translated fields */
    category: {
      ...LocalizedString,
    },
    subCategory: {
      ...LocalizedString,
    },

    /* ---------- NORMAL FIELDS ---------- */

    brand: {
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

    slug: {
      type: String,
      unique: true,
      index: true,
    },

    images: {
      type: [String],
      default: [],
    },

    isActive: {
      type: Boolean,
      default: true,
      index: true,
    },
  },
  { timestamps: true },
);

/* ---------- PERFORMANCE INDEXES ---------- */

// Active products only (very common filter)
ProductSchema.index({ isActive: 1 });

// Category per language
ProductSchema.index({ "category.en": 1 });
ProductSchema.index({ "category.ka": 1 });
ProductSchema.index({ "category.ru": 1 });

// SubCategory per language
ProductSchema.index({ "subCategory.en": 1 });
ProductSchema.index({ "subCategory.ka": 1 });
ProductSchema.index({ "subCategory.ru": 1 });

// Price range filtering
ProductSchema.index({ price: 1 });

// Sorting
ProductSchema.index({ createdAt: -1 });

// Sorting by localized name
ProductSchema.index({ "name.en": 1 });
ProductSchema.index({ "name.ka": 1 });
ProductSchema.index({ "name.ru": 1 });

ProductSchema.index({
  "name.en": "text",
  "name.ka": "text",
  "name.ru": "text",
  brand: "text",
});

export default mongoose.model("Product", ProductSchema);
