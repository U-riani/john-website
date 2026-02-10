import Order from "../models/Order.js";
import { Parser } from "json2csv";
import logger from "../utils/logger.js";

export async function exportOrdersCsv(req, res) {
  try {
    const { from, to, status } = req.query;

    const query = {};

    if (status) {
      query.status = status;
    }

    if (from || to) {
      query.createdAt = {};
      if (from) query.createdAt.$gte = new Date(from);
      if (to) query.createdAt.$lte = new Date(to);
    }

    const orders = await Order.find(query)
      .sort({ createdAt: -1 })
      .lean();

    const rows = orders.map((o) => ({
      order_id: o._id.toString(),
      created_at: o.createdAt.toISOString(),
      status: o.status,
      payment_provider: o.paymentProvider,
      payment_reference: o.paymentReference || "",
      total_amount: o.totalAmount,
      items_count: o.items?.length || 0,
    }));

    const parser = new Parser({
      fields: [
        "order_id",
        "created_at",
        "status",
        "payment_provider",
        "payment_reference",
        "total_amount",
        "items_count",
      ],
    });

    const csv = parser.parse(rows);

    logger.info(
      { count: rows.length },
      "Orders CSV exported"
    );

    res.setHeader("Content-Type", "text/csv");
    res.setHeader(
      "Content-Disposition",
      "attachment; filename=orders.csv"
    );

    res.send(csv);
  } catch (err) {
    logger.error({ err }, "Order CSV export failed");
    res.status(500).json({ message: "Export failed" });
  }
}
