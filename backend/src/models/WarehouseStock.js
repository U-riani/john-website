// // backend/src/models/WarehouseStock.js
// import mongoose from "mongoose";

// const WarehouseStockSchema = new mongoose.Schema(
//   {
//     productId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "Product",
//       required: true,
//       unique: true,
//       index: true,
//     },

//     quantity: {
//       type: Number,
//       default: 0,
//       min: 0,
//       index: true,
//     },
//   },
//   { timestamps: true },
// );

// export default mongoose.model("WarehouseStock", WarehouseStockSchema);
