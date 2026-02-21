// // backend/src/controllers/stockController.js

// import Product from "../models/Product.js";
// import StockService from "../services/StockService.js";
// import WarehouseStock from "../models/WarehouseStock.js";
// import StockLog from "../models/StockLog.js";

// export async function importStock(req, res) {
//   const { rows } = req.body;

//   if (!Array.isArray(rows)) {
//     return res.status(400).json({ error: "Rows required" });
//   }

//   try {
//     for (const row of rows) {
//       const qty = Number(row.quantity);

//       if (!Number.isFinite(qty) || qty <= 0) continue;

//       const product = await Product.findOne({
//         barcode: row.barcode,
//       });

//       if (!product) continue;

//       await StockService.add(
//         product._id,
//         qty,
//         req.adminId,
//         row.reason || "Excel import",
//       );
//     }

//     return res.json({ success: true });
//   } catch (err) {
//     return res.status(500).json({
//       error: err.message,
//     });
//   }
// }

// // export async function getStocks(req, res) {
// //   const stocks = await WarehouseStock.find().populate("productId");

// //   res.json(stocks);
// // }

// export async function addStock(req, res) {
//   const { productId, qty } = req.body;

//   const stock = await StockService.add(
//     productId,
//     qty,
//     req.adminId,
//     "Manual add",
//   );

//   res.json(stock);
// }

// export async function removeStock(req, res) {
//   const { productId, qty } = req.body;

//   const stock = await StockService.remove(
//     productId,
//     qty,
//     req.adminId,
//     "Manual remove",
//   );

//   res.json(stock);
// }

// export async function adjustStock(req, res) {
//   const { productId, qty } = req.body;

//   const stock = await StockService.adjust(
//     productId,
//     qty,
//     req.adminId,
//     "Manual adjust",
//   );

//   res.json(stock);
// }

// export async function getStocks(req, res) {
//   const stocks = await WarehouseStock.find().populate(
//     "productId",
//     "name barcode sku",
//   );

//   res.json(stocks);
// }

// export async function getStockLogs(req, res) {
//   try {
//     const logs = await StockLog.find()
//       .sort({ createdAt: -1 })
//       .populate("productId", "name barcode sku");

//     res.json(logs);
//   } catch (err) {
//     res.status(500).json({
//       error: err.message || "Failed to load logs",
//     });
//   }
// }
