// // backend/src/services/StockService.js

// import WarehouseStock from "../models/WarehouseStock.js";
// import StockLog from "../models/StockLog.js";

// class StockService {
//   /**
//    * STOCK IN
//    */
//   static async add(
//     productId,
//     qty,
//     adminId,
//     reason = "Stock IN",
//     session = null,
//   ) {
//     qty = Number(qty);
//     if (!Number.isFinite(qty) || qty <= 0) {
//       throw new Error("Invalid quantity");
//     }

//     // atomic increment
//     const stock = await WarehouseStock.findOneAndUpdate(
//       { productId },
//       { $inc: { quantity: qty } },
//       {
//         new: true,
//         upsert: true,
//         session,
//       },
//     );

//     const before = stock.quantity - qty;

//     await StockLog.create(
//       [
//         {
//           productId,
//           type: "IN",
//           quantity: qty,
//           before,
//           after: stock.quantity,
//           adminId,
//           reason,
//         },
//       ],
//       { session },
//     );

//     return stock;
//   }

//   /**
//    * STOCK OUT
//    */
//   static async remove(
//     productId,
//     qty,
//     adminId,
//     reason = "Stock OUT",
//     session = null,
//   ) {
//     qty = Number(qty);
//     if (!Number.isFinite(qty) || qty <= 0) {
//       throw new Error("Invalid quantity");
//     }

//     // atomic decrement with safety check
//     const updated = await WarehouseStock.findOneAndUpdate(
//       {
//         productId,
//         quantity: { $gte: qty }, // prevents negative stock
//       },
//       {
//         $inc: { quantity: -qty },
//       },
//       {
//         new: true,
//         session,
//       },
//     );

//     if (!updated) {
//       const err = new Error("Not enough stock or stock changed");
//       err.code = "NOT_ENOUGH_STOCK";
//       throw err;
//     }

//     const before = updated.quantity + qty;

//     await StockLog.create(
//       [
//         {
//           productId,
//           type: "OUT",
//           quantity: qty,
//           before,
//           after: updated.quantity,
//           adminId,
//           reason,
//         },
//       ],
//       { session },
//     );

//     return updated;
//   }

//   /**
//    * STOCK ADJUST (absolute set)
//    */
//   static async adjust(
//     productId,
//     newQty,
//     adminId,
//     reason = "Adjustment",
//     session = null,
//   ) {
//     newQty = Number(newQty);

//     if (!Number.isFinite(newQty) || newQty < 0) {
//       throw new Error("Invalid quantity");
//     }

//     // read BEFORE only for logging
//     const current = await WarehouseStock.findOne({ productId }).session(
//       session,
//     );

//     const before = current?.quantity || 0;

//     const updated = await WarehouseStock.findOneAndUpdate(
//       { productId },
//       { $set: { quantity: newQty } },
//       {
//         new: true,
//         upsert: true,
//         session,
//       },
//     );

//     await StockLog.create(
//       [
//         {
//           productId,
//           type: "ADJUST",
//           quantity: newQty - before,
//           before,
//           after: newQty,
//           adminId,
//           reason,
//         },
//       ],
//       { session },
//     );

//     return updated;
//   }
// }

// export default StockService;
