// frontend/src/pages/Warehouse.jsx

import { useEffect, useState } from "react";
import * as XLSX from "xlsx";

import {
  getStocks,
  addStock,
  removeStock,
  adjustStock,
  importStock,
} from "../api/stock";

export default function Warehouse() {
  const [stocks, setStocks] = useState([]);
  const [loading, setLoading] = useState(true);

  // table inline qty
  const [qtyMap, setQtyMap] = useState({});

  // manual form
  const [manualProductId, setManualProductId] = useState("");
  const [manualQty, setManualQty] = useState("");
  const [manualReason, setManualReason] = useState("");

  /* ---------- LOAD ---------- */

  async function loadStocks() {
    try {
      const data = await getStocks();
      setStocks(data);
    } catch {
      alert("Failed to load warehouse");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadStocks();
  }, []);

  /* ---------- TABLE STOCK UPDATE ---------- */

  async function updateStock(type, productId) {
    const qty = Number(qtyMap[productId] || 0);

    if (!qty || qty <= 0) {
      alert("Invalid quantity");
      return;
    }

    try {
      const payload = {
        productId,
        qty,
        reason: "Quick table update",
      };

      if (type === "add") {
        await addStock(payload);
      } else if (type === "remove") {
        await removeStock(payload);
      } else {
        await adjustStock(payload);
      }

      setQtyMap((p) => ({ ...p, [productId]: "" }));
      loadStocks();
    } catch (err) {
      alert(err.message || "Stock update failed");
    }
  }

  /* ---------- MANUAL FORM UPDATE ---------- */

  async function manualUpdate(type) {
    const qty = Number(manualQty);

    if (!manualProductId) {
      alert("Select product");
      return;
    }

    if (!qty || qty <= 0) {
      alert("Invalid quantity");
      return;
    }

    const payload = {
      productId: manualProductId,
      qty,
      reason: manualReason || "Manual update",
    };

    try {
      if (type === "add") {
        await addStock(payload);
      } else if (type === "remove") {
        await removeStock(payload);
      } else {
        await adjustStock(payload);
      }

      setManualQty("");
      setManualReason("");
      loadStocks();
    } catch (err) {
      alert(err.message || "Manual update failed");
    }
  }

  /* ---------- EXCEL IMPORT ---------- */

  async function handleImport(e) {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const data = await file.arrayBuffer();

      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];
      const json = XLSX.utils.sheet_to_json(sheet);

      const rows = json
        .map((r) => ({
          barcode: String(r.barcode || "").trim(),
          quantity: Number(r.quantity || 0),
          reason: r.reason || "Excel import",
        }))
        .filter((r) => r.barcode && r.quantity > 0);

      if (!rows.length) {
        alert("No valid rows found");
        return;
      }

      await importStock(rows);

      loadStocks();
      alert("Import successful");

      e.target.value = "";
    } catch (err) {
      alert(err.message || "Import failed");
    }
  }

  if (loading) return <div>Loading warehouse...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Warehouse</h1>

      {/* ================= IMPORT BLOCK ================= */}
      <div className="rounded-lg bg-white p-4 shadow space-y-3">
        <h2 className="font-semibold">Bulk Stock Import (Excel)</h2>

        <div className="flex items-center gap-4">
          <a
            href="/templates/stock-import.xlsx"
            download
            className="rounded bg-sky-200 px-3 py-1 text-sm"
          >
            Download Template
          </a>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleImport}
            className="rounded bg-gray-200 px-3 py-1 text-sm"
          />
        </div>
      </div>

      {/* ================= MANUAL UPDATE ================= */}
      <div className="rounded-lg bg-white p-4 shadow space-y-3">
        <h2 className="font-semibold">Manual Stock Update</h2>

        <div className="flex gap-2 flex-wrap items-center">
          <select
            value={manualProductId}
            onChange={(e) => setManualProductId(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="">Select product</option>
            {stocks.map((s) => (
              <option key={s.productId?._id} value={s.productId?._id}>
                {s.productId?.name.en}
              </option>
            ))}
          </select>

          <input
            type="number"
            value={manualQty}
            onChange={(e) => setManualQty(e.target.value)}
            className="border rounded px-2 py-1 w-24"
            placeholder="Qty"
          />

          <input
            type="text"
            value={manualReason}
            onChange={(e) => setManualReason(e.target.value)}
            className="border rounded px-2 py-1 w-64"
            placeholder="Reason (optional)"
          />

          <button
            onClick={() => manualUpdate("add")}
            className="px-3 py-1 bg-green-600 text-white rounded"
          >
            Add
          </button>

          <button
            onClick={() => manualUpdate("remove")}
            className="px-3 py-1 bg-red-600 text-white rounded"
          >
            Remove
          </button>

          <button
            onClick={() => manualUpdate("adjust")}
            className="px-3 py-1 bg-blue-600 text-white rounded"
          >
            Adjust
          </button>
        </div>
      </div>

      {/* ================= TABLE ================= */}
      <div className="rounded-lg bg-white shadow overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Product</th>
              <th className="px-4 py-3 text-left">Barcode</th>
              <th className="px-4 py-3 text-center">Quantity</th>
              <th className="px-4 py-3 text-center">Action</th>
            </tr>
          </thead>

          <tbody>
            {stocks.map((s) => (
              <tr key={s._id} className="border-b">
                <td className="px-4 py-3">{s.productId?.name.en}</td>

                <td className="px-4 py-3 font-mono text-xs">
                  {s.productId?.barcode || "-"}
                </td>

                <td className="px-4 py-3 text-center font-semibold">
                  {s.quantity}
                </td>

                <td className="px-4 py-3">
                  <div className="flex gap-2 justify-center">
                    <input
                      type="number"
                      value={qtyMap[s.productId?._id] || ""}
                      onChange={(e) =>
                        setQtyMap((p) => ({
                          ...p,
                          [s.productId._id]: e.target.value,
                        }))
                      }
                      className="w-20 border rounded px-2 py-1 text-center"
                      placeholder="Qty"
                    />

                    <button
                      onClick={() => updateStock("add", s.productId._id)}
                      className="px-2 py-1 bg-green-600 text-white rounded"
                    >
                      +
                    </button>

                    <button
                      onClick={() => updateStock("remove", s.productId._id)}
                      className="px-2 py-1 bg-red-600 text-white rounded"
                    >
                      -
                    </button>

                    <button
                      onClick={() => updateStock("adjust", s.productId._id)}
                      className="px-2 py-1 bg-blue-600 text-white rounded"
                    >
                      Adjust
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
