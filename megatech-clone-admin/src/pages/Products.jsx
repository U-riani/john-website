// frontend/src/pages/Products.jsx
import { useEffect, useState } from "react";
import {
  getProducts,
  createProduct,
  updateProduct,
  deleteProduct,
} from "../api/products";
import * as XLSX from "xlsx";
import { uploadImage } from "../api/upload";

export default function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrls, setUploadedUrls] = useState([]);

  const emptyForm = {
    name: "",
    brand: "",
    category: "",
    subCategory: "",
    price: "",
    salePrice: "",
    stock: "",
    sku: "",
    barcode: "",
    volume: "",
    target: "unisex",
    description: "",
    ingredients: "",
    usage: "",
    images: [],
  };

  const [form, setForm] = useState(emptyForm);

  const handleBulkImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      setUploading(true);

      const res = await uploadImage(files);

      setUploadedUrls(res.urls || []);

      e.target.value = "";
    } catch (err) {
      alert(err.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      setUploading(true);

      const res = await uploadImage(files);

      setForm((prev) => ({
        ...prev,
        images: [...(prev.images || []), ...res.urls],
      }));

      e.target.value = "";
    } catch (err) {
      alert(err.message || "Image upload failed");
    } finally {
      setUploading(false);
    }
  };

  /* ---------- LOAD ---------- */

  const loadProducts = async () => {
    try {
      const data = await getProducts();
      setProducts(data);
    } catch {
      alert("Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* ---------- FORM ---------- */

  const onChange = (e) => {
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const resetForm = () => {
    setForm({ ...emptyForm, images: [] });
    setEditingId(null);
  };

  /* ---------- SAVE ---------- */

  const onSubmit = async (e) => {
    e.preventDefault();

    const payload = {
      ...form,
      price: Number(form.price || 0),
      salePrice: Number(form.salePrice || 0),
      stock: Number(form.stock || 0),
    };

    try {
      if (editingId) {
        await updateProduct(editingId, payload);
      } else {
        await createProduct(payload);
      }

      resetForm();
      loadProducts();
    } catch {
      alert("Save failed");
    }
  };

  /* ---------- EDIT ---------- */

  const onEdit = (p) => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    setEditingId(p._id);

    setForm({
      name: p.name || "",
      brand: p.brand || "",
      category: p.category || "",
      subCategory: p.subCategory || "",
      price: p.price ?? "",
      salePrice: p.salePrice ?? "",
      stock: p.stock ?? "",
      sku: p.sku || "",
      barcode: p.barcode || "",
      volume: p.volume || "",
      target: p.target || "unisex",
      description: p.description || "",
      ingredients: p.ingredients || "",
      usage: p.usage || "",
      images: p.images || [],
    });
  };

  /* ---------- DELETE ---------- */

  const onDelete = async (id) => {
    if (!confirm("Delete product?")) return;

    try {
      await deleteProduct(id);
      loadProducts();
    } catch {
      alert("Delete failed");
    }
  };

  /* ---------- EXCEL IMPORT ---------- */

  const handleExcelImport = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    try {
      const data = await files[0].arrayBuffer();

      const workbook = XLSX.read(data);
      const sheet = workbook.Sheets[workbook.SheetNames[0]];

      const json = XLSX.utils.sheet_to_json(sheet);

      const parsedProducts = json
        .map((row) => ({
          name: row.name?.trim(),
          brand: row.brand?.trim(),
          category: row.category?.trim(),
          subCategory: row.subCategory?.trim(),
          price: Number(row.price || 0),
          salePrice: Number(row.salePrice || 0),
          stock: Number(row.stock || 0),
          sku: row.sku?.trim(),
          barcode: row.barcode?.trim(),
          volume: row.volume?.trim(),
          target: row.target || "unisex",
          description: row.description || "",
          ingredients: row.ingredients || "",
          usage: row.usage || "",
          images: row.images ? row.images.split(",").map((s) => s.trim()) : [],
        }))
        .filter((p) => p.name && p.price >= 0);

      if (!parsedProducts.length) {
        alert("No valid products found in file");
        return;
      }

      const res = await fetch(
        `${import.meta.env.VITE_API_URL}/products/import`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("admin_token")}`,
          },
          body: JSON.stringify({ products: parsedProducts }),
        },
      );

      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.error || "Import failed");
      }

      await loadProducts();

      e.target.value = "";
      alert("Import successful");
    } catch (err) {
      alert(err.message);
    }
  };

  /* ---------- RENDER ---------- */

  if (loading) return <div>Loading products...</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-bold">Products</h1>
      {/* IMAGE URL GENERATOR */}
      <div className="rounded-lg bg-white p-4 shadow space-y-3">
        <h2 className="font-semibold">Upload Images → Get URLs</h2>

        <input type="file" multiple onChange={handleBulkImageUpload} />

        {uploading && <div>Uploading...</div>}

        {uploadedUrls.length > 0 && (
          <div className="space-y-2">
            <div className="text-sm text-gray-600">
              Copy URLs below into Excel:
            </div>

            <textarea
              readOnly
              value={uploadedUrls.join("\n")}
              className="w-full border rounded p-2 h-40 text-xs"
            />

            <button
              type="button"
              onClick={() =>
                navigator.clipboard.writeText(uploadedUrls.join("\n"))
              }
              className="px-3 py-1 bg-black text-white rounded text-sm"
            >
              Copy All URLs
            </button>
          </div>
        )}
      </div>

      {/* IMPORT */}
      <div className="rounded-lg bg-white p-4 shadow">
        <label className="font-semibold block mb-2">
          Import Products (Excel)
        </label>
        <div className="flex items-center gap-5">
          <a
            className="bg-sky-200  px-3 py-1 rounded cursor-pointer text-sm"
            href="/templates/products-import.xlsx"
            download
          >
            Download Excel Template
          </a>

          <input
            type="file"
            accept=".xlsx,.xls"
            onChange={handleExcelImport}
            className="bg-slate-200 
            px-3 py-1 rounded cursor-pointer text-sm"
          />
        </div>
      </div>

      {/* FORM */}
      <form
        onSubmit={onSubmit}
        className="rounded-lg bg-white p-4 shadow space-y-3"
      >
        <h2 className="font-semibold">
          {editingId ? "Edit Product" : "Add Product"}
        </h2>

        <Input name="name" label="Name" value={form.name} onChange={onChange} />
        <Input
          name="brand"
          label="Brand"
          value={form.brand}
          onChange={onChange}
        />
        <Input
          name="category"
          label="Category"
          value={form.category}
          onChange={onChange}
        />
        <Input
          name="subCategory"
          label="Sub Category"
          value={form.subCategory}
          onChange={onChange}
        />

        <div className="grid grid-cols-2 gap-3">
          <Input
            name="price"
            label="Price"
            type="number"
            value={form.price}
            onChange={onChange}
          />
          <Input
            name="salePrice"
            label="Sale Price"
            type="number"
            value={form.salePrice}
            onChange={onChange}
          />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <Input
            name="stock"
            label="Stock"
            type="number"
            value={form.stock}
            onChange={onChange}
          />
          <Input
            name="volume"
            label="Volume"
            value={form.volume}
            onChange={onChange}
          />
        </div>

        <Input name="sku" label="SKU" value={form.sku} onChange={onChange} />
        <Input
          name="barcode"
          label="Barcode"
          value={form.barcode}
          onChange={onChange}
        />
        <input type="file" multiple onChange={handleImageUpload} />

        {uploading && <div>Uploading...</div>}
        <div className="flex gap-2 flex-wrap">
          {form.images?.map((img) => (
            <div key={img} className="relative">
              <img
                src={img}
                alt="preview"
                className="w-24 h-24 object-cover rounded"
              />
              <button
                type="button"
                onClick={() =>
                  setForm((prev) => ({
                    ...prev,
                    images: prev.images.filter((i) => i !== img),
                  }))
                }
                className="absolute top-0 right-0 bg-black text-white text-xs px-1"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
        <select
          name="target"
          value={form.target}
          onChange={onChange}
          className="border rounded px-2 py-1"
        >
          <option value="unisex">Unisex</option>
          <option value="men">Men</option>
          <option value="women">Women</option>
        </select>

        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={onChange}
          className="border rounded px-2 py-1"
        />

        <div className="flex gap-2">
          <button className="rounded bg-blue-600 px-4 py-2 text-white">
            {editingId ? "Update" : "Create"}
          </button>

          {editingId && (
            <button
              type="button"
              onClick={resetForm}
              className="rounded bg-gray-300 px-4 py-2"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* TABLE */}
      <div className="rounded-lg bg-white shadow">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="px-4 py-3 text-left">Name</th>
              <th className="px-4 py-3 text-left">Brand</th>
              <th className="px-4 py-3 text-left">Category</th>
              <th className="px-4 py-3 text-right">Price</th>
              <th className="px-4 py-3 text-center">Stock</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {products.map((p) => (
              <tr key={p._id} className="border-b">
                <td className="px-4 py-3">{p.name}</td>
                <td className="px-4 py-3">{p.brand}</td>
                <td className="px-4 py-3">{p.category}</td>
                <td className="px-4 py-3 text-right">${p.price}</td>
                <td className="px-4 py-3 text-center">{p.stock}</td>
                <td className="px-4 py-3 text-right space-x-2">
                  <button
                    onClick={() => onEdit(p)}
                    className="text-blue-600 hover:underline"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(p._id)}
                    className="text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

/* ---------- INPUT ---------- */

function Input({ label, ...props }) {
  return (
    <div className="flex flex-col gap-1">
      <label>{label}</label>
      <input {...props} className="border rounded px-2 py-1" />
    </div>
  );
}
