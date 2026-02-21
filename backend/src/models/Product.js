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

ProductSchema.index({ "name.en": "text", "name.ka": "text" });
ProductSchema.index({ brand: 1, "category.en": 1 });

export default mongoose.model("Product", ProductSchema);
